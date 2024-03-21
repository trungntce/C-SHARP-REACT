import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../../../common/api";
import myStyle from "./ManufactureProcess.module.scss";
import { useQueries } from "react-query";
import IOCMenu from "../IOCMenu";

const ManufactureProcess = () => {

  // 실적
  const [innerOuterRealData, setInnerOuterRealData] = useState<any[]>([]);
  const [innerRealData, setInnerRealData] = useState<any[]>([]);
  const [outerRealData, setOuterRealData] = useState<any[]>([]);

  useQueries([
    {
      queryKey: "ManufactureProcess",
      queryFn: async () => {
        const { data } = await api<any>("get", "monitering/real", {});
        setInnerOuterRealData(data[0]);
        setInnerRealData(data[1]);
        setOuterRealData(data[2]);
      },
      refetchInterval: 600000,
    },
  ]);

  const CapaLabel = (props: any) => {
    const {x, y, stroke, value} = props;
    
    return (<text x={x-20} y={y+15}   style={{ fill: '#33A432' }} >{value}</text>)
  }

  const PerfomanceLabel = (props: any) => {
    const {x, y, stroke, value} = props;
    
    return (<text x={x+15} y={y+10}   style={{ fill: '#F2B705' }} >{value}</text>)
  }

  return(
    <>
      <div className={myStyle.mainContainer}>
        <div className={myStyle.leftContainer}>
          <div className={myStyle.topbarChart}>
            <div className={myStyle.title}>
              <IOCMenu title="Menu"></IOCMenu>
              <div style={{position: "absolute", left: "130px", fontSize: "18px"}}>공정별 제조현황 모니터링</div>
              사내+협력사
            </div>
            <div className={myStyle.box}>
              <div style={{width: "95%", height: "100%"}}>
                <ResponsiveContainer width="100%" height="100%" >
                  <BarChart width={500} height={100} margin={{ right:65 ,bottom: 80}} data={innerOuterRealData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis  dataKey="code1Desc" tick={{fill:"white"}} 
                            axisLine={{ stroke: '#ffffff' }} 
                            interval={0} 
                            angle={45}
                            textAnchor="start"
                            />
                    <YAxis tick={{ fill: 'white' }} axisLine={{ stroke: '#ffffff' }}/>
                    <Tooltip />
                    <Legend layout="horizontal" verticalAlign="top" align="right" />
                    <Bar  dataKey="capa" fill="#D93A05" barSize={10} label={<CapaLabel />} />
                    <Bar dataKey="perfomance" fill="#05B3F0" barSize={10} label={<PerfomanceLabel/>}>
                      <LabelList dataKey="actualRate" position="top" fill="white" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                </div>
                <div className={myStyle.text}>
                  단위: ㎡
                </div>
            </div>
          </div>
          <div className={myStyle.middlebarChart}>
            <div className={myStyle.title}>
              사내
            </div>
            <div className={myStyle.box}>
              <div style={{width: "95%", height: "100%"}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart width={500} height={100} margin={{ right:65 ,bottom: 80}} data={innerRealData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis  dataKey="code1Desc" tick={{fill:"white"}} 
                            axisLine={{ stroke: '#ffffff' }} 
                            interval={0} 
                            angle={45}
                            textAnchor="start"
                            />
                    <YAxis tick={{ fill: 'white' }} axisLine={{ stroke: '#ffffff' }}/>
                    <Tooltip />
                    <Legend layout="horizontal" verticalAlign="top" align="right" />
                    <Bar dataKey="capa" fill="#D93A05" barSize={10} label={<CapaLabel />} />
                    <Bar dataKey="perfomance" fill="#05B3F0" barSize={10} label={<PerfomanceLabel/>} >
                      <LabelList dataKey="actualRate" position="top" fill="white" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className={myStyle.text}>
                단위 : ㎡
              </div>
            </div>
          </div>
          <div className={myStyle.bottombarChart}>
            <div className={myStyle.title}>
              협력사
            </div>
            <div className={myStyle.box}>
              <div style={{width: "95%", height: "100%"}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart width={500} height={100} margin={{ right:65 ,bottom: 80}} data={outerRealData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis  dataKey="code1Desc" tick={{fill:"white"}} 
                            axisLine={{ stroke: '#ffffff' }} 
                            interval={0} 
                            angle={45}
                            textAnchor="start"
                            />
                    <YAxis tick={{ fill: 'white' }} axisLine={{ stroke: '#ffffff' }}/>
                    <Tooltip />
                    <Legend layout="horizontal" verticalAlign="top" align="right" />
                    <Bar dataKey="perfomance" fill="#05B3F0" barSize={10} label={<PerfomanceLabel/>} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className={myStyle.text}>
                단위 : ㎡
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ManufactureProcess;