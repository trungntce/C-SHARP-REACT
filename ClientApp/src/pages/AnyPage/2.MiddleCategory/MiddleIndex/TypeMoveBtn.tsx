import { Button } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default (param: any) => {
  const location = useLocation();
  const nav = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        onClick={() => {
          nav(`${location.pathname.slice(0, 20)}eqptype/${param.value}`);
        }}
        sx={{ width: "50%" }}
        variant="outlined"
      >
        이동
      </Button>
    </div>
  );
};
