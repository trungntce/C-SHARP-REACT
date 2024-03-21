import { useState } from 'react'
import myStyle from './BarcodeStatus.module.scss'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart } from 'recharts';
import { AgGridReact } from 'ag-grid-react';
import { barcodeStatusDefs, unHealthyDefs, recogDefs, mesDefs, fail4MDefs} from './BarcodeStatusDefs'
import api from '../../../common/api';
import moment from 'moment';
import { useQueries } from 'react-query';
import IOCMenu from '../IOCMenu';

const BarcodeStatus = () => {
  const [healthChkData, setHealthChkData] = useState<any[]>([]);
  const [unHealtyhData, setUnHealtyhData] = useState<any[]>([]);
  const [fail4MData, setFail4MData] = useState<any[]>([]);

  const [barcodeStatusData, setBarcodeStatusData] = useState<any[]>([]);

  const duratiJudge = (currentDate: Date, targetDate: Date) => {
    let current = moment(currentDate);
    let target = moment(targetDate);

    let duration = moment.duration(current.diff(target)).asMinutes();
    
    if(duration < 2) {
      return '취합중';
    }else if(duration < 5) {
      return '준비중';
    }else {
      return '미취합중';
    }
  };

  const duratiTime = (currentDate: Date, targetDate: Date) => {
    let current = moment(currentDate);
    let target = moment(targetDate);

    let duration = moment.duration(current.diff(target)).asMinutes();
    return duration.toFixed(0);
  }

  const results = useQueries([
    {
      queryKey: "InterlockMonitering_MES",
      queryFn: async () => {
        await api<any>("get", "healthcheck/listall", {}).then((result) => {
          var now = new Date();
          result.data.forEach((x:any) => {
            x.judge = duratiJudge(now, x["Heartbeat"]);
            x.duration = duratiTime(now, x["Heartbeat"])
          });
          
          const summaryData = [];
          const healthCnt = result.data.filter((x:any) => x.judge == "취합중" && x.Type == "P").length;
          const DegradedCnt = result.data.filter((x:any) => x.judge == "준비중" && x.Type == "P").length;
          const unhealthCnt = result.data.filter((x:any) => x.judge == "미취합중" && x.Type == "P").length;
          const totalCnt = result.data.filter((x:any) => x.Type == "P").length;
    
          summaryData.push({status: "취합중", cnt: healthCnt, per: (healthCnt / totalCnt * 100).toFixed(0)+ "%"});
          summaryData.push({status: "준비중", cnt: DegradedCnt, per: (DegradedCnt / totalCnt * 100).toFixed(0) + "%"});
          summaryData.push({status: "미취합중", cnt: unhealthCnt, per: (unhealthCnt / totalCnt * 100).toFixed(0) + "%"});
          summaryData.push({status: "Total", cnt: totalCnt, per: (totalCnt / totalCnt * 100).toFixed(0) + "%"});
    
          setHealthChkData(summaryData);
    
          setUnHealtyhData(result.data.filter((x:any) => x.judge == "미취합중"));
    
        });
      },
      refetchInterval: 600000,
    },
    {
      // queryKey: "InterlockMonitering_MES",
      // queryFn: async () => {
      //   await api<any>("get", "monitering/barcode", {}).then((result) => {
      //         console.log(result.data);
      //   });
      // },
      // refetchInterval: 600000,
    }
  ]);

const colors = ['#8884d8', '#82ca9d', '#ffc658', 'rgb(200,220,150)'];

const SimpleBox = (name: any, value: any) => {
  return (
    <div className={myStyle.box}>
      <div className={myStyle.boxName}>{name}</div>
      <div className={myStyle.boxValue}>{value}</div>
    </div>
  );
};

  return (
    <div className={myStyle.background}>
      <div className={myStyle.top}>
        <div className={myStyle.topLeft}>
          <div className={myStyle.title}>
            <IOCMenu title="Menu"></IOCMenu>
            MES 데이터 취합상태
          </div>
          <div className={myStyle.titleFlex}>
            <div className={myStyle.underTitle}>
              <div className={myStyle.underTitleLeft}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart width={500} height={300} data={healthChkData} margin={{ top: 5, right: 30, left: 20, bottom: 5, }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" tick={{ fill: 'white' }} axisLine={{ stroke: '#ffffff' }}/>
                    <YAxis tick={{ fill: 'white' }} axisLine={{ stroke: '#ffffff' }}/>
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cnt" fill="#8884d8" label={{ position: 'top' }}>
                      {healthChkData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className={myStyle.underTitleRight}>
                <div className="ag-theme-alpine-dark" style={{height: '96%', width: '100%'}}>
                  <AgGridReact
                    rowData={healthChkData}
                    columnDefs={mesDefs}>
                  </AgGridReact>
                </div>
              </div>
            </div>
            <div className="ag-theme-alpine-dark" style={{height: '50%', width: '100%'}}>
              <AgGridReact
                  rowData={unHealtyhData}
                  columnDefs={unHealthyDefs}>
              </AgGridReact>
            </div>
          </div>
        </div>
        <div className={myStyle.topRight}>
          <div className={myStyle.title}>
            4M 누락 Data 모니터링
          </div>
          <div className={myStyle.underTitle}>
            <div className="ag-theme-alpine-dark" style={{height: '100%', width: '100%'}}>
              <AgGridReact
                  rowData={fail4MData}
                  columnDefs={fail4MDefs}>
              </AgGridReact>
            </div>
          </div>
        </div>
      </div>
      <div className={myStyle.bottom}>
        <div className={myStyle.bottomLeft}>
          <div className={myStyle.title}>
            바코드 리더기 가동현황
          </div>
          <div className={myStyle.bottomUnderTitle}>
            <div className={myStyle.underTitleTop}>
              {SimpleBox("월간 실적", '')}
              {SimpleBox("주간 실적", '')}
              {SimpleBox("금일 실적", '')}
            </div>
            <div className={myStyle.underTitleBottom}>
              <div className="ag-theme-alpine-dark" style={{height: '100%', width: '100%'}}>
                <AgGridReact
                  rowData={barcodeStatusData}
                  columnDefs={barcodeStatusDefs}>
                </AgGridReact>
              </div>
            </div>
          </div>
        </div>
        <div className={myStyle.bottomRight}>
          <div className={myStyle.title}>
            이상 발생 현황
          </div>
          <div className={myStyle.bottomUnderTitle}>
            <div className={myStyle.underTitleTop}>
              {SimpleBox("일일 건수", '')}
              {SimpleBox("완료 건수", '')}
              {SimpleBox("미해결 건수", '')}
            </div>
            <div className={myStyle.underTitleBottom}>
              <div className="ag-theme-alpine-dark" style={{height: '100%', width: '100%'}}>
                <AgGridReact
                  rowData={barcodeStatusData}
                  columnDefs={recogDefs}>
                </AgGridReact>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default BarcodeStatus;