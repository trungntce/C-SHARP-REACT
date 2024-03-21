import { useEffect, useCallback, useRef, useState } from "react";
import { Button, Col, Input, Label, Modal, Row, Table } from "reactstrap";
import { useApi, useGridRef, useSearchRef, useEditRef } from "../../common/hooks";

import { Dictionary, contentType } from "../../common/types";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import DateTimePicker from "../../components/Common/DateTimePicker";

import moment from "moment";
import GridBase, { changeColumns, GridAppendOrReplace, countDatarow } from "../../components/Common/Base/iGridBase";
import { CellClickedEvent } from "ag-grid-community";
import api from "../../common/api";

//import AutoCombo from "../../components/Common/AutoComboByCode";
import Select from "../../components/Common/Select";
import { downloadFile, showLoading, yyyymmddhhmmss } from "../../common/utility";
import { showProgress } from "../../components/MessageBox/Progress";
import { alertBox } from "../../components/MessageBox/Alert";
import { currencyFormat, dateFormat, devideFormat, nullGuard, percentFormat } from "../../common/utility";
import { useTranslation } from "react-i18next";
import LangTextBox from "../../components/Common/LangTextBox";


  
import HealthcheckEdit from '../Manage/HealthcheckEdit';

import DocManageEdit from './DocManageEdit';
import { forEach } from "lodash";
import { hide } from "@popperjs/core";


export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'H/P Profile Chart',
        },
    },
};




