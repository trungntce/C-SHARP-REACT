namespace WebApp;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Dynamic;
using System.Linq;
using Framework;
using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using Microsoft.Practices.EnterpriseLibrary.Data;
using Newtonsoft.Json;
using OfficeOpenXml.FormulaParsing.Excel.Functions.RefAndLookup;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Text;

public class PanelService : MinimalApiService, IMinimalApi
{
    public PanelService(ILogger<PanelService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/masterbarcode", nameof(MasterBarcode));
        group.MapPost("/firstbarcode", nameof(FirstBarcode));
        group.MapGet("/operlist", nameof(OperList));
        group.MapPost("/start", nameof(Start));
        group.MapPost("/initialstart", nameof(InitialStart));
        //group.MapGet("/beforechange", nameof(BeforeChange));
        group.MapPost("/change", nameof(Change));
        group.MapPost("/initialchange", nameof(InitialChange));
        group.MapPost("/cancel", nameof(Cancel));
        group.MapPost("/initialcancel", nameof(InitialCancel));
        group.MapPost("/end", nameof(End));
        group.MapPost("/initialend", nameof(InitialEnd));
        //group.MapPost("/interlock", nameof(Interlock));
        //group.MapPost("/interlockcancel", nameof(InterlockCancel));
        //group.MapPost("/defect", nameof(Defect));
        //group.MapPost("/defectcancel", nameof(DefectCancel));
        //group.MapPost("/hold", nameof(Hold));
        //group.MapPost("/holdcancel", nameof(HoldCancel));
        //group.MapPost("/rework", nameof(Rework));
        group.MapPost("/reworkrolltopanel", nameof(ReworkRollToPanel));
        group.MapPost("/reworkapprove", nameof(ReworkApprove));
        //group.MapPut("/error", nameof(Error));
        group.MapPut("item", nameof(ItemInsertSpVersion)); //ItemInsert <- C# Version 23.11.21 jjk
        group.MapPut("itemV2", nameof(ItemInsertSpVersion));

        //group.MapPut("trigger", nameof(TriggerInsert));
        //group.MapPut("layup", nameof(ItemLayup));
        group.MapPost("map", nameof(MapUpdate));
        group.MapPost("sheetmap", nameof(SheetMapUpdate));
        group.MapGet("/getformdata", nameof(GetForMData));
        group.MapGet("/getcodelist", nameof(GetCodeList));
        group.MapGet("/getoperlist", nameof(GetOperList));
        group.MapGet("/panel4mserachdata", nameof(Panel4MSerachData));
        group.MapGet("/verfiypvrvng", nameof(VerfiyPvRvNg));
        group.MapPost("/outsourcingcancel", nameof(OutSourcingCancel));
        //group.MapPost("piecemap", PcsMapUpdate);
        group.MapPost("/cmi", nameof(Cmi));
        group.MapPost("/panelitemcontroll", nameof(PanelItemControll));
        group.MapPost("/panelrealtimecontroll", nameof(PanelRealtimeControll));
        group.MapPost("/panelrollmappingconroll", nameof(PanelRollMappingConroll));

        return RouteAllEndpoint(group);
    }
    [ManualMap]
    public static Dictionary<string, object> MasterBarcode(string asResult)
    {
        Dictionary<string, object> dicMasterBarcode = new Dictionary<string, object>();
        dicMasterBarcode.Add("AS_ARG1", asResult);
        dicMasterBarcode.Add("AS_RESULT", 0);
        dicMasterBarcode.Add("RS_CODE", string.Empty);
        dicMasterBarcode.Add("RS_MSG", string.Empty);
        var dicMarsterBarcode = DataContext.NonQuery("sp_pda_get_barcodemaster", dicMasterBarcode);

        return dicMasterBarcode;
    }

    [ManualMap]
    public static (ResultEnum resultEnum, string? remark, string convertMaterialCode, DataTable convertToMaterialCode) CheckFistRollSplitMeterial(string materialLotCode)
    {
        DataTable convertToMaterialCode = null;
        DataTable mesPanelCheck = null;
        //롤분할 자재에 대한 체크
        mesPanelCheck = DataContext.StringDataSet("@BarcodeApi.Panel.ErpRollSplitMaterialCheck", new { barcode = materialLotCode }).Tables[0];
        if (mesPanelCheck.Rows.Count > 0)
            materialLotCode = mesPanelCheck.Rows[0].TypeCol<string>("parent_id");


        convertToMaterialCode = CommonService.ErpMaterialLotList(new() { new Dictionary<string, string>() { { "materialLot", materialLotCode } } });
        if (convertToMaterialCode.Rows.Count == 0)
        {
            return (ResultEnum.NgDataBase, "@NG_ROLL_SPLIT_NOT_FOUND", "", convertToMaterialCode);//[NG] 자재 정보 가 없습니다.
        }

        dynamic objMaterial = new ExpandoObject();
        objMaterial.Barcode = materialLotCode;
        DataTable interlockCnt = DataContext.StringDataSet("@BarcodeApi.Panel.InterlockCheck", new { rollId = objMaterial.Barcode, panelId = "" }).Tables[0];
        if (interlockCnt.Rows[0].TypeCol<int>("interlock_count") > 0)
        {
            return (ResultEnum.NgPanelInterlock, $"@NG_FISTBARCODE_INTERLOCK^{materialLotCode}", "", convertToMaterialCode);//[NG] 이미 INTERLOCK 상태입니다. \r\n ROLL - {interlockEntity.RollId} \r\n PANEL - {interlockEntity.PanelId}
        }

        DataTable defectCnt = DataContext.StringDataSet("@BarcodeApi.Panel.DefectCheck", new { rollId = objMaterial.Barcode, panelId = "" }).Tables[0];
        if (defectCnt.Rows[0].TypeCol<int>("defect_count") > 0)
        {
            return (ResultEnum.NgPanelDefect, $"@NG_FIRSTBARCODE_DEFECT^{materialLotCode}", "", convertToMaterialCode);//[NG] 이미 DEFECT 상태입니다. \r\n ROLL - {defectEntity.RollId} \r\n PANEL - {defectEntity.PanelId}
        }

        return (ResultEnum.OkFirstBarcode, "", "", convertToMaterialCode);
    }

    [ManualMap]
    public static (ResultEnum resultEnum, string? remark, string convertMaterialCode) CheckFirstMaterial(PanelEntity entity, OperationEntity currOperInfo, string materialLotCode, bool isCountChk)
    {
        #region TODO: 자재 확인
        // 자재는 lot 단위로 줄수 있다 . ( 해당 사항 체크 하기 ) 품번의 수량까지 
        // 창고에 들어갔다오면 lot 넘버가 (자재에 대한 ) 생긴다 
        // 나머지는 그냥 t_card 에 된다.
        bool bIsErrBomChk = false;
        List<string> lstErrBomS = new List<string>();

        // erp 에서 자재(BOM) 정보를 가져옴 
        DataTable erpBomDt = DataContext.StringDataSet("@BarcodeApi.Common.ErpBomList", currOperInfo).Tables[0];
        DataTable convertToMaterialCode = null;
        var LaserBomChk = CommonService.FirsOperLasertMaterialChk(currOperInfo);
        if (erpBomDt.Rows.Count == 0)
        {
            if (!(LaserBomChk.IsMB01Chk && LaserBomChk.count != 0))
            {
                var bomChk = CommonService.FirsOpertMaterialChk(currOperInfo);
                if (!(bomChk.isMB01Chk && bomChk.count != 0))
                    return (ResultEnum.NgDataBase, "@NG_NO_BOM_DATA", "");//[NG] 자재(BOM) 정보 가 없습니다.
            }
        }

        string resultValue = string.Empty;

        //Laser 공정일경우 자재에 대한 체크 
        if (LaserBomChk.IsMB01Chk && LaserBomChk.count != 0)
        {
            var tempEntity = currOperInfo.Adapt<OperationEntity>();
            tempEntity.OperSeqNo = LaserBomChk.LaserBomItem.TypeCol<int>("operation_seq_no");
            erpBomDt = DataContext.StringDataSet("@BarcodeApi.Common.ErpBomList", tempEntity).Tables[0];
            if (erpBomDt.Rows.Count == 0)
                return (ResultEnum.NgDataBase, "@NG_NO_JAJE", "");//[NG] 자재 정보 가 없습니다.

            convertToMaterialCode = CommonService.ErpMaterialLotList(new() { new Dictionary<string, string>() { { "materialLot", materialLotCode } } });
            if (convertToMaterialCode.Rows.Count == 0)
            {
                var rollsplitChk = CheckFistRollSplitMeterial(materialLotCode);
                if (rollsplitChk.resultEnum != ResultEnum.OkFirstBarcode)
                {
                    return (ResultEnum.NgDataBase, rollsplitChk.remark, "");//[NG] 자재 정보 가 없습니다.
                }
                convertToMaterialCode = rollsplitChk.convertToMaterialCode;
            }

            string barcodeBomCode = convertToMaterialCode.Rows[0].TypeCol<string>("material_code");
            string bomCode = erpBomDt.Rows[0].TypeCol<string>("item_code");
            if (barcodeBomCode != bomCode)
                return (ResultEnum.NgPanelMatNotExists, $"@NG_JAJE_DIFF_ERP^{string.Empty}^{string.Empty}", "");//[NG] ERP 자재와 Barcode 자재 정보가 맞지 않습니다.


            DataTable interlockCnt = DataContext.StringDataSet("@BarcodeApi.Panel.InterlockCheck", new { rollId = materialLotCode, panelId = "" }).Tables[0];
            if (interlockCnt.Rows[0].TypeCol<int>("interlock_count") > 0)
            {
                return (ResultEnum.NgPanelInterlock, $"@NG_FISTBARCODE_INTERLOCK^{materialLotCode}", "");//[NG] 이미 INTERLOCK 상태입니다. \r\n ROLL - {interlockEntity.RollId} \r\n PANEL - {interlockEntity.PanelId}
            }

            DataTable defectCnt = DataContext.StringDataSet("@BarcodeApi.Panel.DefectCheck", new { rollId = materialLotCode, panelId = "" }).Tables[0];
            if (defectCnt.Rows[0].TypeCol<int>("defect_count") > 0)
            {
                return (ResultEnum.NgPanelDefect, $"@NG_FIRSTBARCODE_DEFECT^{materialLotCode}", "");//[NG] Defect가 이미 등록되어 있는 Roll 자재 입니다.
            }


            return (ResultEnum.OkFirstBarcode, "", "");
        }

        var firstBomChk = CommonService.FirsOpertMaterialChk(currOperInfo);
        if (firstBomChk.isMB01Chk && firstBomChk.count != 0)
        {
            //200 번째 공정에 있는 자재 코드랑 
            //바코드 들어온애랑 비교해서 맞는지 판단해야하고
            //틀리면 NG리턴 
            //맞으면 return (ResultEnum.OkFirstBarcode, "", "");
            var tempEntity = currOperInfo.Adapt<OperationEntity>();
            tempEntity.OperSeqNo = firstBomChk.operSeqNo;
            erpBomDt = DataContext.StringDataSet("@BarcodeApi.Common.ErpBomList", tempEntity).Tables[0];
            if (erpBomDt.Rows.Count == 0)
                return (ResultEnum.NgDataBase, "@NG_NO_JAJE", "");//[NG] 자재 정보 가 없습니다.

            convertToMaterialCode = CommonService.ErpMaterialLotList(new() { new Dictionary<string, string>() { { "materialLot", materialLotCode } } });
            if (convertToMaterialCode.Rows.Count == 0)
            {
                var rollsplitChk = CheckFistRollSplitMeterial(materialLotCode);
                if (rollsplitChk.resultEnum != ResultEnum.OkFirstBarcode)
                {
                    return (ResultEnum.NgDataBase, rollsplitChk.remark, "");//[NG] 자재 정보 가 없습니다.
                }
                convertToMaterialCode = rollsplitChk.convertToMaterialCode;
            }

            string barcodeBomCode = convertToMaterialCode.Rows[0].TypeCol<string>("material_code");
            string bomCode = erpBomDt.Rows[0].TypeCol<string>("item_code");

            if (barcodeBomCode != bomCode)
                return (ResultEnum.NgPanelMatNotExists, $"@NG_JAJE_DIFF_ERP^{string.Empty}^{string.Empty}", "");//[NG] ERP 자재와 Barcode 자재 정보가 맞지 않습니다.

            DataTable interlockCnt = DataContext.StringDataSet("@BarcodeApi.Panel.InterlockCheck", new { rollId = materialLotCode, panelId = "" }).Tables[0];
            if (interlockCnt.Rows[0].TypeCol<int>("interlock_count") > 0)
            {
                return (ResultEnum.NgPanelInterlock, $"@NG_FISTBARCODE_INTERLOCK^{materialLotCode}", "");//[NG] 이미 INTERLOCK 상태입니다. \r\n ROLL - {interlockEntity.RollId} \r\n PANEL - {interlockEntity.PanelId}
            }

            DataTable defectCnt = DataContext.StringDataSet("@BarcodeApi.Panel.DefectCheck", new { rollId = materialLotCode, panelId = "" }).Tables[0];
            if (defectCnt.Rows[0].TypeCol<int>("defect_count") > 0)
            {
                return (ResultEnum.NgPanelDefect, $"@NG_FIRSTBARCODE_DEFECT^{materialLotCode}", "");//[NG] Defect가 이미 등록되어 있는 Roll 자재 입니다.
            }

            return (ResultEnum.OkFirstBarcode, "", "");
        }
        else
        {
            convertToMaterialCode = CommonService.ErpMaterialLotList(new() { new Dictionary<string, string>() { { "materialLot", materialLotCode } } });
            if (convertToMaterialCode.Rows.Count == 0)
            {
                var rollsplitChk = CheckFistRollSplitMeterial(materialLotCode);
                if (rollsplitChk.resultEnum != ResultEnum.OkFirstBarcode)
                {
                    return (ResultEnum.NgDataBase, rollsplitChk.remark, "");//[NG] 자재 정보 가 없습니다.
                }
                convertToMaterialCode = rollsplitChk.convertToMaterialCode;
            }

            var groupby = convertToMaterialCode.AsEnumerable().GroupBy(x => x.TypeCol<string>("material_code"));
            var list = groupby.Select(x => x.Key).ToList();

            foreach (string value in list)
            {
                //jjk, 23.08.30 서정욱 프로 요청 사항에대하여 모델 중간 번호가 바뀔것에 대해서 split 한 내용으로 비교하여 적용 
                string currentModelName = CommonService.SplitModeCode(value);

                if (!erpBomDt.AsEnumerable().Any(x => CommonService.SplitModeCode(x.TypeCol<string>("ITEM_CODE")) == currentModelName))
                    return (ResultEnum.NgPanelMatNotExists, $"@NG_JAJE_DIFF_ERP^{string.Empty}^{string.Empty}", "");//[NG] ERP 자재와 Barcode 자재 정보가 맞지 않습니다.
                resultValue = value;
            }

            if (isCountChk)
            {
                if (erpBomDt.Rows.Count != list.Count)
                    return (ResultEnum.NgPanelMatNotExists, "@NG_JAJE_COUNT_ERROR", "");//[NG] ERP 자재 수량과 Barcode 자재 수량이 맞지 않습니다.
            }
        }

        ////jjk, 23.09.20 - 서정욱 프로 요청사항으로 인한 자재 선입선출 반영 임시 주석
        //var lots = new List<Dictionary<string, string>>() { new Dictionary<string, string>() { { "materialLot", materialLotCode } } };
        //var expiredDt = convertToMaterialCode.Rows[0].TypeCol<string>("expired_dt");
        //DataTable dtSamiMaterialCode = DataContext.StringDataSet("@BarcodeApi.Panel.SamiMaterialExpired",
        // new { lots = JsonConvert.SerializeObject(lots) , expiredDt = expiredDt }).Tables[0];
        //if (dtSamiMaterialCode.Rows.Count > 0)
        //{
        //    if (convertToMaterialCode.Rows.Count > 0)
        //    {
        //        string currMateriallot = convertToMaterialCode.Rows[0].TypeCol<string>("material_lot");
        //        string currMaterialExpired = convertToMaterialCode.Rows[0].TypeCol<string>("expired_dt");

        //        string bestSamiMateriallot = dtSamiMaterialCode.Rows[0].TypeCol<string>("workorder");
        //        string bestSamiMaterialExpired = dtSamiMaterialCode.Rows[0].TypeCol<string>("expired_dt");
        //        if (bestSamiMateriallot != materialLotCode)
        //        {
        //            // 기존에 들어온 바코드와 반제품 자재 조회한 것을 비교하기  ";
        //            //return (ResultEnum.NgDataBase, $"@NG_FIFO_ERORR^{bestSamiMateriallot}^{currMateriallot}^{currMaterialExpired}^{bestSamiMateriallot}^{bestSamiMaterialExpired}","");//[NG] 자재 정보 가 없습니다.
        //        }
        //    }
        //}

        #endregion

        return (ResultEnum.OkFirstBarcode, "", resultValue);
    }
    [ManualMap]
    public static (ResultEnum resultEnum, string? remark) CheckFirstTool(PanelEntity entity, OperationEntity currOperInfo, string barcode)
    {
        #region TODO: Tool 확인

        bool bIsErrToolChk = false;
        List<string> lstErrToolS = new List<string>();

        //읽어온 ToolCode 의 '-' 빼고 비교하는 함수 
        Func<string, string, bool> toolCompareFunc = (string toolCode, string toolBarcode) => string.Equals(toolCode,
            toolBarcode.Contains('-') ?
                toolBarcode[..toolBarcode.LastIndexOf('-')] :
                toolBarcode,
            StringComparison.InvariantCultureIgnoreCase);

        // erp 에서 tool 정보를 가져옴
        DataTable erpToolDt = DataContext.StringDataSet("@BarcodeApi.Common.ErpToolList", currOperInfo).Tables[0];

        if (erpToolDt.Rows.Count > 0)
        {
            //jjk, 231003 - 서정욱 프로 요청 사항으로 Tool 검증 리스트 관련한 공정은 검사 필요.
            //1.   관련 공정만 누락 검토를 한다	
            //2.   TOOL 2개 중 1개만 정합성 및 누락 검토를 한다			
            //2-2  다른 모델의 TOOL 금지		
            //2-3  TM0801로 시작하는 애는 누락허용, 정합성 허용한다		
            bool bIsToolChk = CodeService.List("TOOL_VERFIY_LIST", entity.OperCode, null, null, null).Count > 0 ? true : false;
            if (!bIsToolChk)
            {
                //lot 및 기준상 Tool 이 있으나, 확장기준정보에서 툴 체크 목록이 N으로 되어있으므로 리턴으로 빠저나감
                DataTable baseOperInfoDt = DataContext.StringDataSet("@BarcodeApi.Common.BaseOperInfo", RefineEntity(currOperInfo)).Tables[0];
                if (baseOperInfoDt.Rows.Count == 0)
                    return (ResultEnum.OkFirstBarcode, "");

                var scanToolyn = baseOperInfoDt.Rows[0].TypeCol<string>("scan_tool_yn");

                if (scanToolyn == "N")
                    return (ResultEnum.OkFirstBarcode, "");
            }

            //Barcode 확인
            if (barcode == null)
                return (ResultEnum.NgDataBase, "@NG_TOOL_CODE_ERROR");//[NG] TOOL CODE 조회 에러

            var dtRowToolItem = erpToolDt.AsEnumerable().FirstOrDefault(
                  x => x.TypeCol<string>("JOB_NO") == currOperInfo.Workorder
                    && x.TypeCol<int>("OPERATION_SEQ_NO") == currOperInfo.OperSeqNo
                    && toolCompareFunc(x.TypeCol<string>("ITEM_CODE"), barcode)
             );

            if (dtRowToolItem == null)
            {
                lstErrToolS.Add(barcode);
                bIsErrToolChk = true;
            }

            //ToolCode List 중 한개 라도 오류가 있음 에러 처리
            if (bIsErrToolChk)
            {
                //lstErrorToolS값 전달 할 거 생각하기 디테일한건 나중에 
                return (ResultEnum.NgPanelToolNotExists, "@NG_TOOL_INFO_ERROR");//[NG] TOOL 정보가 맞지 않습니다.
            }
        }
        else
        {
            return (ResultEnum.NgPanelToolNotExists, $"@NG_PROCESS_TOOL_ERROR^{barcode}");//[NG] 현재 공정에는 적용 할 수 없는 TOOL {barcode} 입니다.
        }

        #endregion
        return (ResultEnum.OkFirstBarcode, "");
    }
    [ManualMap]
    public static (ResultEnum resultEnum, string? remark) CheckFirstEqp(PanelEntity entity, OperationEntity currOperInfo, string barcode)
    {
        //DataTable dtErpOperationChk = DataContext.StringDataSet("@BarcodeApi.Common.ErpOperationCheckList", RefineEntity(currOperInfo)).Tables[0];
        DataTable dtErpOperationChk = DataContext.StringDataSet("@BarcodeApi.Common.ErpOperationCheckList", RefineEntity(currOperInfo)).Tables[0];
        if (dtErpOperationChk.Rows.Count == 0)
            return (ResultEnum.NgDataBase, "@NG_ROUTING_INFO");//[NG] Routing 정보가 등록되어 있지 않습니다.


        //임시 오류처리용
        var nullRowError = dtErpOperationChk.AsEnumerable().FirstOrDefault(x => (x.TypeCol<int>("operation_seq_no") == currOperInfo.OperSeqNo) &&
                                      (x.TypeCol<string>("operation_code") == currOperInfo.OperCode));
        if (nullRowError == null)
        {
            return (ResultEnum.NgPanelEqpNotExists, "@NG_ROUTING_INFO_SEQ");//[NG] 조회된 Routing 정보에 현재 공정순서가 포함되어 있지 않습니다.
        }


        var modelCode = dtErpOperationChk.AsEnumerable()
                 .FirstOrDefault(x => x.TypeCol<int>("operation_seq_no") == currOperInfo.OperSeqNo &&
                                      x.TypeCol<string>("operation_code") == currOperInfo.OperCode).TypeCol<string>("bom_item_code");
        if (modelCode == null)
            return (ResultEnum.NgPanelEqpNotExists, "@NG_ROUTING_INFO_SEQ_OPER");//[NG] 조회된 Routing 정보에 현재 공정 순서, 공정 코드가 포함되어 있지 않습니다.

        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;
        obj.OperSeqNo = currOperInfo.OperSeqNo;

        #region TODO: 장비 확인
        DataTable dtErpEqpChk = null;
        dtErpEqpChk = DataContext.StringDataSet("@BarcodeApi.Panel.DesignateEqpList", RefineExpando(obj)).Tables[0];

        if (dtErpEqpChk.Rows.Count != 0)
        {
            //현재 모델의 공정 순서로 지정설비 가져오기 
            var jsonConvert = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(dtErpEqpChk.Rows[0].TypeCol<string>("eqp_json"));
            var resultValue = jsonConvert.FirstOrDefault(dicItem => dicItem["eqpCode"] == barcode);

            if (resultValue == null)
            {
                dtErpEqpChk = DataContext.StringDataSet("@BarcodeApi.Common.ErpEqpFirstCheckList", RefineEntity(currOperInfo)).Tables[0];
                if (dtErpEqpChk.Rows.Count == 0)
                    return (ResultEnum.NgPanelEqpNotExists, "@NG_NO_EQP");//[NG] 조회된 설비가 없습니다.


                if (!string.IsNullOrWhiteSpace(barcode))
                {
                    //바코드에서 받은 장비가 있으면 통과 없으면 return
                    var dtRowEqpCode = dtErpEqpChk.AsEnumerable()
                        .FirstOrDefault(x => x.TypeCol<string>("equipment_code") == barcode);

                    if (dtRowEqpCode == null)
                    {
                        return (ResultEnum.NgPanelEqpNotExists, "@NG_NO_EQP");//[NG] 조회된 설비가 없습니다.
                    }
                }
            }
            else
            {
                //jjk, 23.08.23 안대표 지시사항으로 지정설비 임시 주석
                //코드관리 추가 siflex 요청
                //if (CodeService.List("ERROR_PROOF_EQP", null, entity.EqpCode, null, null).Count > 0)
                //if (entity.EqpList.AsEnumerable().Any(x => CodeService.List("ERROR_PROOF_EQP", null, x["eqpCode"], null, 'Y').Count > 0))
                if (entity.IsControlModel)
                {
                    var eqpCodeList = jsonConvert.AsEnumerable().ToList().FindAll(x => x.TypeKey<char>("useYn") == 'Y');
                    //[설비코드]설비명
                    string sMssage = string.Empty;// String.Join(",", eqpCodeList);
                    foreach (var item in eqpCodeList)
                        sMssage += $"[{item.TypeKey<string>("eqpCode")}]{item.TypeKey<string>("eqpDesc")}\r\n";


                    bool isUseYn = resultValue["useYn"].ToString() == "Y" ? true : false;
                    if (!isUseYn)
                        return (ResultEnum.NgPanelEqpNotExists, $"@NG_DESIGNATED_ERROR^{barcode}^{isUseYn}^{sMssage}");//[NG] {barcode} / useYn : {isUseYn} 지정 설비 오류.
                }

            }
        }
        else
        {
            //임시 주석
            //dtErpEqpChk = DataContext.StringDataSet("@BarcodeApi.Common.ErpEqpCheckList", RefineEntity(currOperInfo)).Tables[0];
            //if (dtErpEqpChk.Rows.Count == 0)
            //    return (ResultEnum.NgPanelEqpNotExists, "@NG_NO_EQP");//[NG] 조회된 설비가 없습니다.

            //if (!string.IsNullOrWhiteSpace(barcode))
            //{
            //    //바코드에서 받은 장비가 있으면 통과 없으면 return
            //    var dtRowEqpCode = dtErpEqpChk.AsEnumerable()
            //        .FirstOrDefault(x => x.TypeCol<string>("equipment_code") == barcode);

            //    if (dtRowEqpCode == null)
            //    {//입력된 하신 설비는 ( *** ) 현재 공정과 불일치 합니다.
            //        return (ResultEnum.NgPanelEqpNotExists, $"@NG_DESIGNATED_ERROR^{ErpEqpService.SelectCacheName(barcode)}");//[NG] 입력 된 설비는 ({ErpEqpService.SelectCacheName(barcode)}) 현재 공정과 불일치 합니다.
            //    }
            //}
        }

        #endregion
        return (ResultEnum.OkFirstBarcode, "");
    }
    [ManualMap]
    public static (ResultEnum resultEnum, string? remark, Dictionary<string, object> dicResult) VerifiyMaterial(PanelEntity entity, OperationEntity currOperInfo, Dictionary<string, object> dic)
    {
        //작지가 없어서 리턴
        if (entity.OrderCodeNo == null || string.IsNullOrWhiteSpace(currOperInfo.Workorder))
            return new(ResultEnum.NgFirstBarcode, "@NG_WITHOUT_TCARD_SCAN", dic);//[NG] T-Card 정보 없이 자재 정보를 조회 할 수 없습니다.

        DataTable dtErpEqpChk = DataContext.StringDataSet("@BarcodeApi.Common.ErpEqpCheckList", RefineEntity(currOperInfo)).Tables[0];
        if (dtErpEqpChk.Rows.Count == 0)
            return new(ResultEnum.NgFirstBarcode, "@NG_NO_EQP", dic);//[NG] 조회된 설비가 없습니다.



        //엔티티에 일단 리스트가 잇는지 확인 
        //가용설비는 있지만 리스트에 없어서 리턴
        if (entity.EqpList.Count == 0)
        {
            return new(ResultEnum.NgFirstBarcode, "@NG_NEED_PROCESS", dic);//[NG] 설비스캔을 선행 하여 주십시오.
        }

        string maeterialCode = dic["barcode"].ToString();



        //DF코팅 자재 등록 가능하도록 
        string matLot = dic["barcode"].ToString();
        string dfOperCode = currOperInfo.OperCode;
        DataTable dfOper = DataContext.StringDataSet("@BarcodeApi.Panel.DFOperCode", new { dfOperCode }).Tables[0];
        if (dtErpEqpChk.Rows.Count != 0)
        {
            DataTable dfMaterialCheck = CommonService.ErpMaterialLotList(new() { new Dictionary<string, string>() { { "materialLot", matLot } } });
            string materialCode = dfMaterialCheck.Rows[0].TypeCol<string>("material_code");
            if(materialCode.Substring(0, 6) == "SB0201")
            {
                return new(ResultEnum.OkFirstBarcode, "", dic);
            }
        }



        //panelEntity 가 있고 현재 T-Card의 MATERIAL과 Barcode 로 들어온 MATERIAL 일치 하는지 확인
        var materialResult = CheckFirstMaterial(entity, currOperInfo, maeterialCode, false);
        if (materialResult.resultEnum != ResultEnum.OkFirstBarcode)
            return new(ResultEnum.NgFirstBarcode, materialResult.remark, dic);//[NG] T-Card 자재 정보와 Barcode 자재 정보가 일치 하지 않습니다.

        dic.Add("materialCode", materialResult.convertMaterialCode);

        return new(ResultEnum.OkFirstBarcode, "", dic);
    }

    [ManualMap]
    public static (ResultEnum resultEnum, string? remark, Dictionary<string, object> dicResult) VerifiyTool(PanelEntity entity, OperationEntity currOperInfo, Dictionary<string, object> dic, string barcode)
    {
        if (string.IsNullOrWhiteSpace(currOperInfo.Workorder))
            return new(ResultEnum.NgFirstBarcode, "@NG_TOOL_WITHOUT_TCARD", dic);//[NG] T-Card 정보 없이 Tool정보를 조회 할 수 없습니다.

        DataTable dtErpEqpChk = DataContext.StringDataSet("@BarcodeApi.Common.ErpEqpCheckList", RefineEntity(currOperInfo)).Tables[0];
        if (dtErpEqpChk.Rows.Count == 0)
            return new(ResultEnum.NgFirstBarcode, "@NG_NO_TOOL", dic);
        //엔티티에 일단 리스트가 잇는지 확인 
        //가용설비는 있지만 리스트 에 없어서 리턴

        if (entity.EqpList.Count == 0)
        {
            return new(ResultEnum.NgFirstBarcode, "@NG_NEED_PROCESS", dic);//[NG] 설비스캔을 선행 하여 주십시오.
        }


        //panelEntity 가 있고 현재 T-Card의 Tool과 Barcode 로 들어온 Tool 일치 하는지 확인
        var toolResult = CheckFirstTool(entity, currOperInfo, barcode);
        if (toolResult.resultEnum != ResultEnum.OkFirstBarcode)
            return new(ResultEnum.NgFirstBarcode, toolResult.remark, dic);

        return new(ResultEnum.OkFirstBarcode, "", dic);
    }

