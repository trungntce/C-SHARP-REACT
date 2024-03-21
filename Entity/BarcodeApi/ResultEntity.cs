namespace WebApp;

using System;
using System.Collections.Generic;
using System.Data;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;
using System.Xml.Serialization;
using Framework;
using k8s.Models;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Practices.EnterpriseLibrary.Data;
using Org.BouncyCastle.Bcpg.OpenPgp;
using ProtoBuf;

public enum ResultEnum
{
    OkFirstBarcode = 1000
, OkRoll
, OkRollProcDupl
, OkRollProcDuplAprv
, OkRollPanelMap
, OkRollStart
, OkRollChange
, OkRollCancel
, OkRollEnd
, OkRollDefect
, OkRollInterlock
, OkRollHold
, OkRollRework
, OkRollSplit

, OkPanel = 2000
, OkPanelDupl
, OkPanelDuplAprv
, OkPanelPcsMap
, OkPanelSheetMap
, OkPanelStart
, OkPanelChange
, OkPanelCancel
, OkPanelEnd
, OkPanelDefect
, OkPanelError
, OkPanelInterlock
, OkPanelHold
, OkPanelRework

, OkPanelMerge
, OkGet4MData
, OkPanelPvRv
, OkPanelCmi

, NgFirstBarcode = 5000
, NgLotInterlock

, NgRollInterlock
, NgRollProcDupl
, NgRollProcDuplAprv
, NgRollProcDuplAprvReject
, NgRollProcNotExists
, NgRollProcOrder
, NgRollEqpNotExists
, NgRollEqpRecipe
, NgRollEqpParam
, NgRollMatNotExists
, NgRollToolNotExists
, NgRollEtc
, NgRollNotExists
, NgRollSplit
, NgRollCancel

, NgPanelInterlock = 6000
, NgPanelDefect
, NgPanelHolding
, NgPanelProcDupl
, NgPanelProcDuplAprv
, NgPanelProcDuplAprvReject
, NgPanelProcNotExists
, NgPanelProcOrder
, NgPanelEqpNotExists
, NgPanelEqpRecipe
, NgPanelEqpParam
, NgPanelMatNotExists
, NgPanelToolNotExists
, NgPanelEtc
, NgPanelNotExists
, NgBatchInterlock
, NgQime
, NgPtsType

, NgPanelMergeDupl
, NgPanelMergeMissing
, NgPanelMergeOrder

, NgRequired = 9000
, NgDataBase
, NgSystem
, NgEtc
, NgWorkingPanelExists
, NgGet4MData

, NgPanelPv
, NgPanelRv
, NgPanelCmi

, LangCodeKoVi
}

