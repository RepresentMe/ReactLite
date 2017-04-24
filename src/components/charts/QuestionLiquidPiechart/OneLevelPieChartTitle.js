import React from 'react';
import { observer } from "mobx-react";


const OneLevelPieChartTitle = observer(({data}) => {

	return (
    <div>
    {data.values && <p style={{zIndex: 10, margin: 10, textAlign: 'center', color: 'rgb(64, 64, 64)'}} >{data.values[0].title}</p>}
    </div>
    );
  })
export default OneLevelPieChartTitle;
