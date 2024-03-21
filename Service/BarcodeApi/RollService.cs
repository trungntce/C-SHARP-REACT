namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Reflection.Metadata.Ecma335;
using System.Threading;
using Framework;
using Mapster;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Migrations;
using Newtonsoft.Json;
using OfficeOpenXml.FormulaParsing.Excel.Operators;
using static NpgsqlTypes.NpgsqlTsQuery;

//Dictionary<string, object> result = CommonService.VerifiyBarcodeKind(panelId, langCode).dicReturn;
// 롤스프릿 split 매터리얼 랏만 받아야하고 


public class RollService : MinimalApiService, IMinimalApi
{
    public RollService(ILogger<RollService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {

        group.MapPost("/labelcopy", nameof(LabelCopy));
        group.MapPost("/splitcancel", nameof(SplitCancel));
        group.MapGet("/varifysplitcancel", nameof(VarifySplitCancel));
        group.MapPost("/splitlabelplint", nameof(SplitLabelPlint));
        group.MapGet("/gettcardmaterial", nameof(GetTCardMaterial));
        group.MapPost("/rollpanelmapping", nameof(RollPanelMapping));
        group.MapPost("/rework", nameof(Rework));
        group.MapPost("/reworkapprove", nameof(ReworkApprove));

        return RouteAllEndpoint(group);
    }

    /// <summary>
    /// PDA 용 함수
    /// </summary>
    /// <param name="deviceId"></param>
    /// <param name="langCode"></param>
    /// <param name="barcode"></param>
    /// <param name="action"></param>
    /// <returns></returns>
    [ManualMap]
    public static ResultEntity GetTCardMaterial(string deviceId, string langCode, string barcode, string action)
    {
        //사용케이스 1. 롤 스플릿 진행할 때 사용됨
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, langCode });

        //들어오는 바코드에 대한 카인드 찾기
        var barcodeInfo = CommonService.VerifiyBarcodeKind(deviceId, barcode, langCode);

        //panel - 추가 하기 
        //0 보다 크면 
        DataTable mesPanelCheck = DataContext.StringDataSet("@BarcodeApi.Panel.RollPanelCheck", new { barcode }).Tables[0];
        if (mesPanelCheck.Rows.Count > 0)
        {
            int cnt = mesPanelCheck.Rows[0].TypeCol<int>("result_value");
            if (cnt > 0)
                barcodeInfo.BarcodeKind = "PANEL";
        }

        if (barcodeInfo.dicReturn == null && barcodeInfo.BarcodeKind != "PANEL")
            return new(null, historyNo, ResultEnum.NgDataBase, langCode, barcodeInfo.remark);//$[NG] 검색된 바코드 정보가 없습니다. 다시한번 확인해 주십시오.

        //들어오는 바코드가 TCARD 가 아닌경우 리턴
        //if (barcodeInfo.BarcodeKind!= "TCARD"&& barcodeInfo.BarcodeKind != "MATERIAL" && barcodeInfo.BarcodeKind !="PANEL")
        //    return new(historyNo, ResultEnum.NgDataBase, langCode, "[NG] Barcode 번호가 T-Card 가 아닙니다. T-Card로 다시 조회 하십시오.");//[NG] Barcode 번호가 T-Card 가 아닙니다. T-Card로 다시 조회 하십시오.

        if (barcodeInfo.BarcodeKind != "MATERIAL" && barcodeInfo.BarcodeKind != "PANEL")
            return new(null, historyNo, ResultEnum.NgDataBase, langCode, barcodeInfo.remark);//[NG] 바코드 번호를 다시 확인해 주십시오.

        Dictionary<string, object> dic = new Dictionary<string, object>();
        dic.Add("langCode", langCode);
        dic.Add("action", action);
        dic.Add("barcode", barcode);
        dic.Add("barcodeKind", barcodeInfo.BarcodeKind);
        dic.Add("parm1", "");
        dic.Add("rs_code", "");
        dic.Add("rs_msg", "");
        dic.Add("rs_json", "");

        //프로시져 콜 
        var result = DataContext.NonQuery("dbo.sp_panel_4m_get_panel_target", RefineParam(dic));

        var rs_json = dic.TypeKey<string>("rs_json");
        if (rs_json == "" || rs_json == null)
            return new(null, historyNo, ResultEnum.NgRollNotExists, dic, langCode, $"[NG] {dic.TypeKey<string>("rs_msg")}"); //[NG] {dic.TypeKey<string>("rs_msg")}

        //return new(historyNo, ResultEnum.NgRollNotExists, dic, langCode, $"[NG] {dic.TypeKey<string>("rs_msg")}");