public static class ResultEx
{
    public static string ToCode(this ResultEnum result) => result switch
    {
        //kgl, 23.05.11 - 추가
        // FIRST BARCODE 등록
        ResultEnum.OkFirstBarcode => "OK.FIRSTBARCODE",
        // ROLL 등록
        ResultEnum.OkRoll => "OK.ROLL",
        // ROLL 공정 중복 허용
        ResultEnum.OkRollProcDupl => "OK.ROLL.PROC.DUPL",
        // ROLL 공정 중복 승인 완료
        ResultEnum.OkRollProcDuplAprv => "OK.ROLL.PROC.DUPL.APRV",
        // ROLL-PANEL 매칭정보 등록
        ResultEnum.OkRollPanelMap => "OK.ROLL.PANEL.MAP",
        // ROLL 시작
        ResultEnum.OkRollStart => "OK.ROLL.START",
        // ROLL 변경
        ResultEnum.OkRollChange => "OK.ROLL.CHANGE",
        // ROLL 취소
        ResultEnum.OkRollCancel => "OK.ROLL.CANCEL",
        // ROLL 종료
        ResultEnum.OkRollEnd => "OK.ROLL.END",
        // ROLL 불량등록
        ResultEnum.OkRollDefect => "OK.ROLL.DEFECT",
        // ROLL SPLIT 성공
        ResultEnum.OkRollSplit => "OK.ROLL.SPLIT",

        // PANEL 최초 등록
        ResultEnum.OkPanel => "OK.PANEL",
        // PANEL 인터락 등록
        ResultEnum.OkPanelInterlock => "OK.PANEL.INTERLOCK",
        // PANEL 공정 중복 허용
        ResultEnum.OkPanelDupl => "OK.PANEL.PROC.DUPL",
        // PANEL 공정 중복 승인 완료
        ResultEnum.OkPanelDuplAprv => "OK.PANEL.PROC.DUPL.APRV",
        // PANEL-PCS 매칭정보 등록
        ResultEnum.OkPanelPcsMap => "OK.PANEL.PCS.MAP",
        // PANEL-SHEET 매칭정보 등록
        ResultEnum.OkPanelSheetMap => "OK.PANEL.SHEET.MAP",
        // PANEL 시작
        ResultEnum.OkPanelStart => "OK.PANEL.START",
        // PANEL 변경
        ResultEnum.OkPanelChange => "OK.PANEL.CHANGE",
        // PANEL 취소
        ResultEnum.OkPanelCancel => "OK.PANEL.CANCEL",
        // PANEL 종료
        ResultEnum.OkPanelEnd => "OK.PANEL.END",
        // PANEL 불량등록
        ResultEnum.OkPanelDefect => "OK.PANEL.DEFECT",
        // 4m Data 
        ResultEnum.OkGet4MData => "OK.4MDATA",
        // PANEL MERGE 등록
        ResultEnum.OkPanelMerge => "OK.PANEL.MERGE",
        // PANEL PV, RV OK
        ResultEnum.OkPanelPvRv => "OK.PANEL.PV.RV",
        // 동도금 cmi 오류
        ResultEnum.OkPanelCmi => "OK.PANEL.CMI",


        //kgl, 23.05.11 - 추가
        // FIRST BARCODE 등록 불가
        ResultEnum.NgFirstBarcode => "NG.FIRSTBARCODE",

        ResultEnum.NgLotInterlock => "NG.LOT.INTERLOCK",

        // ROLL 인터락
        ResultEnum.NgRollInterlock => "NG.ROLL.INTERLOCK",
        // ROLL 공정 중복 불가
        ResultEnum.NgRollProcDupl => "NG.ROLL.PROC.DUPL",
        // ROLL 공정 중복 승인 요청
        ResultEnum.NgRollProcDuplAprv => "NG.ROLL.PROC.DUPL.APRV",
        // ROLL 공정 중복 승인 거부
        ResultEnum.NgRollProcDuplAprvReject => "NG.ROLL.PROC.DUPL.APRV.REJECT",
        // ROLL 공정 없음
        ResultEnum.NgRollProcNotExists => "NG.ROLL.PROC.NOT.EXISTS",
        // ROLL 공정 순서 이상(중간 누락 공정 있음)
        ResultEnum.NgRollProcOrder => "NG.ROLL.PROC.ORDER",
        // ROLL 장비 레시피
        ResultEnum.NgRollEqpRecipe => "NG.ROLL.EQP.RECIPE",
        // ROLL 장비 파라미터
        ResultEnum.NgRollEqpParam => "NG.ROLL.EQP.PARAM",
        // ROLL 자재 오류
        ResultEnum.NgRollMatNotExists => "NG.ROLL.MAT.NOT.EXISTS",
        // ROOL 툴 오류
        ResultEnum.NgRollToolNotExists => "NG.ROLL.TOOL.NOT.EXISTS",
        // ROLL 기타오류
        ResultEnum.NgRollEtc => "NG.ROLL.ETC",
        // ROLL 없는 롤바코드
        ResultEnum.NgRollNotExists => "NG.ROLL.NOT.EXISTS",
        // ROLL SPLIT 실패
        ResultEnum.NgRollSplit => "NG.ROLL.SPLIT",
        // ROLL CANCEL 실패
        ResultEnum.NgRollCancel => "NG.ROLL.CANCEL",

        // PANEL 인터락
        ResultEnum.NgPanelInterlock => "NG.PANEL.INTERLOCK",
        // PANEL 불량
        ResultEnum.NgPanelDefect => "NG.PANEL.DEFECT",
        // PANEL Holding
        ResultEnum.NgPanelHolding => "NG.PANEL.HOLDING",
        // PANEL 공정 중복 불가
        ResultEnum.NgPanelProcDupl => "NG.PANEL.PROC.DUPL",
        // PANEL 공정 중복 승인 요청
        ResultEnum.NgPanelProcDuplAprv => "NG.PANEL.PROC.DUPL.APRV",
        // PANEL 공정 중복 승인 거부
        ResultEnum.NgPanelProcDuplAprvReject => "NG.PANEL.PROC.DUPL.APRV.REJECT",
        // PANEL 공정 없음
        ResultEnum.NgPanelProcNotExists => "NG.PANEL.PROC.NOT.EXISTS",
        // PANEL 공정 순서 이상(중간 누락 공정 있음)
        ResultEnum.NgPanelProcOrder => "NG.PANEL.PROC.ORDER",

        // PANEL 장비 없음
        ResultEnum.NgPanelEqpNotExists => "NG.PANEL.EQP.NOT.EXISTS",
        // PANEL 장비 레시피
        ResultEnum.NgPanelEqpRecipe => "NG.PANEL.EQP.RECIPE",
        // PANEL 장비 파라미터
        ResultEnum.NgPanelEqpParam => "NG.PANEL.EQP.PARAM",
        // PANEL 자재 오류                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
        ResultEnum.NgPanelMatNotExists => "NG.PANEL.MAT.NOT.EXISTS",
        // PANEL 툴 오류
        ResultEnum.NgPanelToolNotExists => "NG.PANEL.TOOL.NOT.EXISTS",
        // PANEL 기타오류
        ResultEnum.NgPanelEtc => "NG.PANEL.ETC",
        // PANEL 없는 판넬바코드
        ResultEnum.NgPanelNotExists => "NG.PANEL.NOT.EXISTS",

        // PANEL MERGE 오류 (중복된 값이 있음)
        ResultEnum.NgPanelMergeDupl => "NG.PANEL.MERGE.DUPL",
        // PANEL MERGE 오류 (레이어 누락)
        ResultEnum.NgPanelMergeMissing => "NG.PANEL.MERGE.MISSING",
        // PANEL MERGE 오류 (순서 오류)
        ResultEnum.NgPanelMergeOrder => "NG.PANEL.MERGE.ORDER",

        // 필수항목 오류
        ResultEnum.NgRequired => "NG.REQUIRED",

        // 데이터베이스 오류
        ResultEnum.NgDataBase => "NG.DATABASE",
        // 시스템 오류
        ResultEnum.NgSystem => "NG.SYSTEM",
        // 기타 오류
        ResultEnum.NgEtc => "NG.ETC",
        // 4m Data 오류
        ResultEnum.NgGet4MData => "NG.4MDATA",
        // CANCEL 스캔 판넬 존재
        ResultEnum.NgWorkingPanelExists => "NG.WORKING.PANEL.EXISTS",

        //파라미터 Pv, Rv 오류
        ResultEnum.NgPanelPv => "NG.PANEL.PV",
        ResultEnum.NgPanelRv => "NG.PANEL.RV",

        //동도금 cmi 오류
        ResultEnum.NgPanelCmi => "NG.PANEL.CMI",


        //jjk, 23.11.27 error message 관련 enum 재정리 panel insert 부분 수정
        ResultEnum.NgBatchInterlock => "NG.BATCH.INTERLOCK", // 배치 인터락 
        ResultEnum.NgQime => "NG.QIME", //Qtime 
        ResultEnum.NgPtsType => "NG.PTSTYPE", //PTS 


        _ => "NG.UNKNOWN",
    };
}


