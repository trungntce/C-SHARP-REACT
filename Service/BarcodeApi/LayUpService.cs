namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading;
using Framework;
using Google.Protobuf.Collections;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Migrations;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.SwaggerGen;
using Unity.Policy;

public class LayUpService : MinimalApiService, IMinimalApi
{
    public LayUpService(ILogger<LayUpService> logger) : base(logger)
    {

    }


    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    public static ResultEntity Insert([FromBody] List<Dictionary<string, object>> entity)
    {
        var langCode = entity[0].TypeKey<string>("langCode");
        var deviceId = entity[0].TypeKey<string>("deviceId");

        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { entity });
        dynamic resultObj = new ExpandoObject();
        resultObj.DeviceId = deviceId;

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;
        Dictionary<string, object> dicGroupKey = new Dictionary<string, object>();
        dicGroupKey.Add("rowKey", "");
        dicGroupKey.Add("groupKey", entity[0].TypeKey<string>("panelGroupKey"));
        dicGroupKey.Add("workorder", "");
        dicGroupKey.Add("operCode", "");
        dicGroupKey.Add("operSeqNo", "");
        dicGroupKey.Add("eqpCode", "");
        dicGroupKey.Add("startYn", "");
        dicGroupKey.Add("endYn", "");

        DataTable lastOperCode = db.ExecuteStringDataSet("@BarcodeApi.Panel.Panel4MSelect", RefineParam(dicGroupKey)).Tables[0];
        if (lastOperCode.Rows.Count == 0)
            return new(null, historyNo, ResultEnum.NgDataBase, langCode, $"@NG_4M_NOT_FOUND");//[NG] 등록된 PANEL 정보가 없습니다.

        dicGroupKey["operSeqNo"] = lastOperCode.Rows[0].TypeCol<int>("oper_seq_no");
        string panelGroupKeyWorkorder = lastOperCode.Rows[0].TypeCol<string>("workorder");
        resultObj.Workorder = panelGroupKeyWorkorder;
        resultObj.OperSeqNo = lastOperCode.Rows[0].TypeCol<int>("oper_seq_no");
        resultObj.OperCode = lastOperCode.Rows[0].TypeCol<string>("oper_code");
        resultObj.EqpCode = lastOperCode.Rows[0].TypeCol<string>("eqp_code");
        resultObj.DeviceId = deviceId;
        resultObj.ScanDt = lastOperCode.Rows[0].TypeCol<DateTime>("scan_dt");
        resultObj.ModelItemCode = lastOperCode.Rows[0].TypeCol<string>("model_item_code");

        List<string> modelCodelist = new List<string>();
        for (int i = 0; i < entity.Count; i++)
        {
            Dictionary<string, object> panelInfo = entity[i];
            DataTable dtPanelSerach = DataContext.StringDataSet("@BarcodeApi.Panel.LayupModelCode", new { panelId = panelInfo.TypeKey<string>("panelId") }).Tables[0];
            if (dtPanelSerach.Rows.Count == 0)
                return new(null, historyNo, ResultEnum.NgDataBase, langCode, $"@NG_PANEL_NOT_FOUND");//[NG] 등록된 PANEL 정보가 없습니다.

            modelCodelist.Add(CommonService.SplitModeCode(dtPanelSerach.Rows[0].TypeCol<string>("model_code")));
        }

        var compare1 = modelCodelist.Distinct().ToList();
        if (entity.Count != compare1.Count)
        {
            return new(null, historyNo, ResultEnum.NgDataBase, langCode, $"@NG_SAME_LAYUP"); ;//[NG] 같은 층의 제품을 적층할 수 없습니다.
        }

