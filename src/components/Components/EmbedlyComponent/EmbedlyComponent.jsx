import React, {Component} from 'react'

import { observer, inject } from "mobx-react";
import './EmbedlyComponent.css'
@observer
@inject ("UrlPreviewStore")
class EmbedlyComponent extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      html: ''
    }
  }

  componentWillMount() {
    this.props.UrlPreviewStore.getAdvancedStatsData(this.props.url, res => this.setState(res))
  }

  render(){
    return(
      <div className="linkBoxing">
        {this.state.html && <div dangerouslySetInnerHTML={{__html: this.state.html}}/>}
        {(this.state.type === 'photo' || this.state.thumbnail_url) && !this.state.html && <img className="linkImage" src={this.state.thumbnail_url || this.state.url}/>}
        <div className="titleDescr">
          <div className="title"><a href={this.props.url} target="_blank">{this.state.title}</a></div>
          <br/>
          <div className="description">{this.state.description}</div>
        </div>
      </div>
    )
  }
}

export default EmbedlyComponent
