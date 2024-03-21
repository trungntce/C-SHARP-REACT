import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./assets/scss/theme.scss";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

import VerticalLayout from "./components/VerticalLayout";
import BasicTable from "./pages/BasicTables";
import Dashboard from "./pages/Dashboard";
import Error1 from "./pages/Error/Error1";
import Error2 from "./pages/Error/Error2";
import ErrorBasic from "./pages/Error/ErrorBasic";
import ErrorCover from "./pages/Error/ErrorCover";
import Notifications from "./pages/Extended/Notifications";
import FormElements from "./pages/Forms/FormElements";
import FormMask from "./pages/Forms/FormMask";
import FormUpload from "./pages/Forms/FormUpload";
import FormValidation from "./pages/Forms/FormValidation";
import FormWizard from "./pages/Forms/FormWizard";
import AGGrid from "./pages/AGGrid";
import UiAlert from "./pages/UiComponents/UiAlert";
import UiButton from "./pages/UiComponents/UiButton";
import UiCard from "./pages/UiComponents/UiCard";
import UiCarousel from "./pages/UiComponents/UiCarousel";
import UiColors from "./pages/UiComponents/UiColors";
import UiDropdowns from "./pages/UiComponents/UiDropdowns";
import UiGeneral from "./pages/UiComponents/UiGeneral";
import UiGrid from "./pages/UiComponents/UiGrid";
import UiImages from "./pages/UiComponents/UiImages";
import UiModal from "./pages/UiComponents/UiModals";
import UiPlaceholders from "./pages/UiComponents/UiPlaceholders";
import UiProgressbar from "./pages/UiComponents/UiProgressbar";
import UiTabsAccordions from "./pages/UiComponents/UiTabsAccordions";
import UiTypography from "./pages/UiComponents/UiTypography";
import UiVideo from "./pages/UiComponents/UiVideo";
import Utilities from "./pages/UiComponents/Utilities";
import ChartsArea from "./pages/Charts/ChartsArea";
import ChartsBar from "./pages/Charts/ChartsBar";
import ChartsBoxplot from "./pages/Charts/ChartsBoxplot";
import ChartsBubble from "./pages/Charts/ChartsBubble";
import ChartsCandlestick from "./pages/Charts/ChartsCandlestick";
import ChartsColumn from "./pages/Charts/ChartsColumn";
import ChartsHeatmap from "./pages/Charts/ChartsHeatmap";
import ChartsLine from "./pages/Charts/ChartsLine";
import ChartsMixed from "./pages/Charts/ChartsMixed";
import ChartsPie from "./pages/Charts/ChartsPie";
import ChartsPolararea from "./pages/Charts/ChartsPolararea";
import Chartsradar from "./pages/Charts/Chartsradar";
import ChartsRadialbar from "./pages/Charts/ChartsRadialbar";
import ChartsScatter from "./pages/Charts/ChartsScatter";
import ChartsTimeline from "./pages/Charts/ChartsTimeline";
import ChartsTreemap from "./pages/Charts/ChartsTreemap";
import PageStarter from "./pages/Utility/PageStarter";
import PageFaqs from "./pages/Utility/PageFAQs";
import PagesComingsoon from "./pages/Utility/PageComingsoon";
import PageMaintenance from "./pages/Utility/PageMaintenance";
import CodeList from "./pages/Manage/CodeList";
import CodeGroupList from "./pages/Manage/CodeGroupList";
import LanguageList from "./pages/Manage/LanguageList";
import ErrorList from "./pages/Manage/ErrorList";
import Alert from "./components/MessageBox/Alert";

import NoticeList from "./pages/Manage/NoticeList";
import WorkerList from "./pages/Manage/WorkerList";
import StManagerList from "./pages/Manage/StManagerList";
import { withTranslation } from "react-i18next";
import AnyPage from "./pages/AnyPage/AnyPage";
import WorkCalendar from "./pages/Manage/WorkCalendar";
import Water1 from "./pages/Manage/Infra/WaterList";
import Water2 from "./pages/Manage/Infra/WaterList2";
import Water3 from "./pages/Manage/Infra/WaterList3";

