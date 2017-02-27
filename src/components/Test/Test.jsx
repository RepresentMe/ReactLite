import React from 'react';
import { inject, observer } from "mobx-react";
import { observable, autorun } from "mobx";

import AgeProfileBarchart from "../charts/AgeProfileBarchart";
import AnswersOverTimeAreachart from "../charts/AnswersOverTimeAreachart";

const Test = (props) => {
    return (
        <div>
            <AnswersOverTimeAreachart />
            <AgeProfileBarchart geoId={59} />
        </div>
    )
}

export default Test;