        List<Dictionary<string, object>> returnValue = new List<Dictionary<string, object>>();
        int count = 1;
        foreach (var panelInfo in entity)
        {
            int paneCnt = DataContext.StringValue<int>("@BarcodeApi.Panel.LayupPanelIdCheck", new { panelId = panelInfo.TypeKey<string>("panelId") });
            if (paneCnt > 0)
                return new(null, historyNo, ResultEnum.NgDataBase, langCode, $"@NG_ADD_LAYUP");//[NG] layup 등록이 완료된 Panel 입니다.

            //현재 groupKey의 lot의 erp현재 공정을 확인하고 layup 공정이 아닌경우 예외 
            DataTable erpNowOperDt = DataContext.StringDataSet("@BarcodeApi.Panel.ErpNowOper", new { barcode = resultObj.Workorder }).Tables[0];
            if (erpNowOperDt.Rows.Count == 0)
                return new(null, historyNo, ResultEnum.NgDataBase, langCode, $"@NG_NO_DATA_EXIST");//[NG] [작업공순 오류]\r\n시스템의 기준정보와 비교 결과, 입력된 T-CARD의 작업순서가현재공정인 LAYER-UP과 맞지 않습니다.
                                                                                                   //\r\n T-CARD 입력이 정확한지다시한번 확인하시고, 그래도 해결되지 않을 경우 관리자에게 문의하시기 바랍니다.

            //operation_seq_no,  operation_description   10000
            int sOperSeqNo = erpNowOperDt.Rows[0].TypeCol<int>("operation_seq_no");
            string sOperDescription = panelInfo.TypeKey<string>("langCode") == "ko-KR"
                ? erpNowOperDt.Rows[0].TypeCol<string>("operation_description")
                : erpNowOperDt.Rows[0].TypeCol<string>("operation_description_tl");

            var getMapCode = CodeService.GetMap("LAYUP_OPER_CODE_LIST");
            var layupOperCodeChk = getMapCode.AsEnumerable().Any(x => x.Label == resultObj.OperCode);
            if (!layupOperCodeChk)
                return new(null, historyNo, ResultEnum.NgDataBase, langCode, $"@NG_LAYUP_OPER^{sOperSeqNo + "/" + sOperDescription}");//등록하신 현재 공정은 { 0}입니다.Layup 공정 순서와 다릅니다. 공정 순서를 다시한번 확인하여 주십시오.

            //2600      H03020
            Dictionary<string, object> panelList = new Dictionary<string, object>();
            var panelId = panelInfo.TypeKey<string>("panelId");
            //var panelGroupKey = panelInfo.TypeKey<string>("panelGroupKey");
            //DataTable workorderData = DataContext.StringDataSet("@BarcodeApi.Panel.FindWorkOrder", new { panelId, panelGroupKey }).Tables[0];
            //if (workorderData.Rows.Count == 0)
            //{
            //    //panelId, panelGroupKey로 검색되는  workorder 데이터 없음
            //    return new(historyNo, ResultEnum.NgDataBase, langCode , $"@NG_WORKORDER_NOT_FOUND");//[NG] 워크오더 정보를 찾을 수 없습니다.
            //}

            //DataTable workorderData = DataContext.StringDataSet("@BarcodeApi.Panel.LayupModelCode", new { panelId = panelInfo.TypeKey<string>("panelId") }).Tables[0];
            //if (workorderData.Rows.Count == 0)
            //{
            //    //panelId, panelGroupKey로 검색되는  workorder 데이터 없음
            //    return new(null, historyNo, ResultEnum.NgDataBase, langCode, $"@NG_WORKORDER_NOT_FOUND");//[NG] 워크오더 정보를 찾을 수 없습니다.
            //}
            //var workorder = workorderData.Rows[0].TypeCol<string>("workorder");

            DataTable modelCodeData = DataContext.StringDataSet("@BarcodeApi.Panel.LayupModelCode", new { panelId = panelInfo.TypeKey<string>("panelId") }).Tables[0];
            if (modelCodeData.Rows.Count == 0)
            {
                //panelId, panelGroupKey로 검색되는  workorder 데이터 없음
                return new(null, historyNo, ResultEnum.NgDataBase, langCode, $"@NG_WORKORDER_NOT_FOUND");//[NG] 워크오더 정보를 찾을 수 없습니다.
            }
            var modelCode = modelCodeData.Rows[0].TypeCol<string>("model_code");

            //            if (panelGroupKeyWorkorder.Equals(modelCode))

            if (resultObj.ModelItemCode.Equals(modelCode))
            {
                int operseqno = dicGroupKey.TypeKey<int>("operSeqNo");
                DataTable dtBoiitem = DataContext.StringDataSet("@BarcodeApi.Panel.FindBomItemCode", new { workorder = panelGroupKeyWorkorder, OperSeqNo = operseqno }).Tables[0];
                var layPtsType = dtBoiitem.AsEnumerable().Where(x => x.TypeCol<string>("PTS_TYPE_LCODE") != "PTS_0" && x.TypeCol<string>("PTS_TYPE_LCODE") != null).ToList();
                if (layPtsType.Count == 0)
                    continue;

                if (dtBoiitem.Rows.Count == 0)
                {
                    //bom id seq_time, workorder 맞는 bomId 없어서 리턴
                    return new(null, historyNo, ResultEnum.NgDataBase, langCode, $"@NG_BOMID_NOT_FOUND");//[NG] BOM ID를 찾을 수 없습니다.
                }

                if (dtBoiitem.Rows.Count != modelCodelist.Count - 1)
                {
                    return new(null, historyNo, ResultEnum.NgDataBase, langCode, $"@NG_LAYUP_COUNT_ERROR");//[NG] 적층 PANEL 수량이 일치 하지 않습니다.
                }

                foreach (DataRow dtRowBomItem in dtBoiitem.Rows)
                {
                    string sBomItemCode = CommonService.SplitModeCode(dtRowBomItem.TypeCol<string>("BOM_ITEM_CODE"));
                    string sBomItemCodeA = dtRowBomItem.TypeCol<string>("BOM_ITEM_ID_A");
                    string sBomItemCodeB = CommonService.SplitModeCode(dtRowBomItem.TypeCol<string>("BOM_ITEM_ID_B"));
                    string? sPtsType = dtRowBomItem.TypeCol<string>("PTS_TYPE_LCODE");

                    if (string.IsNullOrWhiteSpace(sPtsType) || sPtsType == "PTS_0")
                        continue;

                    foreach (string modelBomItemCode in modelCodelist)
                    {
                        //mian 작지 제품 코드 // 판넬 model 코드 , 적층 대상의 아이템 코드 // 판넬 model 코드 
                        if (!((sBomItemCode == modelBomItemCode) || sBomItemCodeB == modelBomItemCode))
                            return new(null, historyNo, ResultEnum.NgDataBase, langCode, $"@NG_ANOTHER_LAYUP");//[NG] 서로 다른 제품을 적층 할 수 없습니다.
                    }
                }

                panelList.Add("panelId", panelId);
                panelList.Add("layerIndex", count);
                panelList.Add("mainYn", "Y");
            }
            else
            {
                panelList.Add("panelId", panelId);
                panelList.Add("layerIndex", count);
                panelList.Add("mainYn", "N");
                returnValue.Add(panelList);
                continue;
            }
            returnValue.Add(panelList);
            count++;
        }