import MenuList from "./pages/Manage/MenuList";
import TestList from "./pages/Manage/TestList";
import BBTList from "./pages/Manage/QualityMng/BBTList";
import BBTDetailList from "./pages/Manage/QualityMng/BBTDetailList";
import AOIVRSList from "./pages/Manage/QualityMng/AOIVRSList";
import VRSDetailList from "./pages/Manage/QualityMng/VRSDetailList";
import MiddleIndex from "./pages/AnyPage/2.MiddleCategory/MiddleIndex/MiddleIndex";
import DetailIndex from "./pages/AnyPage/1.DetailCategory/DetailIndex/DetailIndex";
import PreProcessing from "./pages/AnyPage/PreProcessing/PreProcessing";
import BBTAndDetailList from "./pages/Manage/QualityMng/BBTAndDetailList";
import ProgressBar from "./components/MessageBox/Progress";
import { setFooter } from "./components/VerticalLayout/Footer";
import TestGbr from "./pages/Manage/TestGbr";
import BarcodeList from "./pages/Manage/BarcodeList";
import PanelInterlockList from "./pages/Manage/Interlock/PanelInterlockList";
import Rework4MList from "./pages/Manage/Rework/Rework4MList";
import FdcInterlockList from "./pages/Manage/Interlock/FdcInterlockList";
import FdcOperStdList from "./pages/Manage/Interlock/FdcOperStdList";
import InterlockList from "./pages/Manage/InterlockList";
import InterlockHistoryList from "./pages/Manage/InterlockHistoryList";
import ReworkPanel from "./pages/Manage/ReworkPanelList";
import ReworkRoll from "./pages/Manage/ReworkRollList";
import DefectStatusList from "./pages/Manage/QualityMng/DefectStatusList";
import CmiList from "./pages/Manage/FacilityMng/CmiList";
import MiddleTest from "./pages/AnyPage/2.MiddleCategory/MiddleTest/MiddleTest";
import RecipeList from "./pages/Manage/Reference/Product/RecipeList";
import HeartbeatList from "./pages/Manage/HeartbeatList";
import ModelMapList from "./pages/Manage/Reference/Product/ModelMapList";
import ModelMapNewList from "./pages/Manage/Reference/Product/ModelMapNewList";
import ModelExtraMapList from "./pages/Manage/Reference/Product/ModelExtraMapList";
import Login from "./pages/User/Login";
import UserList from "./pages/Manage/UserList";
import KPIList from "./pages/Manage/KPI/KPIList";
import Password from "./pages/User/Password";
import UserProfile from "./pages/Manage/UserProfile";
import UsergroupList from "./pages/Manage/UsergroupList";
import CuPlating from "./pages/AnyPage/CuPlating/CuPlating";
import ParamList from "./pages/Manage/Reference/Product/ParamList";
import HealthcheckList from "./pages/Manage/HealthcheckList";
import PlcInfotableList from "./pages/Manage/PlcInfotableList";
import ModelMapApproveList from "./pages/Manage/Reference/Product/ModelMapApproveList";
import ModelApproveList from "./pages/Manage/Reference/Product/ModelApproveList";
import RecipeTemplateList from "./pages/Manage/Reference/Product/RecipeTemplateList";
import OperExtList from "./pages/Manage/OperExtList";
import ModelOperExtList from "./pages/Manage/ModelOperExtList";
import ModelOperExtNewList from "./pages/Manage/ModelOperExtNewList";
import DefectList from "./pages/Manage/DefectList";
// import EqpCmnFailureRateList from "./pages/Manage/Report/System/EqpCmnFailureRateList";
import EqpOffsetList from "./pages/Manage/Reference/Equipment/EqpOffsetList";
import EqpErrorMapList from "./pages/Manage/Reference/Equipment/EqpErrorMapList";
import Matrix4 from "./pages/IOC/Matrix4";
import PcInfotableList from "./pages/Manage/PcInfotableList";
import InterlockRollList from "./pages/Manage/InterlockRollList";
import EqpAreaGroupList from "./pages/Manage/Reference/Common/EqpAreaGroupList";
import EqpAreaList from "./pages/Manage/Reference/Common/EqpAreaList";
import HoldPanelList from "./pages/Manage/HoldPanelList";
import HoldRollList from "./pages/Manage/HoldRollList";
import DefectPanelList from "./pages/Manage/DefectPanelList";
import DefectRollList from "./pages/Manage/DefectRollList";
import Overview from "./pages/IOC/Overview";
import BarcodeErrorList from "./pages/Manage/Report/System/BarcodeErrorList";
import ReDirectPage from "./pages/AnyPage/ReDirectPage";
import TraceList from "./pages/Trace/TraceList";
import TraceMultiList from "./pages/Trace/TraceMultiList";
import TraceTest from "./pages/Trace/Test";
import TraceMultiList4M from "./pages/Trace/TraceMultiList4M";
import PanelJudgeDx from "./pages/Trace/PanelJudgeDx";
import BarcodeRecognitionList from "./pages/Manage/Report/System/BarcodeRecognitionList";
import NewConcept from "./pages/IOC/NewMatrix/NewConcept";
import ReworkList from "./pages/Manage/ReworkList";
import RecipeParamGroupList from "./pages/Manage/Reference/Product/RecipeParamGroupList";
import TraceList4M from "./pages/Trace/TraceList4M";
import ParamLayout from "./pages/ParameterPage/ParamLayout";
import RollSplitHistoryList from "./pages/Manage/QualityMng/RollSplitHistoryList";
import IOCPage from "./pages/IOC/IOCPage";
import BarcodeStatus from "./pages/IOC/Barcode/BarcodeStatus";
import DefectRateMonitoring from "./pages/IOC/DefectRate/DefectRateMonitoring";
import AffectParamList from "./pages/AffectPanel/AffectParamList";
import Ststatus from "./pages/Manage/OperationMng/Ststatus";
import NGPanelList from "./pages/AffectPanel/NGPanelList";
import InterlockMonitoring from "./pages/IOC/Interlock/InterlockMonitoring";
import EfficiencyReport from "./pages/Manage/OperationMng/EfficiencyReport";
import Yield from "./pages/IOC/Yield/Yield";
import LandingPage from "./pages/LandingPage/LandingPage";
import OperCapaList from "./pages/Manage/Reference/Product/OperCapaList";
import ParamRecipeList from "./pages/Manage/Reference/Product/ParamRecipeList";
import ManufactureProcess from "./pages/IOC/ManufactureProcess/ManufactureProcess";
import ApiHistoryList from "./pages/History/ApiHistoryList";
import NewConceptType1 from "./pages/IOC/NewMatrix/NewConceptType1";
import NewConceptType2 from "./pages/IOC/NewMatrix/NewConceptType2";
import NewConceptType3 from "./pages/IOC/NewMatrix/NewConceptType3";
import SpcErrorList from "./pages/Manage/QualityMng/InterlockMng/SpcErrorList";
import TotalErrorList from "./pages/Manage/QualityMng/InterlockMng/TotalErrorList";
import RawChart from "./pages/IOC/ParamChart/RawChart";
import RunList from "./pages/Panel4MEqp/RunList";
import SpcNextList from "./pages/NgReport/SpcNextList";
import ParamNextList from "./pages/NgReport/ParamNextList";
import RecipeNextList from "./pages/NgReport/RecipeNextList";
import ManualTransfer from "./pages/ErpTransfer/ManualTransfer";
import RollPnlMapList from "./pages/Manage/QualityMng/ProductionHistory/RollPnlMapList";
import RollPnlPcsMapList from "./pages/Manage/QualityMng/ProductionHistory/RollPnlPcsMapList";
import EqpRecipeParamCheckList from "./pages/Manage/Reference/Product/EqpRecipeParamCheckList";
import ParamNgList from "./pages/NgReport/ParamNgList";
import SpcNgList from "./pages/NgReport/SpcNgList";
import EqpSpcJudgeList from "./pages/NgReport/EqpSpcJudgeList";
import MutiNgList from "./pages/NgReport/MutiNgList";
import BBTNgList from "./pages/Manage/QualityMng/BBTNgList";
import PerformanceList from "./pages/AnyPage/PerformanceList/PerformanceList";
import AOIVRSNgList from "./pages/Manage/QualityMng/AOIVRSNgList";
import BarcodeReaderList from "./pages/Manage/Report/System/BarcodeReaderList";
import CommunicationStatusList from "./pages/Manage/Report/System/CommunicationStatusList";
import GoldPlating from "./pages/AnyPage/GoldPlating/GoldPlating";
import EMappingList from "./pages/Manage/QualityMng/EMappingList";
import EMappingLayoutList from "./pages/Manage/QualityMng/EMappingLayoutList";
import EMappingUnionList from "./pages/Manage/QualityMng/EMappingUnionList";
import CuPlatingExList from "./pages/Manage/Report/Chart/CuPlatingExList";
import Job4mMapList from "./pages/Manage/Report/System/Job4mMapList";
import EpStatusList from "./pages/Manage/Report/System/EpStatusList";
import CommunicationStatuDownList from "./pages/Manage/Report/System/CommunicationStatuDownList";
import EpStatusDownList from "./pages/Manage/Report/System/EpStatusDownList";
import DiWaterRoot from "./pages/AnyPage/DiWater/DiWater";
import PanelOperMiss from "./pages/Trace/PanelOperMiss";
import LotMaterialLife from "./pages/Trace/LotMaterialLife";
import ENIGNi from "./pages/AnyPage/ENIGNi/ENIGNi";
import FDCInterlock from "./pages/FDC/Interlock/FDCInterlock";
import SPCReport from "./pages/Manage/Report/SPC/SPCReport";
import BlackHoleDefectRate from "./pages/Manage/Report/BlackHoleDefectRate/BlackHoleDefectRate";
import ChemReport from "./pages/Manage/Report/Chemical/ChemReport";
import AOIDefectList from "./pages/Manage/QualityMng/AOIDefectList";
import BBTDefectList from "./pages/Manage/QualityMng/BBTDefectList";
import RecipeCopyList from "./pages/Manage/Reference/Product/RecipeCopyList";
import TotalErrorNewList from "./pages/Manage/QualityMng/InterlockMng/TotalErrorNewList";
import AOIVRSDataList from "./pages/Manage/QualityMng/AOIVRSDataList";
import BBTDataDetailList from "./pages/Manage/QualityMng/BBTDataDetailList";
import BBTDefectNewList from "./pages/Manage/QualityMng/BBTDefectNewList";
import AOIDefectNewList from "./pages/Manage/QualityMng/AOIDefectNewList";
import RawDataDown from "./pages/Manage/RawDataDown";
import ProcessControl from "./pages/AnyPage/Control4m/ProcessControl";
import SpcBlackList from "./pages/Manage/Report/SPC/SpcBlackList";