    /// <summary>
    /// Barcode kind 구별 및 들어온 barocde 에 대한 검증 하는 함수
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="barcode"></param>
    /// <param name="langCode"></param>
    /// <returns></returns>
    [ManualMap]
    public static ResultEntity FirstBarcode(PanelEntity entity, string barcode, string langCode)
    {
        var historyNo = CommonService.PanelHistoryInsert(entity.DeviceId, entity, new { barcode, langCode });

        //card , 자재 , 자재lot , tool , 장비 , worker 전부 DB 서칭 있는경우 있는 kind 와 정보 값 저장중
        dynamic obj = new ExpandoObject();
        obj.Barcode = barcode;
        obj.LangCode = langCode;
        OperationEntity currOperInfo = new OperationEntity();
        Dictionary<string, object> dicMaterialChk = new Dictionary<string, object>();
        Dictionary<string, object> dicWorker = new Dictionary<string, object>();
        Dictionary<string, object> dicTCardChk = new Dictionary<string, object>();
        Dictionary<string, object> dicEqpChk = new Dictionary<string, object>();
        Dictionary<string, object> dicToolChk = new Dictionary<string, object>();
        Dictionary<string, object> dicErrChk = new Dictionary<string, object>();

        var barcodeInfo = CommonService.VerifiyBarcodeKind(entity.DeviceId, barcode, langCode);
        if (barcodeInfo.dicReturn == null)
            return new(null, historyNo, barcodeInfo.resultEnum, langCode, barcodeInfo.remark);

        currOperInfo = barcodeInfo.returnOperInfo;
        switch (barcodeInfo.BarcodeKind)
        {
            case "TCARD":
                dicTCardChk = barcodeInfo.dicReturn;
                break;

            case "MATERIAL":
                dicMaterialChk = barcodeInfo.dicReturn;
                break;

            case "EQUIPMENT":
                dicEqpChk = barcodeInfo.dicReturn;
                break;

            case "TOOL":
                dicToolChk = barcodeInfo.dicReturn;
                break;
                
            case "MAN":
                dicWorker = barcodeInfo.dicReturn;
                break;
            case "EQP_ERROR":
                if (barcodeInfo.dicReturn != null)
                    entity.GroupKey = barcodeInfo.dicReturn.TypeKey<string>("groupKey");
                return new(entity.OrderCodeNo, historyNo, ResultEnum.NgFirstBarcode, barcodeInfo.dicReturn, langCode, barcodeInfo.remark);
                break;

            default:
                break;
        }

        //dynamic modelCheckList = new ExpandoObject();
        //modelCheckList.WorkorderList = entity.OrderCodeNo.ToList();
        //modelCheckList.WorkorderList.Add(new Dictionary<string, object>() { ["workorder"] = barcode });

        List<Dictionary<string, object>> modelCheckList = entity.OrderCodeNo.ToList();
        modelCheckList.Add(new Dictionary<string, object>() { ["workorder"] = barcode });
        string jsonStringModelCheckList = JsonConvert.SerializeObject(modelCheckList);
        DataTable modelControl = DataContext.StringDataSet("@BarcodeApi.Panel.ControlModelCheck", new { workorderList = jsonStringModelCheckList }).Tables[0];
        entity.IsControlModel = modelControl.Rows.Count > 0;

        //T-Card 가 들어왔을때 
        //foreach (Dictionary<string, object> dicOrderCodeNoS in entity.OrderCodeNo)
        for (int i = 0; i < entity.OrderCodeNo.Count; i++)
        {
            var orderCodeNo = entity.GetWorkorderOper(i);
            currOperInfo.Workorder = orderCodeNo.SafeTypeKey<string?>("workorder", null);
            currOperInfo.OperCode = orderCodeNo.SafeTypeKey<string?>("operCode", null);
            currOperInfo.OperSeqNo = orderCodeNo.SafeTypeKey<int?>("operSeqNo", null);

            entity.Workorder = currOperInfo.Workorder;
            entity.OperCode = currOperInfo.OperCode;
            entity.OperSeqNo = currOperInfo.OperSeqNo;

            //Barcode Kind Check (MATERIAL, MAN , TCARD ,EQUIPMENT ,TOOL )
            if (dicMaterialChk.Count > 0)
            {
                obj.BarcodeKind = "MATERIAL";
                var result = VerifiyMaterial(entity, currOperInfo, dicMaterialChk);

                return new(entity.OrderCodeNo, historyNo, result.resultEnum, result.dicResult, langCode, result.remark);

            }
            else if (dicWorker.Count > 0)
            {
                obj.BarcodeKind = "MAN";

                if (string.IsNullOrWhiteSpace(currOperInfo.Workorder))
                    return new(null, historyNo, ResultEnum.NgFirstBarcode, langCode, "@NG_MAN_WITHOUT_TCARD");//"[NG] T-Card 정보 없이 MAN 조회 할 수 없습니다."

                return new(entity.OrderCodeNo, historyNo, ResultEnum.OkFirstBarcode, dicWorker, langCode, "");

            }
            else if (dicTCardChk == null || dicTCardChk.Count > 0)
            {
                obj.BarcodeKind = "TCARD";
                //if (entity.OrderCodeNo.Count >= 1)
                //    return new(historyNo, ResultEnum.NgFirstBarcode,  langCode, "@NG_MULTI_WORKORDER");

                if (entity.WorkType == "PANEL.CHANGE")
                    return new(entity.OrderCodeNo, historyNo, ResultEnum.NgFirstBarcode, dicTCardChk, langCode, "@NG_CHANGE_PAGE_TCARD");//[NG] 변경 페이지 에서는 T-Card를 추가 할 수 없습니다.

                //VPT230526402 - 00012, 공정이 
                // barcode 공정이랑 안맞으면 팅기게 
                // 지금 들어온 작지와 바디로 태워온 공정이 서로 맞지 않으면 팅기기 
                // 공순 왔다갔다?, 테스트주석
                var currOperCode = dicTCardChk.TypeKey<string>("currentOperCode");
                var targetOperCode = entity.OperCode; 
                if (currOperCode != targetOperCode)
                    return new(entity.OrderCodeNo, historyNo, ResultEnum.NgFirstBarcode, dicTCardChk, langCode, $"@NG_TCARD_DIFFERENT^{currOperCode}^{targetOperCode}");//[NG] (기존) T-Card 공정과 (현재) T-Card로 들어온 공정이 다릅니다.\r\n다시 시도 하여 주십시오.

                //코드관리 추가 siflex 요청
                //if (CodeService.List("ERROR_PROOF_EQP", null, entity.EqpCode, null, null).Count > 0)
                //if (entity.eqplist.asenumerable().any(x => codeservice.list("error_proof_eqp", null, x["eqpcode"], null, 'y').count > 0))
                if (entity.IsControlModel)
                {
                    //SPC 긴급 주석
                    //임시주석 SPC
                    //int IPQCcnt = DataContext.StringValue<int>("@BarcodeApi.Common.IPQCStatuseList", new { workorder = entity.Workorder });
                    //if (IPQCcnt > 0)
                    //    return new(historyNo, ResultEnum.OkFirstBarcode, dicTCardChk, langCode, "@NG_IPQC"); //[NG]SPC NG\r\n공정검사데이터를 확인해 주세요
                }


                return new(null, historyNo, ResultEnum.OkFirstBarcode, dicTCardChk, langCode, "");
            }
            else if (dicEqpChk.Count > 0)
            {
                obj.BarcodeKind = "EQUIPMENT";

                if (entity.WorkType == "PANEL.CHANGE")
                    return new(entity.OrderCodeNo, historyNo, ResultEnum.NgFirstBarcode, dicEqpChk, langCode, "@NG_CHANGE_PAGE_EQP");//[NG] 변경 페이지 에서는 설비를 추가 할 수 없습니다.

                if (string.IsNullOrWhiteSpace(currOperInfo.Workorder))
                    return new(entity.OrderCodeNo, historyNo, ResultEnum.OkFirstBarcode, dicEqpChk, langCode, "");

                string eqpCode = dicEqpChk["barcode"].ToString();
                var eqpResult = CheckFirstEqp(entity, currOperInfo, eqpCode);
                if (eqpResult.resultEnum != ResultEnum.OkFirstBarcode)
                    return new(entity.OrderCodeNo, historyNo, ResultEnum.NgFirstBarcode, dicEqpChk, langCode, eqpResult.remark);

                //파라미터 주석처리
                //T-Card가 있으면서 설비가 있을때만 -레서피 파라마터를 보내고
                dynamic workorderBarcode = new ExpandoObject();
                workorderBarcode.Barcode = entity.Workorder;
                DataTable product = DataContext.StringDataSet("@BarcodeApi.Panel.ErpTcardProductName", RefineExpando(workorderBarcode)).Tables[0];

                //기준정보가 있을때는 검사하고 없을때는 검사안하더라도 통과
                if (product.Rows.Count > 0)
                {
                    List<string> resultList = entity.EqpList.SelectMany(dictionary => dictionary.Values).ToList();
                    string barcodeName = product.Rows[0].TypeCol<string>("bom_item_description");
                    string modelCode = product.Rows[0].TypeCol<string>("bom_item_code");
                    dynamic objRecipeOrParam = new ExpandoObject();
                    objRecipeOrParam.ModelCode = modelCode;
                    objRecipeOrParam.OperSeqNo = currOperInfo.OperSeqNo;
                    objRecipeOrParam.OperCode = currOperInfo.OperCode;
                    objRecipeOrParam.EqpCode = eqpCode;

                    DataTable baseRecipeDt = DataContext.StringDataSet("@BarcodeApi.Common.BaseRecipeList", RefineExpando(objRecipeOrParam)).Tables[0];
                    var recipeResult = ToDic(baseRecipeDt).ToList().AsEnumerable().Where(
                        x => x.TypeKey<string>("modelCode") == objRecipeOrParam.ModelCode
                        && x.TypeKey<int>("operationSeqNo") == objRecipeOrParam.OperSeqNo
                        && x.TypeKey<string>("eqpCode") == eqpCode
                        ).ToList();

                    if (recipeResult == null)
                    {
                        dicEqpChk.Add("recipe", "");
                        dicEqpChk.Add("recipeCount", 0);
                    }
                    else
                    {
                        dicEqpChk.Add("recipe", recipeResult);
                        dicEqpChk.Add("recipeCount", recipeResult.Count);
                    }

                    objRecipeOrParam.Params = string.Join(',', resultList);
                    DataTable baseParamDt = DataContext.StringDataSet("@BarcodeApi.Common.BaseParameterList", RefineExpando(objRecipeOrParam)).Tables[0];
                    var parameResult = ToDic(baseParamDt).ToList().AsEnumerable().Where(
                        x => x.TypeKey<string>("modelCode") == objRecipeOrParam.ModelCode
                        && x.TypeKey<string>("operationCode") == currOperInfo.OperCode
                        && x.TypeKey<string>("eqpCode") == eqpCode
                        ).ToList();

                    if (parameResult == null)
                    {
                        dicEqpChk.Add("param", "");
                        dicEqpChk.Add("paramCount", 0);
                    }
                    else
                    {
                        dicEqpChk.Add("param", parameResult);
                        dicEqpChk.Add("paramCount", parameResult.Count);
                    }
                }

                return new(entity.OrderCodeNo, historyNo, ResultEnum.OkFirstBarcode, dicEqpChk, langCode, "");
            }
            else if (dicToolChk.Count > 0)
            {
                obj.BarcodeKind = "TOOL";
                var result = VerifiyTool(entity, currOperInfo, dicToolChk, barcode);
                return new(entity.OrderCodeNo, historyNo, result.resultEnum, result.dicResult, langCode, result.remark);
            }
            else
            {
                //검색된 바코드 정보가 없습니다. 다시한번 확인해 주십시오.
                return new(entity.OrderCodeNo, historyNo, ResultEnum.NgFirstBarcode, langCode, $"@NG_NO_BARCODE^{barcode}^{"No Data"}");//[NG] 검색된 바코드 정보가 없습니다. 다시한번 확인해 주십시오.
            }
        }

        //설비가 먼저 들어오고 T-Card 가 들어왔을때 
        //Barcode Kind Check (MATERIAL, MAN , TCARD ,EQUIPMENT ,TOOL )
        if (dicMaterialChk.Count > 0)
        {
            obj.BarcodeKind = "MATERIAL";
            var result = VerifiyMaterial(entity, currOperInfo, dicMaterialChk);
            return new(entity.OrderCodeNo, historyNo, result.resultEnum, result.dicResult, langCode, result.remark);
        }
        else if (dicWorker.Count > 0)
        {
            obj.BarcodeKind = "MAN";

            if (string.IsNullOrWhiteSpace(currOperInfo.Workorder))
                return new(entity.OrderCodeNo, historyNo, ResultEnum.NgFirstBarcode, dicWorker, langCode, "@NG_NO_TCARD_MAN");//[NG] T-Card 정보 없이 작업자를 조회 할 수 없습니다.

            return new(entity.OrderCodeNo, historyNo, ResultEnum.OkFirstBarcode, dicWorker, langCode, "");
        }
        else if (dicTCardChk.Count > 0)
        {
            obj.BarcodeKind = "TCARD";

            foreach (Dictionary<string, string> dic in entity.EqpList)
            {
                var eqpResult = CheckFirstEqp(entity, currOperInfo, dic["eqpCode"].ToString());
                if (eqpResult.resultEnum != ResultEnum.OkFirstBarcode)
                    return new(entity.OrderCodeNo, historyNo, ResultEnum.NgFirstBarcode, dicEqpChk, langCode, eqpResult.remark);
            }

            return new(entity.OrderCodeNo, historyNo, ResultEnum.OkFirstBarcode, dicTCardChk, langCode, "");
        }
        else if (dicEqpChk.Count > 0)
        {
            obj.BarcodeKind = "EQUIPMENT";

            if (string.IsNullOrWhiteSpace(currOperInfo.Workorder))
            {
                return new(entity.OrderCodeNo, historyNo, ResultEnum.OkFirstBarcode, dicEqpChk, langCode, "");
            }

            string eqpCode = dicEqpChk["barcode"].ToString();
            var eqpResult = CheckFirstEqp(entity, currOperInfo, eqpCode);
            if (eqpResult.resultEnum != ResultEnum.OkFirstBarcode)
                return new(entity.OrderCodeNo, historyNo, ResultEnum.NgFirstBarcode, dicEqpChk, langCode, "@NG_NO_ONLY_EQP");//[NG] 설비만 등록 할 수 없습니다.T-Card 등록 작업을 먼저 진행하시기 바랍니다.

            return new(entity.OrderCodeNo, historyNo, ResultEnum.OkFirstBarcode, dicEqpChk, langCode, "");
        }
        else if (dicToolChk.Count > 0)
        {
            obj.BarcodeKind = "TOOL";

            var result = VerifiyTool(entity, currOperInfo, dicToolChk, barcode);
            return new(entity.OrderCodeNo, historyNo, result.resultEnum, result.dicResult, langCode, result.remark);
        }
        else
        {
            //검색된 바코드 정보가 없습니다. 다시한번 확인해 주십시오.
            return new(entity.OrderCodeNo, historyNo, ResultEnum.NgFirstBarcode, langCode, $"@NG_NO_BARCODE^{barcode}^{"No Data"}");//[NG] 검색된 바코드 정보가 없습니다. 다시한번 확인해 주십시오.
        }
    }


    [ManualMap]
    public static IResult OperList(string? langCode, string? deviceId, string tcard)
    {

        dynamic obj = new ExpandoObject();
        obj.Tcard = tcard;

        if (string.IsNullOrWhiteSpace(langCode))
        {
            langCode = "ko-KR";
        }

        if (langCode.ToUpper() != "KO-KR" && langCode.ToUpper() != "VI-VN")
        {
            langCode = "KR-VN";
        }

        obj.lang = langCode.ToUpper();

        langCode.ToUpper();


        //BASIC
        //NORMAL
        //REWORK

        DataTable erpTcardQuery = DataContext.StringDataSet("@BarcodeApi.Panel.ErpTcardQuery", RefineExpando(obj, true)).Tables[0];
        var list2 = ToDic(erpTcardQuery).ToList(); // 공순이랑 공정명 구하기
        //var dt = DataContext.StringDataSet("@BarcodeApi.Panel.BeforeChange").Tables[0];
        return Results.Json(ToDic(erpTcardQuery));
    }


    /// <summary>
    /// Insert 자재 체크 함수화
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="erpBomDt"></param>
    /// <returns></returns>
    [ManualMap]
    public static (ResultEnum resultEnum, string? remark) CheckInsertMaterial(PanelEntity entity, OperationEntity currOperInfo, DataTable erpBomDt, DataTable erpMaterLotDt)
    {
        List<Dictionary<string, string>> tempRollSplitMaterial = new List<Dictionary<string, string>>();
        string tempMaterialLot = string.Empty;
        if (erpMaterLotDt == null)
        {
            foreach (var item in entity.MaterialList)
            {
                Dictionary<string, string> rollSplitDic = new Dictionary<string, string>();
                string rollSplitId = item.TypeKey<string>("materialLot");

                //조회
                var mesPanelCheck = DataContext.StringValue<string>("@BarcodeApi.Common.MapRootId", new { rollId = rollSplitId });
                if (mesPanelCheck == null)
                    break;
                // 분할 바코드를 차일드에 놓고 
                //원래는 메터리얼 그자리에 넣으면 
                rollSplitDic.Add("materialLot", mesPanelCheck);
                rollSplitDic.Add("childMaterialLot", rollSplitId);

                tempRollSplitMaterial.Add(rollSplitDic);
            }
        }

        //DataTable convertToMaterialCode = CommonService.ErpMaterialLotList(tempRollSplitMaterial);
        //if (convertToMaterialCode.Rows.Count == 0)
        //{
        //    if (erpMaterLotDt == null)
        //        convertToMaterialCode = CommonService.ErpMaterialLotList(entity.MaterialList);
        //    else if (erpMaterLotDt.Rows.Count != 0)
        //        convertToMaterialCode = erpMaterLotDt;
        //}

        DataTable convertToMaterialCode = null;
        if (erpMaterLotDt == null)
            convertToMaterialCode = CommonService.ErpMaterialLotList(entity.MaterialList);
        else if (erpMaterLotDt.Rows.Count != 0)
            convertToMaterialCode = erpMaterLotDt;


        //MaterialCode 여러개를 확인
        var materialCode = convertToMaterialCode.AsEnumerable().GroupBy(x => x.TypeCol<string>("material_code"));
        var lstmaterialCode = materialCode.Select(x => x.Key).ToList();

        var dfFlag = false;

        //DF code check 
        DataTable dfCodeDt = DataContext.StringDataSet("@BarcodeApi.Panel.DFOperCode", new { operCode = entity.OperCode }).Tables[0];
        string dfMaterialCode = string.Empty;
        var getMapCode = CodeService.GetMap("DF_4M_OPER").ToList();
        if (dfCodeDt.Rows.Count != 0)
        {
            if (entity.MaterialList.Count == 0)
            {
                string str = string.Join("\r\n", getMapCode);
                return (ResultEnum.NgPanelMatNotExists, $"@NG_DF_DATA_EXIST^{str}");//[NG] DF공정은 자재가 필수로 등록되어야 합니다. 자재를 등록하고 다시 시도 하십시오.
            }
            DataTable dfMaterialCheck = CommonService.ErpMaterialLotList(entity.MaterialList);
            dfMaterialCode = dfMaterialCheck.Rows[0].TypeCol<string>("material_code");

            dfFlag = true;
        }

        foreach (string value in lstmaterialCode)
        {
            string currentModelName = CommonService.SplitModeCode(value);
            if (!erpBomDt.AsEnumerable().Any(x => CommonService.SplitModeCode(x.TypeCol<string>("item_code")) == currentModelName))
            {
                if(currentModelName.Contains("SB0201")&& !dfFlag)
                {
                    var result = getMapCode.AsEnumerable().FirstOrDefault(x => x.Value == entity.OperCode);
                    if (result == null)
                    {
                        // 4M등록 DF공정에 포함 되지 않은 공정 코드 입니다.
                        // 코드관리에 등록된 코드 목록 : {0}
                        // 등록된 공정 코드 : {1}
                        // 관리자에게 문의하여 공정 등록 후 다시 시도하십시오.
                        string str = string.Join("\r\n", getMapCode);
                        return (ResultEnum.NgPanelMatNotExists, $"@NG_DF_OPER_CODE^{str}^{entity.OperCode}");
                    }
                }

                if (!dfFlag)
                    return (ResultEnum.NgPanelMatNotExists, $"@NG_JAJE_DIFF_ERP^{string.Empty}^{string.Empty}");//[NG] 자재 정보가 맞지 않습니다.
            }
        }

        //insert 시에만 체크 
        if (erpBomDt.Rows.Count != lstmaterialCode.Count && !dfFlag)
            return (ResultEnum.NgPanelMatNotExists, "@NG_MATERIAL_COUNT_ERROR");//[NG] 자재 수량 정보가 맞지 않습니다.

        //자재 유수명 체크 
        //230818 서정욱 프로 요청사항으로 주석 처리
        //230905 서정욱 프로 요청사항으로 주석 해제
        List<DataRow> dtRowS = convertToMaterialCode.AsEnumerable().Where(x => x.TypeCol<string>("expired_dt") != null).ToList();

        //df 공정에서는 일단 유수명 건너뛰기
        if (dfMaterialCode.Length > 0)
            if (dfMaterialCode.Substring(0, 6) == "SB0201")
                dtRowS = new List<DataRow>();

        DateTime currTime = DateTime.Now;

        foreach (var dtRowItem in dtRowS)
        {
            DateTime expiredDt = dtRowItem.TypeCol<DateTime>("expired_dt");
            if (currTime.Date > expiredDt.Date)
            {
                string sExpiredDt = expiredDt.ToString("yyyy-MM-dd");
                string modelCode = dtRowItem.TypeCol<string>("material_code");
                string materialLotCode = dtRowItem.TypeCol<string>("material_lot");
                //기존 리턴메세지
                return (ResultEnum.NgPanelMatNotExists, $"@NG_NEW_LIFE_IS_OVER^{materialLotCode}^{sExpiredDt}^{modelCode}");//[NG] [{materialLotCode}] 의 유수명 기간이 지났습니다. 유수명 기간을 다시 체크하여주십시오.
            }
        }

        if (tempRollSplitMaterial.Count != 0)
            entity.MaterialList = tempRollSplitMaterial;




        return (ResultEnum.OkPanel, "");
    }

    /// <summary>
    /// Insert TOOL 체크 함수화
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="currOperInfo"></param>
    /// <param name="erpBomDt"></param>
    /// <returns></returns>
    [ManualMap]
    public static (ResultEnum resultEnum, string? remark) CheckInsertTool(PanelEntity entity, OperationEntity currOperInfo, DataTable erpBomDt)
    {
        bool bIsErrToolChk = false;
        List<string> lstErrTool = new List<string>();


        //읽어온 ToolCode 의 '-' 빼고 비교하는 함수 
        Func<string, string, bool> toolCompareFunc = (string toolCode, string toolBarcode) => string.Equals(toolCode,
            toolBarcode.Contains('-') ?
                toolBarcode[..toolBarcode.LastIndexOf('-')] :
                toolBarcode,
            StringComparison.InvariantCultureIgnoreCase);



        // erp 에서 tool 정보를 가져옴
        DataTable erpToolDt = DataContext.StringDataSet("@BarcodeApi.Common.ErpToolList", currOperInfo).Tables[0];
        if (entity.ToolList?.Count == 0)
        {
            //임시 주석
            //코드관리 추가 siflex 요청
            if (erpToolDt.Rows.Count != 0 && (entity.EqpList.AsEnumerable().Any(x => CodeService.List("ERROR_PROOF_EQP", null, x["eqpCode"], null, null).Count > 0)))
            {
                return (ResultEnum.NgPanelToolNotExists, "@NG_TOOL_INFO_ERROR");//[NG] TOOL 정보가 맞지 않습니다.
            }
        }

        //jjk, 231003 - 서정욱 프로 요청 사항으로 Tool 검증 리스트 관련한 공정은 검사 필요.
        //1.   관련 공정만 누락 검토를 한다	                     o
        //2.   TOOL 2개 중 1개만 정합성 및 누락 검토를 한다		 o	
        //2-2  다른 모델의 TOOL 금지		
        //2-3  TM0801로 시작하는 애는 누락허용, 정합성 허용한다	 o	
        bool bIsToolChk = CodeService.List("TOOL_VERFIY_LIST", entity.OperCode, null, null, null).Count > 0 ? true : false;
        if (!bIsToolChk)
        {
            //lot 및 기준상 Tool 이 있으나, 확장기준정보에서 툴 체크 목록이 N으로 되어있으므로 리턴으로 빠저나감
            DataTable baseOperInfoDt = DataContext.StringDataSet("@BarcodeApi.Common.BaseOperInfo", RefineEntity(currOperInfo)).Tables[0];
            if (baseOperInfoDt.Rows.Count > 0)
            {
                var scanToolyn = baseOperInfoDt.Rows[0].TypeCol<string>("scan_tool_yn");

                if (scanToolyn == "N")
                    return (ResultEnum.OkFirstBarcode, "");
            }
        }

        //임시 주석
        //코드관리 추가 siflex 요청
        if (entity.ToolList.Count != erpToolDt.Rows.Count && (entity.EqpList.AsEnumerable().Any(x => CodeService.List("ERROR_PROOF_EQP", null, x["eqpCode"], null, null).Count > 0)))
        {
            return (ResultEnum.NgPanelToolNotExists, "@NG_TOOL_COUNT_ERROR");//[NG] TOOL 수량 정보가 맞지 않습니다.
        }

        //ToolCode 여러개를 확인
        foreach (Dictionary<string, string> toolList in entity.ToolList)
        {
            if (toolList.Count == 0)
                continue;

            var toolCode = toolList["toolCode"].ToString();
            if (string.IsNullOrWhiteSpace(toolCode))
                continue;
            if (toolCode == null)
                return (ResultEnum.NgDataBase, "@NG_TOOL_CODE_SEARCH_ERROR");//[NG] TOOL CODE 조회 에러
            if (toolCode.Contains("TM0801"))
                continue;


            var dtRowToolItem = erpToolDt.AsEnumerable().FirstOrDefault(
                  x => x.TypeCol<string>("JOB_NO") == currOperInfo.Workorder
                    && x.TypeCol<int>("OPERATION_SEQ_NO") == currOperInfo.OperSeqNo
                    && toolCompareFunc(x.TypeCol<string>("ITEM_CODE"), toolCode)
             );

            if (dtRowToolItem == null)
            {
                lstErrTool.Add(toolCode);
                bIsErrToolChk = true;
            }
        }


        //임시 주석
        ////ToolCode List 중 한개 라도 오류가 있음 에러 처리
        //if (biserrtoolchk)
        //{
        //    //lsterrortools값 전달 할 거 생각하기 디테일한건 나중에 
        //    return (resultenum.ngpaneltoolnotexists, "@ng_tool_info_error");//[ng] tool 정보가 맞지 않습니다.
        //}

        return (ResultEnum.OkPanel, "");
    }

    [ManualMap]
    public static (ResultEnum resultEnum, string? remark, Dictionary<string, object>? dicResult) CheckInsertBaseRecipe(dynamic objRecipeOrParam)
    {

        #region // TODO: 장비 레시피 확인 
        Dictionary<string, object> dic = new Dictionary<string, object>();
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;
        // 들어오는 값 
        // 기준정보 찾기
        DataTable baseRecipeDt = DataContext.StringDataSet("@BarcodeApi.Common.BaseRecipeList", RefineExpando(objRecipeOrParam, true)).Tables[0];

        //objRecipeOrParam.RecipeParamJudge = true;

        if (baseRecipeDt.Rows.Count > 0)
        {
            DataSet recipeDs = null;
            try
            {
                //DB에서 조회 된 레서피 값
                recipeDs = db.ExecuteStringDataSet("@BarcodeApi.Common.RecipeChkeckList", RefineExpando(objRecipeOrParam, true));

            }
            catch (Exception ex)
            {
                objRecipeOrParam.RecipeParamJudge = false;
                return (ResultEnum.OkPanel, "", null);
            }

            if (recipeDs.Tables.Count == 0)
            {
                //조회된 장비 레서피가 없음
                return (ResultEnum.OkPanel, "", null);
            }

            //기준 정보 값
            foreach (DataRow baseRecipeDtRow in baseRecipeDt.Rows)
            {
                string baseModelCode = baseRecipeDtRow.TypeCol<string>("model_code");
                string baseOperationCode = baseRecipeDtRow.TypeCol<string>("operation_code");
                int baseOperationSeqNo = baseRecipeDtRow.TypeCol<int>("operation_seq_no");
                string baseEqpCode = baseRecipeDtRow.TypeCol<string>("eqp_code");
                string baseColumnName = baseRecipeDtRow.TypeCol<string>("column_name");
                double baseValue = baseRecipeDtRow.TypeCol<double>("base_val");
                string baseRecipeName = baseRecipeDtRow.TypeCol<string>("recipe_name");

                if (string.IsNullOrWhiteSpace(baseRecipeName) || string.IsNullOrWhiteSpace(baseValue.ToString()) || string.IsNullOrWhiteSpace(baseColumnName))
                    continue;

                //장비의 레서피 값을 가져와서 비교 
                var json = recipeDs.Tables[0].AsEnumerable().Where(
                    x => x.TypeCol<string>("model_code") == baseModelCode
                    && x.TypeCol<string>("operation_code") == baseOperationCode
                    && x.TypeCol<string>("eqp_code") == baseEqpCode
                    && !string.IsNullOrWhiteSpace(x.TypeCol<string?>("data_json"))
                    ).Select(x => JsonConvert.DeserializeObject<Dictionary<string, double>>(x.TypeCol<string>("data_json"))).ToList();

                if (json == null || json.Count == 0 || json[0].Count == 0)
                    continue;
                double serchValue = json[0][baseColumnName];
                if (baseValue != serchValue)
                {
                    var recipe = recipeDs.Tables[0].AsEnumerable().Where(
                    x => x.TypeCol<string>("model_code") == baseModelCode
                    && x.TypeCol<string>("operation_code") == baseOperationCode
                    && x.TypeCol<string>("eqp_code") == baseEqpCode
                    ).FirstOrDefault();


                    dic.Clear();
                    dic.Add("baseModelCode", baseModelCode);
                    dic.Add("baseOperationCode", baseOperationCode);
                    dic.Add("baseEqpCode", baseEqpCode);
                    dic.Add("baseColumnName", baseColumnName);
                    dic.Add("baseValue", baseValue);
                    dic.Add("recipeName", baseRecipeName);
                    dic.Add("resultValue", serchValue);

                    dynamic objRecipe = new ExpandoObject();
                    objRecipe.EqpCode = baseEqpCode;
                    objRecipe.RecipeCode = baseRecipeDtRow.TypeCol<string>("recipe_code");
                    objRecipe.Workorder = objRecipeOrParam.Workorder;
                    objRecipe.OperSeqNo = baseOperationSeqNo;
                    objRecipe.BaseVal = baseValue;
                    objRecipe.EqpVal = serchValue;
                    objRecipe.Judge = "N";
                    objRecipe.RawType = recipeDs.Tables[0].Rows[0].TypeCol<string>("raw_type");
                    objRecipe.TableName = baseRecipeDtRow.TypeCol<string>("table_name");
                    objRecipe.ColumnName = baseColumnName;

                    int cnt = DataContext.StringNonQuery("@BarcodeApi.Common.RecipeErrorInsert", RefineExpando(objRecipe));
                    if (cnt <= 0)
                        return (ResultEnum.NgPanelEqpRecipe, $"@ERR_INSERT_ERROR", dic);//[NG] insert fail

                    objRecipeOrParam.RecipeParamJudge = false;
                    //// 기준정보 Recipe 와 Erp Recipe 값이 다른경우 
                    string sMessage1 = $"기준정보 : 설비코드:{baseEqpCode}, 컬럼이름:{baseColumnName}, {baseRecipeName} 기준값:{baseValue}";
                    string sMessage2 = $"Recipe정보 : 설비코드:{recipe.TypeCol<string>("eqp_code")}, 컬럼이름:{baseColumnName}, [{baseRecipeName}] 측정값:{serchValue}";

                    //기준정보 : 설비코드:{baseEqpCode}, 컬럼이름:{baseColumnName}, {baseRecipeName} 기준값:{baseValue}\r\nRecipe정보 : 설비코드:{recipe.TypeCol<string>("eqp_code")}, 컬럼이름:{baseColumnName}, [{baseRecipeName}] 측정값:{serchValue}
                    //NG_RECIPE
                    //기준정보 : 설비코드:{0}, 컬럼이름:{1}, {2} 기준값:{3}\r\nRecipe정보 : 설비코드:{4}, 컬럼이름:{5}, [{6}] 측정값:{7}


                    //return (ResultEnum.NgPanelEqpRecipe, $"{sMessage1}\r\n{sMessage2}", dic);//[NG] 레시피 값
                    return (ResultEnum.NgPanelEqpRecipe, $"@NG_RECIPE_4M^{baseEqpCode}^{baseColumnName}^{baseRecipeName}^{baseValue}^{recipe.TypeCol<string>("eqp_code")}^{baseColumnName}^{baseRecipeName}^{serchValue}", dic);//[NG] 레시피 값
                }
            }
        }
        return new(ResultEnum.OkPanel, "", dic);
        #endregion
    }