public class ResultEntity : BaseEntity
{
    public void Init(ResultEnum resultNo, string langCode, string remark)
    {

        if (string.IsNullOrWhiteSpace(langCode))
        {
            string[] split = remark.Split('^');//.Skip(1).ToArray(); 
            Result = (int)resultNo < (int)ResultEnum.NgFirstBarcode;
            ResultNo = resultNo;
            ResultCode = resultNo.ToCode();

            if (split.Length == 1)
            {
                Remark =
                Result == false ?
                "[NG]" + string.Format(LanguageService.LangText(remark, CleanLang("ko-KR")), split) :
                "[OK]" + string.Format(LanguageService.LangText(remark, CleanLang("ko-KR")), split);
            }
            else
            {
                split = remark.Split('^').Skip(1).ToArray();
                Remark =
                Result == false ?
                "[NG]" + string.Format(LanguageService.LangText(remark.Split('^')[0], CleanLang("ko-KR")), split) :
                "[OK]" + string.Format(LanguageService.LangText(remark.Split('^')[0], CleanLang("ko-KR")), split);
            }
        }
        //KO-KR,VI-VN
        else if (langCode.Contains("#") || langCode.Contains("!"))
        {
            string[] split = remark.Split('^');//.Skip(1).ToArray(); 
            Result = (int)resultNo < (int)ResultEnum.NgFirstBarcode;
            ResultNo = resultNo;
            ResultCode = resultNo.ToCode();
            string kor = string.Empty;
            string vat = string.Empty;
            if (split.Length == 1)
            {
                kor =
                   Result == false ?
                   "[NG]" + string.Format(LanguageService.LangText(remark, CleanLang("ko-KR")), split) :
                   "[OK]" + string.Format(LanguageService.LangText(remark, CleanLang("ko-KR")), split);

                vat =
                   Result == false ?
                   "\r\n" + string.Format(LanguageService.LangText(remark, CleanLang("VI-VN")), split) :
                   "\r\n" + string.Format(LanguageService.LangText(remark, CleanLang("VI-VN")), split);
            }
            else
            {
                split = remark.Split('^').Skip(1).ToArray();
                kor =
                Result == false ?
                "[NG]" + string.Format(LanguageService.LangText(remark.Split('^')[0], CleanLang("ko-KR")), split) :
                "[OK]" + string.Format(LanguageService.LangText(remark.Split('^')[0], CleanLang("ko-KR")), split);

                vat =
                   Result == false ?
                   "\r\n" + string.Format(LanguageService.LangText(remark.Split('^')[0], CleanLang("VI-VN")), split) :
                   "\r\n" + string.Format(LanguageService.LangText(remark.Split('^')[0], CleanLang("VI-VN")), split);

            }
            Remark = kor + vat;

        }
        else
        {
            string[] split = remark.Split('^');//.Skip(1).ToArray(); 
            Result = (int)resultNo < (int)ResultEnum.NgFirstBarcode;
            ResultNo = resultNo;
            ResultCode = resultNo.ToCode();

            if (split.Length == 1)
            {
                Remark =
                Result == false ?
                "[NG]" + string.Format(LanguageService.LangText(remark, CleanLang(langCode)), split) :
                "[OK]" + string.Format(LanguageService.LangText(remark, CleanLang(langCode)), split);
            }
            else
            {
                split = remark.Split('^').Skip(1).ToArray();
                Remark =
                Result == false ?
                "[NG]" + string.Format(LanguageService.LangText(remark.Split('^')[0], CleanLang(langCode)), split) :
                "[OK]" + string.Format(LanguageService.LangText(remark.Split('^')[0], CleanLang(langCode)), split);
            }
        }

        ResultDt = DateTime.Now;
    }