import ChecksheetGroupEqpList from "./pages/Manage/QualityMng/Checksheet/ChecksheetGroupEqpList";
import ChecksheetTypeEqpList from "./pages/Manage/QualityMng/Checksheet/ChecksheetTypeEqpList";
import ChecksheetResultList from "./pages/Manage/QualityMng/Checksheet/ChecksheetResultList";
import OperInspMatter4M from "./pages/Trace/OperInspMatter4M";
import ChecksheetGroupCleanList from "./pages/Manage/QualityMng/Checksheet/ChecksheetGroupCleanList";
import ChecksheetTypeCleanList from "./pages/Manage/QualityMng/Checksheet/ChecksheetTypeCleanList";
import ChecksheetReportList from "./pages/Manage/QualityMng/Checksheet/ChecksheetReportList";

import SidebarMainA from "../src/components/VerticalLayout/SidebarMainA";
import MessengerUserList from "./pages/Manage/Messenger/MessengerUserList";
import DetailIndexSearch from "./pages/AnyPage/1.DetailCategory/DetailIndexSearch/DetailIndexSearch";
import SetMessengerList from "./pages/Manage/Messenger/SetMessengerList";

import HpProfileList from "../src/pages/RMS/HpProfile";
import NewModelCheckSheetList from "../src/pages/RMS/NewModelCheckSheet";
import OperInspMatter4MModel from "./pages/Trace/OperInspMatter4MModel";
import ParamExtraList from "./pages/Manage/Reference/Product/ParamExtraList";
import PanelInterlockReportList from "./pages/Manage/Interlock/PanelInterlockReportList";

