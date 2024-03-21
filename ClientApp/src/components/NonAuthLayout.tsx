import React from "react";
//import withRouter
import withRouter from "./Common/withRouter";

const NonAuthLayout = ({ children }: any) => {
  document.body.setAttribute("data-layout-mode", "light");

  return <React.Fragment>{children}</React.Fragment>;
};

export default withRouter(NonAuthLayout);