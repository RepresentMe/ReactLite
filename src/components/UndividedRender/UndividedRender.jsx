import React from 'react';
import { inject, observer } from "mobx-react";
import { observable, autorun, extendObservable } from "mobx";

import AgeProfileBarchart from "../charts/AgeProfileBarchart";
import AnswersOverTimeAreachart from "../charts/AnswersOverTimeAreachart";
import QuestionResultsBarchart from "../charts/QuestionResultsBarchart";
import QuestionPopulationStackedChart from "../charts/QuestionPopulationStackedChart";
import CertanityStatisticsBarchart from "../charts/CertanityStatisticsBarchart";
import QuestionWeightedAverageLineChart from '../charts/QuestionWeightedAverageLineChart';
import QuestionWeightedAverageGeoChart from '../charts/QuestionWeightedAverageGeoChart';
import QuestionService from "../../services/QuestionService";

const UndividedRender = inject("QuestionStore")(({ QuestionStore, match }) => {
    return (
        <div>
            <QuestionWeightedAverageGeoChart questionId={match.params.questionId} bucketSize={2} startAge={13} endAge={30}/>
        </div>
    )
})

export default UndividedRender;
