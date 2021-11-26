import React from 'react';

class CustomCanvas extends React.Component {
  constructor(props) {
    this.canvas = React.createRef()
  }
  render() {
    return <div>
      <canvas ref={this.canvas}></canvas>
    </div>
  }
}