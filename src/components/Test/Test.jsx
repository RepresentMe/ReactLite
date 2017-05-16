import React from 'react';
import { inject, observer } from "mobx-react";
import { observable, autorun, extendObservable } from "mobx";
import { parse } from 'query-string';

import AgeProfileBarchart from "../charts/AgeProfileBarchart";
import AnswersOverTimeAreachart from "../charts/AnswersOverTimeAreachart";
import QuestionResultsBarchart from "../charts/QuestionResultsBarchart";
import QuestionPopulationStackedChart from "../charts/QuestionPopulationStackedChart";
import CertanityStatisticsBarchart from "../charts/CertanityStatisticsBarchart";
import QuestionWeightedAverageLineChart from '../charts/QuestionWeightedAverageLineChart';
import QuestionService from "../../services/QuestionService";
import CompareCollectionUsers from "../CompareCollectionUsers";
import QuestionLiquidPiechart from '../charts/QuestionLiquidPiechart';

import FollowUserDialog from '../FollowUserDialog';
import JoinGroupDialog from '../JoinGroupDialog';
import IntroCarousel from '../IntroCarousel';

const Test = inject("QuestionStore", "CollectionStore")(({ QuestionStore, CollectionStore, location, router, query }) => {

    // let querySearch = parse(location.search);
    // let userIds = querySearch.users ? querySearch.users.split(',') : [];
    // console.log('userIds: ', userIds);
    // return (
    //     <div>
    //         {/*<AnswersOverTimeAreachart />*/}
    //         {/*<AgeProfileBarchart geoId={59} />*/}
    //         {/*<QuestionPopulationStackedChart questionId={1399} geoId={59} height={100} />*/}
    //         {/*<QuestionResultsBarchart data={data}/>*/}
    //         {/*}<CertanityStatisticsBarchart questionId={1399} geoId={59} />*/}
    //
    //         {/* <CompareCollectionUsers userIds={userIds} />*/}
    //         {/* http://localhost:3000/test?users=7,6736,584,4895 */}
    //
    //         {/* <QuestionWeightedAverageLineChart questionId={2504} bucketSize={4} /> */}
    //
    //         {/*}<QuestionLiquidPiechart questionId={2087}/>*/}
    //     </div>
    // )

    // CollectionStore.getCollectionItemsById(24)
    //   .then((response) => {
    //     console.log(response)
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })

    // let user = {
    //   id: 7,
    //   first_name: 'Ed',
    //   last_name: 'Dowding'
    // }
    //
    // let group = {
    //   id: 6,
    //   name: "Represent"
    // }
    // // return <FollowUserDialog user={user} />;
    // return <JoinGroupDialog group={group} />;
    return <IntroCarousel/>
})

export default Test;