const DocManageStd = () => {

    const { t } = useTranslation();

    const [searchRef, getSearch] = useSearchRef();

    const [gridCountRef, setCountList] = useGridRef();


    const [modal_center, setmodal_center] = useState(false);
    const [ngData, setNgdata] = useState<Dictionary>([]);
    const workorder = useRef<string | null>(null);
    const panelId = useRef<string | null>(null);
    const eqpCode = useRef<string | null>(null);
    const eqpName = useRef<string | null>(null);
    const modelCode = useRef<string | null>(null);
    const operCode = useRef<string | null>(null);

    const { refetch } = useApi("DocManageStd?dept_filter=MID", getSearch, gridCountRef);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    let canvas: HTMLCanvasElement | null = null;
    let context: CanvasRenderingContext2D | null | undefined = null;
    let image = new Image();

    function dhxSerializeGridToJson(grid: any) {
        var json: any = {};
        grid.forEachRow(function (id: any) {
            json[id] = [];
            grid.forEachCell(id, function (cellObj: any, ind: any) {
                json[id][ind] = grid.cells(id, ind).getValue();
            });
        });
        return JSON.stringify(json);
    }

    const searchHandler = async (_?: Dictionary) => {


        // var myjson = dhxSerializeGridToJson(gridCountRef.current);
        //var myjson = dhxSerializeGridToJson(gridCountRef);

        const result = await refetch();
        if (result.data) {
            // const ngcountlist: Dictionary[] = result.data;

            for (var i = 0; i < result.data.length; i++)
                if (result.data[i].sort == 0) {
                    result.data[i].sort = 'TTL';
                    break;
                }

            setCountList(result.data);


            //const headerRow: Dictionary = {
            //  panelQty: 0,
            //  ngPcsTotal: 0,
            //  pcsTotal: 0,
            //  ngCnt: 0
            //}

            //ngTypes.forEach(ng=> {
            //  headerRow[ng.field] = 0;
            //});

            //if(ngcountlist.length) {
            //  ngcountlist.forEach((item) => {
            //    headerRow.itemName = "Total";
            //    headerRow.panelQty += item.panelQty;
            //    headerRow.ngPcsTotal += item.ngPcsTotal;
            //    headerRow.pcsTotal += item.pcsTotal;
            //    headerRow.ngCnt += item.ngCnt;

            //    //ngTypes.forEach(ng=> {
            //    //  headerRow[ng.field] += item[ng.field];
            //    //});
            //  });

            //  gridCountRef.current!.api.setPinnedTopRowData([headerRow]);
            //}
        }
    }





    const css = `
 
     label{         
           width: 248px;           
           height:25px !important;
           padding-left:10px;
     }

     table,tr,td{
         border:lightgray 1px solid;
         border-collapse: collapse;
     }

     .form-label
        {
          display: inline-block;
          padding-top: 8px !important;
        }

        .search-button-row{
            max-width: 360px !important;
        }

        .textcenter{
            text-align:center !important;
        }
        `




    const columnCountDefs = [
        {
            field: "sort", headerName: "No.", width: 50, headerClass: "no-leftborder cell-header-group-2 ",

        },
        //								

        {
            field: "reg_date", headerName: "등록일", width: 150, headerClass: "no-leftborder cell-header-group-2",

        },
        {
            field: "doc_no", headerName: "문서코드", width: 150, headerClass: "no-leftborder cell-header-group-2",

        },
        {
            field: "doc_type", headerName: "문서구분", width: 150, headerClass: "no-leftborder cell-header-group-2",
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {

                values: ["typeA", "typeB", "typeC"],
            }
            //editable: true,
            , cellStyle: { textAlign: 'center' }
        },
        {
            field: "doc_name", headerName: "문서명", width: 125, headerClass: "no-leftborder cell-header-group-2 textcenter"
            , cellStyle: { textAlign: 'center' }
           // ,editable: true
        },
        {
            field: "doc_content", headerName: "내용설명", width: 125, headerClass: "no-leftborder cell-header-group-2 textcenter"
             //, editable: true
        },
        {
            field: "att_file", headerName: "첨부파일", width: 200, headerClass: "no-leftborder cell-header-group-2 textcenter",
            
        },
        {
            field: "reg_user", headerName: "등록자", width: 125, headerClass: "no-leftborder cell-header-group-2 textcenter"
            //, editable: true
        },
        {
            field: "guid", headerName: "guid", width: 100, headerClass: "no-leftborder cell-header-group-2 textcenter"
            ,hide: true
            //, editable: true
        },
        {
            field: "file_name", headerName: "file_name", width: 100, headerClass: "no-leftborder cell-header-group-2 textcenter"
             , hide: true
        },
        {
            field: "file_path", headerName: "file_path", width: 100, headerClass: "no-leftborder cell-header-group-2 textcenter"
            //, editable: true
             , hide: true
        },
        {
            field: "use_yn", headerName: "사용여부", width: 125, headerClass: "no-leftborder cell-header-group-2 textcenter",

            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {

                values: ["Y", "N"],
            }
            //editable: true
            , cellStyle: { textAlign: 'center' }
        },
        {
            field: "remark", headerName: "비고", width: 125, headerClass: "no-leftborder cell-header-group-2 textcenter"
             //, editable: true
        },
        
    ]

    // set background colour on every row, this is probably bad, should be using CSS classes
    const rowStyle = { background: 'white' };

    // set background colour on even rows again, this looks bad, should be using CSS classes
    const getRowStyle = (params: any) => {

        if (params.node.data.Total == "OK") {
            return { background: 'lightgreen' };
        }
        if (params.node.data.sort == "TTL") {
            return { background: '#f8f8f8' };
        }
    };



    const changerows: any = [];


    const onCellEditingStopped = useCallback((event: any) => {

        //var cellDefs:any = gridCountRef.current!api.getEditingCells();
        var data = { ...event.data };

        var modelcode = data.doc_no;
        var changecol = event.column.colId;

        //console.log('-------------------', changecol);

        for (var i = 0; i < columnCountDefs.length; i++) {
            if (!columnCountDefs[i]) continue;
            if (!columnCountDefs[i].field) continue;
            var field = columnCountDefs[i].field;
            data[field] = data[field] || '';
        }

        for (var key in data) {
            if (key != changecol) data[key] = '';
            else {
                data.valu = data[key];
                data.type = changecol;
            }
        }

        data.doc_no = modelcode;

        data.changedtime = new Date();
        changerows.push(data);

        //const result = await api<any>("post", "DocManageStd/save", data);
        //data.success = result.data;
        //event.node.setDataValue(event.column.colId, (parseFloat(event.newValue) || '' ));
        //event.api.refreshCells({ force: true });
        //return event;

    }, []);



    async function postHandler(changerows: any) {

        if (!changerows) return;
        if (!changerows.length) return;
        var keeprows = changerows.filter((x: any) => { return (x.keep && !x.success) });
        var result: any = [];

        for (var i = 0; i < keeprows.length; i++) {
            if (!keeprows[i].model_code || !keeprows[i].type) continue;
            var res = await api<any>("post", "DocManageStd/save", keeprows[i]);
            result.push(res.data);

            keeprows[i].success = res.data;
        }

        if (!result) return;
        if (!result.length) return;

        var done = result.reduce((acc: any, cur: any) => {
            return (!acc ? 1 : acc && acc > 0) && (cur && cur > 0)
        });

        if (done) {
            await postHandler(keeprows);
            searchHandler();
        }
        else {
            alertBox('Save Failed(실패한), please try again!!');
        }
    }


    function saveHandler() {

        gridCountRef.current?.api.clearFocusedCell();
        //gridCountRef.current?.api.clearFocusedCell();
        //console.log(gridCountRef.current?.api.getEditingCells());

        setTimeout(async function () {
            changerows.push({ model_code: '', type: '', success: 1 });
            for (var i = 0; i < changerows.length - 1; i++)
                for (var j = i + 1; j < changerows.length; j++) {
                    var max = i;
                    if (changerows[i].model_code == changerows[j].model_code
                        && changerows[i].type == changerows[j].type) {
                        if (changerows[i].changedtime < changerows[j].changedtime)
                            max = j;
                    }
                    changerows[max].keep = 1;
                }
            await postHandler(changerows);
        }, 500);
    }

    //function onFileUpload() {
    //    // Create an object of formData
    //    const formData = new FormData();

    //    // Update the formData object
    //    formData.append(
    //        "myFile",
    //        selectedFile.selectedFile,
    //        selectedFile.name
    //    );

    //    // Details of the uploaded file
    //    console.log(selectedFile);

    //    // Request made to the backend api
    //    // Send formData object
    //    axios.post("api/uploadfile", formData);
    //};

    async function saveUpFile(row:any,) {
        if (row && row.files) {
            const formData = new FormData();
            formData.append('files', row.files);            
            const result = await api<any>("post", "DocManageStd/upload?doc_no=" + row.doc_no, formData);
            if (result.data || result.status == 200) {
                alertBox(t("@MSG_ALRAM_TYPE13")); {/*수정이 완료되었습니다.*/ }
                searchHandler();
            }
            else if (result.status != 200){
                alertBox("Upload file FAILED");
            }
        }
    }

    const [groupEditRef, groupSetForm, groupCloseModal] = useEditRef();

    const groupEditCompleteHandler = async (row: any, initRow: any) => {
        const newRow = { ...initRow, ...row };

        //console.log(row, row.files);
        newRow.dept_filter = 'MID';

            const result = await api<any>("post", 'DocManageStd/save', newRow);
            //console.log(result);
        if (result.data > 0 || result.status == 200) {
                row.doc_no = result.data;
                saveUpFile(row);
                alertBox(t("@MSG_ALRAM_TYPE13")); {/*작성이 완료되었습니다.*/ }
                searchHandler();
            } else if (result.data == -1 || result.status != 200) {
                alertBox("Save Data FAILED");
            }
        
    };
    function s2ab(s:any) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    const Minetype:any = { ".323": "text/h323", ".3g2": "video/3gpp2", ".3gp": "video/3gpp", ".3gp2": "video/3gpp2", ".3gpp": "video/3gpp", ".7z": "application/x-7z-compressed", ".aa": "audio/audible", ".AAC": "audio/aac", ".aaf": "application/octet-stream", ".aax": "audio/vnd.audible.aax", ".ac3": "audio/ac3", ".aca": "application/octet-stream", ".accda": "application/msaccess.addin", ".accdb": "application/msaccess", ".accdc": "application/msaccess.cab", ".accde": "application/msaccess", ".accdr": "application/msaccess.runtime", ".accdt": "application/msaccess", ".accdw": "application/msaccess.webapplication", ".accft": "application/msaccess.ftemplate", ".acx": "application/internet-property-stream", ".AddIn": "text/xml", ".ade": "application/msaccess", ".adobebridge": "application/x-bridge-url", ".adp": "application/msaccess", ".ADT": "audio/vnd.dlna.adts", ".ADTS": "audio/aac", ".afm": "application/octet-stream", ".ai": "application/postscript", ".aif": "audio/x-aiff", ".aifc": "audio/aiff", ".aiff": "audio/aiff", ".air": "application/vnd.adobe.air-application-installer-package+zip", ".amc": "application/x-mpeg", ".application": "application/x-ms-application", ".art": "image/x-jg", ".asa": "application/xml", ".asax": "application/xml", ".ascx": "application/xml", ".asd": "application/octet-stream", ".asf": "video/x-ms-asf", ".ashx": "application/xml", ".asi": "application/octet-stream", ".asm": "text/plain", ".asmx": "application/xml", ".aspx": "application/xml", ".asr": "video/x-ms-asf", ".asx": "video/x-ms-asf", ".atom": "application/atom+xml", ".au": "audio/basic", ".avi": "video/x-msvideo", ".axs": "application/olescript", ".bas": "text/plain", ".bcpio": "application/x-bcpio", ".bin": "application/octet-stream", ".bmp": "image/bmp", ".c": "text/plain", ".cab": "application/octet-stream", ".caf": "audio/x-caf", ".calx": "application/vnd.ms-office.calx", ".cat": "application/vnd.ms-pki.seccat", ".cc": "text/plain", ".cd": "text/plain", ".cdda": "audio/aiff", ".cdf": "application/x-cdf", ".cer": "application/x-x509-ca-cert", ".chm": "application/octet-stream", ".class": "application/x-java-applet", ".clp": "application/x-msclip", ".cmx": "image/x-cmx", ".cnf": "text/plain", ".cod": "image/cis-cod", ".config": "application/xml", ".contact": "text/x-ms-contact", ".coverage": "application/xml", ".cpio": "application/x-cpio", ".cpp": "text/plain", ".crd": "application/x-mscardfile", ".crl": "application/pkix-crl", ".crt": "application/x-x509-ca-cert", ".cs": "text/plain", ".csdproj": "text/plain", ".csh": "application/x-csh", ".csproj": "text/plain", ".css": "text/css", ".csv": "text/csv", ".cur": "application/octet-stream", ".cxx": "text/plain", ".dat": "application/octet-stream", ".datasource": "application/xml", ".dbproj": "text/plain", ".dcr": "application/x-director", ".def": "text/plain", ".deploy": "application/octet-stream", ".der": "application/x-x509-ca-cert", ".dgml": "application/xml", ".dib": "image/bmp", ".dif": "video/x-dv", ".dir": "application/x-director", ".disco": "text/xml", ".dll": "application/x-msdownload", ".dll.config": "text/xml", ".dlm": "text/dlm", ".doc": "application/msword", ".docm": "application/vnd.ms-word.document.macroEnabled.12", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".dot": "application/msword", ".dotm": "application/vnd.ms-word.template.macroEnabled.12", ".dotx": "application/vnd.openxmlformats-officedocument.wordprocessingml.template", ".dsp": "application/octet-stream", ".dsw": "text/plain", ".dtd": "text/xml", ".dtsConfig": "text/xml", ".dv": "video/x-dv", ".dvi": "application/x-dvi", ".dwf": "drawing/x-dwf", ".dwp": "application/octet-stream", ".dxr": "application/x-director", ".eml": "message/rfc822", ".emz": "application/octet-stream", ".eot": "application/octet-stream", ".eps": "application/postscript", ".etl": "application/etl", ".etx": "text/x-setext", ".evy": "application/envoy", ".exe": "application/octet-stream", ".exe.config": "text/xml", ".fdf": "application/vnd.fdf", ".fif": "application/fractals", ".filters": "Application/xml", ".fla": "application/octet-stream", ".flr": "x-world/x-vrml", ".flv": "video/x-flv", ".fsscript": "application/fsharp-script", ".fsx": "application/fsharp-script", ".generictest": "application/xml", ".gif": "image/gif", ".group": "text/x-ms-group", ".gsm": "audio/x-gsm", ".gtar": "application/x-gtar", ".gz": "application/x-gzip", ".h": "text/plain", ".hdf": "application/x-hdf", ".hdml": "text/x-hdml", ".hhc": "application/x-oleobject", ".hhk": "application/octet-stream", ".hhp": "application/octet-stream", ".hlp": "application/winhlp", ".hpp": "text/plain", ".hqx": "application/mac-binhex40", ".hta": "application/hta", ".htc": "text/x-component", ".htm": "text/html", ".html": "text/html", ".htt": "text/webviewhtml", ".hxa": "application/xml", ".hxc": "application/xml", ".hxd": "application/octet-stream", ".hxe": "application/xml", ".hxf": "application/xml", ".hxh": "application/octet-stream", ".hxi": "application/octet-stream", ".hxk": "application/xml", ".hxq": "application/octet-stream", ".hxr": "application/octet-stream", ".hxs": "application/octet-stream", ".hxt": "text/html", ".hxv": "application/xml", ".hxw": "application/octet-stream", ".hxx": "text/plain", ".i": "text/plain", ".ico": "image/x-icon", ".ics": "application/octet-stream", ".idl": "text/plain", ".ief": "image/ief", ".iii": "application/x-iphone", ".inc": "text/plain", ".inf": "application/octet-stream", ".inl": "text/plain", ".ins": "application/x-internet-signup", ".ipa": "application/x-itunes-ipa", ".ipg": "application/x-itunes-ipg", ".ipproj": "text/plain", ".ipsw": "application/x-itunes-ipsw", ".iqy": "text/x-ms-iqy", ".isp": "application/x-internet-signup", ".ite": "application/x-itunes-ite", ".itlp": "application/x-itunes-itlp", ".itms": "application/x-itunes-itms", ".itpc": "application/x-itunes-itpc", ".IVF": "video/x-ivf", ".jar": "application/java-archive", ".java": "application/octet-stream", ".jck": "application/liquidmotion", ".jcz": "application/liquidmotion", ".jfif": "image/pjpeg", ".jnlp": "application/x-java-jnlp-file", ".jpb": "application/octet-stream", ".jpe": "image/jpeg", ".jpeg": "image/jpeg", ".jpg": "image/jpeg", ".js": "application/x-javascript", ".json": "application/json", ".jsx": "text/jscript", ".jsxbin": "text/plain", ".latex": "application/x-latex", ".library-ms": "application/windows-library+xml", ".lit": "application/x-ms-reader", ".loadtest": "application/xml", ".lpk": "application/octet-stream", ".lsf": "video/x-la-asf", ".lst": "text/plain", ".lsx": "video/x-la-asf", ".lzh": "application/octet-stream", ".m13": "application/x-msmediaview", ".m14": "application/x-msmediaview", ".m1v": "video/mpeg", ".m2t": "video/vnd.dlna.mpeg-tts", ".m2ts": "video/vnd.dlna.mpeg-tts", ".m2v": "video/mpeg", ".m3u": "audio/x-mpegurl", ".m3u8": "audio/x-mpegurl", ".m4a": "audio/m4a", ".m4b": "audio/m4b", ".m4p": "audio/m4p", ".m4r": "audio/x-m4r", ".m4v": "video/x-m4v", ".mac": "image/x-macpaint", ".mak": "text/plain", ".man": "application/x-troff-man", ".manifest": "application/x-ms-manifest", ".map": "text/plain", ".master": "application/xml", ".mda": "application/msaccess", ".mdb": "application/x-msaccess", ".mde": "application/msaccess", ".mdp": "application/octet-stream", ".me": "application/x-troff-me", ".mfp": "application/x-shockwave-flash", ".mht": "message/rfc822", ".mhtml": "message/rfc822", ".mid": "audio/mid", ".midi": "audio/mid", ".mix": "application/octet-stream", ".mk": "text/plain", ".mmf": "application/x-smaf", ".mno": "text/xml", ".mny": "application/x-msmoney", ".mod": "video/mpeg", ".mov": "video/quicktime", ".movie": "video/x-sgi-movie", ".mp2": "video/mpeg", ".mp2v": "video/mpeg", ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".mp4v": "video/mp4", ".mpa": "video/mpeg", ".mpe": "video/mpeg", ".mpeg": "video/mpeg", ".mpf": "application/vnd.ms-mediapackage", ".mpg": "video/mpeg", ".mpp": "application/vnd.ms-project", ".mpv2": "video/mpeg", ".mqv": "video/quicktime", ".ms": "application/x-troff-ms", ".msi": "application/octet-stream", ".mso": "application/octet-stream", ".mts": "video/vnd.dlna.mpeg-tts", ".mtx": "application/xml", ".mvb": "application/x-msmediaview", ".mvc": "application/x-miva-compiled", ".mxp": "application/x-mmxp", ".nc": "application/x-netcdf", ".nsc": "video/x-ms-asf", ".nws": "message/rfc822", ".ocx": "application/octet-stream", ".oda": "application/oda", ".odc": "text/x-ms-odc", ".odh": "text/plain", ".odl": "text/plain", ".odp": "application/vnd.oasis.opendocument.presentation", ".ods": "application/oleobject", ".odt": "application/vnd.oasis.opendocument.text", ".one": "application/onenote", ".onea": "application/onenote", ".onepkg": "application/onenote", ".onetmp": "application/onenote", ".onetoc": "application/onenote", ".onetoc2": "application/onenote", ".orderedtest": "application/xml", ".osdx": "application/opensearchdescription+xml", ".p10": "application/pkcs10", ".p12": "application/x-pkcs12", ".p7b": "application/x-pkcs7-certificates", ".p7c": "application/pkcs7-mime", ".p7m": "application/pkcs7-mime", ".p7r": "application/x-pkcs7-certreqresp", ".p7s": "application/pkcs7-signature", ".pbm": "image/x-portable-bitmap", ".pcast": "application/x-podcast", ".pct": "image/pict", ".pcx": "application/octet-stream", ".pcz": "application/octet-stream", ".pdf": "application/pdf", ".pfb": "application/octet-stream", ".pfm": "application/octet-stream", ".pfx": "application/x-pkcs12", ".pgm": "image/x-portable-graymap", ".pic": "image/pict", ".pict": "image/pict", ".pkgdef": "text/plain", ".pkgundef": "text/plain", ".pko": "application/vnd.ms-pki.pko", ".pls": "audio/scpls", ".pma": "application/x-perfmon", ".pmc": "application/x-perfmon", ".pml": "application/x-perfmon", ".pmr": "application/x-perfmon", ".pmw": "application/x-perfmon", ".png": "image/png", ".pnm": "image/x-portable-anymap", ".pnt": "image/x-macpaint", ".pntg": "image/x-macpaint", ".pnz": "image/png", ".pot": "application/vnd.ms-powerpoint", ".potm": "application/vnd.ms-powerpoint.template.macroEnabled.12", ".potx": "application/vnd.openxmlformats-officedocument.presentationml.template", ".ppa": "application/vnd.ms-powerpoint", ".ppam": "application/vnd.ms-powerpoint.addin.macroEnabled.12", ".ppm": "image/x-portable-pixmap", ".pps": "application/vnd.ms-powerpoint", ".ppsm": "application/vnd.ms-powerpoint.slideshow.macroEnabled.12", ".ppsx": "application/vnd.openxmlformats-officedocument.presentationml.slideshow", ".ppt": "application/vnd.ms-powerpoint", ".pptm": "application/vnd.ms-powerpoint.presentation.macroEnabled.12", ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation", ".prf": "application/pics-rules", ".prm": "application/octet-stream", ".prx": "application/octet-stream", ".ps": "application/postscript", ".psc1": "application/PowerShell", ".psd": "application/octet-stream", ".psess": "application/xml", ".psm": "application/octet-stream", ".psp": "application/octet-stream", ".pub": "application/x-mspublisher", ".pwz": "application/vnd.ms-powerpoint", ".qht": "text/x-html-insertion", ".qhtm": "text/x-html-insertion", ".qt": "video/quicktime", ".qti": "image/x-quicktime", ".qtif": "image/x-quicktime", ".qtl": "application/x-quicktimeplayer", ".qxd": "application/octet-stream", ".ra": "audio/x-pn-realaudio", ".ram": "audio/x-pn-realaudio", ".rar": "application/octet-stream", ".ras": "image/x-cmu-raster", ".rat": "application/rat-file", ".rc": "text/plain", ".rc2": "text/plain", ".rct": "text/plain", ".rdlc": "application/xml", ".resx": "application/xml", ".rf": "image/vnd.rn-realflash", ".rgb": "image/x-rgb", ".rgs": "text/plain", ".rm": "application/vnd.rn-realmedia", ".rmi": "audio/mid", ".rmp": "application/vnd.rn-rn_music_package", ".roff": "application/x-troff", ".rpm": "audio/x-pn-realaudio-plugin", ".rqy": "text/x-ms-rqy", ".rtf": "application/rtf", ".rtx": "text/richtext", ".ruleset": "application/xml", ".s": "text/plain", ".safariextz": "application/x-safari-safariextz", ".scd": "application/x-msschedule", ".sct": "text/scriptlet", ".sd2": "audio/x-sd2", ".sdp": "application/sdp", ".sea": "application/octet-stream", ".searchConnector-ms": "application/windows-search-connector+xml", ".setpay": "application/set-payment-initiation", ".setreg": "application/set-registration-initiation", ".settings": "application/xml", ".sgimb": "application/x-sgimb", ".sgml": "text/sgml", ".sh": "application/x-sh", ".shar": "application/x-shar", ".shtml": "text/html", ".sit": "application/x-stuffit", ".sitemap": "application/xml", ".skin": "application/xml", ".sldm": "application/vnd.ms-powerpoint.slide.macroEnabled.12", ".sldx": "application/vnd.openxmlformats-officedocument.presentationml.slide", ".slk": "application/vnd.ms-excel", ".sln": "text/plain", ".slupkg-ms": "application/x-ms-license", ".smd": "audio/x-smd", ".smi": "application/octet-stream", ".smx": "audio/x-smd", ".smz": "audio/x-smd", ".snd": "audio/basic", ".snippet": "application/xml", ".snp": "application/octet-stream", ".sol": "text/plain", ".sor": "text/plain", ".spc": "application/x-pkcs7-certificates", ".spl": "application/futuresplash", ".src": "application/x-wais-source", ".srf": "text/plain", ".SSISDeploymentManifest": "text/xml", ".ssm": "application/streamingmedia", ".sst": "application/vnd.ms-pki.certstore", ".stl": "application/vnd.ms-pki.stl", ".sv4cpio": "application/x-sv4cpio", ".sv4crc": "application/x-sv4crc", ".svc": "application/xml", ".swf": "application/x-shockwave-flash", ".t": "application/x-troff", ".tar": "application/x-tar", ".tcl": "application/x-tcl", ".testrunconfig": "application/xml", ".testsettings": "application/xml", ".tex": "application/x-tex", ".texi": "application/x-texinfo", ".texinfo": "application/x-texinfo", ".tgz": "application/x-compressed", ".thmx": "application/vnd.ms-officetheme", ".thn": "application/octet-stream", ".tif": "image/tiff", ".tiff": "image/tiff", ".tlh": "text/plain", ".tli": "text/plain", ".toc": "application/octet-stream", ".tr": "application/x-troff", ".trm": "application/x-msterminal", ".trx": "application/xml", ".ts": "video/vnd.dlna.mpeg-tts", ".tsv": "text/tab-separated-values", ".ttf": "application/octet-stream", ".tts": "video/vnd.dlna.mpeg-tts", ".txt": "text/plain", ".u32": "application/octet-stream", ".uls": "text/iuls", ".user": "text/plain", ".ustar": "application/x-ustar", ".vb": "text/plain", ".vbdproj": "text/plain", ".vbk": "video/mpeg", ".vbproj": "text/plain", ".vbs": "text/vbscript", ".vcf": "text/x-vcard", ".vcproj": "Application/xml", ".vcs": "text/plain", ".vcxproj": "Application/xml", ".vddproj": "text/plain", ".vdp": "text/plain", ".vdproj": "text/plain", ".vdx": "application/vnd.ms-visio.viewer", ".vml": "text/xml", ".vscontent": "application/xml", ".vsct": "text/xml", ".vsd": "application/vnd.visio", ".vsi": "application/ms-vsi", ".vsix": "application/vsix", ".vsixlangpack": "text/xml", ".vsixmanifest": "text/xml", ".vsmdi": "application/xml", ".vspscc": "text/plain", ".vss": "application/vnd.visio", ".vsscc": "text/plain", ".vssettings": "text/xml", ".vssscc": "text/plain", ".vst": "application/vnd.visio", ".vstemplate": "text/xml", ".vsto": "application/x-ms-vsto", ".vsw": "application/vnd.visio", ".vsx": "application/vnd.visio", ".vtx": "application/vnd.visio", ".wav": "audio/wav", ".wave": "audio/wav", ".wax": "audio/x-ms-wax", ".wbk": "application/msword", ".wbmp": "image/vnd.wap.wbmp", ".wcm": "application/vnd.ms-works", ".wdb": "application/vnd.ms-works", ".wdp": "image/vnd.ms-photo", ".webarchive": "application/x-safari-webarchive", ".webtest": "application/xml", ".wiq": "application/xml", ".wiz": "application/msword", ".wks": "application/vnd.ms-works", ".WLMP": "application/wlmoviemaker", ".wlpginstall": "application/x-wlpg-detect", ".wlpginstall3": "application/x-wlpg3-detect", ".wm": "video/x-ms-wm", ".wma": "audio/x-ms-wma", ".wmd": "application/x-ms-wmd", ".wmf": "application/x-msmetafile", ".wml": "text/vnd.wap.wml", ".wmlc": "application/vnd.wap.wmlc", ".wmls": "text/vnd.wap.wmlscript", ".wmlsc": "application/vnd.wap.wmlscriptc", ".wmp": "video/x-ms-wmp", ".wmv": "video/x-ms-wmv", ".wmx": "video/x-ms-wmx", ".wmz": "application/x-ms-wmz", ".wpl": "application/vnd.ms-wpl", ".wps": "application/vnd.ms-works", ".wri": "application/x-mswrite", ".wrl": "x-world/x-vrml", ".wrz": "x-world/x-vrml", ".wsc": "text/scriptlet", ".wsdl": "text/xml", ".wvx": "video/x-ms-wvx", ".x": "application/directx", ".xaf": "x-world/x-vrml", ".xaml": "application/xaml+xml", ".xap": "application/x-silverlight-app", ".xbap": "application/x-ms-xbap", ".xbm": "image/x-xbitmap", ".xdr": "text/plain", ".xht": "application/xhtml+xml", ".xhtml": "application/xhtml+xml", ".xla": "application/vnd.ms-excel", ".xlam": "application/vnd.ms-excel.addin.macroEnabled.12", ".xlc": "application/vnd.ms-excel", ".xld": "application/vnd.ms-excel", ".xlk": "application/vnd.ms-excel", ".xll": "application/vnd.ms-excel", ".xlm": "application/vnd.ms-excel", ".xls": "application/vnd.ms-excel", ".xlsb": "application/vnd.ms-excel.sheet.binary.macroEnabled.12", ".xlsm": "application/vnd.ms-excel.sheet.macroEnabled.12", ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlt": "application/vnd.ms-excel", ".xltm": "application/vnd.ms-excel.template.macroEnabled.12", ".xltx": "application/vnd.openxmlformats-officedocument.spreadsheetml.template", ".xlw": "application/vnd.ms-excel", ".xml": "text/xml", ".xmta": "application/xml", ".xof": "x-world/x-vrml", ".XOML": "text/plain", ".xpm": "image/x-xpixmap", ".xps": "application/vnd.ms-xpsdocument", ".xrm-ms": "text/xml", ".xsc": "application/xml", ".xsd": "text/xml", ".xsf": "text/xml", ".xsl": "text/xml", ".xslt": "text/xml", ".xsn": "application/octet-stream", ".xss": "application/xml", ".xtp": "application/octet-stream", ".xwd": "image/x-xwindowdump", ".z": "application/x-compress", ".zip": "application/x-zip-compressed" }
    function getMinetype(fileName:any) {
        var ext:any = fileName.split('.');
        ext = '.'+ext[ext.length - 1];
        return Minetype[ext];
    }

    var saveData = (function () {
        var a :any = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (data: any, fileName: any) {
            console.log(getMinetype(fileName));
            var json = JSON.stringify(data),
                blob = new Blob([data], { type: "application/octet-stream" }),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());

    //var data = { x: 42, s: "hello, world", d: new Date() },
     //   fileName = "my-download.json";

    //saveData(data, fileName);


    var doc_no = "";
    const onCellClicked1 = async (event: CellClickedEvent) => {
        //console.log(event.colDef, event.data);        
        doc_no = event.data["doc_no"];
        var file_name = event.data["att_file"]
        if (event.colDef.field == "att_file") {
            var tes = (await api<any>("downpost", 'DocManageStd/getfile', event.data));

            saveData(tes.data, file_name);
            console.log(tes);
            //console.log(JSON.stringify(tes.data));
        }
    }

   

    return (
        <>
            <style>
                {css}
            </style>
            <ListBase
                editHandler={() => {
                    groupSetForm({});
                }}
                deleteHandler={async() => {
                    const result = await api<any>("post", 'DocManageStd/delete', { doc_no: doc_no });
                    //console.log(result);
                    if (result.data > 0 || result.status == 200) {
                        alertBox(t("@MSG_ALRAM_TYPE13"));
                        searchHandler();
                    }
                }}
                folder="GPM"
                title="표준문서 관리(MID use)"
                postfix="표준문서 관리(MID use)"
                icon="check-square"
               
                search={
                    <SearchBase
                        ref={searchRef}
                        searchHandler={searchHandler}                       
                        postButtons1={
                            <>
                               

                            </>
                        }

                    >
                        {/*    <table className="search-row"  >*/}
                        {/*        <tbody >*/}
                        {/*    <tr>*/}
                        {/*    */}{/*    <td style={{ maxWidth: "115px", display:"none" }}>*/}
                        {/*    */}{/*<DateTimePicker name="fromDt" defaultValue={moment().add(-10, 'days').toDate()} placeholderText="조회시작" required={true} />*/}
                        {/*    */}{/*        </td>*/}

                        {/*          <td>.</td>*/}

                        {/*            </tr>*/}
                        {/*    </tbody >*/}
                        {/*</table>*/}
                    </SearchBase>
                }>

                <Row style={{ height: "99%" }}>
                    <Col md='12' style={{ height: "99%" }}>
                        <div style={{ width: "calc(100% - 85px)" }}><h5 style={{ paddingTop: '10px', paddingLeft: '6px' }} id="panelTitle">표준문서 관리 (MID use)</h5></div>
                        <GridBase
                            ref={gridCountRef}
                            columnDefs={columnCountDefs}
                            className="ag-grid-bbt"
                            containerId="grid-bbt-wrap"
                            alwaysShowHorizontalScroll={true}
                            rowStyle={rowStyle}
                            getRowStyle={getRowStyle}
                            wrapHeaderText={true}
                            autoHeaderHeight={true}
                            onCellClicked={onCellClicked1 }
                            onCellEditingStopped={onCellEditingStopped}
                            onGridReady={() => {
                                setCountList([]);
                            }}
                        />
                    </Col>


                </Row>


            </ListBase>

            <DocManageEdit
                ref={groupEditRef}
                onComplete={groupEditCompleteHandler} />
        </>
    )
}

export default DocManageStd;
