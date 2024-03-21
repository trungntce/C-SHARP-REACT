import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SimpleAreaChart = (props: any) => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={props.data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name"tick={{ fill: 'white' }} axisLine={{ stroke: '#ffffff' }} />
          <YAxis tick={{ fill: 'white' }} axisLine={{ stroke: '#ffffff' }} domain={[90,100]}/>
          <Tooltip />
          <Area type="monotone" dataKey="percent" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    );
}

export default SimpleAreaChart