    [ManualMap]
    public static (ResultEnum resultEnum, string? remark, Dictionary<string, object>? dicResult) CheckInsertBaseParam(dynamic objRecipeOrParam)
    {
        #region // TODO: 장비 파라미터 확인
        Dictionary<string, object> dic = new Dictionary<string, object>();
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;
        // 들어오는 값 
        // 기준정보 찾기
        DataTable baseParamDt = DataContext.StringDataSet("@BarcodeApi.Common.BaseParameterList", RefineExpando(objRecipeOrParam)).Tables[0];
        if (baseParamDt.Rows.Count > 0)
        {
            DataSet paramDs = null;
            try
            {
                paramDs = db.ExecuteStringDataSet("@BarcodeApi.Common.ParameterChkeckList", RefineExpando(objRecipeOrParam, true));
            }
            catch (Exception ex)
            {
                objRecipeOrParam.RecipeParamJudge = false;
                return (ResultEnum.OkPanel, "", dic);

            }


            if (paramDs.Tables.Count == 0)
            {
                // 데이터는 있는데 쿼리문으로 조회 안되는 상황이 있움 검토 필
                // 조회하였는데 없는경우는 넘어가는것을 고려 해봐야함.
                // jjk, 23.06.22

                //조회된 장비 파라미터 없음.
                //return (ResultEnum.NgPanelEqpParam, "[NG] 조회된 파라미터 정보가 없습니다.");
                return (ResultEnum.OkPanel, "", dic);
            }

            //기준 정보 값
            foreach (DataRow baseParamDtRow in baseParamDt.Rows)
            {
                string baseModelCode = baseParamDtRow.TypeCol<string>("model_code");
                int baseOperationSeqNo = objRecipeOrParam.OperSeqNo;
                string baseOperationCode = baseParamDtRow.TypeCol<string>("operation_code");
                string baseEqpCode = baseParamDtRow.TypeCol<string>("eqp_code");

                double? std = baseParamDtRow.TypeCol<double?>("std");
                double? lcl = baseParamDtRow.TypeCol<double?>("lcl"); //하한
                double? ucl = baseParamDtRow.TypeCol<double?>("ucl"); //상한
                double? lsl = baseParamDtRow.TypeCol<double?>("lsl");
                double? usl = baseParamDtRow.TypeCol<double?>("usl");
                string columnName = baseParamDtRow.TypeCol<string>("column_name");
                string parmaName = baseParamDtRow.TypeCol<string>("param_name");

                //파라미터 기준정보가 등록되지 않은 경우로 continue 진행
                if (lcl == null && ucl == null && lsl == null && usl == null)
                    continue;

                //파라미터 기준정보가 등록되지 않은 경우로 continue 진행
                if (lcl == null && ucl == null)
                    continue;

                if (string.IsNullOrWhiteSpace(parmaName) || string.IsNullOrWhiteSpace(columnName))
                    continue;

                var json = paramDs.Tables[0].AsEnumerable().Where(
                    x => x.TypeCol<string>("model_code") == baseModelCode
                    && x.TypeCol<string>("operation_code") == baseOperationCode
                    && x.TypeCol<string>("eqp_code") == baseEqpCode
                    ).Select(x => JsonConvert.DeserializeObject<Dictionary<string, double>>(x.TypeCol<string>("data_json"))).ToList();

                if (json == null || json.Count == 0 || json[0].Count == 0)
                {
                    continue;
                    //설비에서 조회된 Parameter 값이 없음
                    //return (ResultEnum.NgPanelEqpRecipe, "[NG] 조회된 Parameter 값이 없습니다.");
                }

                double serchValue = json.AsEnumerable().Select(x => x.TypeKey<double>(columnName)).FirstOrDefault(x => x != 0);
                (ResultEnum resultEnum, string? remark, Dictionary<string, object>? dicResult) VerilfyParam()
                {
                    var param = paramDs.Tables[0].AsEnumerable().Where(
                           x => x.TypeCol<string>("model_code") == baseModelCode
                           && x.TypeCol<string>("operation_code") == baseOperationCode
                           && x.TypeCol<string>("eqp_code") == baseEqpCode
                       ).FirstOrDefault();

                    dic.Clear();
                    dic.Add("baseModelCode", baseModelCode);
                    dic.Add("baseOperationCode", baseOperationCode);
                    dic.Add("baseEqpCode", baseEqpCode);
                    dic.Add("lcl", lcl);
                    dic.Add("ucl", ucl);
                    dic.Add("columnName", columnName);
                    dic.Add("parmaName", parmaName);

                    dynamic objParameter = new ExpandoObject();
                    objParameter.EqpCode = baseEqpCode;
                    objParameter.ParamId = baseParamDtRow.TypeCol<string>("param_id");
                    objParameter.Workorder = objRecipeOrParam.Workorder;
                    objParameter.OperSeqNo = baseOperationSeqNo;
                    objParameter.Std = std == null ? 0 : std;
                    objParameter.Lcl = lcl == null ? 0 : lcl;
                    objParameter.Ucl = ucl == null ? 0 : ucl;
                    objParameter.Lsl = lsl == null ? 0 : lsl;
                    objParameter.Usl = usl == null ? 0 : usl;
                    objParameter.EqpVal = serchValue;
                    objParameter.Judge = "N";
                    objParameter.RawType = paramDs.Tables[0].Rows[0].TypeCol<string>("raw_type");
                    objParameter.TableName = baseParamDtRow.TypeCol<string>("table_name");
                    objParameter.ColumnName = columnName;

                    int cnt = DataContext.StringNonQuery("@BarcodeApi.Common.ParameterErrorInsert", RefineExpando(objParameter));
                    if (cnt <= 0)
                        return (ResultEnum.NgPanelEqpParam, $"[NG] insert fail", dic);

                    objRecipeOrParam.RecipeParamJudge = false;
                    //파라미터 값이 범위에 포함 되지 않음 
                    string sMessage1 = $"기준정보 : 설비코드:{baseEqpCode}, UCL:{ucl}, LCL : {lcl}";
                    string sMessage2 = $"Param정보 : 설비코드:{param.TypeCol<string>("eqp_code")}, [{parmaName}] 파라미터값 {serchValue}";
                    //return (ResultEnum.NgPanelEqpParam, $"{sMessage1}\r\n{sMessage2}", dic);//[OK] 파라미터 값
                    //return (ResultEnum.OkPanel, "[OK] 파라미터 값", dic);//[OK] 파라미터 값
                    //기준정보 : 설비코드:{0}, 상한:{1}, 하한:{2}\r\nParam정보 : 설비코드:{3}, [{4}] 파라미터값 {5}
                    return (ResultEnum.NgPanelEqpParam, $"@NG_PARAM_4M^{baseEqpCode}^{ucl}^{lcl}^{param.TypeCol<string>("eqp_code")}^{parmaName}^{serchValue}", dic);
                }

                //5 <=    10    >= 20 
                if (!(lcl <= serchValue && serchValue <= ucl))
                    return VerilfyParam();
                else if (ucl == null && lcl != null)
                    return VerilfyParam();
                else if (ucl != null && lcl == null)
                    return VerilfyParam();
                else if (ucl == null && lcl == null)
                    return VerilfyParam();
            }
        }
        return new(ResultEnum.OkPanel, "", dic);
        #endregion
    }

    [ManualMap]
    public static (ResultEnum resultEnum, string remark, DataTable resultDt, List<Dictionary<string, object>> listReturnValue) SetPanelInsert(PanelEntity entity)
    {
        DataTable resultDt = null;
        List<Dictionary<string, object>> listReturnValue = new List<Dictionary<string, object>>();

        (ResultEnum resultEnum, string remark) DuplicatieCheck()
        {
            DataTable panel4MDuplicateChk = DataContext.StringDataSet("@BarcodeApi.Panel.Panel4MDuplicateChack", entity).Tables[0];
            if (panel4MDuplicateChk.Rows.Count > 0)
                return new(ResultEnum.NgPanelProcDupl, "@NG_ALREADY_4M");//[NG] 이미 등록처리된 4M 입니다.

            return new(ResultEnum.OkPanel, "");
        }

        var normalOrBacicChk = DuplicatieCheck();
        if (normalOrBacicChk.resultEnum != ResultEnum.OkPanel)
        {
            return new(normalOrBacicChk.resultEnum, normalOrBacicChk.remark, resultDt, null);
        }


        if (entity.WorkType == "NORMAL")
        {
            DataTable outsidechkdt = DataContext.StringDataSet("@BarcodeApi.Common.ErpOutSideCheck", new { workorder = entity.Workorder, operSeqNo = entity.OperSeqNo }).Tables[0];
            var outSideChk = outsidechkdt.Rows[0].TypeCol<string>("OWNER_TYPE_LCODE");

            //insert
            if (entity.WorkorderList.Count > 1)
            {
                var eqpCode = entity.EqpList[0].TypeKey<string>("eqpCode");
                DataTable getEqpIp = DataContext.StringDataSet("@BarcodeApi.Panel.EquipIpAddress", new { eqpCode }).Tables[0];
                if (getEqpIp.Rows.Count == 0)
                {
                    return new(ResultEnum.NgDataBase, "@NG_EQP_IP_ADDRESS", resultDt, null);
                }



                //사내 레이저공정 중복등록 검사
                if (outSideChk.Equals("INSIDE"))
                {
                    //JsonConvert.SerializeObject(entity.MaterialList);
                    
                    var materialList = JsonConvert.SerializeObject(entity.MaterialList);

                    DataTable dupLaser = DataContext.StringDataSet("@BarcodeApi.Panel.DuplicatedMaterialTest", new { materialList }).Tables[0];

                    if (dupLaser.Rows.Count > 0)
                        return new(ResultEnum.NgPanelProcDupl, "@DUPLICATED_LASER_MATERIAL", resultDt, null);

                }





                //FAR_OUTSIDE     사외외주
                //NEAR_OUTSIDE    사내외주
                //INSIDE          사내
                if (outSideChk.Equals("FAR_OUTSIDE") || outSideChk.Equals("NEAR_OUTSIDE"))
                {
                    resultDt = DataContext.DataSet("dbo.sp_panel_4m_insert_for_multi_workorder_outside", RefineEntity(entity)).Tables[0];
                    if (resultDt.Rows.Count == 0)
                        return new(ResultEnum.NgDataBase, "@NG_INSERT_ERROR", resultDt, null);//[NG] Insert Error API를 확인하여 주십시오.
                }
                else
                {
                    resultDt = DataContext.DataSet("dbo.sp_panel_4m_insert_for_multi_workorder", RefineEntity(entity)).Tables[0];
                    if (resultDt.Rows.Count == 0)
                        return new(ResultEnum.NgDataBase, "@NG_INSERT_ERROR", resultDt, null);//[NG] Insert Error API를 확인하여 주십시오.
                }

                Dictionary<string, object> eqpInfo = new Dictionary<string, object>();
                eqpInfo.Add("eqpCode", eqpCode);

                string eqpIp = string.Empty;
                if (string.IsNullOrWhiteSpace(getEqpIp.Rows[0].TypeCol<string>("ip_address")))
                    eqpIp = "";
                else
                    eqpIp = getEqpIp.Rows[0].TypeCol<string>("ip_address");

                eqpInfo.Add("eqpIpaddress", eqpIp);
                eqpInfo.Add("groupKey", resultDt.Rows[0].TypeCol<string>("group_key"));
                eqpInfo.Add("eqpStatus", entity.RecipeParamJudge);
                eqpInfo.Add("ptsType", entity.PtsType);
                listReturnValue.Add(eqpInfo);
            }
            else if (entity.EqpList.Count > 1)
            {
                var totalEqpList = entity.EqpList.Adapt<List<Dictionary<string, string>>>();
                int cnt = entity.EqpList.Count;

                for (int j = 0; j < cnt; j++)
                {
                    var eqpCode = totalEqpList[j].TypeKey<string>("eqpCode");
                    //var asdfasdf = entity.EqpList[0].TypeKey<string>("eqpCode");
                    DataTable getEqpIp = DataContext.StringDataSet("@BarcodeApi.Panel.EquipIpAddress", new { eqpCode }).Tables[0];
                    if (getEqpIp.Rows.Count == 0)
                    {
                        return new(ResultEnum.NgDataBase, "@NG_EQP_IP_ADDRESS", resultDt, null);
                    }

                    List<Dictionary<string, string>> newEqplist = new List<Dictionary<string, string>>();
                    newEqplist.Add(totalEqpList[j]);
                    entity.EqpList = newEqplist;

                    //FAR_OUTSIDE     사외외주
                    //NEAR_OUTSIDE    사내외주
                    //INSIDE          사내
                    if (outSideChk.Equals("FAR_OUTSIDE") || outSideChk.Equals("NEAR_OUTSIDE"))
                    {
                        resultDt = DataContext.DataSet("dbo.sp_panel_4m_insert_for_multi_eqp_outside", RefineEntity(entity)).Tables[0];
                        if (resultDt.Rows.Count == 0)
                            return new(ResultEnum.NgDataBase, "@NG_INSERT_ERROR", resultDt, null);//[NG] Insert Error API를 확인하여 주십시오.
                    }
                    else
                    {
                        resultDt = DataContext.DataSet("dbo.sp_panel_4m_insert_for_multi_eqp", RefineEntity(entity)).Tables[0];
                        if (resultDt.Rows.Count == 0)
                            return new(ResultEnum.NgDataBase, "@NG_INSERT_ERROR", resultDt, null);//[NG] Insert Error API를 확인하여 주십시오.
                    }

                    Dictionary<string, object> eqpInfo = new Dictionary<string, object>();
                    eqpInfo.Add("eqpCode", eqpCode);
                    eqpInfo.Add("eqpIpaddress", getEqpIp.Rows[0].TypeCol<string>("ip_address"));
                    eqpInfo.Add("groupKey", resultDt.Rows[0].TypeCol<string>("group_key"));
                    eqpInfo.Add("eqpStatus", entity.RecipeParamJudge);
                    eqpInfo.Add("ptsType", entity.PtsType);
                    listReturnValue.Add(eqpInfo);
                }
                entity.EqpList = totalEqpList.Adapt<List<Dictionary<string, string>>>();
            }
            else if (entity.WorkorderList.Count == 1 && entity.EqpList.Count == 1)
            {

                var eqpCode = entity.EqpList[0].TypeKey<string>("eqpCode");
                DataTable getEqpIp = DataContext.StringDataSet("@BarcodeApi.Panel.EquipIpAddress", new { eqpCode }).Tables[0];
                if (getEqpIp.Rows.Count == 0)
                {
                    return new(ResultEnum.NgDataBase, "@NG_EQP_IP_ADDRESS", resultDt, null);
                }

                //FAR_OUTSIDE     사외외주
                //NEAR_OUTSIDE    사내외주
                //INSIDE          사내
                if (outSideChk.Equals("FAR_OUTSIDE") || outSideChk.Equals("NEAR_OUTSIDE"))
                {
                    resultDt = DataContext.DataSet("dbo.sp_panel_4m_insert_for_multi_workorder_outside", RefineEntity(entity)).Tables[0];
                    if (resultDt.Rows.Count == 0)
                        return new(ResultEnum.NgDataBase, "@NG_INSERT_ERROR", resultDt, null);//[NG] Insert Error API를 확인하여 주십시오.
                }
                else
                {
                    resultDt = DataContext.DataSet("dbo.sp_panel_4m_insert_for_multi_workorder", RefineEntity(entity)).Tables[0];
                    if (resultDt.Rows.Count == 0)
                        return new(ResultEnum.NgDataBase, "@NG_INSERT_ERROR", resultDt, null);//[NG] Insert Error API를 확인하여 주십시오.
                }


                Dictionary<string, object> eqpInfo = new Dictionary<string, object>();
                eqpInfo.Add("eqpCode", eqpCode);
                eqpInfo.Add("eqpIpaddress", getEqpIp.Rows[0].TypeCol<string>("ip_address"));
                eqpInfo.Add("groupKey", resultDt.Rows[0].TypeCol<string>("group_key"));
                eqpInfo.Add("eqpStatus", entity.RecipeParamJudge);
                eqpInfo.Add("ptsType", entity.PtsType);
                listReturnValue.Add(eqpInfo);
            }
            else if (entity.WorkorderList.Count == 1 && entity.EqpList.Count == 0)
            {

                //FAR_OUTSIDE     사외외주
                //NEAR_OUTSIDE    사내외주
                //INSIDE          사내
                if (outSideChk.Equals("FAR_OUTSIDE") || outSideChk.Equals("NEAR_OUTSIDE"))
                {
                    resultDt = DataContext.DataSet("dbo.sp_panel_4m_insert_for_multi_workorder_outside", RefineEntity(entity)).Tables[0];
                    if (resultDt.Rows.Count == 0)
                        return new(ResultEnum.NgDataBase, "@NG_INSERT_ERROR", resultDt, null);//[NG] Insert Error API를 확인하여 주십시오.
                }
                else
                {
                    resultDt = DataContext.DataSet("dbo.sp_panel_4m_insert_for_multi_workorder", RefineEntity(entity)).Tables[0];
                    if (resultDt.Rows.Count == 0)
                        return new(ResultEnum.NgDataBase, "@NG_INSERT_ERROR", resultDt, null);//[NG] Insert Error API를 확인하여 주십시오.
                }



                Dictionary<string, object> eqpInfo = new Dictionary<string, object>();
                eqpInfo.Add("eqpCode", "none");
                eqpInfo.Add("eqpIpaddress", "none");
                eqpInfo.Add("groupKey", resultDt.Rows[0].TypeCol<string>("group_key"));
                eqpInfo.Add("eqpStatus", entity.RecipeParamJudge);
                eqpInfo.Add("ptsType", entity.PtsType);
                listReturnValue.Add(eqpInfo);

            }
            else if (entity.EqpList.Count == 1 && entity.WorkorderList.Count == 0)
            {

                //FAR_OUTSIDE     사외외주
                //NEAR_OUTSIDE    사내외주
                //INSIDE          사내
                if (outSideChk.Equals("FAR_OUTSIDE") || outSideChk.Equals("NEAR_OUTSIDE"))
                {
                    resultDt = DataContext.DataSet("dbo.sp_panel_4m_insert_for_multi_eqp_outside", RefineEntity(entity)).Tables[0];
                    if (resultDt.Rows.Count == 0)
                        return new(ResultEnum.NgDataBase, "@NG_INSERT_ERROR", resultDt, null);//[NG] Insert Error API를 확인하여 주십시오.
                }
                else
                {
                    resultDt = DataContext.DataSet("dbo.sp_panel_4m_insert_for_multi_eqp", RefineEntity(entity)).Tables[0];
                    if (resultDt.Rows.Count == 0)
                        return new(ResultEnum.NgDataBase, "@NG_INSERT_ERROR", resultDt, null);//[NG] Insert Error API를 확인하여 주십시오.
                }


                Dictionary<string, object> equipInfo = new Dictionary<string, object>();
                equipInfo.Add("eqpCode", entity.EqpList[0].TypeKey<string>("eqpCode"));
                equipInfo.Add("groupKey", resultDt.Rows[0].TypeCol<string>("group_key"));
                listReturnValue.Add(equipInfo);

            }
            else if (entity.EqpList.Count == 0 && entity.WorkorderList.Count == 0)
            {
                return new(ResultEnum.NgPanelProcDupl, "@NG_NEED_TCARD_EQP", resultDt, null);//T-Card와 설비 정보가 없어 4M 등록이 불가능합니다. 입력된 데이터를 확인해주세요.
            }
        }
        return new(ResultEnum.OkPanel, "", resultDt, listReturnValue);
    }

    [ManualMap]
    public static string RollPanelTypeCheck(PanelEntity entity)
    {
        string scanType = "";
        var getMapCode = CodeService.GetMap("LASER_OPER");
        foreach (var codeId in getMapCode)
        {
            DataTable dtErpOperList = DataContext.StringDataSet("@BarcodeApi.Common.ErpOperList", new { workorder = entity.Workorder }).Tables[0];
            if (dtErpOperList.Rows.Count == 0)
                return string.Empty;

            var findOperCode = dtErpOperList.AsEnumerable().FirstOrDefault(x => x.TypeCol<string>("operation_code") == codeId.Label);
            if (findOperCode == null)
                continue;

            int operSeqNo = findOperCode.TypeCol<int>("operation_seq_no");

            if (operSeqNo >= entity.OperSeqNo)
            {
                scanType = "R";
                break;
            }

        }
        if (string.IsNullOrWhiteSpace(scanType))
            scanType = "P";
        return scanType;
    }

    /// <summary>
    /// 4M 바코드 스캔
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    public static List<ResultEntity> Insert([FromBody] PanelEntity entity)
    {
        var historyNo = CommonService.PanelHistoryInsert(entity.DeviceId, entity, new { });

        List<ResultEntity> lstresultValue = new List<ResultEntity>();
        if (entity.EqpCode == null && entity.EqpList.Count > 0)
            entity.EqpCode = entity.EqpList[0].TypeKey<string>("eqpCode");

        if (entity.WorkType == "REWORK")
        {
            return Rework(entity);
        }

        if (entity.WorkType == "BASIC")
        {
            return InitialInsert(entity);
        }

        //roll split 초기화 
        isCheckMatChild = false;
        rollEntity = null;

        int workorderCnt = 0;
        int banjepoom = 0;
        int layupCnt = 0;

        List<Dictionary<string, string>> newWorkorderList = new List<Dictionary<string, string>>();
        entity.PanelQuantityList = new List<Dictionary<string, object>>();
        entity.WorkorderList = new List<Dictionary<string, object>>();

        //pts type 검사
        int pts0cnt = 0;
        int pts1cnt = 0;
        entity.RecipeParamJudge = true;



        List<Dictionary<string, string>> modelCheckList = new List<Dictionary<string, string>>();

        for (int i = 0; i < entity.OrderCodeNo.Count; i++)
        {
            Dictionary<string, string> d = new Dictionary<string, string>();
            string workorder = entity.OrderCodeNo[i].TypeKey<string>("workorder");
            d.Add("workorder", workorder);
            string operSeqNo = entity.OrderCodeNo[i].TypeKey<string>("operSeqNo");
            d.Add("oper_seq_no", operSeqNo);
            string operCode = entity.OrderCodeNo[i].TypeKey<string>("operCode");
            d.Add("oper_code", operCode);
            modelCheckList.Add(d);
        }

        //작지 json
        string workorderListJson = JsonConvert.SerializeObject(modelCheckList);

        int barcodeCount = 0;

        if (entity.EqpList.Count > 0)
        {
            var eqpList = JsonConvert.SerializeObject(entity.EqpList);

            DataTable barcodeYn = DataContext.StringDataSet("@BarcodeApi.Panel.BarcodeYn", new { eqp_json = eqpList }).Tables[0];

            barcodeCount = barcodeYn.Rows[0].TypeCol<int>("count_y");
        }

        //DataTable modelControl = DataContext.StringDataSet("@BarcodeApi.Panel.ControlModelCheck", new { workorderList = workorderListJson }).Tables[0];
        //entity.IsControlModel = modelControl.Rows.Count > 0;

        //4M 에러프루핑 ON/OFF
        //DataTable onOff4M = DataContext.StringDataSet("@BarcodeApi.Panel.OnOff4M", new { onoff = "Y" }).Tables[0]; // Y는 의미없음
        //int isControlOn = onOff4M.Rows[0].TypeCol<int>("cnt"); // 1이면 Y
        //entity.IsControlModel = onOff4M.Rows[0].TypeCol<int>("cnt") > 0; //1이면 Y

        /*
        entity.IsControlModel로 컨트롤,
        true일 경우 정상 판정
        false일 경우 판정 생략(강제 건너뛰기 - BATCH INTERLOCK 등등..)

        모델별 에러프루핑 로직
        1. Master 4m On일 경우 > 전체 대상 정상 판정 (entity.IsControlModel = true)
        
        2. Master 4m Off일 경우
         > 2-1. 모델별 4m On 일 경우 모델코드 존재여부 검사, 있으면 true, 없으면 false
         > 2-2. 모델별 4m Off 일 경우 false
        */
        entity.IsControlModel = false;

        DataTable masterOnOff4M = DataContext.StringDataSet("@BarcodeApi.Panel.OnOffMaster4M", new { onoff = "Y" }).Tables[0]; // Y는 의미없는 입력값
        if (masterOnOff4M.Rows[0].TypeCol<int>("cnt") > 0)
        {
            //1. Master 4m On일 경우
            entity.IsControlModel = true;
        }
        else
        {
            //4M 에러프루핑 ON/OFF
            DataTable onOff4M = DataContext.StringDataSet("@BarcodeApi.Panel.OnOffModel4M", new { onoff = "Y" }).Tables[0]; // Y는 의미없음
            if (onOff4M.Rows[0].TypeCol<int>("cnt") > 0) // 모델별 4M 에러프루핑 ON일 경우
            {
                //Y인 모델 존재여부 확인
                DataTable modelControl = DataContext.StringDataSet("@BarcodeApi.Panel.ControlModelCheck", new { workorderList = workorderListJson }).Tables[0];
                if (modelControl.Rows.Count > 0)
                {
                    //Y인 모델 존재할 경우
                    entity.IsControlModel = true;
                }
            }
        }

        if (entity.IsControlModel)
        {
            //배치 인터락
            DataTable batchInterlock = DataContext.StringDataSet("@BarcodeApi.Panel.BatchInterlockCheck", new { workorderList = workorderListJson }).Tables[0];
            if (batchInterlock.Rows.Count > 0)
            {
                string remark = "\n";
                for (int i = 0; i < batchInterlock.Rows.Count; i++)
                {
                    remark +=
                    batchInterlock.Rows[i].TypeCol<string>("workorder") + " : " +
                    batchInterlock.Rows[i].TypeCol<string>("oper_code") + "(" + batchInterlock.Rows[i].TypeCol<string>("oper_desc") + ")" +
                    "\n사유 : " + batchInterlock.Rows[i].TypeCol<string>("code_name") +
                    "\n담당 : " + batchInterlock.Rows[i].TypeCol<string>("on_update_user") +
                    "\n일시 : " + batchInterlock.Rows[i].TypeCol<string>("on_dt") + "\n";
                }



                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgBatchInterlock, entity.LangCode, $"@NG_BATCH_INTERLOCK^{remark}") };//[NG] 해당 BATCH는 InterLock 상태입니다. {0}
            }


