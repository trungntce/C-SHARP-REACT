namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.DirectoryServices.Protocols;
using System.Dynamic;
using System.Reflection.Metadata.Ecma335;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using Framework;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Math;
using YamlDotNet.Core;

public class CommonService : BaseServiceEx
{
    public CommonService(ILogger logger) : base(logger)
    {
    }

    [ManualMap]
    public static string CleanLang(string lang) => lang?.ToUpper() switch
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

    public static string SetLangCodeRemark(ResultEnum resultNo, string langCode, string remark)
    {
        bool isResultChk = (int)resultNo < (int)ResultEnum.NgFirstBarcode;
        if (string.IsNullOrWhiteSpace(langCode))
        {
            string[] split = remark.Split('^');//.Skip(1).ToArray(); 
          

            if (split.Length == 1)
            {
                remark =
                isResultChk == false ?
                "[NG]" + string.Format(LanguageService.LangText(remark, CleanLang("ko-KR")), split) :
                "[OK]" + string.Format(LanguageService.LangText(remark, CleanLang("ko-KR")), split);
            }
            else
            {
                split = remark.Split('^').Skip(1).ToArray();
                remark =
                isResultChk == false ?
                "[NG]" + string.Format(LanguageService.LangText(remark.Split('^')[0], CleanLang("ko-KR")), split) :
                "[OK]" + string.Format(LanguageService.LangText(remark.Split('^')[0], CleanLang("ko-KR")), split);
            }
        }
        //KO-KR,VI-VN
        else if (langCode.Contains("#") || langCode.Contains("!"))
        {
            string[] split = remark.Split('^');//.Skip(1).ToArray(); 
            string kor = string.Empty;
            string vnm = string.Empty;
            if (split.Length == 1)
            {
                //map code 에서도 
                if (resultNo == ResultEnum.LangCodeKoVi)
                {
                    kor = string.Format(LanguageService.LangText(remark, CleanLang("ko-KR")), split);
                    vnm = "\r\n" + string.Format(LanguageService.LangText(remark, CleanLang("VI-VN")), split);
                }
                else
                {
                    kor =
                       isResultChk == false ?
                        "[NG]" + string.Format(LanguageService.LangText(remark, CleanLang("ko-KR")), split) :
                        "[OK]" + string.Format(LanguageService.LangText(remark, CleanLang("ko-KR")), split);

                    vnm =
                       isResultChk == false ?
                       "\r\n" + string.Format(LanguageService.LangText(remark, CleanLang("VI-VN")), split) :
                       "\r\n" + string.Format(LanguageService.LangText(remark, CleanLang("VI-VN")), split);
                }
            }
            else
            {
                split = remark.Split('^').Skip(1).ToArray();
                if (resultNo == ResultEnum.LangCodeKoVi)
                {
                    kor = string.Format(LanguageService.LangText(remark, CleanLang("ko-KR")), split);
                    vnm = "\r\n" + string.Format(LanguageService.LangText(remark, CleanLang("VI-VN")), split);
                }
                else
                {
                    kor =
                        isResultChk == false ?
                        "[NG]" + string.Format(LanguageService.LangText(remark.Split('^')[0], CleanLang("ko-KR")), split) :
                        "[OK]" + string.Format(LanguageService.LangText(remark.Split('^')[0], CleanLang("ko-KR")), split);

                    vnm =
                       isResultChk == false ?
                       "\r\n" + string.Format(LanguageService.LangText(remark.Split('^')[0], CleanLang("VI-VN")), split) :
                       "\r\n" + string.Format(LanguageService.LangText(remark.Split('^')[0], CleanLang("VI-VN")), split);
                }


            }
            remark = kor + vnm;

        }
        else
        {
            string[] split = remark.Split('^');//.Skip(1).ToArray(); 
            if (split.Length == 1)
            {
                remark =
                isResultChk == false ?
                "[NG]" + string.Format(LanguageService.LangText(remark, CleanLang(langCode)), split) :
                "[OK]" + string.Format(LanguageService.LangText(remark, CleanLang(langCode)), split);
            }
            else
            {
                split = remark.Split('^').Skip(1).ToArray();
                remark =
                isResultChk == false ?
                "[NG]" + string.Format(LanguageService.LangText(remark.Split('^')[0], CleanLang(langCode)), split) :
                "[OK]" + string.Format(LanguageService.LangText(remark.Split('^')[0], CleanLang(langCode)), split);
            }
        }
        return remark;
    }

    [ManualMap]
    public static string SplitModeCode(string modelCode)
    {
        string result = string.Empty;
        if (modelCode.Contains("-"))
        {
            string[] spliteItem = modelCode.Split(new char[] { '-' }, StringSplitOptions.RemoveEmptyEntries);
            if (spliteItem.Length == 5)
            {
                string modelHader = $"{spliteItem[0]}-{spliteItem[1].Substring(0, 2)}";
                string smiModelTitle = $"{spliteItem[3]}-{spliteItem[4]}";

                result = $"{modelHader}-{smiModelTitle}";
            }
            else if (spliteItem.Length == 3)
            {
                result = $"{spliteItem[0]}-{spliteItem[1].Substring(0, 2)}";
            }
        }
        else
            result = modelCode;


        return result;
    }