import DocManageStdList from "../src/pages/GPM/DocManageStd";
import DocManageMidList from "../src/pages/GPM/DocManageMid";

interface RouteProps {
  path: string;
  component: any;
  standalone?: boolean;
  anonymous?: boolean;
}

const routes: Array<RouteProps> = [
  { path: "/trace/:panelId?", component: <TraceList /> },
  { path: "/tracemulti", component: <TraceMultiList /> },
  { path: "/trace4m/:workorder?/:operSeqNo?", component: <TraceList4M /> },
  { path: "/tracemulti4m", component: <TraceMultiList4M /> },
  { path: "/paneljudgedx", component: <PanelJudgeDx /> },
  { path: "/tracetest", component: <TraceTest /> },

  { path: "/traceoperinsp4m", component: <OperInspMatter4M /> },
  { path: "/traceoperinsp4mmodel", component: <OperInspMatter4MModel /> },

  { path: "/panelopermiss", component: <PanelOperMiss /> },
  { path: "/lotmateriallife", component: <LotMaterialLife /> },

  { path: "/emap", component: <EMappingList /> },
  { path: "/emaplayout", component: <EMappingLayoutList /> },
  { path: "/emapunion", component: <EMappingUnionList /> },

  { path: "/historyapi", component: <ApiHistoryList /> },

  { path: "/affectparam", component: <AffectParamList /> },
  { path: "/ngpanel", component: <NGPanelList /> },

  { path: "/rawchart", component: <RawChart />, standalone: true },
  { path: "/manualtran", component: <ManualTransfer /> },

  { path: "/paramrecipe", component: <ParamRecipeList /> },

  { path: "/job4mmap", component: <Job4mMapList /> },

  { path: "/run4meqp", component: <RunList /> },
  { path: "/ngspcnext", component: <SpcNextList /> },
  { path: "/ngparamnext", component: <ParamNextList /> },
  { path: "/ngrecipenext", component: <RecipeNextList /> },

  { path: "/paramng", component: <ParamNgList /> },
  { path: "/spcng", component: <SpcNgList /> },
  { path: "/eqpspc", component: <EqpSpcJudgeList /> },

  { path: "/muting", component: <MutiNgList /> },

  { path: "/dashboard", component: <Dashboard /> },
  { path: "/basictable", component: <BasicTable /> },
  { path: "/aggrid", component: <AGGrid /> },

  { path: "/code", component: <CodeList /> },
  { path: "/codegroup", component: <CodeGroupList /> },

  { path: "/eqpareagroup", component: <EqpAreaGroupList /> },

  { path: "/opercapa", component: <OperCapaList /> },

  { path: "/stmanager", component: <StManagerList /> },

  { path: "/recipe", component: <RecipeList /> },
  { path: "/recipecopy", component: <RecipeCopyList /> },
  { path: "/recipetemplate", component: <RecipeTemplateList /> },

  { path: "/eqprecipeparam", component: <EqpRecipeParamCheckList /> },

  { path: "/modelmap", component: <ModelMapList /> },
  { path: "/modelextramap", component: <ModelExtraMapList/> },
  { path: "/modelmapapprove", component: <ModelMapApproveList /> },
  { path: "/modelapprove", component: <ModelApproveList /> },
  { path: "/modelmapnew", component: <ModelMapNewList /> },

  { path: "/param", component: <ParamList /> },
  { path: "/paramextra", component: <ParamExtraList /> },

  { path: "/recipeparamgroup", component: <RecipeParamGroupList /> },

  { path: "/defect", component: <DefectList /> },

  { path: "/healthcheck", component: <HealthcheckList /> },
  { path: "/operext", component: <OperExtList /> },
  { path: "/modeloperext", component: <ModelOperExtList /> },
  { path: "/modeloperextnew", component: <ModelOperExtNewList /> },

  { path: "/eqpoffset", component: <EqpOffsetList /> },
  { path: "/eqperrormap", component: <EqpErrorMapList /> },
  { path: "/eqparea", component: <EqpAreaList /> },

    { path: "/user", component: <UserList /> },    
  { path: "/usergroup", component: <UsergroupList /> },
  { path: "/messengerusergroup", component: <MessengerUserList /> },
  { path: "/setmessenger", component: <SetMessengerList /> },
  
  { path: "/profile", component: <UserProfile /> },
  { path: "/language", component: <LanguageList /> },
  { path: "/error", component: <ErrorList /> },
  { path: "/menu", component: <MenuList /> },
  { path: "/notice", component: <NoticeList /> },
  { path: "/workcalendar", component: <WorkCalendar /> },
  { path: "/worker", component: <WorkerList /> },

  { path: "/water", component: <Water1 /> },
  //{ path: "/water", component: <Water2 /> },
  //{ path: "/water", component: <Water3 /> },
  { path: "/panelinterlock", component: <PanelInterlockList /> },
  { path: "/panelinterlockreport", component: <PanelInterlockReportList /> },
  { path: "/rework4m", component: <Rework4MList /> },
  { path: "/fdcoper", component: <FdcOperStdList /> },
  { path: "/fdcinterlock", component: <FdcInterlockList /> },
  { path: "/interlock", component: <InterlockList /> },
  { path: "/interlockhistory", component: <InterlockHistoryList /> },
  { path: "/interlockroll", component: <InterlockRollList /> },
  { path: "/holdpanel", component: <HoldPanelList /> },
  { path: "/holdroll", component: <HoldRollList /> },
  { path: "/defectpanel", component: <DefectPanelList /> },
  { path: "/defectroll", component: <DefectRollList /> },
  { path: "/rework", component: <ReworkList /> },
  { path: "/reworkpanel", component: <ReworkPanel /> },
  { path: "/reworkroll", component: <ReworkRoll /> },

  { path: "/barcodestatus", component: <BarcodeStatus /> },

  { path: "/cmi", component: <CmiList /> },

  { path: "/spcerror", component: <SpcErrorList /> },
  { path: "/totalerror", component: <TotalErrorList /> },
  { path: "/newtotalerror", component: <TotalErrorNewList />},

  { path: "/bbt", component: <BBTList /> },
  { path: "/bbtanddetail", component: <BBTAndDetailList /> },
  { path: "/bbtdata", component: <BBTDataDetailList /> },
  { path: "/bbtanddetail/:type", component: <BBTAndDetailList /> },
  { path: "/bbtdetail", component: <BBTDetailList /> },
  { path: "/bbtng", component: <BBTNgList /> },

  { path: "/aoivrs/:workorder?/:dt?", component: <AOIVRSList /> },
  { path: "/aoivrsdata/:workorder?/:dt?", component: <AOIVRSDataList /> },

  { path: "/aoivrsng", component: <AOIVRSNgList /> },
  { path: "/vrsdetail", component: <VRSDetailList /> },
  { path: "/defectstatus", component: <DefectStatusList /> },

  { path: "/aoidefect", component: <AOIDefectList /> },
  { path: "/bbtdefect", component: <BBTDefectList /> },
  { path: "/bbtdefectnew", component: <BBTDefectNewList /> },
  { path: "/aoidefectnew", component: <AOIDefectNewList /> },


  { path: "/rollsplithistory", component: <RollSplitHistoryList /> },
  { path: "/rollpanelmaphistory", component: <RollPnlMapList /> },
  { path: "/rollpanelpcsmaphistory", component: <RollPnlPcsMapList /> },

  { path: "/plcinfotable", component: <PlcInfotableList /> },
  { path: "/pcinfotable/:eqpcode?", component: <PcInfotableList /> },

  { path: "/cupex", component: <CuPlatingExList /> },

  { path: "/spcreport", component: <SPCReport /> },
  { path: "/spcblacklist", component: <SpcBlackList /> },
  { path: "/chemreport", component: <ChemReport /> },

  // { path: "/eqpcmmfailurerate", component: <EqpCmnFailureRateList/> },
  { path: "/barcodeerror", component: <BarcodeErrorList /> },
  { path: "/barcoderecognition", component: <BarcodeRecognitionList /> },
  { path: "/barcodereader", component: <BarcodeReaderList /> },
  { path: "/communicationstatus", component: <CommunicationStatusList /> },
  {
    path: "/communicationstatudownlist",
    component: <CommunicationStatuDownList />,
  },
  { path: "/epstatus", component: <EpStatusList /> },
  { path: "/epstatusdownlist", component: <EpStatusDownList /> },
  { path: "/enigmonitoring", component: <ENIGNi />, standalone: true },

  { path: "/fdcinterlock", component: <FDCInterlock />, standalone: true },

  { path: "/blackholenglist", component: <BlackHoleDefectRate /> },

  { path: "/ui-alerts", component: <UiAlert /> },
  { path: "/ui-buttons", component: <UiButton /> },
  { path: "/ui-cards", component: <UiCard /> },
  { path: "/ui-carousel", component: <UiCarousel /> },
  { path: "/ui-dropdowns", component: <UiDropdowns /> },
  { path: "/ui-grid", component: <UiGrid /> },
  { path: "/ui-modals", component: <UiModal /> },
  { path: "/ui-images", component: <UiImages /> },
  {
    path: "/ui-progressbars",
    component: <UiProgressbar />,
  },
  { path: "/ui-general", component: <UiGeneral /> },
  { path: "/ui-colors", component: <UiColors /> },
  { path: "/ui-typography", component: <UiTypography /> },
  { path: "/ui-video", component: <UiVideo /> },
  { path: "/ui-tabs-accordions", component: <UiTabsAccordions /> },
  { path: "/ui-utilities", component: <Utilities /> },
  { path: "/ui-placeholders", component: <UiPlaceholders /> },

  { path: "/extended-notifications", component: <Notifications /> },

  { path: "/form-elements", component: <FormElements /> },
  { path: "/form-validation", component: <FormValidation /> },
  { path: "/form-uploads", component: <FormUpload /> },
  { path: "/form-wizard", component: <FormWizard /> },
  { path: "/form-mask", component: <FormMask /> },

  { path: "/charts-area", component: <ChartsArea /> },
  { path: "/charts-bar", component: <ChartsBar /> },
  { path: "/charts-boxplot", component: <ChartsBoxplot /> },
  { path: "/charts-bubble", component: <ChartsBubble /> },
  { path: "/charts-candlestick", component: <ChartsCandlestick /> },
  { path: "/charts-column", component: <ChartsColumn /> },
  { path: "/charts-heatmap", component: <ChartsHeatmap /> },
  { path: "/charts-line", component: <ChartsLine /> },
  { path: "/charts-mixed", component: <ChartsMixed /> },
  { path: "/charts-pie", component: <ChartsPie /> },
  { path: "/charts-polararea", component: <ChartsPolararea /> },
  { path: "/charts-radar", component: <Chartsradar /> },
  { path: "/charts-radialbar", component: <ChartsRadialbar /> },
  { path: "/charts-scatter", component: <ChartsScatter /> },
  { path: "/charts-timeline", component: <ChartsTimeline /> },
  { path: "/charts-treemap", component: <ChartsTreemap /> },

  { path: "/pages-starter", component: <PageStarter /> },
  { path: "/pages-faqs", component: <PageFaqs /> },

  { path: "/error-404-basic", component: <Error1 />, standalone: true },
  { path: "/error-404-cover", component: <Error2 />, standalone: true },
  { path: "/error-500-basic", component: <ErrorBasic />, standalone: true },
  { path: "/error-500-cover", component: <ErrorCover />, standalone: true },

  { path: "/checksheetemt", component: <ChecksheetGroupEqpList groupType="EMT" key="cks-group-emt" /> },
  { path: "/checksheetpm", component: <ChecksheetGroupEqpList groupType="PM" key="cks-group-pm" /> },
  { path: "/checksheetprod", component: <ChecksheetGroupEqpList groupType="PROD" key="cks-group-prod" /> },
  { path: "/checksheetclean", component: <ChecksheetGroupCleanList /> },
  { path: "/ckstypeemt", component: <ChecksheetTypeEqpList groupType="EMT" key="cks-type-emt" /> },
  { path: "/ckstypeepm", component: <ChecksheetTypeEqpList groupType="PM" key="cks-type-pm" /> },
  { path: "/ckstypeprod", component: <ChecksheetTypeEqpList groupType="PROD" key="cks-type-prod" /> },
  { path: "/ckstypeclean", component: <ChecksheetTypeCleanList /> },
  { path: "/checksheetresult", component: <ChecksheetResultList /> },
  { path: "/cheksheetreport", component: <ChecksheetReportList /> },
  {
    path: "/pages-comingsoon",
    component: <PagesComingsoon />,
    standalone: true,
  },
  {
    path: "/pages-maintenance",
    component: <PageMaintenance />,
    standalone: true,
  },
  { path: "/test", component: <TestList /> },
  { path: "/testgbr", component: <TestGbr /> },
  { path: "/barcode", component: <BarcodeList /> },
  { path: "/heartbeat", component: <HeartbeatList /> },

  { path: "/processcontrol", component: <ProcessControl />},

  {
    path: "/parameter/:eqpcode",
    component: <ParamLayout />,
    standalone: true,
  },
  { path: "/pre/:equipName?", component: <PreProcessing />, standalone: true },
  { path: "/cuplating/:eqpCode", component: <CuPlating />, standalone: true },
  { path: "/goldplating", component: <GoldPlating />, standalone: true },

  { path: "/matrix4/:eqpTypes", component: <Matrix4 />, standalone: true },
  { path: "/overview", component: <Overview />, standalone: true },

  { path: "/ststatusreport", component: <Ststatus /> },
  { path: "/efficiencyreport", component: <EfficiencyReport /> },
  { path: "/performancelist", component: <PerformanceList /> },

  { path: "/diwaterroot", component: <DiWaterRoot />, standalone: true },

  { path: "/", component: <LandingPage /> },

  {path: "/secret/page", component:<RawDataDown />, standalone: true},

  { path: "/hpprofile", component: <HpProfileList /> },

  { path: "/newmodelchecksheet", component: <NewModelCheckSheetList /> },
  { path: "/docmanagestd", component: <DocManageStdList /> },
    { path: "/docmanagemid", component: <DocManageMidList /> },
    { path: "/kpiManage", component: <KPIList /> },
];

