import {
  Chart,
  Series,
  CommonSeriesSettings,
  Legend,
  ValueAxis,
  Title,
  Export,
  Tooltip,
  Label,
} from "devextreme-react/chart";

interface Props {
  value: any[];
}

const RateBarChart = ({ value }: Props) => {
  const maleAgeData = [
    {
      state: "rate",
      time: 100,
      sus: 90,
      pre: 40.2,
    },
  ];
  const customizeTooltip = (arg: any) => {
    return {
      text: `${arg.seriesName} : ${arg.valueText}`,
    };
  };
  const CustomLabel = (arg: any) => {
    if (arg.value <= 0) {
      return null;
    }
    return `${arg.seriesName} 
        ${arg.value}`;
  };
  return (
    <Chart
      rotated={true}
      id="chart"
      title="Male Age Structure"
      dataSource={value}
      height={80}
    >
      <CommonSeriesSettings argumentField="state" type="stackedBar" />
      <Series valueField="timeoperation" name="시간 가동률">
        <Label
          visible={true}
          font={{
            color: "#54AFEF",
          }}
          backgroundColor="#00000099"
          customizeText={CustomLabel}
        />
      </Series>
      <Series valueField="performance" name="성능 가동률">
        <Label
          visible={true}
          font={{
            color: "#E36152",
          }}
          backgroundColor="#00000099"
          customizeText={CustomLabel}
        />
      </Series>
      <Series valueField="quality" name="양품률">
        <Label
          visible={true}
          font={{
            color: "#A1C86A",
          }}
          backgroundColor="#00000099"
          customizeText={CustomLabel}
        />
      </Series>
      <ValueAxis visible={false} position="right">
        <Title text="millions" />
      </ValueAxis>
      <Legend
        visible={false}
        verticalAlignment="bottom"
        horizontalAlignment="center"
        itemTextPosition="top"
      />
      <Tooltip
        enabled={true}
        location="edge"
        customizeTooltip={customizeTooltip}
      />
    </Chart>
  );
};

export default RateBarChart;