    public void Init(ResultEnum resultNo, string langCode, string remark, string[] param)
    {
        Result = (int)resultNo < (int)ResultEnum.NgFirstBarcode;
        ResultNo = resultNo;
        ResultCode = resultNo.ToCode();
        Remark = string.Format(LanguageService.LangText(remark, CommonService.CleanLang(langCode)), param);
        ResultDt = DateTime.Now;
    }

    public string CleanLang(string lang) => lang?.ToUpper() switch
    {
        "KO" => "ko-KR",
        "KR" => "ko-KR",
        "KO-KR" => "ko-KR",

        "EN" => "en-US",
        "US" => "en-US",
        "EN-US" => "en-US",

        "VI" => "vi-VN",
        "VN" => "vi-VN",
        "VI-VN" => "vi-VN",
        "VN-VN" => "vi-VN",

        "KO-KR,VN-VN" => "ko-KR",
        "VN-VN,KO-KR" => "ko-KR",
        "KO-KR,VI-VN" => "ko-KR",
        "VI-VN,KO-KR" => "ko-KR",

        _ => "ko-KR"
    };

    /// <summary>
    /// kind type 컨버팅
    /// </summary>
    /// <param name="lstOrderCodeNo"></param>
    /// <returns></returns>
    public List<Dictionary<string, object>> ConvertKindType(List<Dictionary<string, object>> lstOrderCodeNo)
    {
        List<Dictionary<string, object>> tempItemS = new List<Dictionary<string, object>>();
        Dictionary<string, object> dicItem = new Dictionary<string, object>();
        if (lstOrderCodeNo == null)
        {
            dicItem.Add("Workorder", "");
            dicItem.Add("OperCode", "");
            dicItem.Add("OperSeqNo", "");
            return tempItemS = new List<Dictionary<string, object>>() { dicItem };
        }


        if (lstOrderCodeNo.Count == 0)
        {
            dicItem.Add("Workorder", "");
            dicItem.Add("OperCode", "");
            dicItem.Add("OperSeqNo", "");
            return tempItemS = new List<Dictionary<string, object>>() { dicItem };
        }
        else
        {
            foreach (Dictionary<string, object> dic in lstOrderCodeNo)
            {
                Dictionary<string, object> param = dic.ToCleanDic().ToDictionary(x => x.Key, y => y.Value!);
                if (param.Count > 0)
                {
                    dicItem = new Dictionary<string, object>();
                    dicItem.Add("operSeqNo",param.SafeTypeKey<int>("operSeqNo"));
                    dicItem.Add("workorder", param.SafeTypeKey<string>("workorder"));
                    dicItem.Add("operCode", param.SafeTypeKey<string>("operCode"));
                    tempItemS.Add(dicItem);
                }
                else
                {
                    dicItem = new Dictionary<string, object>();
                    dicItem.Add("operSeqNo", dic.SafeTypeKey<int>("operSeqNo"));
                    dicItem.Add("workorder", dic.SafeTypeKey<string>("workorder"));
                    dicItem.Add("operCode", dic.SafeTypeKey<string>("operCode"));
                    tempItemS.Add(dicItem);
                }
            }
            return tempItemS;
        }
    }