    public static (bool isFirstOper, bool isMB01Chk, int count, int operSeqNo) FirsOpertMaterialChk(OperationEntity currOperInfo)
    {
        //동박 체크 
        bool isMB01Chk = false;
        int materialCount = 0;
        int limit = 5;

        DataTable erpOperdt = DataContext.StringDataSet("@BarcodeApi.Common.ErpOperList", currOperInfo).Tables[0];
        if (erpOperdt.Rows.Count == 0)
        {
            //리턴 원인 분석 & 수정해야함 
            return new(false, isMB01Chk, materialCount, -1);
        }
        limit = erpOperdt.Rows.Count < 5 ? erpOperdt.Rows.Count : 5;

        int chkOperSeq = erpOperdt.Rows[0].TypeCol<int>("operation_seq_no");
        int nextOperSeqNo = 0;
        var item = erpOperdt.AsEnumerable().FirstOrDefault(x => x.TypeCol<int>("operation_seq_no") == chkOperSeq);
        DataTable bomDt = DataContext.StringDataSet("@BarcodeApi.Common.ErpBomList", currOperInfo).Tables[0];
        //첫공정이고 첫공정에 BOM이 없는 경우
        if (currOperInfo.OperSeqNo == chkOperSeq && bomDt.Rows.Count == 0)
        {
            for (int i = 0; i < limit; i++)
            {
                nextOperSeqNo = erpOperdt.Rows[i].TypeCol<int>("operation_seq_no");
                //자재 
                DataTable erpBomDt = DataContext.StringDataSet("@BarcodeApi.Common.ErpBomList", new { workorder = currOperInfo.Workorder, operSeqNo = nextOperSeqNo }).Tables[0];
                if (erpBomDt.Rows.Count == 0)
                    continue;

                //동박을 체크한다 MBO1이 있으면 
                isMB01Chk = erpBomDt.Rows[0].TypeCol<string>("item_code").Contains("MB01");
                if (isMB01Chk)
                {
                    materialCount = erpBomDt.Rows.Count;
                    break;
                }
            }
        }
        return (currOperInfo.OperSeqNo == chkOperSeq, isMB01Chk, materialCount, nextOperSeqNo);
    }

    public static (bool IsLaserChk , bool IsMB01Chk, int count, DataRow LaserBomItem) FirsOperLasertMaterialChk(OperationEntity currOperInfo)
    {
        DataRow laserBomItem = null;
        bool isLaserChk = false;
        bool isMB01Chk = false;
        int materialCount = 0;
        //Laser 일때 
        //1. 현재 작지의 라우팅을 모드 가져옴 
        DataTable erpOperdt = DataContext.StringDataSet("@BarcodeApi.Common.ErpOperList", currOperInfo).Tables[0];
        if (erpOperdt.Rows.Count == 0){}

        //2. Laser 공정이 있는지 확인하고 
        DataTable LaserDt = DataContext.StringDataSet("@BarcodeApi.Panel.LaserCodeCheck", currOperInfo).Tables[0];
        if(LaserDt.Rows.Count == 0)
        {
            //Laser 장비 없으니 깐 ok 로 넘어감
            return (false, false, materialCount, laserBomItem);
        }

        foreach (DataRow dtLaserRow in LaserDt.Rows)
        {
            var laserCode =  dtLaserRow.TypeCol<string>("code_name");

            var laserResult = erpOperdt.AsEnumerable().FirstOrDefault(x => x.TypeCol<string>("operation_code") == laserCode);
            if (laserResult == null)
                continue;

            dynamic objLaserMeterrial = new ExpandoObject();
            objLaserMeterrial.Workorder = laserResult.TypeCol<string>("job_no");
            objLaserMeterrial.OperSeqNo = laserResult.TypeCol<int>("operation_seq_no");
            objLaserMeterrial.OperCode = laserResult.TypeCol<string>("operation_code");

            if (objLaserMeterrial.OperSeqNo < currOperInfo.OperSeqNo)
                return (false, false, materialCount, laserBomItem);

            //3. Laser 공정순서에서 자재를 추출 
            DataTable bomDt = DataContext.StringDataSet("@BarcodeApi.Common.ErpBomList",RefineExpando(objLaserMeterrial)).Tables[0];
            if(bomDt.Rows.Count == 0)
            {
                return (isLaserChk, isMB01Chk, materialCount, laserBomItem);
            }

            if (bomDt.Rows[0].TypeCol<string>("item_code").ToUpper().Contains("MB01"))
            {
                laserBomItem = bomDt.Rows[0];
                isMB01Chk = true;
                isLaserChk = true;
                materialCount = bomDt.Rows.Count;
                break;
            }
            
        }

        return (isLaserChk, isMB01Chk, materialCount, laserBomItem);
    }


