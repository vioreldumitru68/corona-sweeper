import React, { Component } from 'react';
import classes from './Timer.module.css';

class Timer extends Component {
  state = {
    elapsedSeconds: 0,
    isRunning: false
  }

  getSeconds() {
    return ('0'+this.state.elapsedSeconds % 60).slice(-2)
  }

  getMinutes() {
    return (Math.floor(this.state.elapsedSeconds / 60))
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.setState({elapsedSeconds: (this.state.elapsedSeconds + 1)})}, 1000);
  }

  stopTimer() {
    clearInterval(this.timer)
  }

  componentDidUpdate(prevProps){
    if(this.props.timerOn !== prevProps.timerOn)
      if(!this.state.isRunning){
        this.startTimer();
        this.setState({elapsedSeconds:0, isRunning: true})
      } else {
        this.stopTimer();
        this.setState({isRunning: false})
      }
  }

  render() {

    return (
    <div className={classes.Timer}>
          {this.getMinutes()}:{this.getSeconds()}
      </div>
    )
  }
}
export default Timer;