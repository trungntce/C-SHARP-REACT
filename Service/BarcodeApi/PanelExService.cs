namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Dynamic;
using System.Reflection.Metadata.Ecma335;
using System.Threading;
using Framework;
using k8s.KubeConfigModels;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Migrations;
using Newtonsoft.Json;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Numeric;
using Org.BouncyCastle.Asn1.X509;

public class PanelExService : MinimalApiService, IMinimalApi
{
    public PanelExService(ILogger<PanelExService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/getworker", nameof(GetWorker));
        group.MapPost("/getpanelinfo", nameof(GetPanelInfo));
        group.MapPost("/interlock", nameof(Interlock));
        group.MapPost("/interlockcancel", nameof(InterlockCancel));
        group.MapPost("/defect", nameof(Defect));
        group.MapPost("/defectcancel", nameof(DefectCancel));
        //group.MapGet("/rework", nameof(Rework));
        //group.MapGet("/reworkcancel", nameof(ReworkCancel));
        return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static ResultEntity GetPanelInfo(Dictionary<string, object> entity)
    {
        var deviceId = entity.TypeKey<string>("deviceId");
        var panelId = entity.TypeKey<string>("panelId");
        var langCode = entity.TypeKey<string>("langCode");
        var action = entity.TypeKey<string>("action").ToUpper();
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { entity });
        DataTable dt = DataContext.StringDataSet("@BarcodeApi.Roll.RealTimePanelInfo", new { panelId = panelId }).Tables[0];
        if (dt.Rows.Count == 0)
        {
            return new(null, historyNo, ResultEnum.NgPanelInterlock, langCode, "@NG_CANNOT_FIND_PANEL");//[NG] 조회된 판넬 데이터가 없습니다.
        }

        if (action == "INTERLOCK")
        {
            //들어오는 판넬 ID가 InterLock 경우
            string interlockYn = dt.Rows[0].TypeCol<string>("interlock_yn");
            if (interlockYn == "Y")
                return new(null, historyNo, ResultEnum.NgPanelInterlock, langCode, "@NG_INTERLOCK_PANEL");//[NG] 해당 판넬은 INTERLOCK 상태 입니다.
        }
        else if (action == "DEFECT")
        {
            //들어오는 판넬 ID가 Defect 경우
            string defectYn = dt.Rows[0].TypeCol<string>("defect_yn");
            if (defectYn == "Y")
                return new(null, historyNo, ResultEnum.NgPanelDefect, langCode, "@NG_DEFECT_PANEL");//[NG] 해당 판넬은 DEFECT 상태 입니다.
        }
        else if (action == "INTERLOCKCANCEL")
        {
            string interlockYn = dt.Rows[0].TypeCol<string>("interlock_yn");
            if (interlockYn == "N")
                return new(null, historyNo, ResultEnum.NgPanelInterlock, langCode, "@NG_NO_INTERLOCK_PANEL");//[NG] 해당 판넬은 INTERLOCK 상태가 아닙니다.
        }
        else if (action == "DEFECTCANCEL")
        {
            string defectYn = dt.Rows[0].TypeCol<string>("defect_yn");
            if (defectYn == "N")
                return new(null, historyNo, ResultEnum.NgPanelDefect, langCode, "@NG_NO_DEFECT_PANEL");//[NG] 해당 판넬은 DEFECT 상태가 아닙니다.
        }

        //쿼리문
        DataTable product = DataContext.StringDataSet("@BarcodeApi.Panel.ErpTcardProductName", new { barcode = dt.Rows[0].TypeCol<string>("workorder") }).Tables[0];
        if (product.Rows.Count == 0)
            return new(null, historyNo, ResultEnum.NgDataBase, langCode, "@NG_MODEL_NAME_NOT_FOUND");//[NG] 모델명을 찾을 수 없습니다.

        string barcodeName = product.Rows[0].TypeCol<string>("bom_item_description");
        string modelCode = product.Rows[0].TypeCol<string>("bom_item_code");

        OperationEntity operEntity = new OperationEntity();
        operEntity.RowKey = "";
        operEntity.GroupKey = "";
        operEntity.Workorder = dt.Rows[0].TypeCol<string>("workorder");
        operEntity.OperCode = dt.Rows[0].TypeCol<string>("oper_code");
        operEntity.OperSeqNo = dt.Rows[0].TypeCol<int>("oper_seq_no");
        operEntity.StartYn = "";
        operEntity.EndYn = "";

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;
        //현재 공정의 workorder 중 작은 숫자의 마지막꺼
        //DataTable operDt = db.ExecuteStringDataSet("@BarcodeApi.Panel.Panel4MSelect", RefineEntity(operEntity)).Tables[0];
        //if (operDt.Rows.Count == 0)
        //    return new(historyNo, ResultEnum.NgDataBase, langCode, "[NG] PANEL 4M 정보 조회 실패");//[NG] PANEL 4M 정보 조회 실패
        DataTable operInfo = DataContext.StringDataSet("@BarcodeApi.Panel.OperationInfo", RefineEntity(operEntity)).Tables[0];
        if (operInfo.Rows.Count == 0)
            return new(null, historyNo, ResultEnum.NgDataBase, langCode, "@NG_PROCESS_NOT_FOUND");//[NG] 공정 정보를 찾을 수 없습니다.

        Dictionary<string, object> dic = new Dictionary<string, object>();
        dic.Add("panelId", panelId);
        dic.Add("prodCode", modelCode);
        dic.Add("prodName", barcodeName);
        dic.Add("workorder", dt.Rows[0].TypeCol<string>("workorder"));
        dic.Add("operCode", dt.Rows[0].TypeCol<string>("oper_code"));
        dic.Add("operSeqNo", dt.Rows[0].TypeCol<int>("oper_seq_no"));
        dic.Add("interlockYn", dt.Rows[0].TypeCol<string>("interlock_yn"));
        dic.Add("defectYn", dt.Rows[0].TypeCol<string>("defect_yn"));
        dic.Add("operDescription", operInfo.Rows[0].TypeCol<string>("operation_description"));

        return new(null, historyNo, ResultEnum.OkPanel, dic, langCode, "PANEL INFO");
    }