        List<Dictionary<string, object>> jsonResult = new List<Dictionary<string, object>>();
        var jsonConvert = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, object>>>(rs_json);
        if (action == "SPLITCANCEL")
        {
            if (rs_json == "" || rs_json == null)
                return new(null, historyNo, ResultEnum.NgRollNotExists, dic, langCode, $"{dic.TypeKey<string>("rs_msg")}");

            List<Dictionary<string, object>> splitcancelJson = new List<Dictionary<string, object>>();

            foreach (var item in jsonConvert)
            {
                List<Dictionary<string, object>> panel = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, object>>>(item.TypeKey<string>("panel"));
                foreach (var item2 in panel)
                {
                    Dictionary<string, object> panelItem = new Dictionary<string, object>();
                    panelItem.Add("materialCode", item.TypeKey<string>("materialCode"));
                    panelItem.Add("materialName", item.TypeKey<string>("materialName"));
                    panelItem.Add("makerName", item.TypeKey<string>("makerName"));
                    panelItem.Add("parentId", item2.TypeKey<string>("parentId"));
                    panelItem.Add("childId", item2.TypeKey<string>("childId"));
                    panelItem.Add("rollId", item2.TypeKey<string>("rollId"));
                    panelItem.Add("defectCode", item2.TypeKey<string>("defectCode"));
                    panelItem.Add("defectName", item2.TypeKey<string>("defectName"));
                    splitcancelJson.Add(panelItem);
                }
            }

            jsonResult = splitcancelJson;
        }
        else if (action == "INTERLOCKCANCEL" || action == "DEFECTCANCEL")
        {
            if (rs_json == "" || rs_json == null)
                return new(null, historyNo, ResultEnum.NgRollNotExists, dic, langCode, $"{dic.TypeKey<string>("rs_msg")}");

            List<Dictionary<string, object>> interOrDefectJson = new List<Dictionary<string, object>>();
            foreach (var item in jsonConvert)
            {
                List<Dictionary<string, object>> panel = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, object>>>(item.TypeKey<string>("panel"));
                foreach (var item2 in panel)
                {
                    Dictionary<string, object> panelItem = new Dictionary<string, object>();
                    panelItem.Add("materialLot", item.TypeKey<string>("materialLot"));
                    panelItem.Add("materialName", item.TypeKey<string>("materialName"));
                    panelItem.Add("materialCode", item.TypeKey<string>("materialCode"));
                    panelItem.Add("makerName", item.TypeKey<string>("makerName"));
                    panelItem.Add("panelId", item2.TypeKey<string>("panelId"));
                    panelItem.Add("reasonCode", item2.TypeKey<string>("reasonCode"));
                    panelItem.Add("onRemark", item2.TypeKey<string>("onRemark"));
                    panelItem.Add("worker", item2.TypeKey<string>("worker"));
                    interOrDefectJson.Add(panelItem);
                }
            }
            // 인터락이 안되어있으면 // 이미 인터락 캔슬 할 수 없습니다..
            // 디펙이 되어있으면 // 이미 디펙 캔슬 할 수 없습니다.

            jsonResult = interOrDefectJson;
        }
        else if (action == "INTERLOCK" || action == "DEFECT")
        {
            if (rs_json == "" || rs_json == null)
                return new(null, historyNo, ResultEnum.NgRollNotExists, dic, langCode, $"{dic.TypeKey<string>("rs_msg")}");

            List<Dictionary<string, object>> interOrDefectJson = new List<Dictionary<string, object>>();
            // 인터락이 되어있으면 // 이미 인터락이 되어있습니다.
            // 디펙이 되어있으면 // 이미 디펙 처리가 되어있습니다.

            if (action == "INTERLOCK" && jsonConvert.Any(item => item.TypeKey<string>("interlockYN") == "Y"))
            {
                // 이미 INTERLOCK인 하위 판넬이 존재합니다
                dic["rs_msg"] = "@NG_ALREADY_PANEL_INTERLOCK"; //[NG] 이미 INTERLOCK 상태인 하위 판넬이 존재합니다
                return new(null, historyNo, ResultEnum.NgRollInterlock, dic, langCode, $"{dic.TypeKey<string>("rs_msg")}");
            }

            if (action == "DEFECT" && jsonConvert.Any(item => item.TypeKey<string>("defectYN") == "Y"))
            {
                // 이미 DEFECT인 하위 판넬이 존재합니다
                dic["rs_msg"] = "@NG_ALREADY_PANEL_DEFECT";
                return new(null, historyNo, ResultEnum.NgRollInterlock, dic, langCode, $"{dic.TypeKey<string>("rs_msg")}");
            }

            //if (jsonConvert[0].TypeKey<string>("panelId").Equals("X"))
            //{
            //    return new(historyNo, ResultEnum.NgRollNotExists, dic, langCode, "[NG] 각인되지 않은 롤 자재 입니다.");
            //}

            jsonResult = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, object>>>(rs_json);

        }
        else
        {
            if (rs_json == "" || rs_json == null)
                return new(null, historyNo, ResultEnum.NgRollNotExists, dic, langCode, $"{dic.TypeKey<string>("rs_msg")}");

            jsonResult = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, object>>>(rs_json);
        }