    //public static (ResultEnum resultEnum,Dictionary<string, object> dicReturn, OperationEntity returnOperInfo, string BarcodeKind ,string remark ) VerifiyBarcodeKind(string deviceId, string barcode, string langCode)
    public static (ResultEnum resultEnum, Dictionary<string, object> dicReturn, OperationEntity returnOperInfo, string BarcodeKind, string remark) VerifiyBarcodeKind(string deviceId, string barcode, string langCode)
    {
        dynamic obj = new ExpandoObject();
        obj.Barcode = barcode;
        obj.LangCode = langCode;

        OperationEntity currOperInfo = new OperationEntity();
        Dictionary<string, object> dicMaterialChk = new Dictionary<string, object>();
        Dictionary<string, object> dicMaterialLotChk = new Dictionary<string, object>();
        Dictionary<string, object> dicDivMaterialLotChk = new Dictionary<string, object>();
        Dictionary<string, object> dicRollSplitMaterialChk = new Dictionary<string, object>();

        Dictionary<string, object> dicWorker = new Dictionary<string, object>();
        Dictionary<string, object> dicTCardChk = new Dictionary<string, object>();
        Dictionary<string, object> dicEqpChk = new Dictionary<string, object>();
        Dictionary<string, object> dicToolChk = new Dictionary<string, object>();
        Dictionary<string, object> dicPanelChk = new Dictionary<string, object>();

        Dictionary<string, object> dicResult = null;

        #region TODO: Barcode 조회 하여 Kind 분기 

        if (barcode.Length <= 4)
        {
            obj.BarcodeKind = "ERROR";
            return (ResultEnum.NgFirstBarcode, dicResult, currOperInfo, (string)obj.BarcodeKind, $"@NG_NO_BARCODE^{barcode}^{"No Data"}");
        }
            

        //작업자
        //작업자 검색이 잘 안되는 경우가 많아 새 테이블로 쿼리 바뀜, erp 테이블로 직접 연결
        string[] workerCache = { "T20", "T21", "201", "120", "121", "220", "221", "204", "202", "203", "205", "H20", "H21" };
        if (Array.Exists(workerCache, x => x == barcode.Substring(0, 3)))
        {
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


                obj.BarcodeKind = "MAN";
                dicWorker.Add("barcodeKind", "MAN");
                dicResult = dicWorker;

                return (ResultEnum.OkFirstBarcode, dicResult, currOperInfo, (string)obj.BarcodeKind, "");
            }
        }


        //설비
        string[] eqpCache = { "M-0", "M-1", "M-2", "M-3", "MES", "S-0", "S-1", "S-2", "VOS", "VWC" };
        if (Array.Exists(eqpCache, x => x == barcode.Substring(0, 3)))
        {
            DataTable equipmentCheck = DataContext.StringDataSet("@BarcodeApi.Panel.EqpList", RefineExpando(obj)).Tables[0];
            if (equipmentCheck.Rows.Count > 0)
            {
                string barcodeName = equipmentCheck.Rows[0].TypeCol<string>("eqp_name");
                string eqpCode = equipmentCheck.Rows.Count.ToString();

                DataTable eqpUseCheck = DataContext.StringDataSet("@BarcodeApi.Panel.EqpUseCheck", RefineExpando(obj)).Tables[0];
                string groupKey = string.Empty;

                Dictionary<string, object> dicparam = new Dictionary<string, object>();
                dicparam.Add("eqpCode", barcode);

                //ip .address 추가 필요 향후 db에서 장비를 뒤져서 ip 를 보내줌
                DataTable pcIpAddressDt = DataContext.StringDataSet("@BarcodeApi.Common.PcIpAddressList", RefineParam(dicparam)).Tables[0];
                if (pcIpAddressDt.Rows.Count == 0)
                    dicEqpChk.Add("eqpIpAddress", "");
                else
                    dicEqpChk.Add("eqpIpAddress", pcIpAddressDt.Rows[0].TypeCol<string>("eqp_ip_address"));

                //설비별 완료 처리 
                if (eqpUseCheck.Rows[0].TypeCol<int>("cnt") > 0)
                {
                    groupKey = eqpUseCheck.Rows[0].TypeCol<string>("group_key");
                    obj.BarcodeKind = "EQP_ERROR";
                    dicEqpChk.Add("barcode", barcode);
                    dicEqpChk.Add("barcodeName", barcodeName);
                    dicEqpChk.Add("layerId", "");
                    dicEqpChk.Add("maker", "");
                    dicEqpChk.Add("eqpCount", eqpCode);
                    dicEqpChk.Add("materialCount", "");
                    dicEqpChk.Add("workerCode", "");
                    dicEqpChk.Add("toolCount", "");
                    dicEqpChk.Add("langCode", langCode);
                    dicEqpChk.Add("currentOperSeq", "");
                    dicEqpChk.Add("currentOperCode", "");
                    dicEqpChk.Add("currentOperName", "");
                    dicEqpChk.Add("barcodeKind", "EQUIPMENT");
                    dicEqpChk.Add("groupKey", groupKey);

                    return (ResultEnum.NgFirstBarcode, dicEqpChk, currOperInfo, obj.BarcodeKind, $"@NG_4M_END_PLEASE");//[NG] 현재 진행중인 4M 설비입니다. 기존 4M 공정  완료 후 등록 가능합니다.
                }

                dicEqpChk.Add("barcode", barcode);
                dicEqpChk.Add("barcodeName", barcodeName);
                dicEqpChk.Add("layerId", "");
                dicEqpChk.Add("maker", "");
                dicEqpChk.Add("eqpCount", eqpCode);
                dicEqpChk.Add("materialCount", "");
                dicEqpChk.Add("workerCode", "");
                dicEqpChk.Add("toolCount", "");
                dicEqpChk.Add("langCode", langCode);
                dicEqpChk.Add("currentOperSeq", "");
                dicEqpChk.Add("currentOperCode", "");
                dicEqpChk.Add("currentOperName", "");
                dicEqpChk.Add("groupKey", groupKey);

                obj.BarcodeKind = "EQUIPMENT";
                dicEqpChk.Add("barcodeKind", "EQUIPMENT");
                dicResult = dicEqpChk;

                return (ResultEnum.OkFirstBarcode, dicResult, currOperInfo, (string)obj.BarcodeKind, "");
            }
        }


