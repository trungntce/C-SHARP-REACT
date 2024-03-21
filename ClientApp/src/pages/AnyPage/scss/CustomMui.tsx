import { ThemeProvider, createTheme } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const CustomMui = ({ children }: Props) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#bdbdbd",
      },
      secondary: {
        main: "#f50057",
      },
      error: {
        main: "#f44336",
      },
      background: {
        default: "#21242B",
        paper: "#3F424A",
      },
      text: {
        primary: "#ffffff",
        secondary: "#ffffff",
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default CustomMui;
