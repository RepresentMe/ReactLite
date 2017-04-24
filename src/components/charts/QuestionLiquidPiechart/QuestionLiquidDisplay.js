import React from 'react';

import QuestionLiquidPiechart from './QuestionLiquidPiechart'
import CollectionSharingLinks from '../CollectionCharts/CollectionSharingLinks';

const QuestionLiquidDisplay = (props) => {
  return (
    <div>
      <QuestionLiquidPiechart questionId={parseInt(props.match.params.questionId)}/>
      <CollectionSharingLinks />
    </div>
  )
}

export default QuestionLiquidDisplay;