        var toolCode = barcode.Contains('-') ? barcode[..barcode.LastIndexOf('-')] : barcode;
        obj.ToolCode = toolCode;
        //TOOL  
        string[] toolCache = { "TM", "DM", "TA", "VK", "s9", "S9", "TS", "KJ", "VY", "s1", "S1", "`", "DS", "RO", "AA" };
        if (Array.Exists(toolCache, x => x == barcode.Substring(0, 2)))
        {
            DataTable toolCheck = DataContext.StringDataSet("@BarcodeApi.Panel.ToolList", RefineExpando(obj)).Tables[0];
            if (toolCheck.Rows.Count > 0)
            {
                string barcodeName = toolCheck.Rows[0].TypeCol<string>("item_description");
                string toolCount = toolCheck.Rows.Count.ToString();//toolCheck.Rows[0].TypeCol<string>("item_code");

                dicToolChk.Add("barcode", barcode);
                dicToolChk.Add("barcodeName", barcodeName);
                dicToolChk.Add("layerId", "");
                dicToolChk.Add("maker", "");
                dicToolChk.Add("eqpCount", "");
                dicToolChk.Add("materialCount", "");
                dicToolChk.Add("workerCode", "");
                dicToolChk.Add("toolCount", toolCount);
                dicToolChk.Add("langCode", langCode);
                dicToolChk.Add("currentOperSeq", "");
                dicToolChk.Add("currentOperCode", "");
                dicToolChk.Add("currentOperName", "");

                obj.BarcodeKind = "TOOL";
                dicToolChk.Add("barcodeKind", "TOOL");
                dicResult = dicToolChk;


                return (ResultEnum.OkFirstBarcode, dicResult, currOperInfo, (string)obj.BarcodeKind, "");
            }
        }