        if (!jsonConvert[0].TypeKey<string>("materialCode").Contains("MB01") && !jsonConvert[0].TypeKey<string>("materialCode").Contains("SB0201"))
        {
            if (!jsonConvert[0].TypeKey<string>("materialCode").Contains("SB0201"))
            {
                dic["rs_msg"] = "@NG_DF_MAT"; //[NG] DF 자재가 아닙니다.
                return new(null, historyNo, ResultEnum.NgRollNotExists, dic, langCode, dic.TypeKey<string>("rs_msg"));//$"[NG] {dic.TypeKey<string>("rs_msg")}"
            }
            else
            {
                dic["rs_msg"] = "@NG_DONG_BAK"; //[NG] 동박 자재가 아닙니다.
                return new(null, historyNo, ResultEnum.NgRollNotExists, dic, langCode, dic.TypeKey<string>("rs_msg"));//$"[NG] {dic.TypeKey<string>("rs_msg")}"
            }
        }

        dic["rs_json"] = jsonResult;

        return new(null, historyNo, ResultEnum.OkRoll, dic, langCode, "");
    }

    /// <summary>
    /// Label Copy (롤 라벨 복사 & 인쇄) 
    /// 소켓 통신 으로만 진행 
    /// </summary>
    /// <param name="deviceId"></param>
    /// <param name="groupKey"></param>
    /// <param name="langCode"></param>
    /// <returns></returns>
    [ManualMap]
    public static ResultEntity LabelCopy(string deviceId, string langCode, string groupKey)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, langCode });

        return new(null, historyNo, ResultEnum.OkPanelDefect, langCode, "");
    }

    [ManualMap]
    public static ResultEntity RollPanelMapping(List<Dictionary<string, object>> entity)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;
        dynamic operation = new ExpandoObject();

        int historyNo = -1;
        string deviceId = string.Empty;
        string langCode = string.Empty;
        string status = string.Empty;

        DataTable rollPanelMapDt;
        string workorder = string.Empty;
        int operSeqNo = 0;
        string operCode = string.Empty;
        string eqpCode = string.Empty;
        string rGroupKey = string.Empty;

        var getPanelId = entity.Where(x => x.TypeKey<string>("status") == "R").FirstOrDefault()?.TypeKey<string>("panelId");
        var getRollId = entity.Where(x => x.TypeKey<string>("status") == "R").FirstOrDefault()?.TypeKey<string>("rollId");
        if (getPanelId != null)
        {
            rollPanelMapDt = DataContext.StringDataSet("@BarcodeApi.Common.WorkOrderSelect", new { panelId = getPanelId ,rollId= getRollId }).Tables[0];
            workorder = rollPanelMapDt.Rows[0].TypeCol<string>("workorder");
            operSeqNo = rollPanelMapDt.Rows[0].TypeCol<int>("oper_seq_no");
            operCode = rollPanelMapDt.Rows[0].TypeCol<string>("oper_code");
            eqpCode = rollPanelMapDt.Rows[0].TypeCol<string>("eqp_code");

            var rList = entity.Where(x => x.TypeKey<string>("status") == "R");
            foreach (Dictionary<string, object> itemValue in rList)
            {
                status = itemValue.TypeKey<string>("status");
                deviceId = itemValue.TypeKey<string>("deviceId");
                langCode = itemValue.TypeKey<string>("langCode");

                var rollId = itemValue.TypeKey<string>("rollId");
                var panelId = itemValue.TypeKey<string>("panelId");

                dynamic objRollPanelid = new ExpandoObject();
                objRollPanelid.RollId = rollId;
                objRollPanelid.PanelId = panelId;
                objRollPanelid.OperCode = operCode;
                objRollPanelid.OperSeqNo = operSeqNo;

                DataTable dt = db.ExecuteStringDataSet("@BarcodeApi.Roll.PanelRollGroupKey", RefineEntity(objRollPanelid)).Tables[0];
                if(dt.Rows.Count != 0)
                {
                    rGroupKey = dt.Rows[0].TypeCol<string>("group_key");
                    break;
                }
            }
        }

        var cList = entity.Where(x => x.TypeKey<string>("status") == "C");
        foreach (Dictionary<string, object> itemValue in cList)
        {
            status = itemValue.TypeKey<string>("status");
            deviceId = itemValue.TypeKey<string>("deviceId");
            langCode = itemValue.TypeKey<string>("langCode");
            historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { itemValue });

            //작업자가 없는데 등록 하려 할때 
            //jjk, 23.06.22
            string workerCode = itemValue.TypeKey<string>("worker");
            if (string.IsNullOrWhiteSpace(workerCode))
                return new(null, historyNo, ResultEnum.NgDataBase, langCode, "@NG_NOT_WORKER_INFO"); //[NG] 작업자 정보가 없습니다.\r\n작업자 등록하고 다시 시도하여 주십시오.

            var panelId = itemValue.TypeKey<string>("panelId");
            var rollId = itemValue.TypeKey<string>("rollId");
            var groupKey = itemValue.TypeKey<string>("workorder");

            dynamic objRollPanelMap = new ExpandoObject();
            //GNG 김종철 대표 의견으로 외주 등록시 workorder 에 groupkey 를 넣어서 주겠다고 함.
            //향후 groupkey로 받는것으로 확인이 필요함.
            if (!string.IsNullOrWhiteSpace(groupKey))
            {
                dynamic obj = new ExpandoObject();
                obj.GroupKey = groupKey;
                rollPanelMapDt = DataContext.StringDataSet("@BarcodeApi.Panel.Panel4MGroupKey", RefineExpando(obj))?.Tables[0];
                if (rollPanelMapDt.Rows.Count == 0)
                    return new(null, historyNo, ResultEnum.NgRollNotExists, entity, langCode, "@NG_4M_NOT_FOUND"); //4M 데이터를 찾을 수 없습니다.
            }
            else
            {
                dynamic obj = new ExpandoObject();
                obj.GroupKey = rGroupKey;
                rollPanelMapDt = DataContext.StringDataSet("@BarcodeApi.Panel.Panel4MGroupKey", RefineExpando(obj))?.Tables[0];
                if (rollPanelMapDt.Rows.Count == 0)
                    return new(null, historyNo, ResultEnum.NgRollNotExists, entity, langCode, "@NG_4M_NOT_FOUND"); //4M 데이터를 찾을 수 없습니다.
                groupKey = rGroupKey;
            }

            objRollPanelMap.RollId = rollId;
            objRollPanelMap.PanelId = panelId;
            objRollPanelMap.DeviceId = "AUTO_GEN_ID";
            objRollPanelMap.Workorder = rollPanelMapDt.Rows[0].TypeCol<string>("workorder");
            objRollPanelMap.OperSeqNo = rollPanelMapDt.Rows[0].TypeCol<int>("oper_seq_no");
            objRollPanelMap.OperCode = rollPanelMapDt.Rows[0].TypeCol<string>("oper_code");
            objRollPanelMap.EqpCode = rollPanelMapDt.Rows[0].TypeCol<string>("eqp_code");
            objRollPanelMap.ScanDt = DateTime.Now;
            objRollPanelMap.ItemKey = NewShortId();

            objRollPanelMap.GroupKey = groupKey;
            DataTable product = DataContext.StringDataSet("@BarcodeApi.Panel.ErpTcardProductName", new { barcode = objRollPanelMap.Workorder }).Tables[0];
            if (product.Rows.Count == 0) { }
            objRollPanelMap.ModelCode = product.Rows[0].TypeCol<string>("BOM_ITEM_CODE");

            int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.RollPanelMapInsert", RefineParam(objRollPanelMap));

        }

        return new(null, historyNo, ResultEnum.OkRoll, entity, langCode, "@OK_PANEL_MAPPING"); //[OK] Panel Mapping이 완료 되었습니다.
    }

    /// <summary>
    /// Roll Split (Roll 분할 등록)
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    public static ResultEntity Insert([FromBody] RollEntity entity)
    {
        var historyNo = CommonService.PanelHistoryInsert(entity.DeviceId, null, new { entity.DeviceId, entity.LangCode });

        //일단 있는지 확인하기 
        DataTable dtRollMap = DataContext.StringDataSet("@BarcodeApi.Roll.MapParentList", RefineEntity(entity)).Tables[0];
        if (dtRollMap.Rows.Count != 0)
            return new(null, historyNo, ResultEnum.NgRollSplit, entity.LangCode, $"@NG_ALREADY_INSERT_INFO^{entity.ParentId}");//[NG] [{entity.ParentId}] 이미 등록된 정보가 있습니다.

        for (int i = 0; i < entity.ChildList.Count; i++)
        {
            var child = entity.GetChild(i);
            var fromPanelId = child.TypeKey<string>("fromPanelId");
            var toPanelId = child.TypeKey<string>("toPanelId");

            if (fromPanelId == "0" && toPanelId == "0")
            {
                string childNo = child.TypeKey<string>("childNo");
                if (childNo == "00" || string.IsNullOrWhiteSpace(childNo))
                    child["childId"] = entity.ParentId;
                else
                    child["childId"] = $"{entity.ParentId}-{childNo}";

                child["defectCode"] = child.TypeKey<string>("defectCode");
                child["panelCnt"] = "0";
            }
            else
            {
                if (entity.IsEngrave)
                    child["childId"] = $"{entity.ParentId}-{i + 1:00}";
                else
                {
                    if (i == 0)
                        child["childId"] = entity.ParentId;
                    else
                        child["childId"] = $"{entity.ParentId}-{i:00}";
                }

                child["fromPanelId"] = child.TypeKey<string>("fromPanelId");
                child["toPanelId"] = child.TypeKey<string>("toPanelId");
                child["defectCode"] = child.TypeKey<string>("defectCode");

                int count = DataContext.StringValue<int>("@BarcodeApi.Roll.PanelCount", new { fromPanelId, toPanelId });
                child["panelCnt"] = count;
                //int count =DataContext.StringValue<int>("@BarcodeApi.Roll.PanelCount", RefineEntity(entity));
            }
        }

        //group key 추가 
        entity.GroupKey = NewShortId();
        int cnt = DataContext.NonQuery("dbo.sp_roll_map_insert", RefineEntity(entity));
        if (cnt <= 0)
            return new(null, historyNo, ResultEnum.NgRollSplit, entity.LangCode, "@NG_ROLL_SPLIT"); //[NG] Roll 분할 등록 실패 API 다시 확인하여 주십시오.

        //split insert 할때 update 쳐줘야함 1
        for (int i = 0; i < entity.ChildList.Count; i++)
        {
            Dictionary<string, object> dic = entity.ChildList[i];

            dynamic obj = new ExpandoObject();
            obj.ParentId = entity.ParentId;
            obj.ChildId = dic.TypeKey<string>("childId");
            obj.FromPanelId = dic.TypeKey<string>("fromPanelId");
            obj.ToPanelId = dic.TypeKey<string>("toPanelId");

            if (obj.FromPanelId == "0" && obj.ToPanelId == "0")
            {
                break;
            }
            else
            {
                int splitUpdate = DataContext.StringNonQuery("@BarcodeApi.Roll.SplitUpdate", RefineExpando(obj));
                if (splitUpdate < 0)
                    return new(null, historyNo, ResultEnum.NgRollSplit, entity.LangCode, "@NG_ROLL_SPLIT_UPDATE"); //[NG] Roll 분할 Update 실패
            }
        }

        return new(null, historyNo, ResultEnum.OkRollSplit, entity.ChildList, entity.LangCode, "@OK_ROLL_SPLIT"); ; //[OK] Roll Split 정상 처리 되었습니다.

        #region List 형식으로 들어올때에 대한 처리 주석 

        //List<ResultEntity> lstresultValue = new List<ResultEntity>();

        //foreach (RollEntity rollEntity in entity)
        //{
        //    var historyNo = CommonService.PanelHistoryInsert(rollEntity.DeviceId, null, new { rollEntity.DeviceId, rollEntity.LangCode });

        //    //일단 있는지 확인하기 
        //    DataTable dtRollMap = DataContext.StringDataSet("@BarcodeApi.Roll.MapParentList", RefineEntity(rollEntity)).Tables[0];
        //    if (dtRollMap.Rows.Count != 0)
        //        return new List<ResultEntity>() { new(historyNo, ResultEnum.NgRollSplit, rollEntity.LangCode, $"@NG_ALREADY_INSERT_INFO^{rollEntity.ParentId}") }; //[NG] [{rollEntity.ParentId}] 이미 등록된 정보가 있습니다.

        //    for (int i = 0; i < rollEntity.ChildList.Count; i++)
        //    {
        //        var child = rollEntity.GetChild(i);
        //        int fromseq = child.TypeKey<int>("fromSeq");
        //        int toseq = child.TypeKey<int>("toSeq");

        //        if(fromseq==0 && toseq==0)
        //        {
        //            string childNo =  child.TypeKey<string>("childNo");
        //            child["childId"] = $"{rollEntity.ParentId}-{childNo}";
        //            child["defectCode"] = child.TypeKey<string>("defectCode");
        //        }
        //        else
        //        {
        //            if (rollEntity.IsEngrave)
        //                child["childId"] = $"{rollEntity.ParentId}-{i + 1:00}";
        //            else
        //            {
        //                if (i == 0)
        //                    child["childId"] = rollEntity.ParentId;
        //                else
        //                    child["childId"] = $"{rollEntity.ParentId}-{i:00}";
        //            }

        //            child["fromSeq"] = child.TypeKey<int>("fromSeq");
        //            child["toSeq"] = child.TypeKey<int>("toSeq");
        //            child["defectCode"] = child.TypeKey<string>("defectCode");
        //        }
        //    }

        //    //2. 일부만 진행된거  panel , roll ( 레이저 각인 하다가 남은거 창고로 보내줄 때 ) defect 에서 m 넣어주기에 판단 가능
        //    //3. panel 만 ( panel 다 각인 되어 있는 상태에서 잘랐을때 )
        //    int cnt = DataContext.NonQuery("dbo.sp_roll_map_insert", RefineEntity(rollEntity));
        //    if (cnt <= 0)
        //        return new List<ResultEntity>() { new(historyNo, ResultEnum.NgRollSplit,  rollEntity.LangCode, "@NG_ROLL_SPLIT") }; //[NG] Roll 분할 등록 실패 API 다시 확인하여 주십시오.

        //    //split insert 할때 update 쳐줘야함 
        //    for (int i = 0; i < rollEntity.ChildList.Count; i++)
        //    {
        //        Dictionary<string, object> dic = rollEntity.ChildList[i];

        //        dynamic obj = new ExpandoObject();
        //        obj.ParentId = rollEntity.ParentId; 
        //        obj.ChildId = dic.TypeKey<string>("childId");
        //        obj.FromSeq = dic.TypeKey<int>("fromSeq");
        //        obj.ToSeq = dic.TypeKey<int>("toSeq");

        //        if(obj.FromSeq == 0 && obj.ToSeq == 0)
        //        {
        //            break;
        //        }   
        //        else
        //        {
        //            int splitUpdate = DataContext.StringNonQuery("@BarcodeApi.Roll.SplitUpdate", RefineExpando(obj));
        //            if (splitUpdate < 0)
        //                return new List<ResultEntity>() { new(historyNo, ResultEnum.NgRollSplit, rollEntity.LangCode, "@NG_ROLL_SPLIT_UPDATE") }; //[NG] Roll 분할 Update 실패
        //        }
        //    }

        //    ResultEntity resultEntity = new(historyNo, ResultEnum.OkRollSplit,rollEntity.ChildList, rollEntity.LangCode, "@OK_ROLL_SPLIT" ); //[OK] Roll Split 정상 처리 되었습니다.
        //    lstresultValue.Add(resultEntity);
        //}

        //return lstresultValue;

        #endregion

    }


    /// <summary>
    /// Split 캔슬이 가능한지 안가능한지 확인 하는 함수
    /// </summary>
    /// <param name="deviceId"></param>
    /// <param name="langCode"></param>
    /// <param name="barcode"></param>
    /// <returns>return value 가 0 이면 불가 , 1이면 가능 </returns>
    [ManualMap]
    public static ResultEntity VarifySplitCancel(string deviceId, string langCode, string barcode)
    {
        Dictionary<string, object> dicResult = new Dictionary<string, object>();
        dicResult.Add("langCode", langCode);
        dicResult.Add("action", "");
        dicResult.Add("barcode", barcode);
        dicResult.Add("barcodeKind", "");

        dicResult.Add("rs_code", "");
        dicResult.Add("rs_msg", "");
        dicResult.Add("rs_json", "");

        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, langCode });
        DataTable mesPanelCheck = DataContext.StringDataSet("@BarcodeApi.Panel.RollPanelCheck", new { barcode }).Tables[0];
        if (mesPanelCheck.Rows.Count > 0)
        {
            int panelchk = mesPanelCheck.Rows[0].TypeCol<int>("result_value");
            if (panelchk < 0)
            {
                dicResult.Add("parm1", false);
                return new(null, historyNo, ResultEnum.NgRollCancel, dicResult, langCode, $"@NG_BARCODE_NOT_ROLL^{barcode}"); //[NG] 해당 [{barcode}] Roll Barcode가 아닙니다.
            }
        }

        dynamic obj = new ExpandoObject();
        obj.ParentId = barcode;
        //일단 있는지 확인하기 
        DataTable dtRollMap = DataContext.StringDataSet("@BarcodeApi.Roll.MapParentList", RefineExpando(obj)).Tables[0];
        if (dtRollMap.Rows.Count == 0)
        {
            dicResult.Add("parm1", false);
            return new(null, historyNo, ResultEnum.NgRollCancel, dicResult, langCode, $"@NG_BARCODE_NOT_ROLL_SPLIT^{barcode}"); //[NG] 해당 [{barcode}] RollSplit 정보를 찾 수 없습니다.
        }

        dynamic splitObj = new ExpandoObject();
        splitObj.Barcode = barcode;//dtRollMap.Rows[0].TypeCol<string>("parent_id");
        splitObj.ParentId = dtRollMap.Rows[0].TypeCol<string>("parent_id");

        DataTable rollChildCnt = DataContext.DataSet("dbo.sp_roll_map_child_child_count", new { parentId = splitObj.ParentId }).Tables[0];
        if (rollChildCnt.Rows[0].TypeCol<int>("child_cnt") > 0)
        {
            dicResult.Add("parm1", false);
            return new(null, historyNo, ResultEnum.NgRollSplit, dicResult, langCode, "@NG_ROLL_IS_SPLITTED"); //[NG] Roll 분할되어 있어 취소 할 수 없습니다.
        }

        dicResult.Add("parm1", true);
        //return value 가 0 이면 불가 , 1이면 가능 
        return new(null, historyNo, ResultEnum.OkRollCancel, dicResult, langCode, "@OK_CAN_ROLL_SPLIT_CANCEL"); //[OK] ROLL 분할 Cancel 가능
    }



    /// <summary>
    /// Roll Split Cancel (Roll 분할 취소)
    /// </summary>
    /// <param name="deviceId"></param>
    /// <param name="groupKey"></param>
    /// <param name="langCode"></param>
    /// <returns></returns>
    [ManualMap]
    public static ResultEntity SplitCancel(Dictionary<string, object> entitiy)
    {
        string deviceId = entitiy.TypeKey<string>("deviceId");
        string langCode = entitiy.TypeKey<string>("langCode");
        string barcode = entitiy.TypeKey<string>("barcode");
        string workerCode = entitiy.TypeKey<string>("worker");
        string reason = entitiy.TypeKey<string>("reason");

        //string reasonRemark = entitiy.TypeKey<string>("reasonRemark");

        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, langCode, barcode, workerCode, reason });
        DataTable mesPanelCheck = DataContext.StringDataSet("@BarcodeApi.Panel.RollPanelCheck", new { barcode }).Tables[0];
        if (mesPanelCheck.Rows.Count > 0)
        {
            int panelchk = mesPanelCheck.Rows[0].TypeCol<int>("result_value");
            if (panelchk < 0)
                return new(null, historyNo, ResultEnum.NgRollCancel, langCode, $"@NG_BARCODE_NOT_ROLL^{barcode}"); //[NG] 해당 [{barcode}] Roll Barcode가 아닙니다.
        }

        dynamic obj = new ExpandoObject();
        obj.ParentId = barcode;
        //일단 있는지 확인하기 
        DataTable dtRollMap = DataContext.StringDataSet("@BarcodeApi.Roll.MapParentList", RefineExpando(obj)).Tables[0];
        if (dtRollMap.Rows.Count == 0)
            return new(null, historyNo, ResultEnum.NgRollCancel, langCode, $"@NG_BARCODE_NOT_ROLL_SPLIT^{barcode}"); //[NG] 해당 [{barcode}] RollSplit 정보를 찾을수 없습니다.

        dynamic splitObj = new ExpandoObject();
        splitObj.Barcode = barcode;//dtRollMap.Rows[0].TypeCol<string>("parent_id");
        splitObj.ParentId = dtRollMap.Rows[0].TypeCol<string>("parent_id");

        DataTable rollChildCnt = DataContext.DataSet("dbo.sp_roll_map_child_child_count", new { parentId = splitObj.ParentId }).Tables[0];
        if (rollChildCnt.Rows[0].TypeCol<int>("child_cnt") > 0)
            return new(null, historyNo, ResultEnum.NgRollSplit, langCode, "@NG_ROLL_IS_SPLITTED"); //[NG] Roll 분할되어 있어 취소 할 수 없습니다.

        DataTable defectCnt = DataContext.StringDataSet("@BarcodeApi.Panel.DefectCheck", new { rollId = splitObj.ParentId, panelId = "" }).Tables[0];
        if (defectCnt.Rows[0].TypeCol<int>("defect_count") > 0)
            return new(null, historyNo, ResultEnum.NgRollSplit, langCode, $"@NG_ROLL_SPLIT_DEFECT_CHECK^{splitObj.ParentId}"); //[NG] 해당 {0}은 Defect 등록이 되어있습니다.\r\nDefect 취소하고 진행 하여 주십시오.

        //부모 바코드를 찍고 취소이다 delete -> tb_roll_map
        int cnt = DataContext.StringNonQuery("@BarcodeApi.Roll.SplitCancel", RefineExpando(splitObj));
        if (cnt <= 0)
            return new(null, historyNo, ResultEnum.NgRollCancel, cnt, langCode, "@NG_ROLL_SPLIT"); //[NG] Roll 분할 취소 실패 API 다시 확인하여 주십시오.

        var canclHistory = ToDic(dtRollMap);
        foreach (var cancelItem in canclHistory)
        {
            dynamic objRollMap = new ExpandoObject();
            objRollMap.GroupKey = cancelItem.TypeKey<string>("groupKey");
            objRollMap.ParentId = cancelItem.TypeKey<string>("parentId");
            objRollMap.ChildId = cancelItem.TypeKey<string>("childId");
            objRollMap.FromPanelId = cancelItem.TypeKey<string>("fromPanelId");
            objRollMap.ToPanelId = cancelItem.TypeKey<string>("toPanelId");
            objRollMap.PanelCnt = cancelItem.TypeKey<int>("panelCnt");
            objRollMap.DefectCode = cancelItem.TypeKey<string>("defectCode");
            objRollMap.DeviceId = cancelItem.TypeKey<string>("deviceId");
            objRollMap.Workorder = cancelItem.TypeKey<string>("workorder");
            objRollMap.OperSeqNo = cancelItem.TypeKey<int>("operSeqNo");
            objRollMap.OperCode = cancelItem.TypeKey<string>("operCode");
            objRollMap.EqpCode = cancelItem.TypeKey<string>("eqpCode");
            objRollMap.WorkerCode = workerCode;
            objRollMap.ScanDt = cancelItem.TypeKey<DateTime>("scanDt");
            objRollMap.CreateDt = cancelItem.TypeKey<DateTime>("createDt");
            objRollMap.Reason = reason;

            int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Roll.MapCancelHistory", RefineExpando(objRollMap));
            if (cnt2 <= 0)
                return new(null, historyNo, ResultEnum.NgDataBase, cnt, langCode, "@NG_ROLL_SPLIT_CANCEL_INSERT"); //[NG] Roll Split Cancel History 등록 실패
        }

        return new(null, historyNo, ResultEnum.OkRollCancel, langCode, "@OK_ROLL_SPLIT_CANCEL"); //[OK] ROLL 분할 취소가 정상 처리 되었습니다.
    }

    /// <summary>
    /// Roll Split Label Print (Roll 분할 라벨 인쇄)
    /// </summary>
    /// <param name="deviceId"></param>
    /// <param name="groupKey"></param>
    /// <param name="langCode"></param>
    /// <returns></returns>
    [ManualMap]
    public static IResult SplitLabelPlint(string deviceId, string langCode, string barcode, string labelName)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, langCode });
        Dictionary<string, object> dic = new Dictionary<string, object>();
        dic.Add("label_name", labelName);
        dic.Add("lotno", barcode);
        dic.Add("result", "");
        //text 처럼
        var result = DataContext.NonQuery("dbo.fn_pda_get_label", RefineParam(dic));

        return Results.Json(dic);
    }
    /// <summary>
    /// Roll Rework (Roll 재처리)
    /// </summary>
    /// <param name="deviceId"></param>
    /// <param name="langCode"></param>
    /// <returns></returns>
    [ManualMap]
    public static ResultEntity Rework(string deviceId, string langCode, string operName, string rollId, string reworkCode, string putRemark, string putUpdateUser)
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
        //int cnt = DataContext.StringNonQuery("@BarcodeApi.Roll.ReworkYn", RefineExpando(obj, true));
        //tb_panel_rework
        int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Roll.ReworkInsert", RefineExpando(obj, true));
        Dictionary<string, object> dic = new Dictionary<string, object>
            {
                { "rollId", rollId },
                { "reworkCode", reworkCode },
                { "remark", putRemark },
                { "updateUser", putUpdateUser}
            };
        if (cnt2 <= 0)
            return new(null, historyNo, ResultEnum.NgPanelNotExists, cnt2, langCode, "");
        return new(null, historyNo, ResultEnum.OkPanelRework, dic, langCode, "");
    }

    /// <summary>
    /// Roll Rework Approve (Roll 재처리 승인)
    /// </summary>
    /// <param name="deviceId"></param>
    /// <param name="langCode"></param>
    /// <returns></returns>
    [ManualMap]
    public static ResultEntity ReworkApprove(string deviceId, string langCode, string operName, string rollId, string approveRemark, string approveUpdateUser)
    {
        var historyNo = CommonService.PanelHistoryInsert(deviceId, null, new { deviceId, langCode });
        dynamic obj = new ExpandoObject();
        obj.OperName = operName;
        obj.RollId = rollId;
        obj.ReworkApproveYn = 'Y';
        obj.ApproveRemark = approveRemark;
        obj.ApproveUpdateUser = approveUpdateUser;
        //tb_panel_realtime 
        //int cnt = DataContext.StringNonQuery("@BarcodeApi.Roll.ReworkYn", RefineExpando(obj, true));
        //tb_panel_rework
        int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Roll.ReworkApproveInsert", RefineExpando(obj, true));
        Dictionary<string, object> dic = new Dictionary<string, object>
            {
                { "rollId", rollId },
                { "remark", approveRemark },
                { "updateUser", approveUpdateUser}
            };
        if (cnt2 <= 0)
            return new(null, historyNo, ResultEnum.NgPanelNotExists, cnt2, langCode, "");
        return new(null, historyNo, ResultEnum.OkPanelRework, dic, langCode, "");
    }

}
