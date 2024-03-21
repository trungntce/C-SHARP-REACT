import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Outlet } from "react-router";
import myStyle from "./AnyPage.module.scss";
import { RecoilRoot } from "recoil";
import logo from "../../assets/images/logo-light.png";

const AnyPage = () => {
  const theme = createTheme({
    palette: {
      primary: {
        light: "#ffa726",
        main: "#f57c00",
        dark: "#ef6c00",
        contrastText: "rgba(0, 0, 0, 0.87)",
      },
    },
  });

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <div className={myStyle.layout}>
          <div
            style={{ display: "flex", justifyContent: "center" }}
            className="d-none d-lg-block "
          >
            <div style={{ width: "200px" }}></div>
            <img alt="iPhone_01" src={logo} />
          </div>
          <div style={{ display: "flex" }}>
            <Outlet />
          </div>
        </div>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default AnyPage;