        // 작지 캐시 임시 주석
        string[] tcardCache = { "S", "AA", "SD", "LJ", "VS", "17", "KP", "VO", "b2", "5S","VP", "19", "20", "P2", "VW", "sf",
                               "V6", "VM", "CP", "te", "VR", "c", "90", "ns", "vp", "B0", "SF", "BS", "cp", "kp", "VC", "VT",
                                "SS", "", "", "B2", "v" };
        if (Array.Exists(tcardCache, x => x == barcode.Substring(0, 2)))
        {
            obj.ToolCode = null;
           //목록 리턴 받는거 추가 해야 함 
           //공순이랑 공정명 구하기
           //작지?
           DataTable erpTcardorMaterialCheck = DataContext.StringDataSet("@BarcodeApi.Panel.ErpTcardOrMaterialCheck", RefineExpando(obj, true)).Tables[0];
            if (erpTcardorMaterialCheck.Rows.Count > 0)
            {
                var tcardOrMat = erpTcardorMaterialCheck.Rows[0].TypeCol<string>("job_status_code");
                if (tcardOrMat == "RELEASE") // TCARD
                {
                    obj.BarcodeKind = "TCARD";
                    DataTable currOper = DataContext.StringDataSet("@BarcodeApi.Panel.ErpNowOper", RefineExpando(obj, true)).Tables[0];
                    if (currOper.Rows.Count == 0)                                                         //$"@NG_NOT_WORKER_INFO^{0}^{1}"
                                                                                                          //$"@NG_RELEASE_NOT_FOUND^{barcode}"
                        return (ResultEnum.NgFirstBarcode, null, currOperInfo, (string)obj.BarcodeKind, $"@NG_RELEASE_NOT_FOUND^{barcode}"); //[NG.FirstBarcode] 현재 바코드는 RELESE 상태이나 공정 정보에서는 조회 할 수 없습니다.
                                                                                                                                             //return new (ResultEnum.NgFirstBarcode, langCode, "[NG.FirstBarcode] 현재 바코드는 RELESE 상태이나 공정 정보에서는 조회 할 수 없습니다.");

                    currOperInfo.Workorder = barcode;
                    currOperInfo.OperSeqNo = Convert.ToInt32(currOper.Rows[0].TypeCol<string>("operation_seq_no"));
                    currOperInfo.OperCode = currOper.Rows[0].TypeCol<string>("operation_code");
                    string currentOperName = currOper.Rows[0].TypeCol<string>("operation_description");

                    DataTable product = DataContext.StringDataSet("@BarcodeApi.Panel.ErpTcardProductName", RefineExpando(obj, true)).Tables[0];
                    if (product.Rows.Count == 0)
                        return (ResultEnum.NgFirstBarcode, null, currOperInfo, (string)obj.BarcodeKind, $"@NG_NO_BARCODE^{barcode}^{"Model"}");


                    string barcodeName = product.Rows[0].TypeCol<string>("bom_item_description");
                    string modelCode = product.Rows[0].TypeCol<string>("bom_item_code");
                    currOperInfo.ModelCode = modelCode;

                    #region 현재 T-Card ( 장비, 자재 , 툴 )조회 리턴용

                    int eqpCount = 0;
                    int materialCount = 0;
                    int toolCount = 0;
                    DataTable baseOperInfoDt = DataContext.StringDataSet("@BarcodeApi.Common.BaseOperInfo", RefineEntity(currOperInfo)).Tables[0];

                    //장비
                    DataTable erpEqpDt = DataContext.StringDataSet("@BarcodeApi.Common.ErpEqpCheckList", currOperInfo).Tables[0];
                    eqpCount = erpEqpDt.Rows.Count;//string.Join(",", erpEqpDt.Rows.Cast<DataRow>().Select(dtRow => dtRow.TypeCol<string>("bom_item_code")));

                    //자재 
                    DataTable erpBomDt = DataContext.StringDataSet("@BarcodeApi.Common.ErpBomList", currOperInfo).Tables[0];

                    //첫공정 bom 이고 
                    if (erpBomDt.Rows.Count != 0)
                    {
                        materialCount = erpBomDt.Rows.Count;
                    }
                    else
                    {
                        //Laser 일때 
                        var chkLaser = FirsOperLasertMaterialChk(currOperInfo);
                        if (chkLaser.IsLaserChk && chkLaser.IsMB01Chk)
                        {
                            materialCount = chkLaser.count;
                        }
                        else
                        {
                            var chkFirst = FirsOpertMaterialChk(currOperInfo);
                            if (chkFirst.isFirstOper)
                            {
                                if (baseOperInfoDt.Rows.Count != 0)
                                {
                                    var scanType = baseOperInfoDt.Rows[0].TypeCol<string>("scan_type");
                                    if (scanType == "R")
                                    {
                                        materialCount = 1;
                                    }
                                }

                                if (chkFirst.isMB01Chk)
                                {
                                    //첫번째 공정 BOM 체크 동박일 경우 
                                    materialCount = chkFirst.count;
                                }
                            }
                        }
                    }

                    //toolna
                    DataTable erpToolDt = DataContext.StringDataSet("@BarcodeApi.Common.ErpToolList", currOperInfo).Tables[0];
                    toolCount = erpToolDt.Rows.Count;//string.Join(",", erpToolDt.Rows.Cast<DataRow>().Select(dtRow => dtRow.TypeCol<string>("item_code")));

                    if (baseOperInfoDt.Rows.Count != 0)
                    {
                        var scanToolyn = baseOperInfoDt.Rows[0].TypeCol<string>("scan_tool_yn");
                        //N이면 Tool List 0개 그게 아니면 원래대로 
                        if (scanToolyn == "N")
                            toolCount = 0;
                    }
                    #endregion
                    dicMaterialLotChk.Clear();
                    dicTCardChk.Add("barcode", barcode);
                    dicTCardChk.Add("barcodeName", barcodeName);
                    dicTCardChk.Add("layerId", "");
                    dicTCardChk.Add("maker", "");
                    dicTCardChk.Add("eqpCount", eqpCount);
                    dicTCardChk.Add("materialCount", materialCount);
                    dicTCardChk.Add("workerCode", "");
                    dicTCardChk.Add("toolCount", toolCount);
                    dicTCardChk.Add("langCode", langCode);
                    dicTCardChk.Add("modelCode", modelCode);
                    dicTCardChk.Add("currentOperSeq", currOperInfo.OperSeqNo);
                    dicTCardChk.Add("currentOperCode", currOperInfo.OperCode);
                    dicTCardChk.Add("currentOperName", currentOperName);

                    obj.BarcodeKind = "TCARD";
                    dicTCardChk.Add("barcodeKind", "TCARD");
                    dicResult = dicTCardChk;

                    return (ResultEnum.OkFirstBarcode, dicResult, currOperInfo, (string)obj.BarcodeKind, "");

                }
                else if (tcardOrMat == "COMPLETED")
                {
                    //컴플리트라면 자재 인것인지 알수는 없으나 자재에 lot 번호가 있는지 검색하고 있으면 자재로 판단하고 없으면 리턴
                    //자재 LOT
                    //materialLotCheck = CommonService.ErpMaterialLotList(new() { new Dictionary<string, string>() { { "materialLot", barcode } } });
                    var completeTCard = CommonService.ErpMaterialLotList(new() { new Dictionary<string, string>() { { "materialLot", barcode } } });
                    //if (materialLotCheck.Rows.Count > 0)
                    if (completeTCard.Rows.Count > 0)
                    {
                        //string barcodeName = materialLotCheck.Rows[0].TypeCol<string>("item_description");
                        //string maker = materialLotCheck.Rows[0].TypeCol<string>("maker_description");
                        //string materialCode = materialLotCheck.Rows.Count.ToString();//materialLotCheck.Rows[0].TypeCol<string>("item_code");

                        //string barcodeName = materialLotCheck.Rows[0].TypeCol<string>("material_name");
                        //string maker = materialLotCheck.Rows[0].TypeCol<string>("maker_name");
                        //string materialCode = materialLotCheck.Rows.Count.ToString();//materialLotCheck.Rows[0].TypeCol<string>("item_code");

                        string barcodeName = completeTCard.Rows[0].TypeCol<string>("material_name");
                        string maker = completeTCard.Rows[0].TypeCol<string>("maker_name");
                        string materialCode = completeTCard.Rows.Count.ToString();//materialLotCheck.Rows[0].TypeCol<string>("item_code");

                        dicMaterialLotChk.Clear();
                        dicMaterialLotChk.Add("barcode", barcode);
                        dicMaterialLotChk.Add("barcodeName", barcodeName);
                        dicMaterialLotChk.Add("layerId", "");
                        dicMaterialLotChk.Add("maker", maker);
                        dicMaterialLotChk.Add("eqpCount", "");
                        dicMaterialLotChk.Add("materialCount", materialCode);
                        dicMaterialLotChk.Add("workerCode", "");
                        dicMaterialLotChk.Add("toolCount", "");
                        dicMaterialLotChk.Add("langCode", langCode);
                        dicMaterialLotChk.Add("currentOperSeq", "");
                        dicMaterialLotChk.Add("currentOperCode", "");
                        dicMaterialLotChk.Add("currentOperName", "");

                        obj.BarcodeKind = "MATERIAL";
                        dicMaterialLotChk.Add("barcodeKind", "MATERIAL");
                        dicResult = dicMaterialLotChk;

                        return (ResultEnum.OkFirstBarcode, dicResult, currOperInfo, (string)obj.BarcodeKind, "");
                    }
                    else
                    {
                        return (ResultEnum.NgFirstBarcode, null, currOperInfo, "ERROR", $"@NG_NO_BARCODE^{barcode}^{"COMPLETED"}");
                        //return new(historyNo, ResultEnum.NgFirstBarcode, langCode, "[NG.FirstBarcode] 검색된 바코드 정보가 없습니다. 다시한번 확인해 주십시오.");
                    }
                }
                //else
                //{

                //    return (ResultEnum.NgFirstBarcode, null, currOperInfo, "ERROR", $"@NG_TCARD_CHECK_PLEASE^{tcardOrMat}^{barcode}");
                //    //return new(historyNo, ResultEnum.NgFirstBarcode, langCode, $"[NG] 현재 T-Card 상태가 {tcardOrMat} 입니다. RELEASE 혹 COMPLETED 상태인지 확인하여 주십시오. ");
                //}
            }

        }

