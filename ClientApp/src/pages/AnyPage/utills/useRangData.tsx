import { useState } from "react";

const useRangeData: () => [
  any[],
  (d: any[]) => void,
  (is: Boolean) => void
] = () => {
  const [initData, setInitData] = useState<any[]>([]);

  const pushData = (newData: any[]) => {
    if (initData.length < newData.length) {
      setInitData(newData);
    } else {
      const SPLICE_LEN = newData.length;
      const prevData = initData.splice(SPLICE_LEN);
      setInitData(
        [...prevData, ...newData].sort(
          (a: any, b: any) =>
            new Date(a.time).getTime() - new Date(b.time).getTime()
        )
      );
    }
  };

  const isSearch = (is: Boolean) => {
    if (is) {
      setInitData([]);
    }
    return;
  };

  return [initData, pushData, isSearch];
};

export default useRangeData;