    /// <summary>
    /// Barcode kind 구별 및 들어온 barocde 에 대한 검증 하는 함수
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="barcode"></param>
    /// <param name="langCode"></param>
    /// <returns></returns>
    [ManualMap]
    public static ResultEntity GetWorker(string barcode, string langCode, string deviceId)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { });
        //card , 자재 , 자재lot , tool , 장비 , worker 전부 DB 서칭 있는경우 있는 kind 와 정보 값 저장중
        dynamic obj = new ExpandoObject();
        obj.Barcode = barcode;
        obj.LangCode = langCode;

        Dictionary<string, object> dicWorker = new Dictionary<string, object>();

        //작업자
        DataTable erpManCheck = DataContext.StringDataSet("@BarcodeApi.Panel.ErpManCheck", RefineExpando(obj, true)).Tables[0];
        if (erpManCheck.Rows.Count > 0)
        {
            string barcodeName = erpManCheck.Rows[0].TypeCol<string>("worker_name");
            string workerCode = erpManCheck.Rows.Count.ToString();//erpManCheck.Rows[0].TypeCol<string>("workerCode");

            dicWorker.Add("barcode", barcode);
            dicWorker.Add("barcodeName", barcodeName);
            dicWorker.Add("layerId", "");
            dicWorker.Add("maker", "");
            dicWorker.Add("eqpCount", "");
            dicWorker.Add("materialCount", "");
            dicWorker.Add("workerCode", workerCode);
            dicWorker.Add("toolCount", "");
            dicWorker.Add("langCode", langCode);
            dicWorker.Add("currentOperSeq", "");
            dicWorker.Add("currentOperCode", "");
            dicWorker.Add("currentOperName", "");
        }

        if (dicWorker.Count > 0)
        {
            obj.BarcodeKind = "MAN";
            dicWorker.Add("barcodeKind", "MAN");

            return new(null, historyNo, ResultEnum.OkFirstBarcode, dicWorker, langCode, "");
        }
        else
        {
            //검색된 바코드 정보가 없습니다. 다시한번 확인해 주십시오.
            return new(null, historyNo, ResultEnum.NgFirstBarcode, langCode, $"@NG_NO_BARCODE^{barcode}^{"Worker"}");//[NG] 검색된 바코드 정보가 없습니다.\r\n다시한번 확인해 주십시오.
        }
    }

    /// <summary>
    /// 인터락 관리
    /// </summary>
    /// <param name="deviceId"></param>
    /// <param name="langCode"></param>
    /// <param name="panelId"></param>
    /// <param name="interlockCode"></param>
    /// <param name="onRemark"></param>
    /// <param name="onUpdateUser"></param>
    /// <returns></returns>
    [ManualMap]
    public static ResultEntity Interlock(List<PanelExEntity> entity)
    {
        //인터락이 걸려 있으면 인터락이 걸려 있다?
        string langCode = string.Empty;
        int historyNo = 0;
        List<Dictionary<string, object>> dicResult = new List<Dictionary<string, object>>();
        foreach (PanelExEntity interlockEntity in entity)
        {
            Dictionary<string, object> dicItem = new Dictionary<string, object>();
            langCode = interlockEntity.LangCode;
            historyNo = CommonService.PanelHistoryInsert(interlockEntity.DeviceId, null, new { interlockEntity });
            DataTable mesPanelCheck = DataContext.StringDataSet("@BarcodeApi.Panel.RollPanelCheck", new { barcode = interlockEntity.PanelId }).Tables[0];
            if (mesPanelCheck.Rows.Count > 0)
            {
                int panelchk = mesPanelCheck.Rows[0].TypeCol<int>("result_value");
                if (panelchk < 0)
                    return new(null, historyNo, ResultEnum.NgPanelInterlock, panelchk, interlockEntity.LangCode, "[NG] result_value ERROR");//[NG] result_value ERROR\
            }

            interlockEntity.RollId = interlockEntity.RollId == "" ? null : interlockEntity.RollId;
            interlockEntity.PanelId = interlockEntity.PanelId == "" ? null : interlockEntity.PanelId;

            DataTable defectCnt = DataContext.StringDataSet("@BarcodeApi.Panel.DefectCheck", interlockEntity).Tables[0];

            //tb_panel_defect 테이블에 rollid, panelid 검색, enddt null이면 현재 Defect 상태로 판단
            if (defectCnt.Rows[0].TypeCol<int>("defect_count") > 0)
            {
                return new(null, historyNo, ResultEnum.NgPanelInterlock, interlockEntity.LangCode, "@NG_INTERLOCK_DEFECT_CHECK");
            }

            //panel_realtime
            int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.InterlockYn", new { rollId = interlockEntity.RollId, panelId = interlockEntity.PanelId, interlockYn = 'Y', deviceType = interlockEntity.DeviceType });
            //if (cnt <= 0)
            //    return  new(historyNo, ResultEnum.NgPanelInterlock, cnt, interlockEntity.LangCode, "[NG] PANEL INTERLOCK UPDATE 를 실패 하였습니다.") ;//[NG] PANEL INTERLOCK UPDATE 를 실패 하였습니다.

            DataTable interlockCnt = DataContext.StringDataSet("@BarcodeApi.Panel.InterlockCheck", interlockEntity).Tables[0];

            //tb_interlock테이블에 rollid, panelid 검색, enddt null이면 현재 interlock으로 판단
            if (interlockCnt.Rows[0].TypeCol<int>("interlock_count") > 0)
            {
                return new(null, historyNo, ResultEnum.NgPanelInterlock, interlockEntity.LangCode, $"@NG_ALREADY_INTERLOCK^{interlockEntity.RollId}^{interlockEntity.PanelId}");//[NG] 이미 INTERLOCK 상태입니다. \r\n ROLL - {interlockEntity.RollId} \r\n PANEL - {interlockEntity.PanelId}
            }

            int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Panel.InterlockInsert", RefineEntity(interlockEntity));

            if (cnt2 <= 0)
                return new(null, historyNo, ResultEnum.NgPanelInterlock, cnt2, interlockEntity.LangCode, "@ERR_INTERLOCK_INSERT");//[NG] INTERLOCK 등록이 실패 하였습니다.

            //barcode kind 가 panel 일때 
            dicItem.Add("panelId", interlockEntity.PanelId);
            dicItem.Add("rollId", interlockEntity.RollId);
            dicItem.Add("interlockCode", interlockEntity.InterlockCode);
            dicItem.Add("remark", interlockEntity.OnRemark);
            dicItem.Add("updateUser", interlockEntity.OnUpdateUser);
            dicResult.Add(dicItem);
        }

        return new(null, historyNo, ResultEnum.OkPanelInterlock, dicResult, langCode, "@OK_INTERLOCK_INSERT");//[OK] INTERLOCK 등록 성공
    }

    /// <summary>
    /// 인터락 취소
    /// </summary>
    /// <param name="deviceId"></param>
    /// <param name="langCode"></param>
    /// <param name="panelId"></param>
    /// <param name="offRemark"></param>
    /// <param name="workerCode"></param>
    /// <returns></returns>
    [ManualMap]
    public static ResultEntity InterlockCancel(List<PanelExEntity> entity)
    {
        string langCode = string.Empty;
        int historyNo = 0;
        List<Dictionary<string, object>> dicResult = new List<Dictionary<string, object>>();

        foreach (PanelExEntity interlockEntity in entity)
        {
            Dictionary<string, object> dicItem = new Dictionary<string, object>();
            langCode = interlockEntity.LangCode;
            historyNo = CommonService.PanelHistoryInsert(interlockEntity.DeviceId, null, new { interlockEntity });
            DataTable mesPanelCheck = DataContext.StringDataSet("@BarcodeApi.Panel.RollPanelCheck", new { barcode = interlockEntity.PanelId }).Tables[0];
            if (mesPanelCheck.Rows.Count > 0)
            {
                int panelchk = mesPanelCheck.Rows[0].TypeCol<int>("result_value");
                if (panelchk < 0)
                    return new(null, historyNo, ResultEnum.NgPanelInterlock, interlockEntity.LangCode, "@NG_RESULT_VALUE_ERROR");//[NG] result_value ERROR
            }

            interlockEntity.RollId = interlockEntity.RollId == "" ? null : interlockEntity.RollId;
            interlockEntity.PanelId = interlockEntity.PanelId == "" ? null : interlockEntity.PanelId;
            DataTable interlockCnt = DataContext.StringDataSet("@BarcodeApi.Panel.InterlockCheck", interlockEntity).Tables[0];
            if (interlockCnt.Rows[0].TypeCol<int>("interlock_count") > 0)
            {
                //panel_realtime
                int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.InterlockYn", new { rollId = interlockEntity.RollId, panelId = interlockEntity.PanelId, interlockYn = 'N', deviceType = interlockEntity.DeviceType });
                //if (cnt <= 0)
                //    return  new(historyNo, ResultEnum.NgPanelInterlock, cnt, interlockEntity.LangCode, "[NG] PANEL INTERLOCK UPDATE 를 실패 하였습니다.") ;//[NG] PANEL INTERLOCK UPDATE 를 실패 하였습니다.
                //panel_interlock
                int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Panel.InterlockCancelInsert", RefineEntity(interlockEntity));

                dicItem.Add("panelId", interlockEntity.PanelId);
                dicItem.Add("rollId", interlockEntity.RollId);
                dicItem.Add("remark", interlockEntity.OffRemark);
                dicItem.Add("updateUser", interlockEntity.OffUpdateUser);
                dicResult.Add(dicItem);
            }
            else
            {
                return new(null, historyNo, ResultEnum.NgPanelInterlock, interlockEntity.LangCode, "등록된 Roll 또는 Panel은 Interlock 상태가 아닙니다. \r\nInterlock 등록 후 다시 시도 하십시오.");//[NG] result_value ERROR
            }
        }

        return new(null, historyNo, ResultEnum.OkPanelInterlock, dicResult, langCode, "INTERLOCK 해제 성공");//[OK] INTERLOCK 해제 성공
    }

    /// <summary>
    /// 불량관리
    /// </summary>
    /// <param name="deviceId"></param>
    /// <param name="langCode"></param>
    /// <param name="panelId"></param>
    /// <param name="defectCode"></param>
    /// <param name="onRemark"></param>
    /// <param name="onUpdateUser"></param>
    /// <returns></returns>
    [ManualMap]
    public static ResultEntity Defect(List<PanelExEntity> entity)
    {
        string langCode = string.Empty;
        int historyNo = 0;
        List<Dictionary<string, object>> dicResult = new List<Dictionary<string, object>>();

        foreach (PanelExEntity defectEntity in entity)
        {
            Dictionary<string, object> dicItem = new Dictionary<string, object>();
            langCode = defectEntity.LangCode;
            historyNo = CommonService.PanelHistoryInsert(defectEntity.DeviceId, null, new { defectEntity });
            DataTable mesPanelCheck = DataContext.StringDataSet("@BarcodeApi.Panel.RollPanelCheck", new { barcode = defectEntity.RollId }).Tables[0];
            if (mesPanelCheck.Rows.Count > 0)
            {
                int panelchk = mesPanelCheck.Rows[0].TypeCol<int>("result_value");
                if (panelchk < 0)
                    return new(null, historyNo, ResultEnum.NgPanelDefect, defectEntity.LangCode, "@NG_RESULT_VALUE_ERROR");//[NG] result_value ERROR
            }

            DataTable interlockCnt = DataContext.StringDataSet("@BarcodeApi.Panel.InterlockCheck", defectEntity).Tables[0];
            if (interlockCnt.Rows[0].TypeCol<int>("interlock_count") > 0)
            {
                return new(null, historyNo, ResultEnum.NgPanelInterlock, defectEntity.LangCode, "@NG_DFECT_INTERLOCK_CHECK");
            }

            //DataTable panelRealtime = DataContext.StringDataSet("@BarcodeApi.Panel.PanelInterlock", entity).Tables[0];
            //if (panelRealtime.Rows.Count <= 0)
            //    return (ResultEnum.OkPanel, null, string.Empty);
            //bool bIsDefect = panelRealtime.Rows[0].TypeCol<string>("defect_yn") == "Y" ? true : false;
            //tb_panel_defect insert. panel Id, updateuser, remark, defectCode, on_dt 생성
            defectEntity.RollId = defectEntity.RollId == "" ? null : defectEntity.RollId;
            defectEntity.PanelId = defectEntity.PanelId == "" ? null : defectEntity.PanelId;
            DataTable defectCnt = DataContext.StringDataSet("@BarcodeApi.Panel.DefectCheck", defectEntity).Tables[0];

            //tb_panel_defect 테이블에 rollid, panelid 검색, enddt null이면 현재 Defect 상태로 판단
            if (defectCnt.Rows[0].TypeCol<int>("defect_count") > 0)
            {
                return new(null, historyNo, ResultEnum.NgPanelInterlock, defectEntity.LangCode, $"@NG_ALREADY_DEFFECT^{defectEntity.RollId}^{defectEntity.PanelId}");//[NG] 이미 DEFECT 상태입니다. \r\n ROLL - {defectEntity.RollId} \r\n PANEL - {defectEntity.PanelId}
            }

            //tb_panel_realtime  defectYn Y로
            int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.DefectYn", new { rollId = defectEntity.RollId, panelId = defectEntity.PanelId, defectYn = 'Y', deviceType = defectEntity.DeviceType });
            //if (cnt <= 0)
            //     return new(historyNo, ResultEnum.NgPanelDefect, cnt, defectEntity.LangCode, "[NG] DEFECT UPDATE 를 실패 하였습니다.") ;

            int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Panel.DefectInsert", RefineEntity(defectEntity));
            if (cnt2 <= 0)
                return new(null, historyNo, ResultEnum.NgPanelDefect, cnt2, defectEntity.LangCode, "@NG_DEFFECT_FAIL");//[NG] DEFECT 등록이 실패 하였습니다.

            int cnt3 = DataContext.StringNonQuery("@BarcodeApi.Panel.InterlockYn", new { rollId = defectEntity.RollId, panelId = defectEntity.PanelId, interlockYn = 'N', deviceType = defectEntity.DeviceType });
            //if (cnt3 <= 0)
            //    return new(historyNo, ResultEnum.NgPanelInterlock, cnt3, defectEntity.LangCode, "@ERR_PANEL_INTERLOCK_UPDATE");//[NG] PANEL INTERLOCK UPDATE 를 실패 하였습니다.

            dicItem.Add("panelId", defectEntity.PanelId);
            dicItem.Add("rollId", defectEntity.RollId);
            dicItem.Add("defectCode", defectEntity.DefectCode);
            dicItem.Add("remark", defectEntity.OnRemark);
            dicItem.Add("updateUser", defectEntity.OnUpdateUser);
            dicResult.Add(dicItem);
        }

        return new(null, historyNo, ResultEnum.OkPanelDefect, dicResult, langCode, "@OK_DEFECT_INSERT"); //[OK] DEFECT 등록 성공
    }

    /// <summary>
    /// 불량취소
    /// </summary>
    /// <param name="deviceId"></param>
    /// <param name="langCode"></param>
    /// <param name="panelId"></param>
    /// <param name="offRemark"></param>
    /// <param name="offUpdateUser"></param>
    /// <returns></returns>
    [ManualMap]
    public static ResultEntity DefectCancel(List<PanelExEntity> entity)
    {
        string langCode = string.Empty;
        int historyNo = 0;
        List<Dictionary<string, object>> dicResult = new List<Dictionary<string, object>>();

        foreach (PanelExEntity defectEntity in entity)
        {
            Dictionary<string, object> dicItem = new Dictionary<string, object>();
            langCode = defectEntity.LangCode;
            historyNo = CommonService.PanelHistoryInsert(defectEntity.DeviceId, null, new { defectEntity });
            DataTable mesPanelCheck = DataContext.StringDataSet("@BarcodeApi.Panel.RollPanelCheck", new { barcode = defectEntity.PanelId }).Tables[0];
            if (mesPanelCheck.Rows.Count > 0)
            {
                int panelchk = mesPanelCheck.Rows[0].TypeCol<int>("result_value");
                if (panelchk < 0)
                    return new(null, historyNo, ResultEnum.NgPanelDefect, defectEntity.LangCode, "@NG_RESULT_VALUE_ERROR");//[NG] result_value ERROR
            }
            //tb_panel_realtime  defectYn Y로
            defectEntity.RollId = defectEntity.RollId == "" ? null : defectEntity.RollId;
            defectEntity.PanelId = defectEntity.PanelId == "" ? null : defectEntity.PanelId;
            DataTable defectCnt = DataContext.StringDataSet("@BarcodeApi.Panel.DefectCheck", defectEntity).Tables[0];
            //tb_panel_defect 테이블에 rollid, panelid 검색, enddt null이면 현재 Defect 상태로 판단
            if (defectCnt.Rows[0].TypeCol<int>("defect_count") > 0)
            {
                int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.DefectYn", new { rollId = defectEntity.RollId, panelId = defectEntity.PanelId, defectYn = 'N', deviceType = defectEntity.DeviceType });
                //if (cnt <= 0)
                //    return  new(historyNo, ResultEnum.NgPanelDefect, cnt, defectEntity.LangCode, "[NG] DEFECT UPDATE 를 실패 하였습니다.");//[NG] DEFECT UPDATE 를 실패 하였습니다.

                //tb_panel_defect insert. panel Id, updateuser, remark, defectCode, off_dt 생성
                int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Panel.DefectCancelInsert", RefineEntity(defectEntity));
                if (cnt2 <= 0)
                    return new(null, historyNo, ResultEnum.NgPanelDefect, cnt2, langCode, "@OK_DEFECT_CANCEL_INSERT");//[NG] DEFECT CACNEL 등록이 실패 하였습니다.


                dicItem.Add("panelId", defectEntity.PanelId);
                dicItem.Add("rollId", defectEntity.RollId);
                dicItem.Add("remark", defectEntity.OffRemark);
                dicItem.Add("updateUser", defectEntity.OffUpdateUser);
                dicResult.Add(dicItem);
            }
            else
            {
                return new(null, historyNo, ResultEnum.NgPanelInterlock, defectEntity.LangCode, "등록된 Roll 또는 Panel은 Defect 상태가 아닙니다. \r\nDefect 등록 후 다시 시도 하십시오.");//[NG] result_value ERROR
            }
        }

        return new(null, historyNo, ResultEnum.OkPanelDefect, dicResult, langCode, "@OK_DEFECT_CANCEL_COMPLETE"); //[OK] DEFECT CANCEL 성공
    }


    /// <summary>
    /// 재처리 등록
    /// </summary>
    /// <param name="deviceId"></param>
    /// <param name="langCode"></param>
    /// <param name="panelId"></param>
    /// <param name="reworkCode"> value가 reowrk code </param>
    /// <param name="onRemark"></param>
    /// <param name="onUpdateUser"></param>
    /// <returns></returns>
    [ManualMap]
    public static ResultEntity Rework(string deviceId, string langCode, string panelId, string reworkCode, string onRemark, string onUpdateUser)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, langCode, panelId, onRemark, onUpdateUser });
        var result = CommonService.VerifiyBarcodeKind(deviceId, panelId, langCode);

        //tcard 기준으로진행하고 추후 변경 필요 
        if (result.BarcodeKind != "TCARD")
            return new(null, historyNo, ResultEnum.NgPanelNotExists, langCode, "@NG_ITS_NOT_TCARD");//[NG] T-Card 바코드가 아닙니다. T-Card를 확인하여 다시 시도하여 주십시오.

        //그룹키 가져오기 
        dynamic obj = new ExpandoObject();
        obj.PanelId = panelId;
        obj.ReworkApproveYn = 'N';
        obj.ReworkCode = reworkCode;
        obj.PutRemark = onRemark;
        obj.PutUpdateUser = onUpdateUser;

        //tb_panel_realtime  defectYn Y로
        int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.ReworkYn", new { panelId, reworkYn = 'Y' });
        //tb_panel_holding insert. panel Id, updateuser, remark, holdingCode, on_dt 생성
        int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Panel.ReworkInsert", new { panelId, onUpdateUser, onRemark, reworkCode });

        Dictionary<string, object> dic = new Dictionary<string, object>
            {
                { "panelId", panelId },
                { "reworkCode", reworkCode },
                { "remark", onRemark },
                { "updateUser", onUpdateUser}
            };

        if (cnt <= 0)
            return new(null, historyNo, ResultEnum.NgPanelNotExists, cnt, langCode, "");

        return new(null, historyNo, ResultEnum.OkPanelRework, dic, langCode, "");
    }

    /// <summary>
    /// 재처리 취소
    /// </summary>
    /// <param name="deviceId"></param>
    /// <param name="langCode"></param>
    /// <param name="panelId"></param>
    /// <param name="offRemark"></param>
    /// <param name="offUpdateUser"></param>
    /// <returns></returns>
    [ManualMap]
    public static ResultEntity ReworkCancel(string deviceId, string langCode, string panelId, string offRemark, string offUpdateUser)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, langCode });
        var result = CommonService.VerifiyBarcodeKind(deviceId, panelId, langCode);

        //tcard 기준으로진행하고 추후 변경 필요 
        if (result.BarcodeKind != "TCARD")
            return new(null, historyNo, ResultEnum.NgPanelNotExists, langCode, "");

        //tb_panel_realtime  defectYn Y로
        int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.ReworkYn", new { panelId, reworkYn = 'N' });
        //tb_panel_holding insert. panel Id, updateuser, remark, holdingCode, off_dt 생성
        int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Panel.ReworkCancelInsert", new { panelId, offUpdateUser, offRemark });

        Dictionary<string, object> dic = new Dictionary<string, object>
            {
                { "panelId", panelId },
                { "remark", offRemark },
                { "updateUser", offUpdateUser}
            };

        if (cnt <= 0)
            return new(null, historyNo, ResultEnum.NgPanelNotExists, cnt, langCode, "");

        return new(null, historyNo, ResultEnum.OkPanelRework, dic, langCode, "");
    }
}