        //자재
        string[] defaultMaterialCache = { "CG0", "CG1", "INK", "MB0", "MB1", "MB2", "MB3", "MB9", "SB0", "SB1", "SB2", "SB3", "SP0", "SP1", "SP2", "SP3", "SP4", "SP9", "TES" };
        if (Array.Exists(defaultMaterialCache, x => x == barcode.Substring(0, 3)))
        {
            DataTable materialCheck = DataContext.StringDataSet("@BarcodeApi.Panel.ErpMaterialCheck", RefineExpando(obj, true)).Tables[0];
            if (materialCheck.Rows.Count > 0)
            {
                string barcodeName = materialCheck.Rows[0].TypeCol<string>("item_description");
                string maker = materialCheck.Rows[0].TypeCol<string>("maker_description");
                string materialCode = materialCheck.Rows.Count.ToString();//materialCheck.Rows[0].TypeCol<string>("item_code");

                dicMaterialChk.Add("barcode", barcode);
                dicMaterialChk.Add("barcodeName", barcodeName);
                dicMaterialChk.Add("layerId", "");
                dicMaterialChk.Add("maker", maker);
                dicMaterialChk.Add("eqpCode", "");
                dicMaterialChk.Add("materialCount", materialCode);
                dicMaterialChk.Add("workerCode", "");
                dicMaterialChk.Add("toolCount", "");
                dicMaterialChk.Add("langCode", langCode);
                dicMaterialChk.Add("currentOperSeq", "");
                dicMaterialChk.Add("currentOperCode", "");
                dicMaterialChk.Add("currentOperName", "");

                obj.BarcodeKind = "MATERIAL";
                dicMaterialChk.Add("barcodeKind", "MATERIAL");
                dicResult = dicMaterialChk;

                return (ResultEnum.OkFirstBarcode, dicResult, currOperInfo, (string)obj.BarcodeKind, "");
            }
        }

