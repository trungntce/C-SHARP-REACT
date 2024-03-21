import { useEffect } from "react";
import { useParams, redirect, useNavigate } from "react-router-dom";
import api from "../../common/api";

const ReDirectPage = () => {
  const { eqpcode } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    const GetUrl = async () => {
      const { data } = await api<any>(
        "get",
        "MonitoringDetail/getredirecturl",
        {
          eqpcode,
        }
      );
      if (data) {
        return nav(data, {
          replace: true,
        });
      }
    };
    GetUrl();
  }, [redirect]);
  return <div></div>;
};

export default ReDirectPage;
