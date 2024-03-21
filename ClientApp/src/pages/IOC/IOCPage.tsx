import { Outlet } from "react-router-dom";
import { RecoilRoot } from "recoil";
import myStyle from "./IOCLayout.module.scss";

const IOCPage = () => {
  return (
    <RecoilRoot>
      <div className={myStyle.layout}>
        <div style={{ display: "flex", height: "100%"}}>
          <Outlet />
        </div>
      </div>
    </RecoilRoot>
  );
};
export default IOCPage;
