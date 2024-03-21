import { useQueries, useQuery } from 'react-query'
import style from './FDCInterlock.module.scss'
import api from '../../../common/api'
import IOCMenu from '../../IOC/IOCMenu'
import FDCGrid from '../BlackThemeGrid/FDCGrid'
import { useGridRef } from '../../../common/hooks'
import { FDCInterlockDefs } from './FDCInterlockDefs'

const FDCInterlock = () => {

    const [listgridref,setGridList] = useGridRef();
    const [anygridref,setAnyGridList] = useGridRef();

    const AllList = async () =>{
        //const { data } = await api<any>("get","FDCInterlock/list",{});
        //setGridList(data)
        setGridList([
        {
            modelName:"LJ41-18999A",
            description:"인터락중",
            auto:"BBT",
            startOperation:"S/E",
            endOpration:"BBT",
            lotNo:"VPN2023XXXXXXXXXX"
        },
        {
            modelName:"LJ41-18999A",
            description:"",
            auto:"AOI 내층",
            startOperation:"H/E",
            endOpration:"AOI 내층",
            lotNo:"VPN2023XXXXXXXXXX"
        },
        {
            modelName:"LJ41-18999A",
            description:"인터락중",
            auto:"AOI 외층",
            startOperation:"S/S",
            endOpration:"AOI 외층",
            lotNo:"VPN2023XXXXXXXXXX"
        }]);
    }

    const anyList = async () =>{
        //const { data } = await api<any>("get","FDCInterlock/list",{});
        
        setAnyGridList([]);
    }

    useQueries([
        {
            queryKey:"AllList",
            queryFn : AllList,
            refetchInterval : 10 * 60 * 1000,
        },
        {
            queryKey:"anyList",
            queryFn : anyList,
            refetchInterval : 12 * 50 * 1000,
        }
    ]);

    return(
        <div className={`${style.layout} p-3`}>
            <div className={style.header}>
                <IOCMenu title="FDC INTERLOCK"/>
            </div>
            <div className={style.body}>
                <FDCGrid ref={listgridref} title='FDC INTERLOCK' columnDefs={FDCInterlockDefs()} />
            </div>
        </div>
    )
}

export default FDCInterlock