        //반제품 자재
        string[] divMaterialCache = { "99", "N1", "SD", "00", "T0", "WB", "TA", "C0", "C1", "M7", "M2", "MA", "B1", "20", "29", "M3", "DM", "W0", "T1", "SH", "RO", "B0", "B9", "M1", "M9", "MS", "LA", "SS", "Z_", "M5", "" };
        if (Array.Exists(divMaterialCache, x => x == barcode.Substring(0, 2)))
        {
            DataTable materialDivCheck = DataContext.StringDataSet("@BarcodeApi.Panel.ErpMaterialDivCheck", RefineExpando(obj, true)).Tables[0];
            if (materialDivCheck.Rows.Count > 0)
            {
                string barcodeName = materialDivCheck.Rows[0].TypeCol<string>("item_description");
                string materialCode = materialDivCheck.Rows.Count.ToString();//materialLotCheck.Rows[0].TypeCol<string>("item_code");

                dicDivMaterialLotChk.Add("barcode", barcode);
                dicDivMaterialLotChk.Add("barcodeName", barcodeName);
                dicDivMaterialLotChk.Add("layerId", "");
                dicDivMaterialLotChk.Add("maker", "");
                dicDivMaterialLotChk.Add("eqpCount", "");
                dicDivMaterialLotChk.Add("materialCount", materialCode);
                dicDivMaterialLotChk.Add("workerCode", "");
                dicDivMaterialLotChk.Add("toolCount", "");
                dicDivMaterialLotChk.Add("langCode", langCode);
                dicDivMaterialLotChk.Add("currentOperSeq", "");
                dicDivMaterialLotChk.Add("currentOperCode", "");
                dicDivMaterialLotChk.Add("currentOperName", "");

                obj.BarcodeKind = "MATERIAL";
                dicDivMaterialLotChk.Add("barcodeKind", "MATERIAL");
                dicResult = dicDivMaterialLotChk;

                return (ResultEnum.OkFirstBarcode, dicResult, currOperInfo, (string)obj.BarcodeKind, "");
            }
        }


        //자재 LOT
        DataTable materialLotCheck = CommonService.ErpMaterialLotList(new() { new Dictionary<string, string>() { { "materialLot", barcode } } });
        //DataTable materialLotCheck = DataContext.StringDataSet("@BarcodeApi.Panel.ErpMaterialLotCheck", new { lots = barcode }).Tables[0];
        if (materialLotCheck.Rows.Count > 0)
        {
            string barcodeName = materialLotCheck.Rows[0].TypeCol<string>("material_name");
            string maker = materialLotCheck.Rows[0].TypeCol<string>("maker_name");
            string materialCode = materialLotCheck.Rows.Count.ToString();//materialLotCheck.Rows[0].TypeCol<string>("item_code");

            dicMaterialLotChk.Add("barcode", barcode);
            dicMaterialLotChk.Add("barcodeName", barcodeName);
            dicMaterialLotChk.Add("layerId", "");
            dicMaterialLotChk.Add("maker", maker);
            dicMaterialLotChk.Add("eqpCount", "");
            dicMaterialLotChk.Add("materialCount", materialCode);
            dicMaterialLotChk.Add("workerCode", "");
            dicMaterialLotChk.Add("toolCount", "");
            dicMaterialLotChk.Add("langCode", langCode);
            dicMaterialLotChk.Add("currentOperSeq", "");
            dicMaterialLotChk.Add("currentOperCode", "");
            dicMaterialLotChk.Add("currentOperName", "");


        }


        //Roll Split 자재
        DataTable mesPanelCheck = DataContext.StringDataSet("@BarcodeApi.Panel.ErpRollSplitMaterialCheck", new { barcode = barcode }).Tables[0];
        if (mesPanelCheck.Rows.Count > 0)
        {
            var parentId = mesPanelCheck.Rows[0].TypeCol<string>("parent_id");
            materialLotCheck = CommonService.ErpMaterialLotList(new() { new Dictionary<string, string>() { { "materialLot", parentId } } });
            if (materialLotCheck.Rows.Count > 0)
            {
                string barcodeName = materialLotCheck.Rows[0].TypeCol<string>("material_name");
                string maker = materialLotCheck.Rows[0].TypeCol<string>("maker_name");
                string materialCode = materialLotCheck.Rows.Count.ToString();//materialLotCheck.Rows[0].TypeCol<string>("item_code");
                dicMaterialLotChk.Clear();
                dicMaterialLotChk.Add("barcode", barcode);
                dicMaterialLotChk.Add("barcodeName", barcodeName);
                dicMaterialLotChk.Add("layerId", "");
                dicMaterialLotChk.Add("maker", maker);
                dicMaterialLotChk.Add("eqpCount", "");
                dicMaterialLotChk.Add("materialCount", materialCode);
                dicMaterialLotChk.Add("workerCode", "");
                dicMaterialLotChk.Add("toolCount", "");
                dicMaterialLotChk.Add("langCode", langCode);
                dicMaterialLotChk.Add("currentOperSeq", "");
                dicMaterialLotChk.Add("currentOperCode", "");
                dicMaterialLotChk.Add("currentOperName", "");


            }
        }

