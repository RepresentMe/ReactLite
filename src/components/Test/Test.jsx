import React from 'react';
import { inject, observer } from "mobx-react";
import { observable, autorun, extendObservable } from "mobx";

import AgeProfileBarchart from "../charts/AgeProfileBarchart";
import AnswersOverTimeAreachart from "../charts/AnswersOverTimeAreachart";
import QuestionResultsBarchart from "../charts/QuestionResultsBarchart";
import QuestionPopulationStackedChart from "../charts/QuestionPopulationStackedChart";
import CertanityStatisticsBarchart from "../charts/CertanityStatisticsBarchart";
import QuestionService from "../../services/QuestionService";

const Test = inject("QuestionStore")(({ QuestionStore }) => {
    return (
        <div>
            {/*<AnswersOverTimeAreachart />*/}
            {/*<AgeProfileBarchart geoId={59} />*/}
            <QuestionPopulationStackedChart questionId={1399} geoId={59} height={100} />
            {/*<QuestionResultsBarchart data={data}/>*/}
            <CertanityStatisticsBarchart questionId={1399} geoId={59} />
        </div>
    )
})

export default Test;