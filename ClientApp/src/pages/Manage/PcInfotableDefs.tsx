import moment from 'moment';
import { Dictionary } from '../../common/types';
import { dateFormat } from '../../common/utility';

export const columnDefs: () => Dictionary[] = () => {
  return [
    {
      headerName: "일시",
      field: "inserttime",
      maxWidth: 150,
      valueFormatter: (d: any) => dateFormat(d.data.dasinserttime, "YYYY-MM-DD HH:mm:ss")
    },
  ];
}