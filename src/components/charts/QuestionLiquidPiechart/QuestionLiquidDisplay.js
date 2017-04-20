import React from 'react';
import QuestionLiquidPiechart from './QuestionLiquidPiechart'

const QuestionLiquidDisplay = (props) => {
  return <QuestionLiquidPiechart questionId={parseInt(props.match.params.questionId)}/>
}

export default QuestionLiquidDisplay;