    public ResultEntity(List<Dictionary<string, object>>? lstOrderCodeNo, int historyNo, ResultEnum resultNo, string langCode, string remark = "", [CallerMemberName] string methodname = "")
    {
        Init(resultNo, langCode, remark);
        this.WorkorderAndOperSeqNo = ConvertKindType(lstOrderCodeNo);
        CommonService.PanelResultInsert(historyNo, this, methodname);
    }

    public ResultEntity(int historyNo, ResultEnum resultNo, string[] param, string langCode, string remark = "", [CallerMemberName] string methodname = "")
    {
        Init(resultNo, langCode, remark, param);

        CommonService.PanelResultInsert(historyNo, this, methodname);
    }

    public ResultEntity(List<Dictionary<string, object>>? lstOrderCodeNo, int historyNo, ResultEnum resultNo, int rowsCount, string langCode, string remark = "", [CallerMemberName] string methodname = "")
    {
        Init(resultNo, langCode, remark);
        RowCount = rowsCount;
        this.WorkorderAndOperSeqNo = ConvertKindType(lstOrderCodeNo);

        CommonService.PanelResultInsert(historyNo, this, methodname);
    }

    public ResultEntity(int historyNo, ResultEnum resultNo, int rowsCount, string[] param, string langCode, string remark = "", [CallerMemberName] string methodname = "")
    {
        Init(resultNo, langCode, remark);
        RowCount = rowsCount;

        CommonService.PanelResultInsert(historyNo, this, methodname);
    }

    public ResultEntity(List<Dictionary<string, object>>? lstOrderCodeNo, int historyNo, ResultEnum resultNo, Dictionary<string, object> returnValue, string langCode, string remark = "", [CallerMemberName] string methodname = "")
    {
        Init(resultNo, langCode, remark);
        ReturnValue = returnValue;
        this.WorkorderAndOperSeqNo = ConvertKindType(lstOrderCodeNo);
        CommonService.PanelResultInsert(historyNo, this, methodname);
    }

    public ResultEntity(int historyNo, ResultEnum resultNo, Dictionary<string, object> returnValue, string[] param, string langCode, string remark = "", [CallerMemberName] string methodname = "")
    {
        Init(resultNo, langCode, remark);
        ReturnValue = returnValue;

        CommonService.PanelResultInsert(historyNo, this, methodname);
    }