const App = () => {
  const location = useLocation();
  const path = location?.pathname?.toLowerCase() ?? "";

  const loginToken = localStorage.getItem("auth-token");
  if (!loginToken && !path.startsWith("/anypage")) {
    return (
      <>
        <Routes>
          <Route path="/password" element={<Password />} />
          <Route path="*" element={<Login />} />
        </Routes>
        <Alert />
      </>
    );
  }

  // url 변경 글로벌 이벤트
  useEffect(() => {
    setFooter("");
  }, [location.pathname]);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <>
     <Routes>
              <Route path="/" element={<SidebarMainA isMobile={isMobile} />} />
        {routes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              route.standalone ? (
                <>{route.component}</>
              ) : (
                <VerticalLayout>{route.component}</VerticalLayout>
              )
            }
            key={idx}
          />
        ))}
          <Route path="iocpage" element={<IOCPage />}>
          <Route path="eqpmonitor" element={<NewConcept />} />
          <Route path="eqpmonitortype1" element={<NewConceptType1 />} />
          <Route path="eqpmonitortype2" element={<NewConceptType2 />} />
          <Route path="eqpmonitortype3" element={<NewConceptType3 />} />
          <Route path="barcodestatus" element={<BarcodeStatus />} />
          <Route path="manufactureProcess" element={<ManufactureProcess />} />

          <Route path="interlock" element={<InterlockMonitoring />} />
          <Route path="yield" element={<Yield />} />
          <Route path="defectrate" element={<DefectRateMonitoring />} />
        </Route>
        <Route path="/anypage" element={<AnyPage />}>
          <Route path=":eqpcode" element={<ReDirectPage />} />
          <Route
            path="facno/:facno/roomname/:roomname"
            element={<MiddleIndex />}
          />
          <Route
            path="facno/:facno/eqptype/:eqptype/:eqp"
            element={<DetailIndex />}
          />
          <Route path="test" element={<DetailIndexSearch />}/>
        </Route>
      </Routes>
      <Alert />
      <ProgressBar />
    </>
  );
};
export default App;