            //큐타임검사 
            DataTable qtTimeDt = DataContext.StringDataSet("@BarcodeApi.Panel.LockQtimeWorkorderJson", new { workorder_list = workorderListJson }).Tables[0];
            if (qtTimeDt.Rows.Count > 0)
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgQime, entity.LangCode, $"@NG_QTIME^{qtTimeDt.Rows[0].TypeCol<string>("workorder")}") };//JOB_NO [ {0} ]의 생산유효시간이 초과되어 작업을 시작할 수 없습니다.
        }

        

        DataTable operCheckYn = DataContext.StringDataSet("@BarcodeApi.Panel.OperSeqNoErpCode", new { onoff = "Y" }).Tables[0]; // Y는 의미없는 입력값
        if (operCheckYn.Rows[0].TypeCol<int>("cnt") > 0)
        {
            //ERP 현재 공순과 비교
            DataTable nowOperCheckDt = DataContext.StringDataSet("@BarcodeApi.Panel.Oper4mMesJson", new { workorder_list = workorderListJson }).Tables[0];
            if (nowOperCheckDt.Rows.Count > 0)
            {
                string remark = "\n ";
                for (int i = 0; i < nowOperCheckDt.Rows.Count; i++)
                {
                    remark += 
                    nowOperCheckDt.Rows[i].TypeCol<string>("workorder") + " - " +  
                    " data : " + nowOperCheckDt.Rows[i].TypeCol<string>("oper_seq_no")  +
                    " erp : " + nowOperCheckDt.Rows[i].TypeCol<string>("oper_seq_no_erp")
                    + "\n";
                }
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgPanelProcOrder, entity.LangCode, $"@NG_4M_NOW_OPER^{remark}") };//현재 입력된 공정순서와 ERP 기준 현재 공정 순서가 다릅니다.{0}
            }
        }






        for (int i = 0; i < entity.OrderCodeNo.Count; i++)
        {
            var result = entity.GetWorkorderOper(i);
            entity.Workorder = result.SafeTypeKey<string?>("workorder", null);
            entity.OperCode = result.SafeTypeKey<string?>("operCode", null);
            entity.OperSeqNo = result.SafeTypeKey<int?>("operSeqNo", null); // 키가없으면 기본값

            string rollpanelTypechk = RollPanelTypeCheck(entity);

            // SIFLEX : 조헌수 부장 요청 사항 pc 이면서 roll이 아닐때는 workorder 가 여러개가 들어갈 수가 없다.
            // 공백이면 pc , R이면 롤
            // 모바일은 여러개 등록 할수 있고. o
            // pc에서는 roll 일때 는 여러개 등록 해야 한다. o
            //if (string.IsNullOrWhiteSpace(entity.DeviceType )&& !rollpanelTypechk.Equals("R")) // pc, roll 이 아닌 경우는 여러개 등록되면 안된다.
            //{
            //    if (entity.OrderCodeNo.Count > 1)
            //        return new List<ResultEntity>() { new(historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_MULTI_WORKORDER") };//[NG] 2개 이상의 T-CARD를 등록 할 수 없습니다.
            //}

            Dictionary<string, string> workorderDic = new Dictionary<string, string>();
            workorderDic.Add("workorder_list", result.TypeKey<string>("workorder"));
            newWorkorderList.Add(workorderDic);
            result.SafeTypeKey<string?>("operCode", null);

            if (string.IsNullOrWhiteSpace(entity.Workorder))
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_NOT_INSERT_TCARD") };//[NG] 등록된 T-Card 정보가 없습니다.

            if (string.IsNullOrWhiteSpace(entity.OperCode))
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_OPER_NOT_FOUND") };//[NG] 등록된 공정 정보가 없습니다.

            if (entity.OperSeqNo == null)
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_OPERSEQ_NOT_FOUND") };//[NG] 등록된 공정 순서가 없습니다.

            //코드관리 추가 siflex 요청
            //entity.EqpList.AsEnumerable().Any(x => CodeService.List("ERROR_PROOF_EQP", null, x["eqpCode"], null, null).Count > 0);
            //CodeService.List("ERROR_PROOF_EQP", null, entity.EqpCode, null, null).Count > 0
            //if (entity.EqpList.AsEnumerable().Any(x => CodeService.List("ERROR_PROOF_EQP", null, x["eqpCode"], null, 'Y').Count > 0))
            //if (entity.IsControlModel)
            //{
            //    DataTable qtTimeDt = DataContext.StringDataSet("@BarcodeApi.Panel.LockQtime", new { workorder = entity.Workorder }).Tables[0];
            //    if (qtTimeDt.Rows.Count > 0)
            //        return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgQime, entity.LangCode, $"@NG_QTIME^{entity.Workorder}") };//JOB_NO [ {0} ]의 생산유효시간이 초가되어 작업을 시작할 수 없습니다.
            //}


            //var getMapCode = CodeService.GetMap("ERROR_PROOF_EQP");
            //var lockEqpList = entity.EqpList.AsEnumerable().Any(x => CodeService.List("ERROR_PROOF_EQP", null, x["eqpCode"], null, null).Count > 0);
            OperationEntity currOper = new OperationEntity();
            currOper.Workorder = entity.Workorder;
            currOper.OperCode = entity.OperCode;
            currOper.OperSeqNo = entity.OperSeqNo;
            currOper.RecipeParamJudge = true;

            if (entity.RecipeParamJudge == false)
                currOper.RecipeParamJudge = false;

            DataTable ptsData = DataContext.StringDataSet("@BarcodeApi.Panel.PtsType", new { workorder = currOper.Workorder }).Tables[0];
            //PTS_type이 검색이 되지 않을 경우 PTS_0으로 처리
            //23.08.11
            //추후 컬럼 변경 예정
            if (ptsData.Rows.Count == 0)
                entity.PtsType = "PTS_0";
            //return new List<ResultEntity>() { new(historyNo, ResultEnum.NgDataBase, entity.LangCode, "@PTS_TYPE_NOT_EXIST") };//[NG] 해당 모델의 PTS_TYPE을 찾을 수 없습니다.
            else
            {
                entity.PtsType = ptsData.Rows[0].TypeCol<string>("pts_type");
            }

            if (entity.PtsType == "PTS_0")
                pts0cnt++;
            else
                pts1cnt++;

            if (barcodeCount > 0 && pts0cnt > 0 && pts1cnt > 0)
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgPtsType, entity.LangCode, "@PTS_TYPE_ERROR") };//[NG] 바코드 유/무(PTS_TYPE) 를 확인 후 작업해주세요

            //코드관리 추가 siflex 요청
            //if (entity.EqpList.AsEnumerable().Any(x => CodeService.List("ERROR_PROOF_EQP", null, x["eqpCode"], null, 'Y').Count > 0))
            // 긴급 주석
            //if (entity.IsControlModel)
            //{
            //    //임시주석 SPC
            //    //int IPQCcnt = DataContext.StringValue<int>("@BarcodeApi.Common.IPQCStatuseList", new { workorder = currOper.Workorder });
            //    //if (IPQCcnt > 0)
            //    //    return new List<ResultEntity>() { new(historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_IPQC") };//[NG]SPC NG\r\n공정검사데이터를 확인해 주세요

            //    DataTable spcNgList = DataContext.StringDataSet("@BarcodeApi.Panel.Spc4mErrorProofing", new { workorder = currOper.Workorder }).Tables[0];
            //    if (spcNgList.Rows.Count > 0)
            //    {
            //        string remark = "";
            //        for(int j = 0; j < spcNgList.Rows.Count; j++)
            //        {
            //            remark += "\nOperSeqNo [ " +  spcNgList.Rows[j].TypeCol<string>("oper_seq_no") + " ]";
            //        }
            //        return new List<ResultEntity>() { new(historyNo, ResultEnum.NgDataBase, entity.LangCode, $"@NG_SPC_ERROR^{currOper.Workorder}^{remark}") };//[NG]SPC NG\r\n공정검사데이터를 확인해 주세요
            //    }

            //}

            DataTable product = DataContext.StringDataSet("@BarcodeApi.Panel.ErpTcardProductName", new { barcode = currOper.Workorder }).Tables[0];
            if (product.Rows.Count == 0)
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_NO_MODEL_INFO") };//[NG] 조회된 모델 정보가 없습니다.

            currOper.ModelCode = product.Rows[0].TypeCol<string>("bom_item_code");

            //작업자가 등록이 안되어 있을경우
            if (entity.WorkerList.Count == 0)
            {
                var getMapCode = CodeService.GetMap("QR_LASER_OPER");
                var outsourcingWorker = getMapCode.AsEnumerable().Any(x => x.Label == entity.OperCode);
                if (!outsourcingWorker)
                    return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgPanelNotExists, entity.LangCode, "@NG_NO_WORKER") };//[NG] 작업자가 등록되어 있지 않습니다.
            }

            //인터락이나 , defect 일때 4m 등록 못하게 막기
            // LOT 공정 확인(+자재, +툴)
            var procResult = CheckLotProc(entity, currOper);
            if ((int)procResult.resultEnum >= 5000)
            {
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, procResult.resultEnum, entity.LangCode, procResult.remark) };
            }

            //설비 확인
            //파라미터 가불가
            var eqpResult = CheckEqp(entity, currOper);
            if (eqpResult.resultEnum != ResultEnum.OkPanel)
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, eqpResult.resultEnum, eqpResult.dicResult, entity.LangCode, eqpResult.remark) };

            entity.RowKey = NewShortId();

            //PanelQuantity4m
            DataTable panelQuantity = DataContext.StringDataSet("@BarcodeApi.Panel.PanelQuantity4m", RefineEntity(entity)).Tables[0];
            if (panelQuantity.Rows.Count > 0)
            {
                Dictionary<string, object> workorderQuantity = new Dictionary<string, object>();
                workorderQuantity.Add("workorder", entity.Workorder);
                workorderQuantity.Add("panel_qty", panelQuantity.Rows[0].TypeCol<int>("panel_qty"));
                workorderQuantity.Add("oper_seq_no", entity.OperSeqNo);

                entity.PanelQuantityList.Add(workorderQuantity);
                entity.WorkorderList.Add(workorderQuantity);

            }

            if (currOper.RecipeParamJudge == false)
            {
                entity.RecipeParamJudge = false;
            }

            DataTable resultDt = null;
            List<Dictionary<string, object>> listReturnValue = new List<Dictionary<string, object>>();

            //(ResultEnum resultEnum, string remark) DuplicatieCheck()
            //{
            //    DataTable panel4MDuplicateChk = DataContext.StringDataSet("@BarcodeApi.Panel.Panel4MDuplicateChack", entity).Tables[0];
            //    if (panel4MDuplicateChk.Rows.Count > 0)
            //        return new(ResultEnum.NgPanelProcDupl, "@NG_ALREADY_4M");//[NG] 이미 등록처리된 4M 입니다.

            //    return new(ResultEnum.OkPanel, "");
            //}

            //var normalOrBacicChk = DuplicatieCheck();
            //if (normalOrBacicChk.resultEnum != ResultEnum.OkPanel)
            //{
            //    continue;
            //}


            if (i != entity.OrderCodeNo.Count - 1)
                continue;

            //roll split 초기화 
            isCheckMatChild = false;
            rollEntity = null;

            #region panel / roll 구분
            int layupCount = 0;

            if (rollpanelTypechk == "P")
            {
                //insert
                var panelInsert = SetPanelInsert(entity);
                if (panelInsert.resultEnum != ResultEnum.OkPanel)
                    return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, panelInsert.resultEnum, entity.LangCode, panelInsert.remark) };

                //dynamic obj = new ExpandoObject();
                //obj.DeviceId = entity.DeviceId;
                //obj.RowKey = entity.RowKey;
                //obj.GroupKey = "GP4M-20230927-00004415"; // panelInsert.listReturnValue[0].TypeKey<string>("group_key");
                //obj.Workorder = entity.Workorder;
                //obj.EqpCode = entity.EqpCode;

                ////cmi 동도금 insert
                //DataTable cmiInsert = DataContext.StringDataSet("@BarcodeApi.Panel.Panel4mCmiInsert", RefineExpando(obj)).Tables[0];

                //layup 적층 row count +1 해서 보내주기 
                DataTable layupDt = DataContext.StringDataSet("@BarcodeApi.Panel.FindBomItemCode", new { workorder = currOper.Workorder, operSeqNo = entity.OperSeqNo }).Tables[0];

                var layPtsType = layupDt.AsEnumerable().Where(x => x.TypeCol<string>("PTS_TYPE_LCODE") != "PTS_0" && x.TypeCol<string>("PTS_TYPE_LCODE") != null).ToList();

                if (layPtsType.Count > 0)
                {
                    layupCount = layPtsType.Count + 1;
                    layupCnt = layPtsType.Count + 1;
                }
                //layupCount = layupDt.Rows.Count + 1;
                resultDt = panelInsert.resultDt;
                listReturnValue = panelInsert.listReturnValue;
            }
            else if (rollpanelTypechk == "R")
            {
                //롤인지 알아보고 넣어야함 .
                //롤공정이고 자재가 랏코드 하나 들어올때 // 롤 바코드를 추적하기 위해 저장 
                //insert
                var panelInsert = SetPanelInsert(entity);
                if (panelInsert.resultEnum != ResultEnum.OkPanel)
                    return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, panelInsert.resultEnum, entity.LangCode, panelInsert.remark) };

                DataTable layupDt = DataContext.StringDataSet("@BarcodeApi.Panel.FindBomItemCode", new { workorder = currOper.Workorder, operSeqNo = entity.OperSeqNo }).Tables[0];
                if (layupDt.Rows.Count > 0)
                {
                    layupCount = layupDt.Rows.Count + 1;
                    layupCnt = layupDt.Rows.Count + 1;
                }
                //layupCount = layupDt.Rows.Count + 1;
                resultDt = panelInsert.resultDt;
                listReturnValue = panelInsert.listReturnValue;

                //들어온 자재 lot 이 없을 경우는 저장 Roll Item에 저장하지 않고 통과
                if (entity.MaterialList.Count != 0)
                {
                    dynamic rollEntity = new ExpandoObject();
                    rollEntity.RowKey = NewShortId(true ,30 );
                    rollEntity.RollRowKey = resultDt.Rows[0].TypeCol<string>("row_key");
                    rollEntity.RollGroupKey = resultDt.Rows[0].TypeCol<string>("group_key");
                    rollEntity.MatList = JsonConvert.SerializeObject(entity.MaterialList);
                    //insert
                    int cnt = DataContext.NonQuery("dbo.sp_roll_item_insert", RefineExpando(rollEntity));
                    if (cnt <= 0)
                        return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, cnt, "@ERR_ROLL_INSERT_ERROR") };//[NG] ROLL INSERT 실패 하였습니다.
                }
            }
            else
            {
                banjepoom++;

                //반제품일때
                var panelInsert = SetPanelInsert(entity);
                if (panelInsert.resultEnum != ResultEnum.OkPanel)
                    return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, panelInsert.resultEnum, entity.LangCode, panelInsert.remark) };

                //layup 적층 row count +1 해서 보내주기 
                DataTable layupDt = DataContext.StringDataSet("@BarcodeApi.Panel.FindBomItemCode", new { workorder = currOper.Workorder, operSeqNo = currOper.OperSeqNo }).Tables[0];
                if (layupDt.Rows.Count > 0)
                {
                    layupCnt = layupDt.Rows.Count + 1;
                    layupCount = layupDt.Rows.Count + 1;
                }
                //layupCount = layupDt.Rows.Count + 1;

                resultDt = panelInsert.resultDt;
                listReturnValue = panelInsert.listReturnValue;
            }

            #region 모델공정확장 기준정보 바라보는것 나중에 변경 주석처리

            //DataTable baseOperInfoDt = DataContext.StringDataSet("@BarcodeApi.Common.BaseOperInfo", RefineEntity(currOper)).Tables[0];
            //if (baseOperInfoDt.Rows.Count > 0)
            //{
            //    string rollpanelTypechk = RollPanelTypeCheck(entity);
            //    if (rollpanelTypechk == "P")
            //    {
            //        //insert
            //        var panelInsert = SetPanelInsert(entity);
            //        if (panelInsert.resultEnum != ResultEnum.OkPanel)
            //            return new List<ResultEntity>() { new(historyNo, panelInsert.resultEnum, entity.LangCode, panelInsert.remark) };

            //        //layup 적층 row count +1 해서 보내주기 
            //        DataTable layupDt = DataContext.StringDataSet("@BarcodeApi.Panel.FindBomItemCode", new { workorder = currOper.Workorder, operSeqNo = entity.OperSeqNo }).Tables[0];
            //        if (layupDt.Rows.Count > 0)
            //        {
            //            layupCount = layupDt.Rows.Count + 1;
            //            layupCnt = layupDt.Rows.Count + 1;
            //        }
            //        //layupCount = layupDt.Rows.Count + 1;
            //        resultDt = panelInsert.resultDt;
            //        listReturnValue = panelInsert.listReturnValue;
            //    }
            //    else if (rollpanelTypechk == "R")
            //    {
            //        //롤인지 알아보고 넣어야함 .
            //        //롤공정이고 자재가 랏코드 하나 들어올때 // 롤 바코드를 추적하기 위해 저장 
            //        //insert
            //        var panelInsert = SetPanelInsert(entity);
            //        if (panelInsert.resultEnum != ResultEnum.OkPanel)
            //            return new List<ResultEntity>() { new(historyNo, panelInsert.resultEnum, entity.LangCode, panelInsert.remark) };

            //        DataTable layupDt = DataContext.StringDataSet("@BarcodeApi.Panel.FindBomItemCode", new { workorder = currOper.Workorder, operSeqNo = entity.OperSeqNo }).Tables[0];
            //        if (layupDt.Rows.Count > 0)
            //        {
            //            layupCount = layupDt.Rows.Count + 1;
            //            layupCnt = layupDt.Rows.Count + 1;
            //        }
            //        //layupCount = layupDt.Rows.Count + 1;
            //        resultDt = panelInsert.resultDt;
            //        listReturnValue = panelInsert.listReturnValue;

            //        //들어온 자재 lot 이 없을 경우는 저장 Roll Item에 저장하지 않고 통과
            //        if (entity.MaterialList.Count != 0)
            //        {
            //            dynamic rollEntity = new ExpandoObject();
            //            rollEntity.RowKey = NewShortId();
            //            rollEntity.RollRowKey = resultDt.Rows[0].TypeCol<string>("row_key");
            //            rollEntity.RollGroupKey = resultDt.Rows[0].TypeCol<string>("group_key");
            //            rollEntity.MatList = JsonConvert.SerializeObject(entity.MaterialList);
            //            //insert
            //            int cnt = DataContext.NonQuery("dbo.sp_roll_item_insert", RefineExpando(rollEntity));
            //            if (cnt <= 0)
            //                return new List<ResultEntity>() { new(historyNo, ResultEnum.NgDataBase, cnt, "@ERR_ROLL_INSERT_ERROR") };//[NG] ROLL INSERT 실패 하였습니다.
            //        }
            //    }

            //    #region 모델별 공정확장 기준정보 추가될 경우 진행 

            //    if(rollpanelTypechk == string.Empty)
            //    {
            //        //메인작지 판넬 / 롤 구분
            //        var scanType = baseOperInfoDt.Rows[0].TypeCol<string>("scan_type");
            //        if (scanType == "P")
            //        {
            //            //insert
            //            var panelInsert = SetPanelInsert(entity);
            //            if (panelInsert.resultEnum != ResultEnum.OkPanel)
            //                return new List<ResultEntity>() { new(historyNo, panelInsert.resultEnum, entity.LangCode, panelInsert.remark) };

            //            //layup 적층 row count +1 해서 보내주기 
            //            DataTable layupDt = DataContext.StringDataSet("@BarcodeApi.Panel.FindBomItemCode", new { workorder = currOper.Workorder, operSeqNo = entity.OperSeqNo }).Tables[0];
            //            if (layupDt.Rows.Count > 0)
            //            {
            //                layupCount = layupDt.Rows.Count + 1;
            //                layupCnt = layupDt.Rows.Count + 1;
            //            }
            //            //layupCount = layupDt.Rows.Count + 1;
            //            resultDt = panelInsert.resultDt;
            //            listReturnValue = panelInsert.listReturnValue;
            //        }
            //        else if (scanType == "R")
            //        {
            //            //롤인지 알아보고 넣어야함 .
            //            //롤공정이고 자재가 랏코드 하나 들어올때 // 롤 바코드를 추적하기 위해 저장 
            //            //insert
            //            var panelInsert = SetPanelInsert(entity);
            //            if (panelInsert.resultEnum != ResultEnum.OkPanel)
            //                return new List<ResultEntity>() { new(historyNo, panelInsert.resultEnum, entity.LangCode, panelInsert.remark) };

            //            DataTable layupDt = DataContext.StringDataSet("@BarcodeApi.Panel.FindBomItemCode", new { workorder = currOper.Workorder, operSeqNo = entity.OperSeqNo }).Tables[0];
            //            if (layupDt.Rows.Count > 0)
            //            {
            //                layupCount = layupDt.Rows.Count + 1;
            //                layupCnt = layupDt.Rows.Count + 1;
            //            }
            //            //layupCount = layupDt.Rows.Count + 1;
            //            resultDt = panelInsert.resultDt;
            //            listReturnValue = panelInsert.listReturnValue;

            //            //들어온 자재 lot 이 없을 경우는 저장 Roll Item에 저장하지 않고 통과
            //            if (entity.MaterialList.Count != 0)
            //            {
            //                dynamic rollEntity = new ExpandoObject();
            //                rollEntity.RowKey = NewShortId();
            //                rollEntity.RollRowKey = resultDt.Rows[0].TypeCol<string>("row_key");
            //                rollEntity.RollGroupKey = resultDt.Rows[0].TypeCol<string>("group_key");
            //                rollEntity.MatList = JsonConvert.SerializeObject(entity.MaterialList);
            //                //insert
            //                int cnt = DataContext.NonQuery("dbo.sp_roll_item_insert", RefineExpando(rollEntity));
            //                if (cnt <= 0)
            //                    return new List<ResultEntity>() { new(historyNo, ResultEnum.NgDataBase, cnt, "@ERR_ROLL_INSERT_ERROR") };//[NG] ROLL INSERT 실패 하였습니다.
            //            }
            //        }
            //    }

            //    #endregion
            //}
            //else
            //{
            //    banjepoom++;

            //    //반제품일때
            //    var panelInsert = SetPanelInsert(entity);
            //    if (panelInsert.resultEnum != ResultEnum.OkPanel)
            //        return new List<ResultEntity>() { new(historyNo, panelInsert.resultEnum, entity.LangCode, panelInsert.remark) };

            //    //layup 적층 row count +1 해서 보내주기 
            //    DataTable layupDt = DataContext.StringDataSet("@BarcodeApi.Panel.FindBomItemCode", new { workorder = currOper.Workorder, operSeqNo = currOper.OperSeqNo }).Tables[0];
            //    if (layupDt.Rows.Count > 0)
            //    {
            //        layupCnt = layupDt.Rows.Count + 1;
            //        layupCount = layupDt.Rows.Count + 1;
            //    }
            //    //layupCount = layupDt.Rows.Count + 1;

            //    resultDt = panelInsert.resultDt;
            //    listReturnValue = panelInsert.listReturnValue;
            //}

            #endregion

            #endregion

            workorderCnt++;

            var lstRowKeS = resultDt.AsEnumerable().Select(row => row.TypeCol<string>("row_key")).ToList();
            List<string> lst = new List<string>();
            lst.Add(entity.Context);
            ResultEntity resultEntity = new(historyNo, ResultEnum.OkPanel, layupCount, lstRowKeS, resultDt.Rows[0].TypeCol<string>("group_key"), listReturnValue, entity.LangCode, "PANEL", "4M INSERT");
            lstresultValue.Add(resultEntity);

        }

        //등록된 4M 이 없음.
        if (lstresultValue.Count == 0)
        {
            ResultEntity resultEntity = new(historyNo, ResultEnum.NgPanelProcDupl, 0, null, "", null, entity.LangCode, "@NG_ALREADY_4M");
            lstresultValue.Add(resultEntity);
        }

        return lstresultValue;
    }

    [ManualMap]
    public static ResultEntity Start(string deviceId, string groupKey, string langCode)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, groupKey, langCode });
        int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.StartUpdate", new { groupKey });

        if (cnt <= 0)
            return new(null, historyNo, ResultEnum.NgPanelNotExists, cnt, langCode, "");

        return new(null, historyNo, ResultEnum.OkPanelStart, langCode);
    }

    [ManualMap]
    public static ResultEntity InitialStart(string deviceId, string groupKey, string langCode)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, groupKey, langCode });
        int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.StartUpdateInitial", new { groupKey });

        if (cnt <= 0)
            return new(null, historyNo, ResultEnum.NgPanelNotExists, cnt, langCode, "");

        return new(null, historyNo, ResultEnum.OkPanelStart, langCode);
    }

    //23.05.24 kgl 변경쪽
    [ManualMap]
    public static IResult BeforeChange(string deviceId, string langCode)
    {
        var dt = DataContext.StringDataSet("@BarcodeApi.Panel.BeforeChange").Tables[0];
        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static ResultEntity Change(string groupkey, string remark, string remarkUser, [FromBody] PanelEntity entity)
    {
        var historyNo = CommonService.PanelHistoryInsert(entity.DeviceId, entity, new { groupkey, remark, remarkUser });

        Dictionary<string, object> dic = new Dictionary<string, object>();
        dic.Add("group_key", groupkey);

        if (entity.WorkType == "NORMAL")
        {
            //end dt 가 null 체크 해야되고 (tb_panel_4m)
            DataTable dt = DataContext.StringDataSet("@BarcodeApi.Panel.BeforeChange", RefineParam(dic)).Tables[0];
            if (dt.Rows.Count == 0)
                return new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NO_BEFORE_CHANGE");//[NG] BeforeChange NO DATA

            string sEndDt = dt.Rows[0].TypeCol<string>("end_dt");
            if (!string.IsNullOrWhiteSpace(sEndDt))
            {
                //end가 null 아닐때 수정 을 할 수 없습니다.
                return new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_ALREADY_FINISH");//[NG] 이미 완료된 작업입니다.
            }

            entity.GroupKey = groupkey;

            DataTable panel4mGroupKey = DataContext.StringDataSet("@BarcodeApi.Panel.Panel4MGroupKey", RefineEntity(entity)).Tables[0];
            if (panel4mGroupKey.Rows.Count != 0)
            {
                var change4m = entity.OrderCodeNo.AsEnumerable().Select(y => y.TypeKey<string>("workorder")).ToList();
                var groupKey4m = panel4mGroupKey.AsEnumerable().Select(x => x.TypeCol<string>("workorder")).ToList();


                //레이저공정 롤판넬맵 이상 관련 CHANGE 수정
                //if (panel4mGroupKey.Rows[0].TypeCol<string>("laser_oper") == "Y")
                //{
                //    string workorder = panel4mGroupKey.Rows[0].TypeCol<string>("workorder");
                //    bool wrongChange = true;
                //    for (int i = 0; i < entity.OrderCodeNo.Count; i++)
                //    {
                //        if(workorder == entity.OrderCodeNo[0].TypeKey<string>("workorder"))
                //        {
                //            wrongChange = false;
                //        }
                //    }
                //    if (wrongChange)
                //    {
                //        return new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, $"@NG_CHANGE4M_IN_LASER_OPER^{workorder}"); // 해당 T-CARD를 첫번째로 포함해야 합니다[{0}]
                //    }
                //}



                //변경 요청 값이 기존 그룹키보다 적을때 delete
                if (change4m.Count < groupKey4m.Count)
                {
                    var duplicates = groupKey4m.Intersect(change4m).ToList();
                    var nonDuplicates = groupKey4m.Except(duplicates).ToList();

                    foreach (var workorderItem in nonDuplicates)
                    {
                        var taget4mRowKey = panel4mGroupKey.AsEnumerable().FirstOrDefault(x => x.TypeCol<string>("workorder") == workorderItem).TypeCol<string>("row_key");
                        int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Panel.PanelRowKeyDelete", new { rowKey = taget4mRowKey });
                    }
                }
                //변경 요청 값이 기존 그룹키보다 많을때 add
                else if (change4m.Count > groupKey4m.Count)
                {
                    entity.PanelQuantityList = new List<Dictionary<string, object>>();
                    entity.WorkorderList = new List<Dictionary<string, object>>();

                    var duplicates = change4m.Intersect(groupKey4m).ToList();
                    var nonDuplicates = change4m.Except(duplicates).ToList();

                    for (int index = 0; index < entity.OrderCodeNo.Count; index++)
                    {
                        var result = entity.GetWorkorderOper(index);
                        entity.Workorder = result.SafeTypeKey<string?>("workorder", null);
                        entity.OperCode = result.SafeTypeKey<string?>("operCode", null);
                        entity.OperSeqNo = result.SafeTypeKey<int?>("operSeqNo", null); // 키가없으면 기본값

                        var chkWokrorder = nonDuplicates.FirstOrDefault(x => x == entity.OrderCodeNo[index].TypeKey<string>("workorder"));
                        if (chkWokrorder == null)
                            continue;

                        DataTable panelQuantity = DataContext.StringDataSet("@BarcodeApi.Panel.PanelQuantity4m", RefineEntity(entity)).Tables[0];
                        if (panelQuantity.Rows.Count > 0)
                        {
                            Dictionary<string, object> workorderQuantity = new Dictionary<string, object>();
                            workorderQuantity.Add("workorder", entity.Workorder);
                            workorderQuantity.Add("panel_qty", panelQuantity.Rows[0].TypeCol<int>("panel_qty"));
                            workorderQuantity.Add("oper_seq_no", entity.OperSeqNo);

                            entity.PanelQuantityList.Add(workorderQuantity);
                            entity.WorkorderList.Add(workorderQuantity);
                        }

                    }

                    if (entity.EqpList.Count == 1)
                    {
                        entity.EqpCode = entity.EqpList.AsEnumerable().Where(x => x.ContainsKey("eqpCode")).Select(x => x.TypeKey<string>("eqpCode")).FirstOrDefault();
                    }

                    //group_key insert 시키기.
                    //새로운 로우키 할당 
                    DataTable cnt3 = DataContext.DataSet("dbo.sp_panel_4m_change_insert", RefineEntity(entity)).Tables[0];


                    int cnt = DataContext.NonQuery("dbo.sp_panel_4m_update", RefineEntity(entity));
                    if (cnt <= 0)
                        return new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, cnt, entity.LangCode, "@ERR_PANEL_UPDATE");//[NG] dbo.sp_panel_4m_update NO DATA

                }
            }


            dic = new Dictionary<string, object>();
            dic.Add("row_key", "");
            dic.Add("group_key", groupkey);
            dic.Add("body_json", JsonConvert.SerializeObject(entity));
            dic.Add("wokrer_code", remarkUser);
            dic.Add("change_remark", remark);

            //jjk, 23.06.23 - 변경자, 변경사유 넣어야됨 
            //int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Panel.CancelHistoryInsert", RefineParam(dic));
            //if (cnt2 <= 0)
            //    return new(historyNo, ResultEnum.NgDataBase, cnt, entity.LangCode, "[MG] CACNEL History insert Fail");
        }

        return new(entity.OrderCodeNo, historyNo, ResultEnum.OkPanelChange, entity.LangCode, "@OK_PANEL_CHANGE");//[OK] PANEL CHANGE 변경이 완료 되었습니다.
    }

    [ManualMap]
    public static ResultEntity InitialChange(string groupkey, string remark, string remarkUser, [FromBody] PanelEntity entity)
    {
        var historyNo = CommonService.PanelHistoryInsert(entity.DeviceId, entity, new { });

        Dictionary<string, object> dic = new Dictionary<string, object>();
        dic.Add("group_key", groupkey);

        if (entity.WorkType == "NORMAL")
        {
            //end dt 가 null 체크 해야되고 (tb_panel_4m)
            DataTable dt = DataContext.StringDataSet("@BarcodeApi.Panel.BeforeChange", RefineParam(dic)).Tables[0];
            if (dt.Rows.Count == 0)
                return new(null, historyNo, ResultEnum.NgDataBase, entity.LangCode, "[MG.Change] BeforeChange NO DATA");//[MG.Change] BeforeChange NO DATA

            string sEndDt = dt.Rows[0].TypeCol<string>("end_dt");
            if (!string.IsNullOrWhiteSpace(sEndDt))
            {
                //end가 null 아닐때 수정 을 할 수 없습니다.
                return new(null, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_ALREADY_FINISH");//[NG] 이미 완료된 작업입니다.
            }

            entity.GroupKey = groupkey;

            int cnt = DataContext.NonQuery("dbo.sp_panel_4m_update", RefineEntity(entity));
            if (cnt <= 0)
                return new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, cnt, entity.LangCode, "@ERR_PANEL_UPDATE");//[NG.Change] dbo.sp_panel_4m_update NO DATA

            dic = new Dictionary<string, object>();
            dic.Add("row_key", "");
            dic.Add("group_key", groupkey);
            dic.Add("body_json", JsonConvert.SerializeObject(entity));
            dic.Add("remark", remark);
            dic.Add("request_user", remarkUser);

            //jjk, 23.06.23 - 변경자, 변경사유 넣어야됨 

        }
        else
        {
            //end dt 가 null 체크 해야되고 (tb_panel_4m_initial)
            DataTable dt = DataContext.StringDataSet("@BarcodeApi.Panel.BeforeChangeInitial", RefineParam(dic)).Tables[0];
            if (dt.Rows.Count == 0)
                return new(null, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NO_BEFORE_CHANGE");//[NG.Change] BeforeChange NO DATA

            string sEndDt = dt.Rows[0].TypeCol<string>("end_dt");
            if (!string.IsNullOrWhiteSpace(sEndDt))
            {
                //end가 null 아닐때 수정 을 할 수 없습니다.
                return new(null, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_ALREADY_FINISH");//[NG] 이미 완료된 작업입니다.
            }

            entity.GroupKey = groupkey;

            int cnt = DataContext.NonQuery("dbo.sp_panel_4m_initial_update", RefineEntity(entity));
            if (cnt <= 0)
                return new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, cnt, entity.LangCode, "@ERR_PANEL_INTIAL_UPDATE");//[NG.Change] dbo.sp_panel_4m_initial_update NO DATA

            dic = new Dictionary<string, object>();
            dic.Add("row_key", "");
            dic.Add("group_key", groupkey);
            dic.Add("body_json", JsonConvert.SerializeObject(entity));
            dic.Add("remark", remark);
            dic.Add("request_user", remarkUser);
        }


        return new(null, historyNo, ResultEnum.OkPanelChange, entity.LangCode, "@OK_PANEL_CHANGE");//[OK] PANEL CHANGE 변경이 완료 되었습니다.
    }

    [ManualMap]
    public static ResultEntity Cmi(Dictionary<string, object> entity)
    {
        string deviceId = entity.TypeKey<string>("deviceId");
        string langCode = entity.TypeKey<string>("langCode");

        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { langCode, entity });

        string panelId = entity.TypeKey<string>("panelId");
        string eqpCode = entity.TypeKey<string>("eqpCode");
        string scanDt = entity.TypeKey<string>("scanDt");

        dynamic obj = new ExpandoObject();
        obj.deviceId = deviceId;
        obj.langCode = langCode;
        obj.panelId = panelId;
        obj.eqpCode = eqpCode;
        obj.scanDt = scanDt;

        DataTable dtCmi = DataContext.StringDataSet("@BarcodeApi.Panel.CmiDuplicate", RefineExpando(obj)).Tables[0];
        if (dtCmi.Rows[0].TypeCol<int>("cmi_count") > 0)
            return new ResultEntity(null, historyNo, ResultEnum.NgPanelCmi, langCode, "이미 CMI 등록된 Panel 입니다.");

        int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Panel.CmiInsert", RefineExpando(obj));
        if (cnt2 <= 0)
            return new ResultEntity(null, historyNo, ResultEnum.NgPanelCmi, langCode, "CMI 등록 실패 다시 시도 하여 주십시오.");

        return new ResultEntity(null, historyNo, ResultEnum.OkPanelCmi, langCode, "CMI 등록 성공.");
    }

    [ManualMap]
    public static ResultEntity OutSourcingCancel(List<Dictionary<string, object>> entitiy)
    {
        string deviceId = string.Empty;
        string groupKey = string.Empty;
        string workorder = string.Empty;
        string eqpCode = string.Empty;
        string langCode = string.Empty;
        int historyNo = 0;
        foreach (Dictionary<string, object> entitiyitem in entitiy)
        {
            deviceId = entitiyitem.TypeKey<string>("deviceId");
            groupKey = entitiyitem.TypeKey<string>("groupKey");
            workorder = entitiyitem.TypeKey<string>("workorder");
            eqpCode = entitiyitem.TypeKey<string>("eqpCode");
            langCode = entitiyitem.TypeKey<string>("langCode");
            historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, groupKey, langCode });

            int cnt = DataContext.NonQuery("dbo.sp_outsourcing_delete", new { groupKey = groupKey, workorder = workorder });
            //int cnt = DataContext.NonQuery("dbo.sp_panel_roll_panel_map_delete", new { groupKey = groupKey, workorder = workorder });
            //if (cnt <= 0)
            //    return new(historyNo, ResultEnum.NgDataBase, cnt, langCode, "ERROR_OUTSOURCING_CANCEL");
        }

        return new(null, historyNo, ResultEnum.OkPanelCancel, langCode, "@OK_PANEL_CANCEL");//[OK] PANEL CALCEL 완료되었습니다
    }

    [ManualMap]
    //public static ResultEntity Cancel(string deviceId, string groupKey, string langCode string workerCode, string reamrk)
    public static ResultEntity Cancel(string deviceId, string groupKey, string langCode)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, groupKey, langCode });
        Dictionary<string, object> dic = new Dictionary<string, object>();
        dic.Add("rowKey", "");
        dic.Add("groupKey", groupKey);
        dic.Add("workorder", "");
        dic.Add("operCode", "");
        dic.Add("operSeqNo", "");
        dic.Add("eqpCode", "");
        dic.Add("startYn", "");
        dic.Add("endYn", "");
        //jjk, 23.06.23 - 변경자, 변경사유 넣어야됨

        //Dictionary<string, object> searchParam = new Dictionary<string, object>();


        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;
        //현재 공정의 workorder 중 작은 숫자의 마지막꺼
        DataTable lastOperCode = db.ExecuteStringDataSet("@BarcodeApi.Panel.Panel4MSelect", RefineParam(dic)).Tables[0];
        if (lastOperCode.Rows.Count > 0)
        {
            var cancleGroupKey = NewShortId();
            for (int i = 0; i < lastOperCode.Rows.Count; i++)
            {

                Dictionary<string, object> cancleHisParam = new Dictionary<string, object>();
                var json = JsonConvert.SerializeObject(lastOperCode.Rows[i]);
                cancleHisParam.Add("rowKey", "test1");
                cancleHisParam.Add("groupKey", cancleGroupKey);
                cancleHisParam.Add("body_json", json);
                cancleHisParam.Add("wokrerCode", "test4");
                cancleHisParam.Add("cancelCode", "test5");
                cancleHisParam.Add("cancelRemark", "test6");
                int cancleHistoryCnt = DataContext.StringNonQuery("@BarcodeApi.Panel.CancelHistoryInsert", RefineParam(cancleHisParam));
                if (cancleHistoryCnt <= 0)
                    return new(null, historyNo, ResultEnum.NgWorkingPanelExists, cancleHistoryCnt, langCode, "@NG_ALREADY_PANEL");//[NG] 등록된 panel 있으므로 취소 할 수 없습니다.
            }
        }

        int cnt = DataContext.Value<int>("dbo.sp_panel_4m_delete", dic);
        if (cnt > 0)
            return new(null, historyNo, ResultEnum.NgWorkingPanelExists, cnt, langCode, "@NG_ALREADY_PANEL");//[NG] 등록된 panel 있으므로 취소 할 수 없습니다.

        return new(null, historyNo, ResultEnum.OkPanelCancel, langCode, "@OK_PANEL_CANCEL");//[OK] PANEL CALCEL 완료되었습니다
    }

    [ManualMap]
    public static ResultEntity InitialCancel(string deviceId, string groupKey, string langCode)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, groupKey, langCode });
        Dictionary<string, object> dic = new Dictionary<string, object>();
        dic.Add("group_key", groupKey);

        int cnt = DataContext.Value<int>("dbo.sp_panel_4m_initial_delete", dic);
        if (cnt > 0)
            return new(null, historyNo, ResultEnum.NgWorkingPanelExists, cnt, langCode, "@NG_ALREADY_PANEL");//[NG] 등록된 panel 있으므로 취소 할 수 없습니다.

        return new(null, historyNo, ResultEnum.OkPanelCancel, langCode, "");
    }

    [ManualMap]
    public static ResultEntity End(string deviceId, string groupKey, string langCode, string? defectReason)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, groupKey, langCode, defectReason });
        Dictionary<string, object> dic = new Dictionary<string, object>();
        dic.Add("rowKey", "");
        dic.Add("groupKey", groupKey);
        dic.Add("workorder", "");
        dic.Add("operCode", "");
        dic.Add("operSeqNo", "");
        dic.Add("eqpCode", "");
        dic.Add("startYn", "");
        dic.Add("endYn", "");

        int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.EndUpdate", RefineParam(dic));
        if (cnt <= 0)
            return new(null, historyNo, ResultEnum.NgPanelNotExists, cnt, langCode, "@ERR_PANEL_UPDATE");//[NG] End Time Update 실패 GroupKey에 대한 정보가 없습니다.

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;
        //현재 공정의 workorder 중 작은 숫자의 마지막꺼
        DataTable lastOperCode = db.ExecuteStringDataSet("@BarcodeApi.Panel.Panel4MSelect", RefineParam(dic)).Tables[0];
        if (lastOperCode.Rows.Count == 0)
            return new(null, historyNo, ResultEnum.NgPanelNotExists, cnt, langCode, "@NG_4M_NOT_FOUND");//[NG] End Time Update 실패 GroupKey에 대한 정보가 없습니다.

        if (dic.ContainsKey("workorder"))
        {
            dic["workorder"] = lastOperCode.Rows[0].TypeCol<string>("workorder");
            dic["operCode"] = lastOperCode.Rows[0].TypeCol<string>("oper_code");
            dic["operSeqNo"] = lastOperCode.Rows[0].TypeCol<int>("oper_seq_no");
        }
        dic.Add("modelCode", lastOperCode.Rows[0].TypeCol<string>("model_item_code"));

        ////roll 일때 insert 
        ////group key 를 찾아서 panel 인지 roll 인지 구분하기
        //DataTable rollPanelChk = DataContext.StringDataSet("@BarcodeApi.Common.BaseOperInfo", RefineParam(dic)).Tables[0];
        //if (rollPanelChk.Rows.Count > 0)
        //{
        //    var scanType = rollPanelChk.Rows[0].TypeCol<string>("scan_type");

        //    if (scanType == "P")
        //    {
        //        //realtime 에 item 등록 되어있는지 확인하고 항목이 없으면 최신이니깐 insert 시켜주기
        //        DataTable realtimeChk = DataContext.StringDataSet("@BarcodeApi.Panel.RealTimeList", new { workorder = dic.TypeKey<string>("workorder") }).Tables[0];
        //        if (realtimeChk.Rows.Count == -0)
        //        {
        //            dic.Add("first_yn", "Y");
        //            int cnt2 = DataContext.NonQuery("dbo.sp_panel_realtime_insert", RefineParam(dic));
        //        }
        //    }
        //    else
        //    {
        //        //roll 일때 insert 
        //        int cnt2 = DataContext.NonQuery("dbo.sp_roll_panel_map_insert", RefineParam(dic));
        //    }
        //}
        //else
        //{
        //    //DataTable panelItemChk = DataContext.StringDataSet("@BarcodeApi.Panel.PanelItemCount", RefineParam(dic)).Tables[0];
        //    ////roll 일때 insert 
        //    //if (panelItemChk.Rows.Count == 0)
        //    //{
        //    //    //panel item 에 등록된 groupkey 가 없으면 roll 간주

        //    //    int cnt2 = DataContext.NonQuery("dbo.sp_roll_panel_map_insert", RefineParam(dic));
        //    //    if (cnt2 <= 0)
        //    //        return new(historyNo, ResultEnum.NgPanelNotExists, cnt, langCode, "@NG_NO_GROUP_KEY");
        //    //}
        //}

        //QR laser 공정에서 판넬 메핑이 진행되므로 end처리시 임시 주석 
        //panel item 에 등록된 groupkey 가 없으면 roll 간주
        //int cnt2 = DataContext.NonQuery("dbo.sp_roll_panel_map_insert", RefineParam(dic));
        //if (cnt2 <= 0)
        //    return new(historyNo, ResultEnum.OkPanelEnd, cnt, langCode, "@OK_4M_COMPLETE");

        return new(null, historyNo, ResultEnum.OkPanelEnd, langCode, "@OK_4M_COMPLETE");//[OK] 4M COMPLETE 완료되었습니다.
    }

    [ManualMap]
    public static ResultEntity InitialEnd(string deviceId, string groupKey, string langCode, string? defectReason)
    {
        //var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, groupKey, langCode });
        //if (string.IsNullOrWhiteSpace(groupKey) || string.IsNullOrWhiteSpace(langCode))
        //    return new(historyNo, ResultEnum.NgPanelNotExists, langCode, "");


        //int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.EndUpdateInitial", new { groupKey });

        //if (cnt <= 0)
        //    return new(historyNo, ResultEnum.NgPanelNotExists, cnt, langCode, "");

        //return new(historyNo, ResultEnum.OkPanelEnd, langCode, "");

        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, groupKey, langCode, defectReason });
        Dictionary<string, object> dic = new Dictionary<string, object>();
        dic.Add("rowKey", "");
        dic.Add("groupKey", groupKey);
        dic.Add("workorder", "");
        dic.Add("operCode", "");
        dic.Add("operSeqNo", "");
        dic.Add("eqpCode", "");
        dic.Add("startYn", "");
        dic.Add("endYn", "");

        int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.Panel4MSelectInitial", RefineParam(dic));
        if (cnt <= 0)
            return new(null, historyNo, ResultEnum.NgPanelNotExists, cnt, langCode, "@NG_NO_INITIAL_GROUP_KEY");//[NG] End Time Initial Update 실패 GroupKey에 대한 정보가 없습니다.

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;
        //현재 공정의 workorder 중 작은 숫자의 마지막꺼
        DataTable lastOperCode = db.ExecuteStringDataSet("@BarcodeApi.Panel.Panel4MSelectInitial", RefineParam(dic)).Tables[0];
        if (lastOperCode.Rows.Count == 0)
            return new(null, historyNo, ResultEnum.NgPanelNotExists, cnt, langCode, "@NG_NO_INITIAL_GROUP_KEY");//[NG] End Time Initial Update 실패 GroupKey에 대한 정보가 없습니다.

        if (dic.ContainsKey("workorder"))
        {
            dic["workorder"] = lastOperCode.Rows[0].TypeCol<string>("workorder");
            dic["operCode"] = lastOperCode.Rows[0].TypeCol<string>("oper_code");
            dic["operSeqNo"] = lastOperCode.Rows[0].TypeCol<int>("oper_seq_no");
        }

        //group key 를 찾아서 panel 인지 roll 인지 구분하기
        DataTable rollPanelChk = DataContext.StringDataSet("@BarcodeApi.Common.BaseOperInfo", RefineParam(dic)).Tables[0];
        var scanType = rollPanelChk.Rows[0].TypeCol<string>("scan_type");
        dic.Add("first_yn", "Y");

        if (scanType == "P")
        {

            //realtime 에 item 등록 되어있는지 확인하고 항목이 없으면 최신이니깐 insert 시켜주기
            DataTable realtimeChk = DataContext.StringDataSet("@BarcodeApi.Panel.RealTimeList", new { workorder = dic.TypeKey<string>("workorder") }).Tables[0];
            if (realtimeChk.Rows.Count == -0)
            {
                int cnt2 = DataContext.NonQuery("dbo.sp_panel_realtime_insert", RefineParam(dic));
            }
        }
        else
        {
            //roll 일때 insert 
            int cnt2 = DataContext.NonQuery("dbo.sp_roll_panel_map_insert", RefineParam(dic));
        }

        return new(null, historyNo, ResultEnum.OkPanelEnd, langCode, "@OK_INITIAL_COMPLETE");//[OK] 4M INITIAL COMPLETE 완료되었습니다.
    }

    [ManualMap]
    public static ResultEntity Hold(string deviceId, string langCode, string panelId, string holdCode, string onRemark, string onUpdateUser)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, langCode });
        //tb_panel_realtime  defectYn Y로
        int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.HoldYn", new { panelId, holdYn = 'Y' });
        //tb_panel_holding insert. panel Id, updateuser, remark, holdingCode, on_dt 생성
        int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Panel.HoldInsert", new { panelId, onUpdateUser, onRemark, holdCode });

        Dictionary<string, object> dic = new Dictionary<string, object>
            {
                { "panelId", panelId },
                { "holdCode", holdCode },
                { "remark", onRemark },
                { "updateUser", onUpdateUser}
            };

        if (cnt <= 0)
            return new(null, historyNo, ResultEnum.NgPanelNotExists, cnt, langCode, "");

        return new(null, historyNo, ResultEnum.OkPanelHold, dic, langCode, "");
    }

    [ManualMap]
    public static ResultEntity HoldCancel(string deviceId, string langCode, string panelId, string offRemark, string offUpdateUser)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, langCode });
        //tb_panel_realtime  defectYn Y로
        int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.HoldYn", new { panelId, holdYn = 'N' });
        //tb_panel_holding insert. panel Id, updateuser, remark, holdingCode, off_dt 생성
        int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Panel.HoldCancelInsert", new { panelId, offUpdateUser, offRemark });

        Dictionary<string, object> dic = new Dictionary<string, object>
            {
                { "panelId", panelId },
                { "remark", offRemark },
                { "updateUser", offUpdateUser}
            };

        if (cnt <= 0)
            return new(null, historyNo, ResultEnum.NgPanelNotExists, cnt, langCode, "");

        return new(null, historyNo, ResultEnum.OkPanelHold, dic, langCode, "");
    }

    [ManualMap]
    public static List<ResultEntity> Rework(PanelEntity entity)
    {
        var historyNo = CommonService.PanelHistoryInsert(entity.DeviceId, entity, new { });
        List<ResultEntity> lstresultValue = new List<ResultEntity>();
        List<dynamic> results = new List<dynamic>();
        List<string> wList = new List<string>();

        entity.WorkorderList = new List<Dictionary<string, object>>();


        entity.CodegroupId = "REWORKREASON";

        if (string.IsNullOrWhiteSpace(entity.ReworkCode))
        {
            entity.ReworkCode = "2005";
            entity.Code = "2005";
        }
        else
        {
            entity.Code = entity.ReworkCode;
            DataTable codeCnt = DataContext.StringDataSet("@BarcodeApi.Panel.CodeExistCheck", RefineEntity(entity)).Tables[0];
            if (codeCnt.Rows[0].TypeCol<int>("cnt") == 0)
            {
                entity.ReworkCode = "2005";
                entity.Code = "2005";
            }
            else
            {
                entity.Code = entity.ReworkCode;
            }
        }

        for (int i = 0; i < entity.OrderCodeNo.Count; i++)
        {
            var result = entity.GetWorkorderOper(i);
            entity.Workorder = result.SafeTypeKey<string?>("workorder", null);
            entity.OperCode = result.SafeTypeKey<string?>("operCode", null);
            entity.OperSeqNo = result.SafeTypeKey<int?>("operSeqNo", null); // 키가없으면 기본값
            entity.ReworkCode = result.SafeTypeKey<string?>("reworkCode", null); // 키가없으면 기본값

            if (string.IsNullOrWhiteSpace(entity.Workorder))
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_NOT_INSERT_TCARD") };//[NG] 등록된 T-Card 정보가 없습니다.

            if (string.IsNullOrWhiteSpace(entity.OperCode))
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_OPER_NOT_FOUND") };//[NG] 등록된 공정 정보가 없습니다.

            if (entity.OperSeqNo == null)
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_OPERSEQ_NOT_FOUND") };//[NG] 등록된 공정 순서가 없습니다.

            //if (entity.ReworkCode == null)
            //    return new List<ResultEntity>() { new(historyNo, ResultEnum.NgDataBase, entity.LangCode, "[NG] ReworkCode가 없습니다.\r\nReworkCode를 다시 입력하여 주십시오.") };//[NG] ReworkCode가 없습니다.\r\nReworkCode를 다시 입력하여 주십시오.

            dynamic reworkEntity = new ExpandoObject();
            reworkEntity.corpId = "SIFLEX";
            reworkEntity.facId = "SIFLEX";
            reworkEntity.workorder = entity.Workorder;
            reworkEntity.operSeqNo = (entity.OperSeqNo - entity.OperSeqNo % 100);
            reworkEntity.operCode = entity.OperCode;
            reworkEntity.realSeqNo = entity.OperSeqNo;
            reworkEntity.putUpdateUser = "putupdateuser";

            dynamic searchParam = new ExpandoObject();
            searchParam.RowKey = "";
            searchParam.GroupKey = "";
            searchParam.Workorder = entity.Workorder;
            searchParam.OperCode = "";
            searchParam.OperSeqNo = "";
            searchParam.EqpCode = "";
            searchParam.StartYn = "";
            searchParam.EndYn = "";
            entity.WorkType = "REWORK";
            string updateUser = "Test";
            entity.UpdateUser = updateUser;


            OperationEntity currOper = new OperationEntity();
            currOper.Workorder = entity.Workorder;
            currOper.OperCode = entity.OperCode;
            currOper.OperSeqNo = entity.OperSeqNo;
            currOper.RecipeParamJudge = true;

            DataTable product = DataContext.StringDataSet("@BarcodeApi.Panel.ErpTcardProductName", new { barcode = currOper.Workorder }).Tables[0];
            if (product.Rows.Count == 0)
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_NO_MODEL_INFO") };//[NG.Insert] 조회된 모델 정보가 없습니다.

            currOper.ModelCode = product.Rows[0].TypeCol<string>("bom_item_code");


            //작업자가 등록이 안되어 있을경우
            if (entity.WorkerList.Count == 0)
            {
                var getMapCode = CodeService.GetMap("QR_LASER_OPER");
                var outsourcingWorker = getMapCode.AsEnumerable().Any(x => x.Label == entity.OperCode);
                if (!outsourcingWorker)
                    return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgPanelNotExists, entity.LangCode, "@NG_NO_WORKER") };//[NG] 작업자가 등록되어 있지 않습니다.
            }

            // LOT 공정 확인(+자재, +툴)
            var procResult = CheckLotProcRework(entity, currOper);
            if ((int)procResult.resultEnum >= 5000)
            {
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, procResult.resultEnum, entity.LangCode, procResult.remark) };
            }

            // 설비 확인
            var eqpResult = CheckEqp(entity, currOper);
            if (eqpResult.resultEnum != ResultEnum.OkPanel)
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, eqpResult.resultEnum, eqpResult.dicResult, entity.LangCode, eqpResult.remark) };

            //리워크코드 여부 확인
            //DataTable reworkData = DataContext.StringDataSet("@BarcodeApi.Panel.FindReworkData", new { entity.ReworkCode }).Tables[0];
            //if (reworkData.Rows.Count == 0)
            //{
            //    //리워크 테이블에 리워크 데이터 없음
            //    return new List<ResultEntity>() { new(historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_NO_REWORK_CODE") };//[NG] 입력된 REWORK 코드 정보를 찾을 수 없습니다.
            //}


            //var db = DataContext.Create(null);
            //db.IgnoreParameterSame = true;
            //DataTable panelData = db.ExecuteStringDataSet("@BarcodeApi.Panel.Panel4MSelect", RefineExpando(searchParam)).Tables[0];
            //if (panelData.Rows.Count == 0)
            //{
            //    return new List<ResultEntity>() { new(historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_REWORK_4M_DATA") };//[NG] 4M 데이터를 찾을 수 없습니다.
            //}

            //PanelQuantity4m
            DataTable panelQuantity = DataContext.StringDataSet("@BarcodeApi.Panel.PanelQuantity4m", RefineEntity(entity)).Tables[0];
            if (panelQuantity.Rows.Count > 0)
            {
                Dictionary<string, object> workorderQuantity = new Dictionary<string, object>();
                workorderQuantity.Add("workorder", entity.Workorder);
                workorderQuantity.Add("panel_qty", panelQuantity.Rows[0].TypeCol<int>("panel_qty"));
                //entity.PanelQuantityList.Add(workorderQuantity);
                //entity.WorkorderList.Add(workorderQuantity);
            }

            wList.Add(entity.Workorder);

            if (i != entity.OrderCodeNo.Count - 1)
                continue;



            //일단 INSERT 똑같이 따라붙음

            int layupCount = 0;
            DataTable resultDt = null;
            DataTable baseOperInfoDt = DataContext.StringDataSet("@BarcodeApi.Common.BaseOperInfo", RefineEntity(currOper)).Tables[0];
            if (baseOperInfoDt.Rows.Count > 0)
            {
                //메인작지 판넬 / 롤 구분
                var scanType = baseOperInfoDt.Rows[0].TypeCol<string>("scan_type");
                if (scanType == "P")
                {
                    if (entity.WorkorderList.Count > 1)
                    {
                        resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_workorder", RefineEntity(entity)).Tables[0];
                        if (resultDt.Rows.Count == 0)
                            return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.
                    }
                    else if (entity.EqpList.Count > 1)
                    {
                        //rework
                        var totalEqpList = entity.EqpList.Adapt<List<Dictionary<string, string>>>();
                        int cnt = entity.EqpList.Count;
                        for (int j = 0; j < cnt; j++)
                        {
                            List<Dictionary<string, string>> newEqplist = new List<Dictionary<string, string>>();
                            newEqplist.Add(totalEqpList[j]);
                            entity.EqpList = newEqplist;
                            resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_eqp", RefineEntity(entity)).Tables[0];
                            if (resultDt.Rows.Count == 0)
                                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.
                        }
                        entity.EqpList = totalEqpList;
                    }
                    else if (entity.WorkorderList.Count == 1 && entity.EqpList.Count == 1)
                    {
                        resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_workorder", RefineEntity(entity)).Tables[0];
                        if (resultDt.Rows.Count == 0)
                            return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@ERR_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.
                    }
                    else if (entity.WorkorderList.Count == 1 && entity.EqpList.Count == 0)
                    {
                        resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_workorder", RefineEntity(entity)).Tables[0];
                        if (resultDt.Rows.Count == 0)
                            return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@ERR_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.

                    }
                    else if (entity.EqpList.Count == 1 && entity.WorkorderList.Count == 0)
                    {
                        resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_eqp", RefineEntity(entity)).Tables[0];
                        if (resultDt.Rows.Count == 0)
                            return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@ERR_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.

                    }
                    else if (entity.EqpList.Count == 0 && entity.WorkorderList.Count == 0)
                    {
                        return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_NEED_TCARD_EQP_REWORK") };//[NG] T-Card와 설비 정보가 없어 4M REWORK 등록이 불가능합니다. 입력된 데이터를 확인해주세요.
                    }

                }
                else if (scanType == "R")
                {
                    //롤인지 알아보고 넣어야함 .
                    //롤공정이고 자재가 랏코드 하나 들어올때 // 롤 바코드를 추적하기 위해 저장 
                    //entity.WorkorderList = new List<string>() { entity.Workorder };


                    if (entity.WorkorderList.Count > 1)
                    {
                        //entity.WorkorderList = new List<string>() { entity.Workorder };
                        resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_workorder", RefineEntity(entity)).Tables[0];
                        if (resultDt.Rows.Count == 0)
                            return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.
                    }
                    else if (entity.EqpList.Count > 1)
                    {
                        //rework
                        var totalEqpList = entity.EqpList.Adapt<List<Dictionary<string, string>>>();
                        int cnt = entity.EqpList.Count;
                        for (int j = 0; j < cnt; j++)
                        {
                            List<Dictionary<string, string>> newEqplist = new List<Dictionary<string, string>>();
                            newEqplist.Add(totalEqpList[j]);
                            entity.EqpList = newEqplist;
                            resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_eqp", RefineEntity(entity)).Tables[0];
                            if (resultDt.Rows.Count == 0)
                                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@ERR_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.
                        }
                        entity.EqpList = totalEqpList.Adapt<List<Dictionary<string, string>>>();
                    }
                    else if (entity.WorkorderList.Count == 1 && entity.EqpList.Count == 1)
                    {
                        resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_workorder", RefineEntity(entity)).Tables[0];
                        if (resultDt.Rows.Count == 0)
                            return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@ERR_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.
                    }
                    else if (entity.WorkorderList.Count == 1 && entity.EqpList.Count == 0)
                    {
                        resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_workorder", RefineEntity(entity)).Tables[0];
                        if (resultDt.Rows.Count == 0)
                            return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@ERR_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.

                    }
                    else if (entity.EqpList.Count == 1 && entity.WorkorderList.Count == 0)
                    {
                        resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_eqp", RefineEntity(entity)).Tables[0];
                        if (resultDt.Rows.Count == 0)
                            return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@ERR_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.

                    }
                    else if (entity.EqpList.Count == 0 && entity.WorkorderList.Count == 0)
                    {
                        return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_NEED_TCARD_EQP_REWORK") };//[NG] T-Card와 설비 정보가 없어 4M REWORK 등록이 불가능합니다. 입력된 데이터를 확인해주세요.
                    }
                }
            }
            else
            {
                //반제품일때
                if (entity.WorkorderList.Count > 1)
                {
                    //entity.WorkorderList = new List<string>() { entity.Workorder };
                    resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_workorder", RefineEntity(entity)).Tables[0];
                    if (resultDt.Rows.Count == 0)
                        return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@ERR_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.
                }
                else if (entity.EqpList.Count > 1)
                {

                    var totalEqpList = entity.EqpList.Adapt<List<Dictionary<string, string>>>();
                    int cnt = entity.EqpList.Count;
                    for (int j = 0; j < cnt; j++)
                    {
                        //rework
                        List<Dictionary<string, string>> newEqplist = new List<Dictionary<string, string>>();
                        newEqplist.Add(totalEqpList[j]);
                        entity.EqpList = newEqplist;
                        resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_eqp", RefineEntity(entity)).Tables[0];
                        if (resultDt.Rows.Count == 0)
                            return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@ERR_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.
                    }
                    entity.EqpList = totalEqpList.Adapt<List<Dictionary<string, string>>>();
                }
                else if (entity.WorkorderList.Count == 1 && entity.EqpList.Count == 1)
                {
                    resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_workorder", RefineEntity(entity)).Tables[0];
                    if (resultDt.Rows.Count == 0)
                        return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@ERR_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.
                }
                else if (entity.WorkorderList.Count == 1 && entity.EqpList.Count == 0)
                {
                    resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_workorder", RefineEntity(entity)).Tables[0];
                    if (resultDt.Rows.Count == 0)
                        return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@ERR_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.

                }
                else if (entity.EqpList.Count == 1 && entity.WorkorderList.Count == 0)
                {
                    resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_eqp", RefineEntity(entity)).Tables[0];
                    if (resultDt.Rows.Count == 0)
                        return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@ERR_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.

                }
                else if (entity.EqpList.Count == 0 && entity.WorkorderList.Count == 0)
                {
                    return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_NEED_TCARD_EQP_REWORK") };//[NG] T-Card와 설비 정보가 없어 4M REWORK 등록이 불가능합니다. 입력된 데이터를 확인해주세요.
                }
            }

            var lstRowKeS = resultDt.AsEnumerable().Select(row => row.TypeCol<string>("row_key")).ToList();
            List<string> lst = new List<string>();
            lst.Add(entity.Context);
            ResultEntity resultEntity = new(historyNo, ResultEnum.OkPanel, layupCount, lstRowKeS, resultDt.Rows[0].TypeCol<string>("group_key"), entity.LangCode);
            lstresultValue.Add(resultEntity);



            results.Add(reworkEntity);
        }


        return lstresultValue;
    }

    [ManualMap]
    public static List<ResultEntity> InitialInsert(PanelEntity entity)
    {
        List<ResultEntity> lstresultValue = new List<ResultEntity>();

        //일단 초품 insert는 캔슬이 없으니 놔둠, 필요시 구현
        //dynamic insertEntity = new ExpandoObject();
        //insertEntity.CorpId = entity.CorpId;
        //insertEntity.FacId = entity.FacId;
        //insertEntity.DeviceId = entity.DeviceId;
        ////insertEntity.WorkorderList = new List<Dictionary<string, object>>();
        //insertEntity.eqpList = entity.EqpList;
        //insertEntity.OperSeqNo = entity.OperSeqNo;
        //insertEntity.OperCode = entity.OperCode;
        //insertEntity.EqpCode = entity.EqpCode;
        //insertEntity.WorkType = "INITIAL";
        //insertEntity.Remark = "remark";
        //insertEntity.Code = "code";
        //insertEntity.UpdateUser = "initUpdateUser";
        //insertEntity.WorkerList = entity.WorkerList;
        //insertEntity.MaterialList = entity.MaterialList;
        //insertEntity.ToolList = entity.ToolList;
        //insertEntity.Context = "context";

        //List<Dictionary<string, object>> workorderList = new List<Dictionary<string, object>>();




        entity.WorkorderList = new List<Dictionary<string, object>>();

        //entity.InterlockCode

        entity.CodegroupId = "INITREASON";

        if (string.IsNullOrWhiteSpace(entity.InitialCode))
        {
            entity.InitialCode = "0005";
            entity.Code = "0005";
        }
        else
        {
            entity.Code = entity.InitialCode;
            DataTable codeCnt = DataContext.StringDataSet("@BarcodeApi.Panel.CodeExistCheck", RefineEntity(entity)).Tables[0];
            if (codeCnt.Rows[0].TypeCol<int>("cnt") == 0)
            {
                entity.InitialCode = "0005";
                entity.Code = "0005";
            }
            else
            {
                entity.Code = entity.InitialCode;
            }
        }

        for (int i = 0; i < entity.OrderCodeNo.Count; i++)
        {
            var result = entity.GetWorkorderOper(i);
            entity.Workorder = result.SafeTypeKey<string?>("workorder", null);
            entity.OperCode = result.SafeTypeKey<string?>("operCode", null);
            entity.OperSeqNo = result.SafeTypeKey<int?>("operSeqNo", null); // 키가없으면 기본값
            entity.Remark = entity.Context;

            entity.UpdateUser = "test";
            entity.Code = "";
            entity.WorkType = "INITIAL";

            var historyNo = CommonService.PanelHistoryInsert(entity.DeviceId, entity, new { });

            if (string.IsNullOrWhiteSpace(entity.Workorder))
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_NOT_INSERT_TCARD") };//[NG] 등록된 T-Card 정보가 없습니다.

            if (string.IsNullOrWhiteSpace(entity.OperCode))
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_OPER_NOT_FOUND") };//[NG] 등록된 공정 정보가 없습니다.

            if (entity.OperSeqNo == null)
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_OPERSEQ_NOT_FOUND") };//[NG] 등록된 공정 순서가 없습니다.

            OperationEntity currOper = new OperationEntity();
            currOper.Workorder = entity.Workorder;
            currOper.OperCode = entity.OperCode;
            currOper.OperSeqNo = entity.OperSeqNo;

            entity.RowKey = NewShortId();

            DataTable resultDt = null;
            DataTable baseOperInfoDt = DataContext.StringDataSet("@BarcodeApi.Common.BaseOperInfo", RefineEntity(currOper)).Tables[0];
            if (baseOperInfoDt.Rows.Count == 0)
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgPanelProcDupl, entity.LangCode, "@NG_OPER_CODE_SEQ_CHECK") };//[NG] 공정코드 , 공정순서를 알 수 없습니다. 공정코드와 공정순서를 확인하여 다시시도해 주십시오.

            var scanType = baseOperInfoDt.Rows[0].TypeCol<string>("scan_type");
            int layupCount = 0;


            if (i != entity.OrderCodeNo.Count - 1)
                continue;



            if (entity.WorkorderList.Count > 1)
            {
                //entity.WorkorderList = new List<string>() { entity.Workorder };
                resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_workorder", RefineEntity(entity)).Tables[0];
                if (resultDt.Rows.Count == 0)
                    return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_INITIAL_INSERT_ERROR") };//[NG] Initial Insert Error API를 확인하여 주십시오.

            }
            else if (entity.EqpList.Count > 1)
            {
                var totalEqpList = entity.EqpList.Adapt<List<Dictionary<string, string>>>();
                int cnt = entity.EqpList.Count;
                for (int j = 0; j < cnt; j++)
                {
                    List<Dictionary<string, string>> newEqplist = new List<Dictionary<string, string>>();
                    newEqplist.Add(totalEqpList[j]);
                    entity.EqpList = newEqplist;
                    resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_eqp", RefineEntity(entity)).Tables[0];
                    if (resultDt.Rows.Count == 0)
                        return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.
                }
                entity.EqpList = totalEqpList.Adapt<List<Dictionary<string, string>>>();
            }
            else if (entity.WorkorderList.Count == 1 && entity.EqpList.Count == 1)
            {
                resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_workorder", RefineEntity(entity)).Tables[0];
                if (resultDt.Rows.Count == 0)
                    return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@ERR_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.
            }
            else if (entity.WorkorderList.Count == 1 && entity.EqpList.Count == 0)
            {
                resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_workorder", RefineEntity(entity)).Tables[0];
                if (resultDt.Rows.Count == 0)
                    return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@ERR_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.

            }
            else if (entity.EqpList.Count == 1 && entity.WorkorderList.Count == 0)
            {
                resultDt = DataContext.DataSet("dbo.sp_panel_4m_rework_initial_insert_for_multi_eqp", RefineEntity(entity)).Tables[0];
                if (resultDt.Rows.Count == 0)
                    return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@ERR_INSERT_ERROR") };//[NG] Insert Error API를 확인하여 주십시오.

            }
            else if (entity.EqpList.Count == 0 && entity.WorkorderList.Count == 0)
            {
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "@NG_NEED_TCARD_EQP_INITIAL") };//[NG] T-Card와 설비 정보가 없어 4M INITIAL 등록이 불가능합니다. 입력된 데이터를 확인해주세요.
            }

            if (resultDt == null)
            {
                return new List<ResultEntity>() { new(entity.OrderCodeNo, historyNo, ResultEnum.NgDataBase, entity.LangCode, "[NG] Initial Insert Error API를 확인하여 주십시오.") };//[NG] Initial Insert Error API를 확인하여 주십시오.
            }

            var lstRowKeS = resultDt.AsEnumerable().Select(row => row.TypeCol<string>("row_key")).ToList();
            List<string> lst = new List<string>();
            lst.Add(entity.Context);
            ResultEntity resultEntity = new(historyNo, ResultEnum.OkPanel, layupCount, lstRowKeS, resultDt.Rows[0].TypeCol<string>("group_key"), entity.LangCode);
            lstresultValue.Add(resultEntity);
        }

        return lstresultValue;
    }

    [ManualMap]
    public static ResultEntity ReworkRollToPanel(string deviceId, string langCode, string operName, string rollId, string reworkCode, string putRemark, string putUpdateUser)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, langCode });
        dynamic obj = new ExpandoObject();
        obj.OperName = operName;
        obj.RollId = rollId;
        obj.ReworkApproveYn = 'N';
        obj.ReworkCode = reworkCode;
        obj.PutRemark = putRemark;
        obj.PutUpdateUser = putUpdateUser;
        //tb_panel_realtime
        int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.ReworkRollYn", RefineExpando(obj, true));
        //tb_panel_rework
        int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Panel.ReworkRollInsert", RefineExpando(obj, true));
        Dictionary<string, object> dic = new Dictionary<string, object>
            {
                { "rollId", rollId },
                { "reworkCode", reworkCode },
                { "remark", putRemark },
                { "updateUser", putUpdateUser}
            };
        if (cnt <= 0)
            return new(null, historyNo, ResultEnum.NgPanelNotExists, cnt, langCode, "");
        return new(null, historyNo, ResultEnum.OkPanelRework, dic, langCode, "");
    }

    [ManualMap]
    public static ResultEntity ReworkApprove(string deviceId, string langCode, string operName, string panelId, string approveRemark, string approveUpdateUser)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, langCode });
        dynamic obj = new ExpandoObject();
        obj.OperName = operName;
        obj.PanelId = panelId;
        obj.ReworkApproveYn = 'Y';
        obj.ApproveRemark = approveRemark;
        obj.ApproveUpdateUser = approveUpdateUser;
        //tb_panel_realtime 
        int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.ReworkYn", RefineExpando(obj, true));
        //tb_panel_rework
        int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Panel.ReworkApproveInsert", RefineExpando(obj, true));
        Dictionary<string, object> dic = new Dictionary<string, object>
            {
                { "panelId", panelId },
                { "remark", approveRemark },
                { "updateUser", approveUpdateUser}
            };
        if (cnt <= 0)
            return new(null, historyNo, ResultEnum.NgPanelNotExists, cnt, langCode, "");
        return new(null, historyNo, ResultEnum.OkPanelRework, dic, langCode, "");
    }

    [ManualMap]
    public static ResultEntity ItemInsertSpVersion([FromBody] PanelItemEntity entity, ILogger<PanelService>? logger)
    {
        var historyNo = CommonService.PanelHistoryInsert(entity.DeviceId, null, new { entity.DeviceId, entity.LangCode, entity });
        entity.PanelRowKey = "";
        entity.ItemKey = $"{NewShortId()}";
        DataTable result = DataContext.DataSet("dbo.sp_panel_item_insert_version", RefineEntity(entity)).Tables[0];

        ResultEnum isResult = ResultEnum.NgEtc;
        if (result.Rows.Count > 0)
        {
            string sCode = result.Rows[0].TypeCol<string>("rs_code");
            string sMessage = result.Rows[0].TypeCol<string>("rs_message");

            switch (sCode)
            {
                case "E":
                    isResult = ResultEnum.NgPanelNotExists;
                    break;
                case "S":
                    isResult = ResultEnum.OkPanel;
                    break;
                case "I":
                    isResult = ResultEnum.NgPanelInterlock;
                    break;
                case "D":
                    isResult = ResultEnum.NgPanelDefect;
                    break;
                default:
                    break;
            }

            return new(null, historyNo, isResult, entity.LangCode, sMessage);
        }


        return new(null, historyNo, ResultEnum.OkPanel, entity.LangCode, "@OK_AUTO_SCAN_COMPLETE");
    }

    /// <summary>
    /// 고정형 고속 바코드 스캔
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    [ManualMap]
    public static ResultEntity ItemInsert([FromBody] PanelItemEntity entity, ILogger<PanelService>? logger)
    {

        var watch = Stopwatch.StartNew();
        var historyNo = CommonService.PanelHistoryInsert(entity.DeviceId, null, new { entity.DeviceId, entity.LangCode, entity });
        string panelId = entity.PanelId.ToUpper();
        if (string.IsNullOrWhiteSpace(entity.PanelId))
        {
            // PANEL바코드 필수
            return new(null, historyNo, ResultEnum.NgRequired, entity.LangCode, "@NG_NO_PANEL_BARCODE");//[NG] PANEL바코드 없음
        }
        else if (entity.PanelId.ToUpper() == "ERROR" || entity.PanelId.ToUpper() == "NO READ" || entity.PanelId.ToUpper() == "NOT READ")
        {
            watch.Restart();

            dynamic obj = new ExpandoObject();
            obj.CorpId = entity.CorpId;
            obj.FacId = entity.FacId;
            obj.PanelErrorId = $"ERROR_{NewShortId()}";
            obj.PanelRowKey = $"ERROR_{NewShortId()}";
            obj.PanelGroupKey = entity.PanelGroupKey;
            obj.DeviceId = entity.DeviceId;
            obj.EqpCode = entity.EqpCode;
            obj.ImgPath = entity.ImgPath == null ? "" : entity.ImgPath;
            obj.ScanDt = entity.ScanDt;
            obj.CreateDt = entity.CreateDt;
            //error insert = 고속스캐너  
            int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.ErrorItemInsert", RefineExpando(obj));
            logger.LogCritical("[PNL: {panelId}, {elapsed}] {method}", panelId, watch.Elapsed.ToString("mm':'ss':'fff"), "Logic1_Error 발생 insert 로직");
            return new(null, historyNo, ResultEnum.OkPanel, entity.LangCode, "ERROR");
        }

        entity.ItemKey = NewShortId();
        Dictionary<string, object> dic = new Dictionary<string, object>();
        dic.Add("item_key", entity.ItemKey);
        dic.Add("panel_row_key", entity.PanelRowKey);
        dic.Add("panel_group_key", entity.PanelGroupKey);
        dic.Add("device_id", entity.DeviceId);
        dic.Add("eqp_code", entity.EqpCode);
        dic.Add("panel_id", entity.PanelId);
        dic.Add("scan_dt", entity.ScanDt);
        dic.Add("rs_code", "");
        dic.Add("rs_message", "");

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        watch.Restart();

        //모델별 로더제어 > 서정욱프로 요청, 전체모델 ON / OFF
        //DataTable loaderControlItem = DataContext.StringDataSet("@BarcodeApi.Panel.LoaderControlItem", entity).Tables[0];
        //int loaderCount = loaderControlItem.Rows[0].TypeCol<int>("cnt");
        //bool isControlModel = loaderCount > 0;


        /*
         스캐너 로더제어, isControlModel == true일때 정상 판정, false일때 강제 ok 판정

        1. 마스터 스캐너 On일 경우 > 정상 판정

        2. 마스터 스캐너 Off일 경우
            MODEL_SCANNER ON > 모델 확인 후 정상판정, 없으면 강제 OK판정
            MODEL_SCANNER OFF > 강제OK판정
         */

        bool isControlModel = false; // true면 정상판정, false이면 강제 ok판정
        DataTable masterScannerOnOff = DataContext.StringDataSet("@BarcodeApi.Panel.OnOffMasterScanner", entity).Tables[0];
        if (masterScannerOnOff.Rows[0].TypeCol<int>("cnt") != 0)
        {   //MasterScnnerOnOff - ON일 경우
            isControlModel = true;
        }
        else
        {
            DataTable loaderOnOff = DataContext.StringDataSet("@BarcodeApi.Panel.OnOffModelScanner", entity).Tables[0];
            if (loaderOnOff.Rows[0].TypeCol<int>("cnt") == 0)
            {
                // 모델별 기능 Off일 경우 (cnt == 0)
                isControlModel = false;
            }
            else
            {
                // 모델별 기능 On일 경우  (cnt != 0)
                DataTable loaderControlItem = DataContext.StringDataSet("@BarcodeApi.Panel.LoaderControlItem", entity).Tables[0];
                int loaderCount = loaderControlItem.Rows[0].TypeCol<int>("cnt");
                isControlModel = loaderCount > 0; //loaderCount == 0이면 지정모델 아님, loaderCount > 0 이면 지정모델
            }
        }


        //end처리 된 그룹키가 있으면 그룹키 NO4M 으로 INSERT 후 리턴
        DataTable groupKeyEndCheck = db.ExecuteStringDataSet("@BarcodeApi.Panel.PanelGroupKeyEndCheck", RefineParam(dic)).Tables[0];
        if (groupKeyEndCheck.Rows[0].TypeCol<int>("count") > 0)
        {

            var interchk = CheckPanelInterlock(entity);
            if (interchk.resultEnum != ResultEnum.OkPanel)
            {
                //모델별 인터락 긴급 수정
                //긴급 수정, 판정 ok로 변경, REMARK 표기
                // 오디트용 판넬 리마크 임시 변경
                if (ResultEnum.NgPanelInterlock == interchk.resultEnum && !isControlModel)
                {
                    //return new(historyNo, ResultEnum.OkPanel, entity.LangCode, $"@NOT_CONTROL_MODEL_PANEL^{"INTERLOCK"}");
                    return new(null, historyNo, ResultEnum.OkPanel, entity.LangCode, "@OK_AUTO_SCAN_COMPLETE");
                }
                else if (ResultEnum.NgPanelDefect == interchk.resultEnum && !isControlModel)
                {
                    //return new(historyNo, ResultEnum.OkPanel, entity.LangCode, $"@NOT_CONTROL_MODEL_PANEL^{"DEFECT"}");
                    return new(null, historyNo, ResultEnum.OkPanel, entity.LangCode, "@OK_AUTO_SCAN_COMPLETE");
                }
                else if (!isControlModel)
                {
                    //return new(historyNo, ResultEnum.OkPanel, entity.LangCode, $"@NOT_CONTROL_MODEL_PANEL^{"NO REASON"}");
                    return new(null, historyNo, ResultEnum.OkPanel, entity.LangCode, "@OK_AUTO_SCAN_COMPLETE");
                }
                return new(null, historyNo, interchk.resultEnum, entity.LangCode, interchk.remark);
            }

            return new(null, historyNo, ResultEnum.OkPanel, entity.LangCode, "@OK_AUTO_SCAN_COMPLETE");
        }

        Dictionary<string, object> dicScan = new Dictionary<string, object>();
        dicScan.Add("device_id", entity.DeviceId);
        dicScan.Add("panel_group_key", entity.PanelGroupKey);
        dicScan.Add("eqp_code", entity.EqpCode);
        dicScan.Add("totalCount", entity.TotalCount);
        //dicScan.Add("triggerCount", entity.TriggerCount); -- GNG 쪽에서 작업 완료되면 trigger count 추가
        dicScan.Add("scan_dt", entity.ScanDt);
        //23.08.05 -> 바코드 스캔 xml 정보를 줄때 insert 문 수정 필요 
        int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Panel.ScannerCountInsert", RefineParam(dicScan));

        logger.LogCritical("[PNL: {panelId}, {elapsed}] {method}", panelId, watch.Elapsed.ToString("mm':'ss':'fff"), "Logic2_바코드 인식률 관련 로직");

        DataTable insertedCnt = DataContext.StringDataSet("@BarcodeApi.Panel.InsertedPanelItemCheck", RefineParam(dic)).Tables[0];
        if (insertedCnt.Rows[0].TypeCol<int>("cnt") != 0)
        {
            watch.Restart();

            var getMapCode = CodeService.GetMap("LAYUP_OPER_CODE_LIST").FirstOrDefault(x => x.Label == entity.OperCode);
            if (getMapCode == null)
            {
                dynamic obj1 = new ExpandoObject();
                obj1.CorpId = entity.CorpId;
                obj1.FacId = entity.FacId;
                obj1.ItemKey = $"{NewShortId()}";
                obj1.PanelRowKey = $"{NewShortId()}";
                obj1.PanelGroupKey = entity.PanelGroupKey;
                obj1.DeviceId = entity.DeviceId;
                obj1.EqpCode = entity.EqpCode;
                obj1.PanelId = $"{entity.PanelId}";
                obj1.NgRemark = "이미 스캔된 판넬입니다";
                obj1.ScanDt = entity.ScanDt;
                obj1.RecipeJudge = "";
                obj1.ParamJudge = "";
                int cnt1 = DataContext.StringNonQuery("@BarcodeApi.Panel.ErrorItemInsertNG", RefineExpando(obj1));

                logger.LogCritical("[PNL: {panelId}, {elapsed}] {method}", panelId, watch.Elapsed.ToString("mm':'ss':'fff"), "Logic3_layup 부분 이미스캔된 panel");


                //모델별 인터락 긴급수정
                //등록모델 아닐 경우 무조건 OKANEL
                if (!isControlModel)
                {
                    //return new(historyNo, ResultEnum.OkPanel, entity.LangCode, $"@NOT_CONTROL_MODEL_PANEL^{"ALREADY SCANNED"}");
                    return new(null, historyNo, ResultEnum.OkPanel, entity.LangCode, "@OK_AUTO_SCAN_COMPLETE");
                }


                return new(null, historyNo, ResultEnum.NgPanelNotExists, entity.LangCode, "@NG_ALREADY_SCANNDED");//[NG] 이미 스캔된 판넬입니다
            }
            else
            {
                var layupInterlockResult = CheckPanelInterlock(entity);

                dynamic obj1 = new ExpandoObject();
                obj1.CorpId = entity.CorpId;
                obj1.FacId = entity.FacId;
                obj1.ItemKey = $"{NewShortId()}";
                obj1.PanelRowKey = $"{NewShortId()}";
                obj1.PanelGroupKey = entity.PanelGroupKey;
                obj1.DeviceId = entity.DeviceId;
                obj1.EqpCode = entity.EqpCode;
                obj1.PanelId = $"{entity.PanelId}";
                obj1.NgRemark = $"@NG_INTERLOCK_DB_ERROR";//$"ErrorInterlock DB 조회 결과가 없습니다."
                obj1.ScanDt = entity.ScanDt;
                obj1.RecipeJudge = "";
                obj1.ParamJudge = "";
                int cnt1 = DataContext.StringNonQuery("@BarcodeApi.Panel.ErrorItemInsertNG", RefineExpando(obj1));
                logger.LogCritical("[PNL: {panelId}, {elapsed}] {method}", panelId, watch.Elapsed.ToString("mm':'ss':'fff"), "Logic_layup 인터락 확인 로직");

                //모델별 인터락 긴급 수정
                //긴급 수정, 판정 ok로 변경, REMARK 표기
                if (ResultEnum.NgPanelInterlock == layupInterlockResult.resultEnum && !isControlModel)
                {
                    //return new(historyNo, ResultEnum.OkPanel, entity.LangCode, $"@NOT_CONTROL_MODEL_PANEL^{"INTERLOCK"}");
                    return new(null, historyNo, ResultEnum.OkPanel, entity.LangCode, "@OK_AUTO_SCAN_COMPLETE");
                }
                else if (ResultEnum.NgPanelDefect == layupInterlockResult.resultEnum && !isControlModel)
                {
                    //return new(historyNo, ResultEnum.OkPanel, entity.LangCode, $"@NOT_CONTROL_MODEL_PANEL^{"DEFECT"}");
                    return new(null, historyNo, ResultEnum.OkPanel, entity.LangCode, "@OK_AUTO_SCAN_COMPLETE");
                }
                else if (!isControlModel)
                {
                    //return new(historyNo, ResultEnum.OkPanel, entity.LangCode, $"@NOT_CONTROL_MODEL_PANEL^{"NO REASON"}");
                    return new(null, historyNo, ResultEnum.OkPanel, entity.LangCode, "@OK_AUTO_SCAN_COMPLETE");
                }

                return new(null, historyNo, layupInterlockResult.resultEnum, layupInterlockResult.dic, entity.LangCode, layupInterlockResult.remark);

                //if (layupInterlockResult.resultEnum != ResultEnum.OkPanel)
                //{
                //    dynamic obj1 = new ExpandoObject();
                //    obj1.CorpId = entity.CorpId;
                //    obj1.FacId = entity.FacId;
                //    obj1.ItemKey = $"{NewShortId()}";
                //    obj1.PanelRowKey = $"{NewShortId()}";
                //    obj1.PanelGroupKey = entity.PanelGroupKey;
                //    obj1.DeviceId = entity.DeviceId;
                //    obj1.EqpCode = entity.EqpCode;
                //    obj1.PanelId = $"{entity.PanelId}";
                //    obj1.NgRemark = $"@NG_INTERLOCK_DB_ERROR";//$"ErrorInterlock DB 조회 결과가 없습니다."
                //    obj1.ScanDt = entity.ScanDt;
                //    obj1.RecipeJudge = "";
                //    obj1.ParamJudge = "";
                //    int cnt1 = DataContext.StringNonQuery("@BarcodeApi.Panel.ErrorItemInsertNG", RefineExpando(obj1));
                //    logger.LogCritical("[PNL: {panelId}, {elapsed}] {method}", panelId, watch.Elapsed.ToString("mm':'ss':'fff"), "Logic_layup 인터락 확인 로직");
                //    return new(historyNo, layupInterlockResult.resultEnum, layupInterlockResult.dic, entity.LangCode, layupInterlockResult.remark);
                //}
                logger.LogCritical("[PNL: {panelId}, {elapsed}] {method}", panelId, watch.Elapsed.ToString("mm':'ss':'fff"), "Logic4_layup 부분 등록완료 로직");
                if (layupInterlockResult.resultEnum != ResultEnum.OkPanel)
                {
                    return new(null, historyNo, layupInterlockResult.resultEnum, layupInterlockResult.dic, entity.LangCode, layupInterlockResult.remark);
                }

                return new(null, historyNo, ResultEnum.OkPanel, entity.LangCode, "@OK_AUTO_SCAN_COMPLETE");//[OK] 고속 바코드 스캔 등록 완료.
            }
        }

        //jjk, 230925 - 조혜인 프로 요청사항으로 laser 공정이면서 동일그룹키가 아닐때는 error proof 중복된 판넬 아이디입니다.
        var getMapLaserCode = CodeService.GetMap("LASER_OPER").FirstOrDefault(x => x.Label == entity.OperCode);
        if (getMapLaserCode != null)
        {
            dynamic objitem = new ExpandoObject();
            objitem.PanelId = entity.PanelId;

            DataTable panelitemdt = db.ExecuteStringDataSet("@BarcodeApi.Panel.InsertedPanelICheck", RefineExpando(objitem)).Tables[0];
            if (panelitemdt.Rows[0].TypeCol<int>("cnt") > 0)
            {
                //모델별 인터락 긴급 수정
                //긴급 수정, 판정 ok로 변경, REMARK 표기
                if (!isControlModel)
                {
                    //return new(historyNo, ResultEnum.OkPanel, entity.LangCode, $"@NOT_CONTROL_MODEL_PANEL^{"DUPLICATED PANEL ID"}");
                    return new(null, historyNo, ResultEnum.OkPanel, entity.LangCode, "@OK_AUTO_SCAN_COMPLETE");
                }

                return new(null, historyNo, ResultEnum.NgPanelNotExists, entity.LangCode, "@NG_LASER_INSERTED_PANEL");
            }
        }

        //panel_item이 tb_panel_realtime에 존재해야 로직이 성립

        //item insert = 고속스캐너 gng전용 sp에서 qr laser 각인 , 인터락일때도 찍히긴 해야한다. 4m 정보있고 , qr laser 공정이 아닌경우  ( 현재 무조건 insert )
        DataTable result = DataContext.DataSet("dbo.sp_panel_item_insert", RefineParam(dic)).Tables[0];

        if (result.Rows[0].TypeCol<string>("rs_code") == "E")
        {
            watch.Restart();

            dynamic obj1 = new ExpandoObject();
            obj1.CorpId = entity.CorpId;
            obj1.FacId = entity.FacId;
            obj1.ItemKey = $"{NewShortId()}";
            obj1.PanelRowKey = $"{NewShortId()}";
            obj1.PanelGroupKey = entity.PanelGroupKey;
            obj1.DeviceId = entity.DeviceId;
            obj1.EqpCode = entity.EqpCode;
            obj1.PanelId = $"{entity.PanelId}";
            obj1.NgRemark = $"{result.Rows[0].TypeCol<string>("rs_message")}";
            obj1.ScanDt = entity.ScanDt;
            obj1.RecipeJudge = "";
            obj1.ParamJudge = "";
            int cnt1 = DataContext.StringNonQuery("@BarcodeApi.Panel.ErrorItemInsertNG", RefineExpando(obj1));

            logger.LogCritical("[PNL: {panelId}, {elapsed}] {method}", panelId, watch.Elapsed.ToString("mm':'ss':'fff"), "Logic5_고속바코드 등록 실패 로직");


            //모델별 인터락 긴급 수정
            //긴급 수정, 판정 ok로 변경, REMARK 표기
            if (!isControlModel)
            {
                //return new(historyNo, ResultEnum.OkPanel, entity.LangCode, $"@NOT_CONTROL_MODEL_PANEL^{"INSERT FAILED"}");
                return new(null, historyNo, ResultEnum.OkPanel, entity.LangCode, "@OK_AUTO_SCAN_COMPLETE");
            }

            return new(null, historyNo, ResultEnum.NgPanelNotExists, entity.LangCode, "@NG_SCANNER_INSERT");//[NG] 고속바코드 등록 실패
        }
        else if (result.Rows[0].TypeCol<string>("rs_code") == "S")
            //공정이 QR_LASER 일때
            return new(null, historyNo, ResultEnum.OkPanel, entity.LangCode, "@OK_AUTO_SCAN_COMPLETE");//[OK] 고속 바코드 스캔 등록 완료.

        // PANEL 인터락 확인
        watch.Restart();
        var interlockResult = CheckPanelInterlock(entity);
        logger.LogCritical("[PNL: {panelId}, {elapsed}] {method}", panelId, watch.Elapsed.ToString("mm':'ss':'fff"), "Logic6_인터락 확인 로직");

        if (interlockResult.resultEnum != ResultEnum.OkPanel)
        {
            watch.Restart();

            dynamic obj1 = new ExpandoObject();
            obj1.CorpId = entity.CorpId;
            obj1.FacId = entity.FacId;
            obj1.ItemKey = $"{NewShortId()}";
            obj1.PanelRowKey = $"{NewShortId()}";
            obj1.PanelGroupKey = entity.PanelGroupKey;
            obj1.DeviceId = entity.DeviceId;
            obj1.EqpCode = entity.EqpCode;
            obj1.PanelId = $"{entity.PanelId}";
            obj1.NgRemark = $"@NG_INTERLOCK_DB_ERROR";//$"ErrorInterlock DB 조회 결과가 없습니다."
            obj1.ScanDt = entity.ScanDt;
            obj1.RecipeJudge = "";
            obj1.ParamJudge = "";
            int cnt1 = DataContext.StringNonQuery("@BarcodeApi.Panel.ErrorItemInsertNG", RefineExpando(obj1));

            //[ 2023.07.16 ] SIFLEX 요청에 따라 INTERLOCK 상태의 판넬도 스캔 가능하도록 처리
            if (result.Rows[0].TypeCol<string>("rs_code") == "C")
            {
                int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.PanelItemInsert", RefineParam(dic));
                var t1 = DataContext.NonQuery("dbo.sp_panel_realtime_insert_firsttime", new { itemKey = dic.TypeKey<string>("item_key") });
                var t2 = DataContext.NonQuery("dbo.sp_roll_panel_map_insert_firsttime", new { itemKey = dic.TypeKey<string>("item_key") });
            }

            logger.LogCritical("[PNL: {panelId}, {elapsed}] {method}", panelId, watch.Elapsed.ToString("mm':'ss':'fff"), "Logic7_인터락 상태일때 panel 등록 로직");


            //모델별 인터락 긴급 수정
            //긴급 수정, 판정 ok로 변경, REMARK 표기
            if (ResultEnum.NgPanelInterlock == interlockResult.resultEnum && !isControlModel)
            {
                //return new(historyNo, ResultEnum.OkPanel, entity.LangCode, $"@NOT_CONTROL_MODEL_PANEL^{"INTERLOCK"}");
                return new(null, historyNo, ResultEnum.OkPanel, entity.LangCode, "@OK_AUTO_SCAN_COMPLETE");
            }
            else if (ResultEnum.NgPanelDefect == interlockResult.resultEnum && !isControlModel)
            {
                //return new(historyNo, ResultEnum.OkPanel, entity.LangCode, $"@NOT_CONTROL_MODEL_PANEL^{"DEFECT"}");
                return new(null, historyNo, ResultEnum.OkPanel, entity.LangCode, "@OK_AUTO_SCAN_COMPLETE");
            }
            else if (!isControlModel)
            {
                //return new(historyNo, ResultEnum.OkPanel, entity.LangCode, $"@NOT_CONTROL_MODEL_PANEL^{"NO REASON"}");
                return new(null, historyNo, ResultEnum.OkPanel, entity.LangCode, "@OK_AUTO_SCAN_COMPLETE");
            }

            return new(null, historyNo, interlockResult.resultEnum, interlockResult.dic, entity.LangCode, interlockResult.remark);
        }


        watch.Restart();
        if (result.Rows[0].TypeCol<string>("rs_code") == "C")
        {
            int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.PanelItemInsert", RefineParam(dic));
            var t1 = DataContext.NonQuery("dbo.sp_panel_realtime_insert_firsttime", new { itemKey = dic.TypeKey<string>("item_key") });
            var t2 = DataContext.NonQuery("dbo.sp_roll_panel_map_insert_firsttime", new { itemKey = dic.TypeKey<string>("item_key") });
        }

        logger.LogCritical("[PNL: {panelId}, {elapsed}] {method}", panelId, watch.Elapsed.ToString("mm':'ss':'fff"), "Logic8_panel 등록 완료 로직");

        return new(null, historyNo, ResultEnum.OkPanel, entity.LangCode, "@OK_AUTO_SCAN_COMPLETE");//[OK] 고속 바코드 스캔 등록 완료.
    }

    [ManualMap]
    public static ResultEntity MapUpdate(string deviceId, string langCode, string panelId, List<string> pieceIdList)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { panelId, pieceIdList });
        int panelCnt = PanelCountSelect(panelId);
        if (panelCnt <= 0)
            return new(null, historyNo, ResultEnum.NgPanelNotExists, langCode, "");

        dynamic obj = new ExpandoObject();
        obj.PanelId = panelId;
        obj.Json = JsonConvert.SerializeObject(pieceIdList);

        int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.MapUpdate", RefineExpando(obj));

        if (cnt <= 0)
            return new(null, historyNo, ResultEnum.NgDataBase, langCode, "");

        return new(null, historyNo, ResultEnum.OkPanelPcsMap, cnt, langCode, "");
    }

    [ManualMap]
    public static ResultEntity SheetMapUpdate(string deviceId, string langCode, string sheetId, List<string> pieceIdList)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { sheetId, pieceIdList });
        int sheetCnt = SheetCountSelect(sheetId);
        if (sheetCnt <= 0)
            return new(null, historyNo, ResultEnum.NgPanelNotExists, langCode, "");

        dynamic obj = new ExpandoObject();
        obj.SheetId = sheetId;
        obj.Json = JsonConvert.SerializeObject(pieceIdList);

        int cnt = DataContext.StringNonQuery("@BarcodeApi.Sheet.MapUpdate", RefineExpando(obj));

        if (cnt <= 0)
            return new(null, historyNo, ResultEnum.NgDataBase, langCode, "");

        return new(null, historyNo, ResultEnum.OkPanelSheetMap, cnt, langCode, "");
    }

    [ManualMap]
    public static ResultEntity PieceMapUpdate(string deviceId, string langCode, string pieceId, List<string> pcsIdList)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { pieceId, pcsIdList });
        int pieceCnt = PieceCountSelect(pieceId);
        if (pieceCnt <= 0)
            return new(null, historyNo, ResultEnum.NgPanelNotExists, langCode, "");

        dynamic obj = new ExpandoObject();
        obj.PieceId = pieceId;
        obj.Json = JsonConvert.SerializeObject(pcsIdList);

        int cnt = DataContext.StringNonQuery("@BarcodeApi.Piece.MapUpdate", RefineExpando(obj));

        if (cnt <= 0)
            return new(null, historyNo, ResultEnum.NgDataBase, langCode, "");

        return new(null, historyNo, ResultEnum.OkPanelPcsMap, cnt, langCode, "");
    }

    [ManualMap]
    public static ResultEntity PanelMergeInsert(string deviceId, string langCode, string panelId, List<string> panelIdList)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { panelId, panelIdList });
        int panelCnt = PanelCountSelect(panelId);
        if (panelCnt <= 0)
            return new(null, historyNo, ResultEnum.NgPanelNotExists, langCode, "");

        // 머지 판넬 및 순서 확인
        var mergeResult = CheckMerge(panelId, panelIdList);

        dynamic obj = new ExpandoObject();
        obj.PanelId = panelId;
        obj.Json = JsonConvert.SerializeObject(panelIdList);

        int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.PanelMergeInsert", RefineExpando(obj));

        if (cnt <= 0)
            return new(null, historyNo, ResultEnum.NgDataBase, langCode, "");

        return new(null, historyNo, ResultEnum.OkPanelMerge, cnt, langCode, "");
    }

    [ManualMap]
    public static ResultEnum CheckMerge(string panelId, List<string> panelIdList)
    {
        if (panelIdList.Contains(panelId))
            return ResultEnum.NgPanelMergeDupl;

        if (panelId.Distinct().Count() != panelId.Count())
            return ResultEnum.NgPanelMergeDupl;

        // TODO: 모든 레이어 존재 확인 NgPanelMergeMissing

        // TODO: 순서 확인 NgPanelMergeOrder

        return ResultEnum.OkPanel;
    }

    /// <summary>
    /// PANEL 인터락 확인
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    [ManualMap]
    public static (ResultEnum resultEnum, Dictionary<string, object>? dic, string remark) CheckPanelInterlock(PanelItemEntity entity)
    {
        // tb_panel_realtime 에서 조회하고 
        // nnn 이면 통과 , 한개라도 y이면 리턴인데 
        // 뭐에 대한 에러인지 결과 값 리턴 하기 
        #region TODO: panel lock인지 확인

        DataTable panelRealtime = DataContext.StringDataSet("@BarcodeApi.Panel.PanelInterlock", entity).Tables[0];

        //panel id가 없을 경우 return
        if (panelRealtime.Rows.Count <= 0)
            return (ResultEnum.OkPanel, null, string.Empty);

        bool bIsInterlock = panelRealtime.Rows[0].TypeCol<string>("interlock_yn") == "Y" ? true : false;
        //bool bisHolding = panelRealtime.Rows[0].TypeCol<string>("hold_yn") == "Y" ? true : false;
        bool bIsDefect = panelRealtime.Rows[0].TypeCol<string>("defect_yn") == "Y" ? true : false;

        //인터록 에러 
        if (bIsInterlock)
        {
            DataTable errInterLock = DataContext.StringDataSet("@BarcodeApi.Panel.ErrorInterlock", new { entity.PanelId }).Tables[0];
            //if (errInterLock.Rows.Count == 0)
            //    return (ResultEnum.NgDataBase, null, "@NG_INTERLOCK_DB_ERROR");//[NG] ErrorInterlock DB 조회 결과가 없습니다.

            string sMessage = $"@NG_INTERLOCK_PANEL^{string.Empty}^{string.Empty}^{string.Empty}";
            if (errInterLock.Rows.Count > 0)
            {
                string onRemark = errInterLock.Rows[0].TypeCol<string>("code_name") + ", " + errInterLock.Rows[0].TypeCol<string>("on_remark");//사유
                string user = errInterLock.Rows[0].TypeCol<string>("on_update_user");//담당
                string onDt = errInterLock.Rows[0].TypeCol<DateTime>("on_dt").ToString(); //일시
                sMessage = $"@NG_INTERLOCK_PANEL^{onRemark}^{user}^{onDt}";
            }

            return (ResultEnum.NgPanelInterlock, ToDic(errInterLock) as Dictionary<string, object>, sMessage);//[OK] INTERLOCK
        }
        ////Holding 에러 
        //if (bisHolding)
        //{
        //    DataTable errHolidng = DataContext.StringDataSet("@BarcodeApi.Panel.ErrorHolding", entity).Tables[0];
        //    return (ResultEnum.NgPanelHolding, ToDic(errHolidng).First() as Dictionary<string, object>);
        //}

        //defect 불량
        if (bIsDefect)
        {
            DataTable errDefcet = DataContext.StringDataSet("@BarcodeApi.Panel.ErrorDefect", new { entity.PanelId }).Tables[0];
            //if (errDefcet.Rows.Count == 0)
            //    return (ResultEnum.NgDataBase, null, "@NG_DEFECT_DB_ERROR");//[NG] ErrorDefect DB 조회 결과가 없습니다.

            string sMessage = $"@NG_DEFECT_PANEL^{string.Empty}^{string.Empty}^{string.Empty}";
            if (errDefcet.Rows.Count > 0)
            {
                string onRemark = errDefcet.Rows[0].TypeCol<string>("code_name") + ", " + errDefcet.Rows[0].TypeCol<string>("on_remark");//사유
                string user = errDefcet.Rows[0].TypeCol<string>("on_update_user");//담당
                string onDt = errDefcet.Rows[0].TypeCol<DateTime>("on_dt").ToString(); //일시
                sMessage = $"@NG_DEFECT_PANEL^{onRemark}^{user}^{onDt}";
            }

            return (ResultEnum.NgPanelDefect, ToDic(errDefcet) as Dictionary<string, object>, sMessage);
        }

        #endregion

        //시간순으로 가장 마지막꺼 가져와서 
        //인터락 해제도 될수 도 있고 
        //off dt 가 없고
        //현재시간이 안에 있나 

        //인서트추가 sp_panel_item_insert

        return (ResultEnum.OkPanel, null, "");
    }

    public static bool isCheckMatChild = false;
    public static RollEntity rollEntity = null;
    [ManualMap]
    public static (ResultEnum resultEnum, string remark, DataTable dtResult) CheckLaserRollSplit(PanelEntity entity)
    {
        DataTable erpMaterLotDt = null;// CommonService.ErpMaterialLotList(entity.MaterialList); // 자재 코드 변환
        List<Dictionary<string, string>> tempRollSplitMaterial = new List<Dictionary<string, string>>();
        string childId = string.Empty;
        DataTable outsidechkdt = DataContext.StringDataSet("@BarcodeApi.Common.ErpOutSideCheck", new { workorder = entity.Workorder, operSeqNo = entity.OperSeqNo }).Tables[0];
        var outSideChk = outsidechkdt.Rows[0].TypeCol<string>("OWNER_TYPE_LCODE");
        //FAR_OUTSIDE     사외외주
        //NEAR_OUTSIDE    사내외주
        //INSIDE          사내
        foreach (var item in entity.MaterialList)
        {
            Dictionary<string, string> rollSplitDic = new Dictionary<string, string>();
            string rollSplitId = item.TypeKey<string>("materialLot");

            if (outSideChk.Equals("FAR_OUTSIDE") || outSideChk.Equals("NEAR_OUTSIDE"))
            {
                int rollsplitCount = rollSplitId.Count(x => x == '-');
                if (rollsplitCount == 1)
                {
                    if (!isCheckMatChild)
                    {
                        //roll split child 자동 생성 로직 추가                              
                        DataTable rollspitDt = DataContext.StringDataSet("@BarcodeApi.Panel.RollChildIdCheck",
                            new { lots = JsonConvert.SerializeObject(entity.MaterialList) }).Tables[0];

                        if (rollspitDt.Rows.Count > 0)
                        {
                            List<Dictionary<string, object>> lstRollspitChild = null;
                            Dictionary<string, object> dicParent = null;

                            var childType = rollspitDt.Rows[0].TypeCol<string>("child_no");
                            string groupKey = "";
                            if (childType == "NONE")
                            {
                                lstRollspitChild = new List<Dictionary<string, object>>();
                                dicParent = new Dictionary<string, object>();
                                //신규 roll_map 추가하기 parent / child 둘다 
                                dicParent.Add("childId", $"{rollSplitId}");
                                dicParent.Add("defectCode", "");
                                dicParent.Add("toPanelId", "");
                                dicParent.Add("fromPanelId", "");
                                dicParent.Add("panelCnt", 0);
                                lstRollspitChild.Add(dicParent);

                                groupKey = NewShortId();
                            }
                            else
                            {
                                lstRollspitChild = new List<Dictionary<string, object>>();
                                dicParent = new Dictionary<string, object>();
                                dicParent.Add("childId", $"{rollSplitId}-{childType}");
                                dicParent.Add("defectCode", "");
                                dicParent.Add("toPanelId", "");
                                dicParent.Add("fromPanelId", "");
                                dicParent.Add("panelCnt", 0);
                                lstRollspitChild.Add(dicParent);

                                groupKey = rollspitDt.Rows[0].TypeCol<string>("group_key");
                            }

                            rollEntity = new RollEntity()
                            {
                                DeviceId = entity.DeviceId,
                                EqpCode = entity.EqpCode,
                                IsEngrave = false,
                                GroupKey = groupKey,
                                LangCode = entity.LangCode,
                                OperCode = entity.OperCode,
                                OperSeqNo = entity.OperSeqNo,
                                Workorder = entity.Workorder,
                                ParentId = rollSplitId,
                                ScanDt = entity.ScanDt,
                                WorkerCode = entity.WorkerList[0].TypeKey<string>("workerCode"),
                                ChildList = lstRollspitChild,
                                Reason = string.Empty,

                            };

                            int cnt = DataContext.NonQuery("dbo.sp_roll_map_insert", RefineEntity(rollEntity));
                            if (cnt <= 0) { }

                            string fromPanelId = rollEntity.ChildList[0].TypeKey<string>("fromPanelId");
                            string toPanelId = rollEntity.ChildList[0].TypeKey<string>("toPanelId");
                            int count = DataContext.StringValue<int>("@BarcodeApi.Roll.PanelCount", new { fromPanelId, toPanelId });
                            isCheckMatChild = true;
                        }
                    }
                }

                // 분할 바코드를 차일드에 놓고 
                //원래는 메터리얼 그자리에 넣으면 

                var parentId = DataContext.StringValue<string>("@BarcodeApi.Common.MapRootId", new { rollId = rollSplitId });

                if (rollEntity != null)
                {
                    childId = rollEntity.ChildList[0].TypeKey<string>("childId");
                }
                else
                {
                    childId = rollSplitId;
                }

                rollSplitDic.Add("materialLot", parentId);
                rollSplitDic.Add("childMaterialLot", childId);
            }
            else
            {
                var parentId = DataContext.StringValue<string>("@BarcodeApi.Common.MapRootId", new { rollId = rollSplitId });
                if (parentId == null)
                    break;

                rollSplitDic.Add("materialLot", parentId);
                rollSplitDic.Add("childMaterialLot", childId);
            }

            tempRollSplitMaterial.Add(rollSplitDic);
        }


        if (tempRollSplitMaterial.Count != 0)
        {
            if (outSideChk == "FAR_OUTSIDE" || outSideChk == "NEAR_OUTSIDE" )
            {
                //외주 일때 
                erpMaterLotDt = DataContext.StringDataSet("@BarcodeApi.Common.ErpMaterialLotListOutSide",
                                new { lots = JsonConvert.SerializeObject(tempRollSplitMaterial) }).Tables[0];
            }
            else
            {
                erpMaterLotDt = CommonService.ErpMaterialLotList(tempRollSplitMaterial);
            }
        }
        else
            erpMaterLotDt = CommonService.ErpMaterialLotList(entity.MaterialList);


        if (erpMaterLotDt.Rows.Count == 0)
            return (ResultEnum.NgPanelMatNotExists, "@NG_MATERIAL_LOT_NOT_FOUND", erpMaterLotDt);//[NG] 자재 정보가 누락되었습니다.\r\n자재 정보를 다시 입력하여 주십시오.

        if (tempRollSplitMaterial.Count != 0)
            entity.MaterialList = tempRollSplitMaterial;

        return (ResultEnum.OkPanel, "", erpMaterLotDt);
    }

    /// <summary>
    /// LOT 공정 체크(Exists, 공정순서, 자재, 툴)
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    [ManualMap]
    public static (ResultEnum resultEnum, string? remark) CheckLotProc(PanelEntity entity, OperationEntity currOperInfo)
    {
        #region TODO: 공정 확인 

        #region TODO: 공정 존재 확인
        DataTable dtErpOperationChk = DataContext.StringDataSet("@BarcodeApi.Common.ErpOperationCheckList", RefineEntity(currOperInfo)).Tables[0];
        // OperCode 는 같지만 Oper_Seq_Num이 여려개일수 있으므로 List로 가져옴
        List<DataRow> lstOperCodeDtRow = dtErpOperationChk.AsEnumerable()
                                        .Where(x => x.TypeCol<string>("operation_code") == currOperInfo.OperCode
                                                 && x.TypeCol<int>("operation_seq_no") == currOperInfo.OperSeqNo).ToList();
        if (lstOperCodeDtRow.Count == 0)
        {
            return (ResultEnum.NgPanelProcNotExists, "@NG_PROCESS_NO_INFO");//[NG] 조회된 공정이 없습니다.
        }

        #endregion

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;
        //현재 공정의 workorder 중 작은 숫자의 마지막꺼
        DataTable lastOperCode = db.ExecuteStringDataSet("@BarcodeApi.Panel.CheckLotProcLastOperCode", RefineEntity(currOperInfo)).Tables[0];

        //O 옵션 , Y는 필수 , N 미사용 
        //모델 코드를 가지고 조회 하고 
        DataTable product = DataContext.StringDataSet("@BarcodeApi.Panel.ErpTcardProductName", new { barcode = entity.Workorder }).Tables[0];
        string modelCode = product.Rows[0].TypeCol<string>("bom_item_code");

        //mes 공정확장 기준 정보 가져 오기 
        DataTable baseOperInfoDt = DataContext.StringDataSet("@BarcodeApi.Common.MesBaseOperInfoList", new { modelCode = modelCode }).Tables[0];

        if (baseOperInfoDt.Rows.Count == 0)
        {
            if (lastOperCode.Rows.Count != 0)
            {
                #region TODO: 공정 순서 확인
                int iPrevOperSeqNo = lastOperCode.Rows[0].TypeCol<int>("oper_seq_no");
                bool bIsChk = false;

                if (currOperInfo.OperSeqNo < iPrevOperSeqNo)
                {
                    //공정 순서 판단기준은 
                    //현재 workorder 의 가장 마지막으로 들어온 oper_seq_no 를 가져옴
                    //현재 seq_no 2100 이전 seq_no 2000
                    // 2100 > 2000
                    bIsChk = true;
                }

                if (bIsChk)
                {
                    //공정 순서가 맞지 않은 경우 
                    //return (ResultEnum.NgPanelProcOrder, $"@NG_OPER_SEQ^{currOperInfo.OperSeqNo}^{iPrevOperSeqNo}");//[NG] 공정 순서가 맞지 않습니다.
                }
                #endregion
                //공정확장 기준정보
                //이전 공정 따지는거
                //카운트 가져와서 0이면
                //다 선택되어 있는 공정으로 판단 시키고 진행
                if (iPrevOperSeqNo < currOperInfo.OperSeqNo)
                {
                    //DataTable panel4mDt = db.ExecuteStringDataSet("@BarcodeApi.Panel.Panel4MSelect", currOperInfo).Tables[0];
                    if (lastOperCode.Rows.Count != 0)
                    {
                        string sWorkOrder = lastOperCode.Rows[0].TypeCol<string>("workorder");
                        string sOperCode = lastOperCode.Rows[0].TypeCol<string>("oper_code");
                        var dtEndTime = lastOperCode.Rows[0].TypeCol<string>("end_dt");
                        //end_dt 값이 널이 아니면 완료가 되어있는것임
                        if (string.IsNullOrWhiteSpace(dtEndTime))
                        {
                            //이전공정이 완료 되지 않은 경우
                            return (ResultEnum.NgPanelProcOrder, "@NG_OPER_NOT_FINISH");//[NG] 이전 공정이 완료되지 않았습니다.
                        }
                    }
                }
            }
        }
        else if (lastOperCode.Rows.Count != 0 && (entity.EqpList.AsEnumerable().Any(x => CodeService.List("ERROR_PROOF_EQP", null, x["eqpCode"], null, null).Count > 0)))
        //코드관리 추가 siflex 요청
        {

            #region TODO: 공정 순서 확인
            int iPrevOperSeqNo = lastOperCode.Rows[0].TypeCol<int>("oper_seq_no");
            bool bIsChk = false;
            if (currOperInfo.OperSeqNo > iPrevOperSeqNo)
            {
                //공정 순서 판단기준은 
                //현재 workorder 의 가장 마지막으로 들어온 oper_seq_no 를 가져옴
                //현재 seq_no 2100 이전 seq_no 2000
                // 2100 > 2000
                bIsChk = true;
            }

            if (bIsChk)
            {
                //공정 순서가 맞지 않은 경우 
                //return (ResultEnum.NgPanelProcOrder, "@NG_OPER_SEQ");//[NG] 공정 순서가 맞지 않습니다.
            }
            #endregion

            #region  TODO: 이전 공정이 되어 있는지 체크 하기

            // 현재 공정전에 이전공정이 있는경우
            if (iPrevOperSeqNo < currOperInfo.OperSeqNo)
            {
                //oper_yn 으로 y는 필수 , o 스킵
                string operYn = baseOperInfoDt.AsEnumerable().FirstOrDefault(x => x.TypeCol<int>("operation_seq_no") == iPrevOperSeqNo).TypeCol<string>("oper_yn");
                if (operYn == "Y")
                {
                    DataTable panel4mDt = db.ExecuteStringDataSet("@BarcodeApi.Panel.Panel4MSelect", currOperInfo).Tables[0];
                    if (lastOperCode.Rows.Count != 0)
                    {
                        string sWorkOrder = lastOperCode.Rows[0].TypeCol<string>("workorder");
                        string sOperCode = lastOperCode.Rows[0].TypeCol<string>("oper_code");
                        var dtEndTime = lastOperCode.Rows[0].TypeCol<string>("end_dt");
                        //end_dt 값이 널이 아니면 완료가 되어있는것임
                        if (string.IsNullOrWhiteSpace(dtEndTime))
                        {
                            //이전공정이 완료 되지 않은 경우
                            return (ResultEnum.NgPanelProcOrder, "@NG_OPER_NOT_FINISH");//[NG] 이전 공정이 완료되지 않았습니다.
                        }
                    }
                }
            }
            #endregion
        }

        #endregion

        // 자재는 lot 단위로 줄수 있다 . ( 해당 사항 체크 하기 ) 품번의 수량까지 
        // 창고에 들어갔다오면 lot 넘버가 ( 자재 관련으로 ) 생긴다 
        // 나머지는 그냥 t_card 에 된다.
        bool bIsErrBomChk = false;
        List<string> lstErrBomS = new List<string>();

        // erp 에서 자재(BOM) 정보를 가져옴 
        DataTable erpBomDt = DataContext.StringDataSet("@BarcodeApi.Common.ErpBomList", currOperInfo).Tables[0];
        if (erpBomDt.Rows.Count < 0)
        {
            //erp 조회 정보 에러 
            return (ResultEnum.NgDataBase, "@NG_EQP_SCAN_INFO");//[NG] 설비 스캔 정보가 없습니다.
        }

        if (entity.MaterialList?.Count == 0)
        {
            if (erpBomDt.Rows.Count != 0)
            {
                return (ResultEnum.NgPanelMatNotExists, $"@NG_MATERIAL_ERROR^{erpBomDt.Rows[0].TypeCol<string>("ITEM_CODE")}");//[NG] 자재 정보가 맞지 않습니다.
            }
        }

        //Laser 공정일경우 자재에 대한 체크 
        var laserBomChk = CommonService.FirsOperLasertMaterialChk(currOperInfo);
        if (laserBomChk.IsMB01Chk && laserBomChk.count != 0)
        {
            var tempEntity = currOperInfo.Adapt<OperationEntity>();
            tempEntity.OperSeqNo = laserBomChk.LaserBomItem.TypeCol<int>("operation_seq_no");
            erpBomDt = DataContext.StringDataSet("@BarcodeApi.Common.ErpBomList", tempEntity).Tables[0];
            if (erpBomDt.Rows.Count == 0)
                return (ResultEnum.NgDataBase, "@NG_NO_BOM_DATA");//[NG] 자재(BOM) 정보 가 없습니다.

            if (entity.MaterialList?.Count == 0)
            {
                if (erpBomDt.Rows.Count != 0)
                {
                    return (ResultEnum.NgPanelMatNotExists, "@NG_MATERIAL_INFO_NEED");//[NG] 자재 정보가 누락되었습니다.\r\n자재 정보를 다시 입력하여 주십시오.
                }
            }

            var chkRollSplit = CheckLaserRollSplit(entity);
            if (chkRollSplit.resultEnum != ResultEnum.OkPanel || chkRollSplit.dtResult == null)
            {
                return (chkRollSplit.resultEnum, chkRollSplit.remark);
            }

            DataTable erpMaterLotDt = chkRollSplit.dtResult;
            if (erpMaterLotDt.Rows.Count == 0)
                return (ResultEnum.NgPanelMatNotExists, "@NG_MATERIAL_LOT_NOT_FOUND");//[NG] ERP에서 조회된 자재 목록이 없습니다.자재를 다시 한 번 확인하고 4M 재 등록을 진행하여 주십시오.

            string barcodeBomCode = erpMaterLotDt.Rows[0].TypeCol<string>("material_code");
            string bomCode = erpBomDt.Rows[0].TypeCol<string>("item_code");

            if (barcodeBomCode != bomCode)
            {
                string matBomDecription = erpMaterLotDt.Rows[0].TypeCol<string>("material_name");
                string erpBomDecription = erpBomDt.Rows[0].TypeCol<string>("ITEM_DESCRIPTION");

                return (ResultEnum.NgPanelMatNotExists, $"@NG_JAJE_DIFF_ERP^{barcodeBomCode},{matBomDecription}^{bomCode},{erpBomDecription}");//ERP 자재와 Barcode 자재 정보가 맞지 않습니다.
            }

            var chkInsertBom = CheckInsertMaterial(entity, currOperInfo, erpBomDt, erpMaterLotDt);
            if (chkInsertBom.resultEnum != ResultEnum.OkPanel)
                return (chkInsertBom.resultEnum, chkInsertBom.remark);

            var chkInsertTool = CheckInsertTool(entity, currOperInfo, erpBomDt);
            if (chkInsertTool.resultEnum != ResultEnum.OkPanel)
                return (chkInsertTool.resultEnum, chkInsertTool.remark);

            return (ResultEnum.OkPanel, "");
        }

        var firstBomChk = CommonService.FirsOpertMaterialChk(currOperInfo);
        if (firstBomChk.isMB01Chk && firstBomChk.count != 0)
        {
            //200 번째 공정에 있는 자재 코드랑 
            //바코드 들어온애랑 비교해서 맞는지 판단해야하고
            //틀리면 NG리턴 
            //맞으면 return (ResultEnum.OkFirstBarcode, "", "");
            var tempEntity = currOperInfo.Adapt<OperationEntity>();
            tempEntity.OperSeqNo = firstBomChk.operSeqNo;
            erpBomDt = DataContext.StringDataSet("@BarcodeApi.Common.ErpBomList", tempEntity).Tables[0];
            if (erpBomDt.Rows.Count == 0)
                return (ResultEnum.NgDataBase, "@NG_NO_BOM_DATA");//[NG] 자재(BOM) 정보 가 없습니다.

            var chkFirst = CommonService.FirsOpertMaterialChk(currOperInfo);
            if (chkFirst.isFirstOper)
            {
                string rollpanelTypechk = RollPanelTypeCheck(entity);
                if (rollpanelTypechk == "R")
                {
                    //1개가 들어왔는데 롤공정이고 
                    return (ResultEnum.OkPanel, "");
                }
            }

            var chkRollSplit = CheckLaserRollSplit(entity);
            if (chkRollSplit.resultEnum != ResultEnum.OkPanel || chkRollSplit.dtResult == null)
            {
                return (chkRollSplit.resultEnum, chkRollSplit.remark);
            }

            if (entity.MaterialList?.Count == 0)
            {
                if (erpBomDt.Rows.Count != 0)
                {
                    return (ResultEnum.NgPanelMatNotExists, "@NG_MATERIAL_INFO_NEED");//[NG] 자재 정보가 누락되었습니다.\r\n자재 정보를 다시 입력하여 주십시오.
                }
            }

            DataTable erpMaterLotDt = CommonService.ErpMaterialLotList(entity.MaterialList); // 자재 코드 변환
            if (erpMaterLotDt.Rows.Count == 0)
                return (ResultEnum.NgPanelMatNotExists, "@NG_MATERIAL_LOT_NOT_FOUND");//[NG] ERP에서 조회된 자재 목록이 없습니다.자재를 다시 한 번 확인하고 4M 재 등록을 진행하여 주십시오.

            string barcodeBomCode = CommonService.SplitModeCode(erpMaterLotDt.Rows[0].TypeCol<string>("material_code"));
            string bomCode = CommonService.SplitModeCode(erpBomDt.Rows[0].TypeCol<string>("item_code"));

            if (barcodeBomCode != bomCode)
                return (ResultEnum.NgPanelMatNotExists, $"@NG_JAJE_DIFF_ERP^{string.Empty}^{string.Empty}");//ERP 자재와 Barcode 자재 정보가 맞지 않습니다.

            var chkInsertBom = CheckInsertMaterial(entity, currOperInfo, erpBomDt, erpMaterLotDt);
            if (chkInsertBom.resultEnum != ResultEnum.OkPanel)
                return (chkInsertBom.resultEnum, chkInsertBom.remark);

            var chkInsertTool = CheckInsertTool(entity, currOperInfo, erpBomDt);
            if (chkInsertTool.resultEnum != ResultEnum.OkPanel)
                return (chkInsertTool.resultEnum, chkInsertTool.remark);

            return (ResultEnum.OkPanel, "");
        }
        else
        {
            var chkInsertBom = CheckInsertMaterial(entity, currOperInfo, erpBomDt, null);
            if (chkInsertBom.resultEnum != ResultEnum.OkPanel)
                return (chkInsertBom.resultEnum, chkInsertBom.remark);


            var chkInsertTool = CheckInsertTool(entity, currOperInfo, erpBomDt);
            if (chkInsertTool.resultEnum != ResultEnum.OkPanel)
                return (chkInsertTool.resultEnum, chkInsertTool.remark);

            return (ResultEnum.OkPanel, "");
        }
    }

    [ManualMap]
    public static (ResultEnum resultEnum, string? remark) CheckLotProcRework(PanelEntity entity, OperationEntity currOperInfo)
    {
        #region TODO: 공정 확인 

        #region TODO: 공정 존재 확인
        DataTable dtErpOperationChk = DataContext.StringDataSet("@BarcodeApi.Common.ErpOperationCheckList", RefineEntity(currOperInfo)).Tables[0];
        // OperCode 는 같지만 Oper_Seq_Num이 여려개일수 있으므로 List로 가져옴
        List<DataRow> lstOperCodeDtRow = dtErpOperationChk.AsEnumerable()
                                        .Where(x => x.TypeCol<string>("operation_code") == currOperInfo.OperCode
                                                 && x.TypeCol<int>("operation_seq_no") == currOperInfo.OperSeqNo).ToList();
        if (lstOperCodeDtRow.Count == 0)
        {
            return (ResultEnum.NgPanelProcNotExists, "@NG_PROCESS_NO_INFO");//[NG] 조회된 공정이 없습니다.
        }

        #endregion

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;
        //현재 공정의 workorder 중 작은 숫자의 마지막꺼
        DataTable lastOperCode = db.ExecuteStringDataSet("@BarcodeApi.Panel.Panel4MSelect", RefineEntity(currOperInfo)).Tables[0];

        //O 옵션 , Y는 필수 , N 미사용 
        //모델 코드를 가지고 조회 하고 
        DataTable product = DataContext.StringDataSet("@BarcodeApi.Panel.ErpTcardProductName", new { barcode = entity.Workorder }).Tables[0];
        string modelCode = product.Rows[0].TypeCol<string>("bom_item_code");

        //mes 공정확장 기준 정보 가져 오기 
        DataTable baseOperInfoDt = DataContext.StringDataSet("@BarcodeApi.Common.MesBaseOperInfoList", new { modelCode = modelCode }).Tables[0];

        if (baseOperInfoDt.Rows.Count == 0)
        {
            if (lastOperCode.Rows.Count != 0)
            {
                #region TODO: 공정 순서 확인
                int iPrevOperSeqNo = lastOperCode.Rows[0].TypeCol<int>("oper_seq_no");
                bool bIsChk = false;
                if (currOperInfo.OperSeqNo > iPrevOperSeqNo)
                {
                    //공정 순서 판단기준은 
                    //현재 workorder 의 가장 마지막으로 들어온 oper_seq_no 를 가져옴
                    //현재 seq_no 2100 이전 seq_no 2000
                    // 2100 > 2000
                    bIsChk = true;
                }

                #endregion
                //공정확장 기준정보
                //이전 공정 따지는거
                //카운트 가져와서 0이면
                //다 선택되어 있는 공정으로 판단 시키고 진행
                if (iPrevOperSeqNo < currOperInfo.OperSeqNo)
                {
                    DataTable panel4mDt = db.ExecuteStringDataSet("@BarcodeApi.Panel.Panel4MSelect", currOperInfo).Tables[0];
                    if (lastOperCode.Rows.Count != 0)
                    {
                        string sWorkOrder = lastOperCode.Rows[0].TypeCol<string>("workorder");
                        string sOperCode = lastOperCode.Rows[0].TypeCol<string>("oper_code");
                        var dtEndTime = lastOperCode.Rows[0].TypeCol<string>("end_dt");
                        //end_dt 값이 널이 아니면 완료가 되어있는것임
                        if (string.IsNullOrWhiteSpace(dtEndTime))
                        {
                            //이전공정이 완료 되지 않은 경우
                            return (ResultEnum.NgPanelProcOrder, "@NG_OPER_NOT_FINISH");//[NG] 이전 공정이 완료되지 않았습니다.
                        }
                    }
                }
            }
        }
        else if (lastOperCode.Rows.Count != 0)
        {
            #region TODO: 공정 순서 확인
            int iPrevOperSeqNo = lastOperCode.Rows[0].TypeCol<int>("oper_seq_no");
            bool bIsChk = false;
            if (currOperInfo.OperSeqNo > iPrevOperSeqNo)
            {
                //공정 순서 판단기준은 
                //현재 workorder 의 가장 마지막으로 들어온 oper_seq_no 를 가져옴
                //현재 seq_no 2100 이전 seq_no 2000
                // 2100 > 2000
                bIsChk = true;
            }

            if (bIsChk)
            {
                //공정 순서가 맞지 않은 경우 
                //return (ResultEnum.NgPanelProcOrder, "@NG_OPER_SEQ");
            }
            #endregion

            #region  TODO: 이전 공정이 되어 있는지 체크 하기

            // 현재 공정전에 이전공정이 있는경우
            if (iPrevOperSeqNo < currOperInfo.OperSeqNo)
            {
                //oper_yn 으로 y는 필수 , o 스킵
                string operYn = baseOperInfoDt.AsEnumerable().FirstOrDefault(x => x.TypeCol<int>("operation_seq_no") == iPrevOperSeqNo).TypeCol<string>("oper_yn");
                if (operYn == "Y")
                {
                    DataTable panel4mDt = db.ExecuteStringDataSet("@BarcodeApi.Panel.Panel4MSelect", currOperInfo).Tables[0];
                    if (lastOperCode.Rows.Count != 0)
                    {
                        string sWorkOrder = lastOperCode.Rows[0].TypeCol<string>("workorder");
                        string sOperCode = lastOperCode.Rows[0].TypeCol<string>("oper_code");
                        var dtEndTime = lastOperCode.Rows[0].TypeCol<string>("end_dt");
                        //end_dt 값이 널이 아니면 완료가 되어있는것임
                        if (string.IsNullOrWhiteSpace(dtEndTime))
                        {
                            //이전공정이 완료 되지 않은 경우
                            return (ResultEnum.NgPanelProcOrder, "@NG_OPER_NOT_FINISH");//[NG] 이전 공정이 완료되지 않았습니다.
                        }
                    }
                }
            }
            #endregion
        }


        #endregion

        // 자재는 lot 단위로 줄수 있다 . ( 해당 사항 체크 하기 ) 품번의 수량까지 
        // 창고에 들어갔다오면 lot 넘버가 ( 자재 관련으로 ) 생긴다 
        // 나머지는 그냥 t_card 에 된다.
        bool bIsErrBomChk = false;
        List<string> lstErrBomS = new List<string>();

        // erp 에서 자재(BOM) 정보를 가져옴 
        DataTable erpBomDt = DataContext.StringDataSet("@BarcodeApi.Common.ErpBomList", currOperInfo).Tables[0];
        if (erpBomDt.Rows.Count < 0)
        {
            //erp 조회 정보 에러 
            return (ResultEnum.NgDataBase, "@NG_EQP_SCAN_INFO");//[NG] 설비 스캔 정보가 없습니다.
        }

        if (entity.MaterialList?.Count == 0)
        {
            if (erpBomDt.Rows.Count != 0)
            {
                string sMassgage = erpBomDt.Rows[0].TypeCol<string>("ITEM_CODE");
                return (ResultEnum.NgPanelMatNotExists, $"@NG_MATERIAL_ERROR^{sMassgage}");
            }

        }

        var firstBomChk = CommonService.FirsOpertMaterialChk(currOperInfo);
        if (firstBomChk.isMB01Chk && firstBomChk.count != 0)
        {
            //200 번째 공정에 있는 자재 코드랑 
            //바코드 들어온애랑 비교해서 맞는지 판단해야하고
            //틀리면 NG리턴 
            //맞으면 return (ResultEnum.OkFirstBarcode, "", "");
            var tempEntity = currOperInfo.Adapt<OperationEntity>();
            tempEntity.OperSeqNo = firstBomChk.operSeqNo;
            erpBomDt = DataContext.StringDataSet("@BarcodeApi.Common.ErpBomList", tempEntity).Tables[0];
            if (erpBomDt.Rows.Count == 0)
                return (ResultEnum.NgDataBase, "@NG_NO_BOM_DATA");//[NG] 자재(BOM) 정보 가 없습니다.
            DataTable erpMaterLotDt = CommonService.ErpMaterialLotList(entity.MaterialList); // 자재 코드 변환

            if (entity.MaterialList?.Count == 0)
            {
                if (erpBomDt.Rows.Count != 0)
                {
                    return (ResultEnum.NgPanelMatNotExists, "@NG_MATERIAL_INFO_NEED");//[NG] 자재 정보가 누락되었습니다.\r\n자재 정보를 다시 입력하여 주십시오.
                }
            }

            var chkFirst = CommonService.FirsOpertMaterialChk(currOperInfo);
            if (chkFirst.isFirstOper)
            {
                if (baseOperInfoDt.Rows.Count != 0)
                {
                    var scanType = baseOperInfoDt.Rows[0].TypeCol<string>("scan_type");
                    if (scanType == "R")
                    {
                        //1개가 들어왔는데 롤공정이고 
                        return (ResultEnum.OkPanel, "");
                    }
                }
            }

            string barcodeBomCode = erpMaterLotDt.Rows[0].TypeCol<string>("material_code");
            string bomCode = erpBomDt.Rows[0].TypeCol<string>("item_code");

            if (barcodeBomCode != bomCode)
                return (ResultEnum.NgPanelMatNotExists, $"@NG_JAJE_DIFF_ERP^{string.Empty}^{string.Empty}");//[NG] ERP 자재와 Barcode 자재 정보가 맞지 않습니다.

            var chkInsertBom = CheckInsertMaterial(entity, currOperInfo, erpBomDt, erpMaterLotDt);
            if (chkInsertBom.resultEnum != ResultEnum.OkPanel)
                return (chkInsertBom.resultEnum, chkInsertBom.remark);

            var chkInsertTool = CheckInsertTool(entity, currOperInfo, erpBomDt);
            if (chkInsertTool.resultEnum != ResultEnum.OkPanel)
                return (chkInsertTool.resultEnum, chkInsertTool.remark);

            return (ResultEnum.OkPanel, "");
        }
        else
        {
            var chkInsertBom = CheckInsertMaterial(entity, currOperInfo, erpBomDt, null);
            if (chkInsertBom.resultEnum != ResultEnum.OkPanel)
                return (chkInsertBom.resultEnum, chkInsertBom.remark);


            var chkInsertTool = CheckInsertTool(entity, currOperInfo, erpBomDt);
            if (chkInsertTool.resultEnum != ResultEnum.OkPanel)
                return (chkInsertTool.resultEnum, chkInsertTool.remark);

            return (ResultEnum.OkPanel, "");
        }
    }

    /// <summary>
    /// 설비 확인
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    [ManualMap]
    public static (ResultEnum resultEnum, string? remark, Dictionary<string, object>? dicResult) CheckEqp(PanelEntity entity, OperationEntity currOperInfo)
    {
        #region // TODO: 지정설비 확인

        bool bIsErpRecipeChek = false;
        List<string> lstErrErpRecipeS = new List<string>();

        DataTable dtErpOperationChk = DataContext.StringDataSet("@BarcodeApi.Common.ErpOperationCheckList", RefineEntity(currOperInfo)).Tables[0];
        if (dtErpOperationChk.Rows.Count == 0)
            return (ResultEnum.NgDataBase, "@NG_PROCESS_NO_INFO", null);//[NG] 조회된 공정이 없습니다.

        var modelCode = dtErpOperationChk.AsEnumerable()
                 .FirstOrDefault(x => x.TypeCol<int>("operation_seq_no") == currOperInfo.OperSeqNo &&
                                      x.TypeCol<string>("operation_code") == currOperInfo.OperCode).TypeCol<string>("bom_item_code");
        if (modelCode == null)
            return (ResultEnum.NgPanelEqpNotExists, "@NG_MODEL_NOT_IN_PROCESS", null);//[NG] 현재 공정의 모델명을 찾을 수 없습니다.

        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;
        obj.OperSeqNo = currOperInfo.OperSeqNo;
        obj.OperCode = currOperInfo.OperCode;
        DataTable dtErpEqpChk = null;
        string eqpCode = string.Empty;

        dtErpEqpChk = DataContext.StringDataSet("@BarcodeApi.Panel.DesignateEqpList", RefineExpando(obj)).Tables[0];
        if (dtErpEqpChk.Rows.Count == 0)
        {
            //임시 주석
            dtErpEqpChk = DataContext.StringDataSet("@BarcodeApi.Common.ErpEqpCheckList", RefineEntity(currOperInfo)).Tables[0];

            if (entity.EqpList?.Count == 0)
            {
                if (dtErpEqpChk.Rows.Count == 0)
                {
                    //설비가 없다
                    return (ResultEnum.OkPanel, "", null);
                }
                else
                {
                    return (ResultEnum.NgPanelToolNotExists, "@NG_EQP_INFO", null);//[NG] 설비 정보가 맞지 않습니다.
                }
            }

            //바코드에서 받은 장비가 있으면 통과 없으면 return
            //설비 검사부분 체크
            foreach (Dictionary<string, string> eqpList in entity.EqpList)
            {
                if (eqpList.Count == 0)
                    continue;

                eqpCode = eqpList["eqpCode"].ToString();
                if (string.IsNullOrWhiteSpace(eqpCode))
                    continue;
                if (eqpCode == null)
                    return (ResultEnum.NgDataBase, "@NG_EQP_CODE", null);//[NG] 설비 CODE 조회 에러

                var dtRowEqpCode = dtErpEqpChk.AsEnumerable().FirstOrDefault(
                         x => x.TypeCol<int>("OPERATION_SEQ_NO") == currOperInfo.OperSeqNo
                         && x.TypeCol<string>("equipment_code") == eqpCode
                );

                if (dtRowEqpCode == null)
                {
                    lstErrErpRecipeS.Add(eqpCode);
                    bIsErpRecipeChek = true;
                }
            }

            if (bIsErpRecipeChek)
            {
                //Error값 전달 할 거 생각하기 디테일한건 나중에 
                return (ResultEnum.NgPanelEqpNotExists, $"@NG_NOT_MATCHING_OPER_EQP^{entity.OperCode}", null);
                //기존 : [NG] 조회된 설비가 없습니다.
                //변경 : [NG] 현재 등록하려는 공정( {0} )에 맞지 않는 설비입니다.
            }
        }
        else
        {
            //현재 모델의 공정 순서로 지정설비 가져오기 
            var jsonConvert = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(dtErpEqpChk.Rows[0].TypeCol<string>("eqp_json"));

            if (jsonConvert == null)
            {
                #region // TODO: 장비 있는지 확인 

                dtErpEqpChk = DataContext.StringDataSet("@BarcodeApi.Common.ErpEqpCheckList", RefineEntity(currOperInfo)).Tables[0];

                if (entity.EqpList?.Count == 0)
                {
                    if (dtErpEqpChk.Rows.Count == 0)
                    {
                        //설비가 없다
                        return (ResultEnum.OkPanel, "", null);
                    }
                    else
                    {
                        return (ResultEnum.NgPanelToolNotExists, "@NG_EQP_INFO", null);//[NG] 설비 정보가 맞지 않습니다.
                    }
                }

                //바코드에서 받은 장비가 있으면 통과 없으면 return
                foreach (Dictionary<string, string> eqpList in entity.EqpList)
                {
                    if (eqpList.Count == 0)
                        continue;

                    eqpCode = eqpList["eqpCode"].ToString();
                    if (string.IsNullOrWhiteSpace(eqpCode))
                        continue;
                    if (eqpCode == null)
                        return (ResultEnum.NgDataBase, "@NG_EQP_CODE", null);//[NG] 설비 CODE 조회 에러

                    var dtRowEqpCode = dtErpEqpChk.AsEnumerable().FirstOrDefault(
                             x => x.TypeCol<int>("OPERATION_SEQ_NO") == currOperInfo.OperSeqNo
                             && x.TypeCol<string>("equipment_code") == eqpCode
                    );

                    if (dtRowEqpCode == null)
                    {
                        lstErrErpRecipeS.Add(eqpCode);
                        bIsErpRecipeChek = true;
                    }
                }

                if (bIsErpRecipeChek)
                {
                    //Error값 전달 할 거 생각하기 디테일한건 나중에 
                    return (ResultEnum.NgPanelEqpNotExists, "@NG_NO_EQP", null);//[NG] 조회된 설비가 없습니다.
                }

                return (ResultEnum.OkPanel, "", null);
                #endregion
            }



            if (entity.EqpList?.Count == 0)
            {
                if (jsonConvert == null)
                {
                    return (ResultEnum.OkPanel, "", null);
                }
                else
                {
                    return (ResultEnum.NgPanelEqpNotExists, "@NG_EQP_INFO", null);//[NG] 설비 정보가 맞지 않습니다.
                }
            }

            if (dtErpEqpChk.Rows[0].TypeCol<string>("oper_yn") != "N")
            {
                bool isUseYn = false;
                //바코드에서 받은 장비가 있으면 통과 없으면 return
                foreach (Dictionary<string, string> eqpList in entity.EqpList)
                {


                    if (eqpList.Count == 0)
                        continue;

                    eqpCode = eqpList["eqpCode"].ToString();
                    if (string.IsNullOrWhiteSpace(eqpCode))
                        continue;
                    if (eqpCode == null)
                        return (ResultEnum.NgDataBase, "@NG_EQP_CODE", null);//[NG.CheckEqp] 설비 CODE 조회 에러

                    var dtRowEqpCode = jsonConvert.FirstOrDefault(dicItem => dicItem["eqpCode"] == eqpCode);
                    if (dtRowEqpCode == null)
                    {
                        lstErrErpRecipeS.Add(eqpCode);
                        bIsErpRecipeChek = true;
                    }
                    else
                    {
                        //코드관리 추가 siflex 요청
                        //if (CodeService.List("ERROR_PROOF_EQP", null, entity.EqpCode, null, null).Count > 0)
                        //if (entity.EqpList.AsEnumerable().Any(x => CodeService.List("ERROR_PROOF_EQP", null, x["eqpCode"], null, 'Y').Count > 0))
                        if (entity.IsControlModel)
                        {
                            var eqpCodeList = jsonConvert.AsEnumerable().ToList().FindAll(x => x.TypeKey<char>("useYn") == 'Y');
                            //[설비코드]설비명
                            string sMssage = string.Empty;// String.Join(",", eqpCodeList);
                            foreach (var item in eqpCodeList)
                                sMssage += $"[{item.TypeKey<string>("eqpCode")}]{item.TypeKey<string>("eqpDesc")}\r\n";

                            //jjk, 23.08.22 SIFELX 대표 지시 사항으로 임시 주석
                            isUseYn = dtRowEqpCode["useYn"].ToString() == "Y" ? true : false;
                            if (!isUseYn)
                            {
                                return (ResultEnum.NgPanelEqpNotExists, $"@NG_EQP_IS_N^{eqpCode}^{sMssage}", null);//[NG] {eqpCode} 조회된 지정 설비가 'N' 으로 설정되어 있습니다.
                            }
                        }

                    }
                }
            }

            if (bIsErpRecipeChek)
            {
                //코드관리 추가 siflex 요청
                //if (CodeService.List("ERROR_PROOF_EQP", null, entity.EqpCode, null, null).Count > 0)
                //if (entity.EqpList.AsEnumerable().Any(x => CodeService.List("ERROR_PROOF_EQP", null, x["eqpCode"], null, 'Y').Count > 0))
                if (entity.IsControlModel)
                {
                    //jjk, 23.08.22 SIFELX 대표 지시 사항으로 임시 주석
                    ////Error값 전달 할 거 생각하기 디테일한건 나중에 
                    string sMessage = string.Join("\r\n", jsonConvert.AsEnumerable().Select(x => x.TypeKey<string>("eqpCode")));
                    return (ResultEnum.NgPanelEqpNotExists, $"@NG_EQP_IS_NOT_EXIST^{sMessage}", null);
                }
            }
        }

        #endregion

        List<string> lstTest = new List<string>();
        dynamic objRecipeOrParam = new ExpandoObject();
        List<string> resultList = entity.EqpList.SelectMany(dictionary => dictionary.Values).ToList();
        objRecipeOrParam.ModelCode = modelCode;
        objRecipeOrParam.Workorder = currOperInfo.Workorder;
        objRecipeOrParam.OperCode = currOperInfo.OperCode;
        objRecipeOrParam.OperSeqNo = currOperInfo.OperSeqNo;
        objRecipeOrParam.Params = string.Join(',', resultList);
        objRecipeOrParam.RecipeParamJudge = true;


        //파라미터 가불가 여기서 판단
        //코드관리 추가 siflex 요청
        //if (CodeService.List("ERROR_PROOF_EQP", null, entity.EqpCode, null, null).Count > 0)
        //if (entity.EqpList.AsEnumerable().Any(x => CodeService.List("ERROR_PROOF_EQP", null, x["eqpCode"], null, 'Y').Count > 0))
        if (entity.IsControlModel)
        {
            (ResultEnum resultEnum, string remark, Dictionary<string, object> dicResult) chkRecipeChk = CheckInsertBaseRecipe(objRecipeOrParam);
            if (chkRecipeChk.resultEnum != ResultEnum.OkPanel)
                return (chkRecipeChk.resultEnum, chkRecipeChk.remark, chkRecipeChk.dicResult);


            //currOperInfo.RecipeParamJudge
            (ResultEnum resultEnum, string remark, Dictionary<string, object> dicResult) chkParamChk = CheckInsertBaseParam(objRecipeOrParam);
            if (chkParamChk.resultEnum != ResultEnum.OkPanel)
                return (chkParamChk.resultEnum, chkParamChk.remark, chkRecipeChk.dicResult);
        }

        return (ResultEnum.OkPanel, "", null);
    }

    /// <summary>
    /// PANEL 공정 중복 체크
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    [ManualMap]
    public static ResultEnum CheckPanelProc(PanelItemEntity entity)
    {
        // TODO: 공정 중복 확인

        // 정상 리턴
        return ResultEnum.OkPanel;
    }
    [ManualMap]
    public static ResultEnum CheckEqpParam(PanelItemEntity entity)
    {
        // TODO: 설비 파라미터 체크
        // 정상 리턴
        return ResultEnum.OkPanel;
    }

    [ManualMap]
    public static int PanelCountSelect(string panelId)
    {
        dynamic obj = new ExpandoObject();
        obj.PanelId = panelId;

        return DataContext.StringValue<int>("@BarcodeApi.Panel.CountSelect", RefineExpando(obj));
    }
    [ManualMap]
    public static int PieceCountSelect(string pieceId)
    {
        dynamic obj = new ExpandoObject();
        obj.PieceId = pieceId;

        return DataContext.StringValue<int>("@BarcodeApi.Piece.CountSelect", RefineExpando(obj));
    }
    [ManualMap]
    public static int SheetCountSelect(string sheetId)
    {
        dynamic obj = new ExpandoObject();
        obj.SheetId = sheetId;

        return DataContext.StringValue<int>("@BarcodeApi.Sheet.CountSelect", RefineExpando(obj));
    }

    /// <summary>
    /// PDA서 요청하는 프로시저 추가
    /// GNG- 김종절 대표 추가 요청  문의 : 010-8973-8076 연락 요망
    /// </summary>
    /// <param name="barcode"></param>
    /// <param name="barcodeKind"></param>
    /// <param name="action"></param>
    /// <param name="langCode"></param>
    /// <returns></returns>
    [ManualMap]
    public static IResult GetForMData(string deviceId, string barcode, string langCode, string action)
    {
        string remark = string.Empty;
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;
        DataTable dt = new DataTable();
        dynamic operation = new ExpandoObject();
        ResultEnum resultEnum = ResultEnum.NgDataBase;

        int layupCnt = 0;
        // t-card , 설비 카인드 바코드 준다 .
        // 호출 해서 그룹키를 받아서 또한번 호출 하는 

        //1.바코드 보내줌
        //2.카인드 체크함
        var verifiybarcodekind = CommonService.VerifiyBarcodeKind("", barcode, langCode);
        Dictionary<string, object> result = verifiybarcodekind.dicReturn;
        if (result == null)
        {
            result = new Dictionary<string, object>();
            resultEnum = verifiybarcodekind.resultEnum;
            remark = string.Format(CommonService.SetLangCodeRemark(resultEnum, langCode, verifiybarcodekind.remark));
            result.Add("resultEnum", resultEnum.ToCode());
            result.Add("remark", remark);//[NG] 조회 가능한 데이터가 없습니다.
            result.Add("result", false);
            if (!result.ContainsKey("layers"))
                result.Add("layers", layupCnt);
            return Results.Json(result);
        }

        string sBarcodeKind = result["barcodeKind"].ToString();
        if (sBarcodeKind == "EQUIPMENT")
        {
            operation = new ExpandoObject();
            operation.TopNo = 1;
            operation.RowKey = "";
            operation.GroupKey = "";
            operation.Workorder = "";
            operation.OperCode = "";
            operation.OperSeqNo = "";
            operation.EqpCode = result["barcode"].ToString();
            operation.StartDt = "";
            operation.EndDt = "";

            //eqp code 로 tb_panel_4m table 뒤져서 일단 가져오기 덩어리
            // start 기준으로 end 진행중인거 현재 EQP
            dt = db.ExecuteStringDataSet("@BarcodeApi.Panel.PanelGroupKey", RefineEntity(operation)).Tables[0];
            if (dt.Rows.Count == 0)
            {
                resultEnum = ResultEnum.NgGet4MData;
                remark = string.Format(CommonService.SetLangCodeRemark(resultEnum, langCode, "@NG_4M_NOT_RUNNING"));//[NG] 진행중인 4M 작업이 없습니다.
                result.Add("resultEnum", resultEnum.ToCode());
                result.Add("remark", remark);//[NG] 진행중인 4M 작업이 없습니다.
                result.Add("result", false);
                if (!result.ContainsKey("layers"))
                    result.Add("layers", layupCnt);
                return Results.Json(result);
            }

            string sWorkorder = dt.Rows[0].TypeCol<string>("workorder");
            int iOperSeqNo = dt.Rows[0].TypeCol<int>("oper_seq_no");
            DataTable layupDt = DataContext.StringDataSet("@BarcodeApi.Panel.FindBomItemCode", new { workorder = sWorkorder, operSeqNo = iOperSeqNo }).Tables[0];
            if (layupDt.Rows.Count == 0)
                layupCnt = 0;

            var layPtsType = layupDt.AsEnumerable().Where(x => x.TypeCol<string>("PTS_TYPE_LCODE") != "PTS_0" && x.TypeCol<string>("PTS_TYPE_LCODE") != null).ToList();
            if (layPtsType.Count > 0)
            {
                layupCnt = layPtsType.Count + 1;
            }


            //layupCnt = layupDt.Rows.Count + 1;
            if (!result.ContainsKey("layers"))
                result.Add("layers", layupCnt);
        }
        else if (sBarcodeKind == "TCARD")
        {
            //remark = string.Format(LanguageService.LangText("@NG_4M_SEQ_NOT_FOUND_TCARD", CleanLang(langCode)), "");//[NG] 해당 공정 순서로 4M 등록된 T-CARD를 찾을 수 없습니다.

            //eqp code 로 tb_panel_4m table 뒤져서 일단 가져오기 덩어리
            operation = new ExpandoObject();
            operation.TopNo = 1;
            operation.RowKey = "";
            operation.GroupKey = "";
            operation.Workorder = result["barcode"].ToString();
            operation.OperCode = "";
            operation.OperSeqNo = ""; // result.TypeKey<int>("currentOperSeq").ToString(); //임시 주석 처리 jjk,23.07.05
            operation.EqpCode = "";
            operation.StartDt = "";
            operation.EndDt = "";

            dt = db.ExecuteStringDataSet("@BarcodeApi.Panel.PanelGroupKey", RefineEntity(operation)).Tables[0];
            if (dt.Rows.Count == 0)
            {
                //@NG_ALREADY_4M");
                //remark = string.Format(LanguageService.LangText("@NG_ALREADY_4M", CleanLang(langCode)), "");//[NG] 이미 등록처리된 4M 입니다.//@NG_4M_SEQ_NOT_FOUND_TCARD[NG] 해당 공정 순서로 4M 등록된 T-CARD를 찾을 수 없습니다.
                resultEnum = ResultEnum.NgGet4MData;
                remark = string.Format(CommonService.SetLangCodeRemark(resultEnum, langCode, "@NG_4M_COMPLETE"));
                result.Add("resultEnum", resultEnum.ToCode());
                result.Add("remark", remark);
                result.Add("result", false);
                if (!result.ContainsKey("layers"))
                    result.Add("layers", layupCnt);
                return Results.Json(result);
            }

            string sWorkorder = dt.Rows[0].TypeCol<string>("workorder");
            int iOperSeqNo = dt.Rows[0].TypeCol<int>("oper_seq_no");
            DataTable layupDt = DataContext.StringDataSet("@BarcodeApi.Panel.FindBomItemCode", new { workorder = sWorkorder, operSeqNo = iOperSeqNo }).Tables[0];
            if (layupDt.Rows.Count == 0)
                layupCnt = 0;

            var layPtsType = layupDt.AsEnumerable().Where(x => x.TypeCol<string>("PTS_TYPE_LCODE") != "PTS_0" && x.TypeCol<string>("PTS_TYPE_LCODE") != null).ToList();
            if (layPtsType.Count > 0)
            {
                layupCnt = layPtsType.Count + 1;
            }

            if (!result.ContainsKey("layers"))
                result.Add("layers", layupCnt);
        }
        else
        {
            resultEnum = ResultEnum.NgGet4MData;
            remark = string.Format(CommonService.SetLangCodeRemark(resultEnum, langCode, "@NG_BARCODE_NOT_TCARD_EQP"));
            result.Add("resultEnum", resultEnum.ToCode());
            result.Add("remark", remark);//[NG] 현재 Barcode 정보는 T-Card 또는 설비가 아닙니다. 다시 시도하여 주십시오.
            result.Add("result", false);
            result.Add("layers", layupCnt);
            return Results.Json(result);
        }

        operation.GroupKey = dt.Rows[0].TypeCol<string>("group_key");
        string json = db.ExecuteStringScalar<string>("@BarcodeApi.Panel.Panel4MData", RefineEntity(operation));
        if (string.IsNullOrWhiteSpace(json))
        {
            resultEnum = ResultEnum.NgGet4MData;
            remark = string.Format(CommonService.SetLangCodeRemark(resultEnum, langCode, "@NG_4M_COMPLETE"));
            result.Add("resultEnum", resultEnum.ToCode());
            result.Add("remark", remark);//[NG] 해당 작업에 대하여 이미 4M 처리가 완료되었습니다. 다음 작업을 진행하여 주십시오.
            result.Add("result", false);
            if (!result.ContainsKey("layers"))
                result.Add("layers", layupCnt);
            return Results.Json(result);
        }

        resultEnum = ResultEnum.OkGet4MData;
        result.Add("resultEnum", resultEnum.ToCode());
        result.Add("remark", "");
        List<Dictionary<string, object>> jsonResult = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, object>>>(json);
        result.Add("context", jsonResult);
        result.Add("result", true);
        if (!result.ContainsKey("layers"))
            result.Add("layers", layupCnt);
        return Results.Json(result);
    }
    /// <summary>
    /// 코드 값 , 이름 한번에 드롭 다운 형식의 리스트를 표현 하기 위해 추가
    /// 사원, 불량이유 , 변경 사유 , holding 사유 등등 
    /// </summary>
    /// <param name="codeKind"></param>
    /// <param name="langCode"></param>
    /// <param name="parm1"></param>
    /// <returns></returns>
    [ManualMap]
    public static IResult GetCodeList(string deviceId, string codeKind, string langCode, string parm1)
    {

        Dictionary<string, object> dic = new Dictionary<string, object>();
        dic.Add("langCode", langCode);
        dic.Add("codeKind", codeKind);
        dic.Add("parm1", parm1);
        dic.Add("rs_code", "");
        dic.Add("rs_msg", "");
        dic.Add("rs_json", "");

        var result = DataContext.NonQuery("dbo.sp_pda_get_codeList", RefineParam(dic));
        var rs_json = dic.TypeKey<string>("rs_json");
        List<Dictionary<string, object>> jsonResult = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, object>>>(rs_json);
        dic["rs_json"] = jsonResult;

        return Results.Json(dic);
    }

    /// <summary>
    /// 코드 값 , 이름 한번에 드롭 다운 형식의 리스트를 표현 하기 위해 추가
    /// 사원, 불량이유 , 변경 사유 , holding 사유 등등 
    /// </summary>
    /// <param name="codeKind"></param>
    /// <param name="langCode"></param>
    /// <param name="parm1"></param>
    /// <returns></returns>
    [ManualMap]
    public static ResultEntity GetOperList(string deviceId, string langCode, string workorder)
    {
        DataTable dtErpOperationChk = DataContext.StringDataSet("@BarcodeApi.Common.ErpOperationCheckList", new { workorder = workorder }).Tables[0];
        if (dtErpOperationChk.Rows.Count == 0)
        {
            return null;
        }

        return null;
    }

    [ManualMap]
    public static IEnumerable<IDictionary> Panel4MSerachData()
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;
        DataTable dt = new DataTable();
        dynamic operation = new ExpandoObject();
        operation.TopNo = 100;
        operation.RowKey = "";
        operation.GroupKey = "";
        operation.Workorder = "";
        operation.OperCode = "";
        operation.OperSeqNo = "";
        operation.EqpCode = "";
        operation.StartYn = "";
        operation.EndYn = "";

        /*
         * select * from fn_panel_4m_top_select('1','','','','','','','2023-07-15 14:51:22.230','')
            order by create_dt desc
         */

        dt = db.ExecuteStringDataSet("@BarcodeApi.Panel.Panel4MSelect", RefineEntity(operation)).Tables[0];


        return ToList(dt);
    }

    [ManualMap]
    public static IResult VerfiyPvRvNg(string deviceId, string langCode, string eqpCode)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { langCode, eqpCode });
        List<Dictionary<string, object>> lstResultValue = new List<Dictionary<string, object>>();
        Dictionary<string, object> resultValue = new Dictionary<string, object>();

        // 모델별 로더제어, codegroup_id = 'LOADER_CONTROL_BY_MODEL'에 등록되지 않은 모델이면 정상값 빈 배열(OK) 리턴
        //DataTable findModelData = DataContext.StringDataSet("@BarcodeApi.Panel.LoaderControlByModel", new { eqpCode }).Tables[0];
        //if (findModelData.Rows[0].TypeCol<int>("cnt") == 0)
        //    return Results.Json(lstResultValue);

        /*
        로더제어 마스터
        1. 마스터 On일 경우 전체 대상으로 검사

        2. 마스터 Off일 경우
            2-1. MODEL_LOADER - OFF > 빈배열 리턴
            2-2. On일 경우 -> 모델이 있나 확인(code_id = '모델명' and useYn = 'Y') 없을 경우 빈 배열 리턴
            2-3. Off일 경우 빈 배열 리턴
         */
        DataTable masterLoaderOnOff = DataContext.StringDataSet("@BarcodeApi.Panel.OnOffMasterLoader", new { eqpCode }).Tables[0];
        if (masterLoaderOnOff.Rows[0].TypeCol<int>("cnt") == 0)
        {
            // Master Off(0) 일 경우 > Model On인지 확인


            //model_loader off일 경우 무조건 합격 (빈배열)
            DataTable loaderOnOff = DataContext.StringDataSet("@BarcodeApi.Panel.OnOffModelLoader", new { eqpCode }).Tables[0];
            if (loaderOnOff.Rows[0].TypeCol<int>("cnt") == 0)
                return Results.Json(lstResultValue);

            //Model Loader On일 경우에 모델 검사
            DataTable findModelData = DataContext.StringDataSet("@BarcodeApi.Panel.LoaderControlByModel", new { eqpCode }).Tables[0];
            if (findModelData.Rows[0].TypeCol<int>("cnt") == 0) //모델이 없거나 useYn = 'N'인 경우
                return Results.Json(lstResultValue);

        }

        DataSet dtPvRvds = DataContext.DataSet("dbo.sp_param_recipe_judge_by_eqp_code", new { eqpCode = eqpCode });
        if (dtPvRvds.Tables.Count > 1)
        {
            DataTable dtTableNgCount = dtPvRvds.Tables[0];
            if (dtTableNgCount.Rows.Count == 0) { }

            resultValue.Add("judge", dtTableNgCount.Rows[0].TypeCol<string>("judge"));
            resultValue.Add("ng_cnt", dtTableNgCount.Rows[0].TypeCol<string>("ng_cnt"));

            DataTable dtTable = dtPvRvds.Tables[1];
            if (dtTable.Rows.Count == 0) { }

            if (dtTableNgCount.Rows[0].TypeCol<string>("judge").ToUpper() == "OK")
            {
                return Results.Json(lstResultValue);
            }

            var json = JsonConvert.SerializeObject(ToDic(dtTable));
            var dicTypeJson = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(json);


            foreach (Dictionary<string, object> dicItem in dicTypeJson)
            {

                //SPC , CHEMICAL ,
                string rpType = dicItem.TypeKey<string>("rpType");
                string rpName = dicItem.TypeKey<string>("rpName");
                double baseVal = dicItem.TypeKey<double>("baseVal");
                double lsl = dicItem.TypeKey<double>("lsl");
                double usl = dicItem.TypeKey<double>("usl");
                double minVal = dicItem.TypeKey<double>("minVal");
                double maxVal = dicItem.TypeKey<double>("maxVal");
                double avgVal = dicItem.TypeKey<double>("avgVal");

                //string sMessage = $"[NG] {rpType} Error\r\n" +
                //                  $"- 설비코드 : {eqpCode} , 설비이름: {rpName}\r\n" +
                //                  $"- 기준값 : {baseVal}\r\n" +
                //                  $"- 측정값 :\r\n" +
                //                  $"     LSL : {lsl}, USL: {usl}\r\n " +
                //                  $"    MIN : {minVal} , MAX: {maxVal} , AVG: {avgVal}";

                if (rpType == "SPC")
                {
                    dicItem.Add("remark", "@LOADER_ERROR_SPC");
                }
                else if (rpType == "CHEMICAL")
                {
                    dicItem.Add("remark", "@LOADER_ERROR_CHEMICAL");
                }
                else
                    dicItem.Add("remark", "");
                //else if (rpType == "PV")
                //    dicItem.Add("remark", sMessage);
                //else if (rpType == "RV")
                //    dicItem.Add("remark", sMessage);

            }

            lstResultValue = dicTypeJson;
        }

        return Results.Json(lstResultValue);
    }



    [ManualMap]
    public static int PanelItemControll(string startPanel, string workorder, int operSeqNo, int startNum, int endNum, string s)
    {
        DataTable ptsData = DataContext.StringDataSet("@BarcodeApi.Panel.PanelItemControlSelect", new { workorder, operSeqNo }).Tables[0];
        string groupKey = ptsData.Rows[0].TypeCol<string>("group_key");
        string deviceId = ptsData.Rows[0].TypeCol<string>("device_id");
        string eqpCode = ptsData.Rows[0].TypeCol<string>("eqp_code");
        DateTime startDt = ptsData.Rows[0].TypeCol<DateTime>("start_dt");
        DateTime endDt = ptsData.Rows[0].TypeCol<DateTime>("end_dt");


        int deleteCnt = DataContext.StringNonQuery("@BarcodeApi.Panel.PanelItemControlDelete", new { groupKey });


        Random rand = new Random();

        int ranA = rand.Next(3, 10);
        int ranB = rand.Next(3, 10);

        TimeSpan gap = (endDt.AddMinutes(-ranA) - startDt.AddMinutes(ranB)) / Math.Abs(startNum - endNum);

        DateTime standard = startDt.AddMinutes(ranB);


        //롤 판넬 각인
        //TimeSpan gap = (endDt.AddMinutes(-6) - startDt.AddSeconds(120)) / Math.Abs(startNum - endNum);

        //DateTime standard = startDt.AddSeconds(120); 

        int cnt = 0;

        if (s == "+")
        {
            for (int i = startNum; i <= endNum; i++)
            {
                string id = NewShortId();

                string panelNum = String.Format("{0:D3}", i);
                string panel = startPanel + "-" + panelNum;
                DateTime scanDt = standard.AddMinutes(-ranB).AddSeconds(-(ranA * 7));

                dynamic obj = new ExpandoObject();
                obj.ItemKey = id;
                obj.PanelGroupKey = groupKey;
                obj.DeviceId = deviceId;
                obj.EqpCode = eqpCode;
                obj.PanelId = panel;
                obj.ScanDt = scanDt;
                obj.CreateDt = standard;


                cnt += DataContext.StringNonQuery("@BarcodeApi.Panel.PanelItemControl", RefineExpando(obj));


                standard += gap;
            }
        }
        else if (s == "-")
        {
            for (int i = endNum; i >= startNum; i--)
            {
                string id = NewShortId();

                string panelNum = String.Format("{0:D3}", i);
                string panel = startPanel + "-" + panelNum;
                DateTime scanDt = standard.AddMinutes(-ranB).AddSeconds(-(ranA * 7));

                dynamic obj = new ExpandoObject();
                obj.ItemKey = id;
                obj.PanelGroupKey = groupKey;
                obj.DeviceId = deviceId;
                obj.EqpCode = eqpCode;
                obj.PanelId = panel;
                obj.ScanDt = scanDt;
                obj.CreateDt = standard;


                cnt += DataContext.StringNonQuery("@BarcodeApi.Panel.PanelItemControl", RefineExpando(obj));


                standard += gap;
            }
        }
        return cnt;
    }

    [ManualMap]
    public static int PanelItemControll2([FromBody] Dictionary<string, object?> value)
    {

        var param = value.ToCleanDic().ToDictionary(x => x.Key, y => y.Value!);

        string startPanel = param.TypeKey<string>("startPanel");
        string workorder = param.TypeKey<string>("workorder");
        int operSeqNo = param.TypeKey<int>("operSeqNo");
        int startNum = param.TypeKey<int>("startNum");
        int endNum = param.TypeKey<int>("endNum");
        string s = param.TypeKey<string>("s");


        DataTable ptsData = DataContext.StringDataSet("@BarcodeApi.Panel.PanelItemControlSelect", new { workorder, operSeqNo }).Tables[0];
        string groupKey = ptsData.Rows[0].TypeCol<string>("group_key");
        string deviceId = ptsData.Rows[0].TypeCol<string>("device_id");
        string eqpCode = ptsData.Rows[0].TypeCol<string>("eqp_code");
        DateTime startDt = ptsData.Rows[0].TypeCol<DateTime>("start_dt");
        DateTime endDt = ptsData.Rows[0].TypeCol<DateTime>("end_dt");


        int deleteCnt = DataContext.StringNonQuery("@BarcodeApi.Panel.PanelItemControlDelete", new { groupKey });


        Random rand = new Random();

        int ranA = rand.Next(3, 10);
        int ranB = rand.Next(3, 10);

        TimeSpan gap = (endDt.AddMinutes(-ranA) - startDt.AddMinutes(ranB)) / Math.Abs(startNum - endNum);

        DateTime standard = startDt.AddMinutes(ranB);


        //롤 판넬 각인
        //TimeSpan gap = (endDt.AddMinutes(-6) - startDt.AddSeconds(120)) / Math.Abs(startNum - endNum);

        //DateTime standard = startDt.AddSeconds(120); 

        int cnt = 0;

        if (s == "+")
        {
            for (int i = startNum; i <= endNum; i++)
            {
                string id = NewShortId();

                string panelNum = String.Format("{0:D3}", i);
                string panel = startPanel + "-" + panelNum;
                DateTime scanDt = standard.AddMinutes(-ranB).AddSeconds(-(ranA * 7));

                dynamic obj = new ExpandoObject();
                obj.ItemKey = id;
                obj.PanelGroupKey = groupKey;
                obj.DeviceId = deviceId;
                obj.EqpCode = eqpCode;
                obj.PanelId = panel;
                obj.ScanDt = scanDt;
                obj.CreateDt = standard;


                cnt += DataContext.StringNonQuery("@BarcodeApi.Panel.PanelItemControl", RefineExpando(obj));


                standard += gap;
            }
        }
        else if (s == "-")
        {
            for (int i = endNum; i >= startNum; i--)
            {
                string id = NewShortId();

                string panelNum = String.Format("{0:D3}", i);
                string panel = startPanel + "-" + panelNum;
                DateTime scanDt = standard.AddMinutes(-ranB).AddSeconds(-(ranA * 7));

                dynamic obj = new ExpandoObject();
                obj.ItemKey = id;
                obj.PanelGroupKey = groupKey;
                obj.DeviceId = deviceId;
                obj.EqpCode = eqpCode;
                obj.PanelId = panel;
                obj.ScanDt = scanDt;
                obj.CreateDt = standard;


                cnt += DataContext.StringNonQuery("@BarcodeApi.Panel.PanelItemControl", RefineExpando(obj));


                standard += gap;
            }
        }
        return cnt;
    }


    [ManualMap]
    public static int PanelRealtimeControll(string startPanel, string workorder, int startNum, int endNum)
    {

        DataTable model = DataContext.StringDataSet("@BarcodeApi.Panel.PanelRealtimeControlBom", new { workorder }).Tables[0];
        string modelCode = model.Rows[0].TypeCol<string>("model_code");

        int cnt = 0;

        for (int i = startNum; i <= endNum; i++)
        {

            string panelNum = String.Format("{0:D3}", i);
            string panel = startPanel + "-" + panelNum;

            dynamic obj = new ExpandoObject();
            obj.PanelId = panel;
            obj.Workorder = workorder;
            obj.ModelCode = modelCode;

            cnt += DataContext.StringNonQuery("@BarcodeApi.Panel.PanelRealtimeControlInsert", RefineExpando(obj));
        }

        return cnt;
    }

    [ManualMap]
    public static int PanelRealtimeControll2([FromBody] Dictionary<string, object?> value)
    {

        var param = value.ToCleanDic().ToDictionary(x => x.Key, y => y.Value!);

        string workorder = param.TypeKey<string>("workorder");
        string startPanel = param.TypeKey<string>("startPanel");
        int startNum = param.TypeKey<int>("startNum");
        int endNum = param.TypeKey<int>("endNum");

        DataTable model = DataContext.StringDataSet("@BarcodeApi.Panel.PanelRealtimeControlBom", new { workorder }).Tables[0];
        string modelCode = model.Rows[0].TypeCol<string>("model_code");

        int cnt = 0;

        for (int i = startNum; i <= endNum; i++)
        {

            string panelNum = String.Format("{0:D3}", i);
            string panel = startPanel + "-" + panelNum;

            dynamic obj = new ExpandoObject();
            obj.PanelId = panel;
            obj.Workorder = workorder;
            obj.ModelCode = modelCode;

            cnt += DataContext.StringNonQuery("@BarcodeApi.Panel.PanelRealtimeControlInsert", RefineExpando(obj));
        }

        return cnt;
    }

    [ManualMap]
    public static int PanelRollMappingConroll(string rollId, string workorder, int operSeqNo, string operCode, string startPanel, int startNum, int endNum)
    {
        DataTable ptsData = DataContext.StringDataSet("@BarcodeApi.Panel.PanelItemControlSelect", new { workorder, operSeqNo }).Tables[0];
        string groupKey = ptsData.Rows[0].TypeCol<string>("group_key");
        string deviceId = ptsData.Rows[0].TypeCol<string>("device_id");
        string eqpCode = ptsData.Rows[0].TypeCol<string>("eqp_code");
        DateTime startDt = ptsData.Rows[0].TypeCol<DateTime>("start_dt");
        DateTime endDt = ptsData.Rows[0].TypeCol<DateTime>("end_dt");


        Random rand = new Random();

        int ranA = rand.Next(3, 10);
        int ranB = rand.Next(3, 10);

        TimeSpan gap = (endDt.AddMinutes(-ranA) - startDt.AddMinutes(ranB)) / Math.Abs(startNum - endNum);

        DateTime standard = startDt.AddMinutes(ranB);

        int cnt = 0;

        for (int i = startNum; i <= endNum; i++)
        {
            string panelNum = String.Format("{0:D3}", i);
            string panel = startPanel + "-" + panelNum;
            DateTime scanDt = standard.AddMinutes(-ranB).AddSeconds(-(ranA * 7));

            dynamic obj = new ExpandoObject();
            obj.RollId = rollId;
            obj.PanelId = panel;
            obj.Workorder = workorder;
            obj.OperSeqNo = operSeqNo;
            obj.OperCode = operCode;
            obj.EqpCode = eqpCode;
            obj.DeviceId = deviceId;
            obj.ScanDt = scanDt;
            obj.CreateDt = standard;

            cnt += DataContext.StringNonQuery("@BarcodeApi.Panel.RollPanelMappingInsert", RefineExpando(obj));

            standard += gap;
        }

        return cnt;
    }

    [ManualMap]
    public static int PanelRollMappingConroll2([FromBody] Dictionary<string, object?> value)
    {

        var param = value.ToCleanDic().ToDictionary(x => x.Key, y => y.Value!);

        string rollId = param.TypeKey<string>("rollId");
        string workorder = param.TypeKey<string>("workorder");
        int operSeqNo = param.TypeKey<int>("operSeqNo");
        string operCode = param.TypeKey<string>("operCode");
        string startPanel = param.TypeKey<string>("startPanel");
        int startNum = param.TypeKey<int>("startNum");
        int endNum = param.TypeKey<int>("endNum");

        DataTable ptsData = DataContext.StringDataSet("@BarcodeApi.Panel.PanelItemControlSelect", new { workorder, operSeqNo }).Tables[0];
        string groupKey = ptsData.Rows[0].TypeCol<string>("group_key");
        string deviceId = ptsData.Rows[0].TypeCol<string>("device_id");
        string eqpCode = ptsData.Rows[0].TypeCol<string>("eqp_code");
        DateTime startDt = ptsData.Rows[0].TypeCol<DateTime>("start_dt");
        DateTime endDt = ptsData.Rows[0].TypeCol<DateTime>("end_dt");


        Random rand = new Random();

        int ranA = rand.Next(3, 10);
        int ranB = rand.Next(3, 10);

        TimeSpan gap = (endDt.AddMinutes(-ranA) - startDt.AddMinutes(ranB)) / Math.Abs(startNum - endNum);

        DateTime standard = startDt.AddMinutes(ranB);

        int cnt = 0;

        for (int i = startNum; i <= endNum; i++)
        {
            string panelNum = String.Format("{0:D3}", i);
            string panel = startPanel + "-" + panelNum;
            DateTime scanDt = standard.AddMinutes(-ranB).AddSeconds(-(ranA * 7));

            dynamic obj = new ExpandoObject();
            obj.RollId = rollId;
            obj.PanelId = panel;
            obj.Workorder = workorder;
            obj.OperSeqNo = operSeqNo;
            obj.OperCode = operCode;
            obj.EqpCode = eqpCode;
            obj.DeviceId = deviceId;
            obj.ScanDt = scanDt;
            obj.CreateDt = standard;

            cnt += DataContext.StringNonQuery("@BarcodeApi.Panel.RollPanelMappingInsert", RefineExpando(obj));

            standard += gap;
        }

        return cnt;
    }


}