        bool chkMain = false;
        //둘다 main 이 아닌경우 리턴?
        foreach (var panelidList in returnValue)
        {
            Dictionary<string, object> panelIdItem = panelidList;
            if (panelIdItem.TypeKey<string>("mainYn") == "Y")
            {
                chkMain = true;
                break;
            }
        }

        if (!chkMain)
            return new(null, historyNo, ResultEnum.NgDataBase, langCode, $"@NG_NO_MAIN_LAYER");//[NG] 등록된 PANEL 정보에 Main 층이 없습니다.

        var json = JsonConvert.SerializeObject(returnValue);
        resultObj.PanelList = json;


        var resultDt = DataContext.DataSet("dbo.sp_panel_layup_insert", RefineExpando(resultObj)).Tables[0];

        return new(null, historyNo, ResultEnum.OkPanel, langCode, $"@OK_PANEL_LAYUP");//[OK] 레이어 적층 제품 검증 완료
    }


    // DataTable baseOperInfoDt = DataContext.StringDataSet("@BarcodeApi.Common.ErpBomList", RefineEntity(currOper)).Tables[0];
    [ManualMap]
    //    public static Dictionary<string, object> VerifyLayer(string panelId)
    public static String VerifyLayer(string panelId)
    {
        //panelid 여러개로 들어옴

        /*
         SELECT * FROM tb_panel_realtime;
                workorder / string
         */


        DataTable panelData = DataContext.StringDataSet("@BarcodeApi.Panel.PanelRealtimeExist", new { panelId }).Tables[0];
        if (panelData.Rows.Count == 0)
        {
            //return false;
            //realtime 테이블에 판넬 데이터 없음
            return "realtime 테이블에 판넬 데이터 없음";
        }

        //워크오더임
        string barcode = panelData.Rows[0].TypeCol<string>("workorder");

        /**
         *      where workorder = barcode
         *      job_id job_no   job_status_code operation_seq_no    operation_code  operation_description
         *              str            R /              int
         */

        DataTable workorderData = DataContext.StringDataSet("@BarcodeApi.Panel.ErpNowOper", new { barcode }).Tables[0];
        if (workorderData.Rows.Count == 0)
        {
            //workorder 테이블에 조회 데이터 없음
            //return false;
            return "workorder 테이블에 조회 데이터 없음";
        }



        if (workorderData.Rows[0].TypeCol<string>("operation_seq_no") == null)
        {
            //시퀀스넘버 없음
            //return false;
            return "워크오더 시퀀스넘버 없음";
        }

        string operationSeqNo = workorderData.Rows[0].TypeCol<string>("operation_seq_no");


        DataTable layers = DataContext.StringDataSet("@BarcodeApi.Panel.LayerListCheck", new { barcode, operationSeqNo }).Tables[0];
        if (layers.Rows.Count == 0)
        {
            //적층 레이어 조회 결과 없음
            return "적층 레이어 조회 결과가 없음";
        }

        /**
         * where workorder(jobno) = barcode and operation_seq_no = operSeqNo
         * 
         * JOB_ID   JOB_NO  OPERATION_SEQ_NO    INVENTORY_ITEM_ID   ITEM_CODE   ITEM_DESCRIPTION    LAYER_NO    MAIN_BASE_FLAG  BARCODE_USE_FLAG
         *  INT     STR     INT                 INT                     STR         STR             NO          Y/N                 Y/N
         */


        //DataTable layers = new DataTable();


        //layers.Columns.Add("job_id", typeof(int));
        //layers.Columns.Add("job_no", typeof(string));
        //layers.Columns.Add("operation_seq_no", typeof(int));
        //layers.Columns.Add("inventory_item_id", typeof(int));
        //layers.Columns.Add("item_code", typeof(string));
        //layers.Columns.Add("item_description", typeof(string));
        //layers.Columns.Add("layer_no", typeof(object));
        //layers.Columns.Add("main_base_flag", typeof(string));

        //layers.Rows.Add(new Object[] { 1231231, "asdf1234", 100, 1, "aaa", "description", 4, "Y" });
        //layers.Rows.Add(new Object[] { 1231231, "asdf1234", 100, 1, "bbb", "description", 2, null });
        //layers.Rows.Add(new Object[] { 1231231, "asdf1234", 100, 1, "ccc", "description", 3, "N" });
        //layers.Rows.Add(new Object[] { 1231231, "asdf1234", 100, 1, "ddd", "description", 1, "N" });



        List<int> layerOriginal = new List<int>();
        List<int> layerCompare = new List<int>();

        var layerNull = false;
        var flagNull = false;
        var flagCount = 0;
        foreach (DataRow row in layers.Rows)
        {
            var useFlag = row.Field<object>("barcode_use_flag");

            if (useFlag != "Y")
            {
                return "바코드로 선정되지 않은 판넬이 존재합니다.";
            }

            var layerNo = row.Field<object>("layer_no");

            if (layerNo == null)
            {
                layerNull = true;
            }

            if (row.TypeCol<string>("main_base_flag") == null)
            {
                flagNull = true;
            }
            if (row.TypeCol<string>("main_base_flag") == "Y")
            {
                flagCount++;
            }
            if (layerNo != null)
            {

                layerOriginal.Add(int.Parse(layerNo.ToString()));
                layerCompare.Add(int.Parse(layerNo.ToString()));
            }
        }

        if (layerNull && flagNull)
        {
            //layer가 null인것과 main_base_flag가 null 인 것이 모두 존재
            //return false;
            return "layer가 null인것과 main_base_flag가 null 인 것이 모두 존재";
        }
        else if (layerNull)
        {
            //layer가 null인 것이 존재
            //return false;
            return "layer가 null인 것이 존재";
        }
        else if (flagNull)
        {
            //flag가 null인 것이 존재
            //return false;
            return "flag가 null인 것이 존재";
        }


        if (flagCount == 0)
        {
            //flag === "Y"가 존재하지 않음  
            //return false;
            return "MAIN_BASE_FLAG [ Y ]가 존재하지 않음";
        }

        if (flagCount >= 2)
        {
            //flag "Y"가 2개 이상 존재함
            //return false;
            return "MAIN_BASE_FLAG [ Y ]가 2개 이상 존재함";
        }

        var isSameList = false;
        var isSorted = false;
        //layerOriginal
        //layerCompare
        var compare1 = layerOriginal.Distinct().ToList();
        if (!layerOriginal.SequenceEqual(compare1))
        {
            //layer에 중복 존재
            //return false;
            Console.WriteLine(layerOriginal);
            Console.WriteLine(compare1);
            return "layerNo에 중복이 존재합니다";
        }

        compare1.Sort();
        if (layerOriginal.SequenceEqual(compare1))
        {
            isSorted = true;
        }
        compare1.Reverse();
        if (layerOriginal.SequenceEqual(compare1))
        {
            isSorted = true;
        }



        if (!isSorted)
        {
            //layer 순서가 정렬되어있지 않음
            //return false;
            return "layer 순서가 정렬되어있지 않음";

        }


        return "true";
    }

}

