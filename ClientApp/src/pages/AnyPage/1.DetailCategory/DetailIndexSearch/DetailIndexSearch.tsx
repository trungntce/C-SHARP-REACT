import moment from 'moment'
import { useSearchRef } from '../../../../common/hooks'
import AutoCombo from '../../../../components/Common/AutoCombo'
import SearchBase from '../../../../components/Common/Base/SearchBase'
import DateTimePicker from '../../../../components/Common/DateTimePicker'
import AlarmLayout from './AlarmLayout'
import myStyle from './DetailIndex.module.scss'
import EquipList from './EquipList'
import EquipMain from './EquipMain'
import { Dictionary } from '../../../../common/types'
import { alertBox } from '../../../../components/MessageBox/Alert'
import api from '../../../../common/api'
import { useRef, useState } from 'react'
import { Col, Row } from 'reactstrap'



const DetailIndexSearch = () =>{
  const [searchRef, getSearch] = useSearchRef();

  const [result, setResult] = useState<any>([]);

  const ttt = useRef<any>([]);

  const SearchHandler = async (_?: Dictionary) =>{
    const param = getSearch();
    if(!param.eqpCode){
      alertBox("설비코드 선택해주세요.");
    }

    const { data } = await api("get","MonitoringDetail/eqpproductivity", getSearch())
    if(data){
      setResult(data);
    }
  }

  return (
   <div className={myStyle.container}>
     <div style={{ flex: 7, width: "100%", height: "100%" }}>
       <AlarmLayout list={[]} selectedData={result[0]}>
         <div className={myStyle.layout}>
            <div className={myStyle.notice}>
              <div style={{width:"1000px"}}></div>
            <SearchBase ref={searchRef} searchHandler={SearchHandler}>
              <Col md={4}></Col>
              <Col  md={1} >
                <DateTimePicker name="toDt" placeholderText="조회종료" dateFormat="yyyy-MM-dd" />
              </Col>
              <Col  md={2}>
                <AutoCombo name="eqp_type" placeholder={"설비중분류"} mapCode="roomlist"/> {/* 설비중분류 */}
              </Col>
              <Col  md={2}>
                <AutoCombo name="eqpCode" placeholder={"설비코드"} mapCode="eqp" /> {/* 설비코드 */}
              </Col>
            </SearchBase>
            </div>
          <div className={myStyle.equipment}>
           <div className={myStyle.equipMain}>
            <div className="d-none d-lg-block" style={{ flex: 1 }}>
             <EquipList selectedData={result[0]} />
            </div>
            <div style={{display: "flex",flex: 2.5,}}>
             <EquipMain selectedData={result[0]} />
            </div>
           </div>
          </div>
      </div>
    </AlarmLayout>
     </div>
    <div className={myStyle.timeTable}>
      {/* <TimeTable /> */}
    </div>
   </div>
  )
}


export default DetailIndexSearch