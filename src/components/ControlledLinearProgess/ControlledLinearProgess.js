import React from 'react';
import LinearProgress from 'material-ui/LinearProgress';

class ControlledLinearProgess extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      completed: 0,
    };
  }

  componentDidMount() {
    this.step = Math.floor(this.props.index / this.props.len * 100);;
  }

  progress(completed) {
    if (completed > 100) {
      this.setState({completed: 100});
    } else {
      this.setState({completed});
      const diff = Math.floor(this.props.index / this.props.len * 100);
      this.step = () => this.progress(completed + diff);
    }
  }

  render() {
    return (
      <LinearProgress mode="determinate" value={this.state.completed} />
    );
  }
}

export default ControlledLinearProgess;