    public ResultEntity(List<Dictionary<string, object>>? lstOrderCodeNo, int historyNo, ResultEnum resultNo, List<Dictionary<string, object>> listReturnValue, string langCode, string remark = "", [CallerMemberName] string methodname = "")
    {
        Init(resultNo, langCode, remark);
        ListReturnValue = listReturnValue;
        this.WorkorderAndOperSeqNo = ConvertKindType(lstOrderCodeNo);

        CommonService.PanelResultInsert(historyNo, this, methodname);
    }

    public ResultEntity(int historyNo, ResultEnum resultNo, List<Dictionary<string, object>> listReturnValue, string[] param, string langCode, string remark = "", [CallerMemberName] string methodname = "")
    {
        Init(resultNo, langCode, remark);
        ListReturnValue = listReturnValue;

        CommonService.PanelResultInsert(historyNo, this, methodname);
    }


    //jjk, 23.05.18 - list Rowkey , groupkey return 용 추가
    public ResultEntity(int historyNo, ResultEnum resultNo, List<string> rowKey, string groupKey, string langCode, string remark = "", [CallerMemberName] string methodname = "")
    {
        Init(resultNo, langCode, remark);
        this.RowKey = rowKey;
        this.GroupKey = groupKey;

        CommonService.PanelResultInsert(historyNo, this, methodname);
    }

    public ResultEntity(int historyNo, ResultEnum resultNo, List<string> rowKey, string groupKey, string[] param, string langCode, string remark = "", [CallerMemberName] string methodname = "")
    {
        Init(resultNo, langCode, remark);
        this.RowKey = rowKey;
        this.GroupKey = groupKey;

        CommonService.PanelResultInsert(historyNo, this, methodname);
    }

    //jjk, 23.05.18 - list Rowkey , groupkey return 용 추가
    public ResultEntity(int historyNo, ResultEnum resultNo, int layers, List<string> rowKey, string groupKey, string langCode, string remark = "", [CallerMemberName] string methodname = "")
    {
        Init(resultNo, langCode, remark);
        this.RowKey = rowKey;
        this.GroupKey = groupKey;
        this.Layers = layers;
        CommonService.PanelResultInsert(historyNo, this, methodname);
    }

    //설비코드, ptsType등 리턴
    public ResultEntity(int historyNo, ResultEnum resultNo, int layers, List<string> rowKey, string groupKey, List<Dictionary<string, object>> listReturnValue, string langCode, string remark = "", [CallerMemberName] string methodname = "")
    {
        Init(resultNo, langCode, remark);
        this.RowKey = rowKey;
        this.GroupKey = groupKey;
        this.Layers = layers;
        this.ListReturnValue = listReturnValue;
        CommonService.PanelResultInsert(historyNo, this, methodname);
    }

    //

    [JsonIgnore]
    [XmlIgnore]
    public string CorpId { get; set; } = default!;
    [JsonIgnore]
    [XmlIgnore]
    public string FacId { get; set; } = default!;
    // 성공 or 실패
    public bool Result { get; set; }

    public ResultEnum ResultNo { get; set; }

    public string ResultCode { get; set; } = default!;
    public string Remark { get; set; } = default!;
    public int RowCount { get; set; }
    public List<string>? RowKey { get; set; }
    public string? GroupKey { get; set; }
    public DateTime ResultDt { get; set; }
    public Dictionary<string, object> ReturnValue { get; set; } = default!;

    //jjk, 23.06.07 - T-card 기준으로 자재 , tool , 작업자 등 리턴 값이 list 인 경우 리턴하기 위하여 추가
    public List<Dictionary<string, object>>? ListReturnValue { get; set; } = default!;

    public int? Layers { get; set; } = 0;

    //jjk, 23.11.27 - ng 목록 추가건
    public List<Dictionary<string, object>>? WorkorderAndOperSeqNo { get; set; } = default!;

    [System.Text.Json.Serialization.JsonIgnore]
    [Newtonsoft.Json.JsonIgnore]
    [XmlIgnore]
    public int? HistoryNo { get; set; }
    [System.Text.Json.Serialization.JsonIgnore]
    [Newtonsoft.Json.JsonIgnore]
    [XmlIgnore]
    public string? Method { get; set; }

    public override string ToString()
    {
        return $"{Result},{ResultNo},{ResultCode},{Remark},{ResultDt}";
    }
}
