import React from 'react';
import { inject, observer } from "mobx-react";
import { observable, autorun, extendObservable } from "mobx";

import AgeProfileBarchart from "../charts/AgeProfileBarchart";
import AnswersOverTimeAreachart from "../charts/AnswersOverTimeAreachart";
import QuestionResultsBarchart from "../charts/QuestionResultsBarchart";
import QuestionPopulationStackedChart from "../charts/QuestionPopulationStackedChart";
import CertanityStatisticsBarchart from "../charts/CertanityStatisticsBarchart";
import QuestionWeightedAverageLineChart from '../charts/QuestionWeightedAverageLineChart';
import QuestionService from "../../services/QuestionService";
import CompareCollectionUsers from "../CompareCollectionUsers";

const Test = inject("QuestionStore")(({ QuestionStore, location, router, query }) => {
    return (
        <div>
            {/*<AnswersOverTimeAreachart />*/}
            {/*<AgeProfileBarchart geoId={59} />*/}
            {/*<QuestionPopulationStackedChart questionId={1399} geoId={59} height={100} />*/}
            {/*<QuestionResultsBarchart data={data}/>*/}
            {/*<CertanityStatisticsBarchart questionId={1399} geoId={59} />*/}
            <CompareCollectionUsers />
            <QuestionWeightedAverageLineChart questionId={2504} bucketSize={4} />
        </div>
    )
})

export default Test;