        ////PAMEL
        DataTable panelRealTime = DataContext.StringDataSet("@BarcodeApi.Panel.PanelInterlock", new { panelId = barcode }).Tables[0];
        if (panelRealTime.Rows.Count > 0)
        {
            dicPanelChk.Add("panelId", panelRealTime.Rows[0].TypeCol<string>("panel_id"));
            dicPanelChk.Add("workorder", panelRealTime.Rows[0].TypeCol<string>("workorder"));
            dicPanelChk.Add("interlockYn", panelRealTime.Rows[0].TypeCol<string>("interlock_yn"));
            dicPanelChk.Add("defectYn", panelRealTime.Rows[0].TypeCol<string>("defect_yn"));
            dicPanelChk.Add("reworkApproveYn", panelRealTime.Rows[0].TypeCol<string>("rework_approve_yn"));
        }

        #endregion

        if (dicMaterialChk.Count > 0)
        {
            obj.BarcodeKind = "MATERIAL";
            dicMaterialChk.Add("barcodeKind", "MATERIAL");
            dicResult = dicMaterialChk;
        }
        else if (dicMaterialLotChk.Count > 0)
        {
            obj.BarcodeKind = "MATERIAL";
            dicMaterialLotChk.Add("barcodeKind", "MATERIAL");
            dicResult = dicMaterialLotChk;
        }
        else if (dicDivMaterialLotChk.Count > 0)
        {
            obj.BarcodeKind = "MATERIAL";
            dicDivMaterialLotChk.Add("barcodeKind", "MATERIAL");
            dicResult = dicDivMaterialLotChk;
        }
        else if (dicRollSplitMaterialChk.Count > 0)
        {
            obj.BarcodeKind = "MATERIAL";
            dicDivMaterialLotChk.Add("barcodeKind", "MATERIAL");
            dicResult = dicRollSplitMaterialChk;
        }
        else if (dicWorker.Count > 0)
        {
            obj.BarcodeKind = "MAN";
            dicWorker.Add("barcodeKind", "MAN");
            dicResult = dicWorker;
        }
        else if (dicTCardChk.Count > 0)
        {
            obj.BarcodeKind = "TCARD";
            dicTCardChk.Add("barcodeKind", "TCARD");
            dicResult = dicTCardChk;
        }
        else if (dicEqpChk.Count > 0)
        {
            obj.BarcodeKind = "EQUIPMENT";
            dicEqpChk.Add("barcodeKind", "EQUIPMENT");
            dicResult = dicEqpChk;
        }
        else if (dicToolChk.Count > 0)
        {
            obj.BarcodeKind = "TOOL";
            dicToolChk.Add("barcodeKind", "TOOL");
            dicResult = dicToolChk;
        }
        else if (dicPanelChk.Count > 0)
        {
            obj.BarcodeKind = "PANEL";
            dicPanelChk.Add("barcodeKind", "PANEL");
            dicResult = dicPanelChk;
        }
        else
        {
            obj.BarcodeKind = "ERROR";
            return (ResultEnum.NgFirstBarcode, dicResult, currOperInfo, (string)obj.BarcodeKind, $"@NG_NO_BARCODE^{barcode}^{"No Data"}");//$"[NG] 일치하는 바코드 정보가 없습니다.\r\n입력된 바코드 정보 : {barcode}"
        }

        return (ResultEnum.OkFirstBarcode, dicResult, currOperInfo, (string)obj.BarcodeKind, "");
    }

    /// <summary>
    /// index 추가 
    /// index 0 번이면 onehand_qty 검증 진행 자재수량이 있는지 체크
    /// index 1 번이면 onehand_qty 검증 제외 
    /// </summary>
    /// <param name="index"></param>
    /// <param name="lots"></param>
    /// <returns></returns>
    public static DataTable ErpMaterialLotList(List<Dictionary<string, string>> lots)
    {
        return DataContext.StringDataSet(
            "@BarcodeApi.Common.ErpMaterialLotList",    
            new { lots = JsonConvert.SerializeObject(lots) }).Tables[0];
    }

    public static int PanelHistoryInsert(string deviceId, PanelEntity? entity, dynamic paramJson, [CallerMemberName] string methodname = "")
    {
        if (entity == null)
            entity = new PanelEntity();

        entity.DeviceId = string.IsNullOrWhiteSpace(deviceId) ? entity.DeviceId : deviceId;
        entity.ParamJson = JsonConvert.SerializeObject(paramJson);
        entity.Method = methodname;

        return DataContext.Value<int, dynamic>("dbo.sp_panel_4m_history_insert", RefineEntity(entity));
    }


    public static int PanelResultInsert(int historyNo, ResultEntity entity, string methodName)
    {
        entity.HistoryNo = historyNo;
        entity.Method = methodName;

        return DataContext.NonQuery("dbo.sp_panel_4m_result_insert", RefineEntity(entity));
    }
}
