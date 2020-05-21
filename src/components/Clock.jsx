import React from "react";
import isElectron from "is-electron";
import { Button } from "semantic-ui-react";


class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      toggleClassName: "fas fa-toggle-off",
    };
  }

  //upon mounting, start tick per interval length
  //setInterval runs function every interval length, as opposed to setTimeout which runs only once (and is nested within a function if expected to be recurring)
  //note that we have the interval set to 50ms rather than 1000ms in order to sync the seconds closer to the true time
  componentDidMount() {
    console.log(this);
    this.timerID = setInterval(() => this.tick(), 50);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    //console.log(this)
    //this.test()
    this.setState({
      date: new Date(),
    });
  }

  toggle() {
    let x = document.getElementById("timer");
    //x.style.display = (x.style.display === 'none') ? '' : 'none'
    let toggleClassName = this.state.toggleClassName;

    if (toggleClassName === "fas fa-toggle-off") {
      x.style.display = "inline-block";
      //tell electron-starter.js to resize the window (if in electron)
      //thanks to the following comment for the advice: https://github.com/electron/electron/issues/9920#issuecomment-336757899
      if (isElectron()) {
        window.ipcRenderer.send("make-large");
      }
      toggleClassName = "fas fa-toggle-on";
    } else {
      x.style.display = "none";
      if (isElectron()) {
        window.ipcRenderer.send("make-small");
      }
      toggleClassName = "fas fa-toggle-off";
    }

    this.setState({
      toggleClassName: toggleClassName,
    });
  }

  getTimeHTML() {
    let hrs = this.state.date.getHours();
    if (hrs < 10) {
      hrs = "0" + hrs.toString();
    }

    let secs = this.state.date.getSeconds();
    if (secs < 10) {
      secs = "0" + secs.toString();
    }

    let mins = this.state.date.getMinutes();
    if (mins < 10) {
      mins = "0" + mins.toString();
    }

    return (
      <div className="timeContainer" style={{ position: "relative" }}>
        <span className="time time-hrs">{hrs}</span>
        <span className="sep sep-0">:</span>
        <span className="time time-mins">{mins}</span>
        <span className="sep sep-1">:</span>
        <span className="time time-secs">{secs}</span>
      </div>
    );
  }

  render() {
    return (
      <div id="clock">
        <div style={{ position: "relative", height: "100px" }}>
          <div className="timeString">{this.getTimeHTML()}</div>
          <Button
            className="btn btn-primary expand"
            onClick={() => this.toggle()}
          >
            <i className="fas fa-stopwatch">:</i>{" "}
            <i className={this.state.toggleClassName}></i>
          </Button>
          <span className="timePeriod">
            {this.state.date
              .toLocaleTimeString("en-us", { hour12: true })
              .slice(-2)}
          </span>
        </div>
        <hr style={{ width: "100%" }}></hr>
      </div>
    );
  }
}

export default Clock;