import React, {Component} from 'react'

// import Avatar from 'material-ui/Avatar';
// import Chip from 'material-ui/Chip';
import EmbedlyComponent from '../Components/EmbedlyComponent';
import MoreText from '../Components/MoreText';

import './QuestionFlowInfo.css';

class QuestionFlowInfo extends Component {

  render() {
    const { question } = this.props;
    return (
      <div style={{ textAlign: 'center'}}>
        <h1 style={{ maxWidth: '600px', display: '-webkit-inline-box' }}>{ question.question }</h1>
        <MoreText className="moreText" text={question.description}/>
        {question.links.map((link, i) => {
          return (<div key={i}><EmbedlyComponent url={link.link} /><br/></div>);
        })}
      </div>
    )
  }
}

// const QuestionLink = ({link}) => {
//   return (<div>
//     <a href={link.url}>{link.link}</a>
//   </div>)
// }
//
// const Author = ({user}) => {
//   const userName = user.first_name+' '+user.last_name;
//   return (<div>
//     <Chip>
//       <Avatar src={user.photo} />{userName}
//     </Chip>
//   </div>)
// }

export default QuestionFlowInfo;
