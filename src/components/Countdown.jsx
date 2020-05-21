import React from "react";
import Counter from "./Counter";
import { Button } from "semantic-ui-react";
import parseTime from "../helpers/parseTime";
import arrayOfSizeSixToMilliseconds from "../helpers/arrayOfSizeSixToMilliseconds";

class Countdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: 0,
      duration: 0,
      timeRemaining: 0,
      formattedTime: Array(6).fill(0),
      inputMode: false,
    };
  }

  componentDidMount() {
    //TODO: maybe have this enter a certain state upon mounting (click a dropdown arrow to display & mount?)
    console.log("mounted");
    //inputMode = true;
    document.getElementById("stop").style.display = "none";
    document.addEventListener("keydown", this.handleNums);
    this.player.addEventListener("ended", () => {
      this.player.play();
    });
  }

  componentWillUnmount() {
    document.removeEventListener("nums", this.handleNums);
  }

  handleNums = (event) => {
    if (this.state.inputMode) {
      let formattedTime = this.state.formattedTime;

      //if a number:
      if (isFinite(event.key)) {
        formattedTime.shift();
        formattedTime.push(event.key);
      } else if (event.key === "Enter") {
        this.start();
      } else if (event.key === "Backspace") {
        formattedTime.pop();
        formattedTime.unshift(0);
      }
      let duration = arrayOfSizeSixToMilliseconds(formattedTime);

      this.setState({
        duration: duration,
        timeRemaining: duration,
        formattedTime: formattedTime,
      });
    }
  };

  enterInputMode() {
    this.stop();
    this.setState({
      duration: 0,
      timeRemaining: 0,
      inputMode: true,
      formattedTime: Array(6).fill(0),
    });
  }

  tick() {
    //timeRemaining = duration minus elapsed time since starting countdown
    let timeRemaining =
      this.state.duration - new Date().getTime() + this.state.startTime;

    if (timeRemaining <= 0) {
      clearInterval(this.timerID);
      timeRemaining = 0;
      this.player.play();
      //run 'alarm' function also
      //change button to 'OK'? or keep as 'stop'
    }

    this.setState({
      timeRemaining: timeRemaining,
      formattedTime: parseTime(timeRemaining),
    });
  }

  start() {
    let startTime = new Date().getTime();
    this.timerID = setInterval(() => this.tick(), 50);

    document.getElementById("stop").style.display = "";
    document.getElementById("start").style.display = "none";

    this.setState({
      startTime: startTime,
      inputMode: false,
    });
  }

  stop() {
    clearInterval(this.timerID);
    this.player.pause();
    //use this rather than simply setting currentTime to 0 so as to completely stop the player rather than only pausing. This prevents the play/pause media key from resuming the player independent of the timer
    this.player.src = this.player.src; //eslint-disable-line
    //this.player.currentTime = 0;
    document.getElementById("stop").style.display = "none";
    document.getElementById("start").style.display = "";

    this.setState({
      duration: this.state.timeRemaining,
    });
  }
  // style={{display: 'inline', float:'right', position:'absolute', bottom:25, right:25}}

  render() {
    return (
      <div id="countdown">
        <div id="timer" className="timeContainer" style={{ display: "none" }}>
          <Counter
            onClick={() => this.enterInputMode()}
            time={this.state.formattedTime}
            inputMode={this.state.inputMode}
          />
          <Button id="start" className="startStop" onClick={() => this.start()}>
            START
          </Button>
          <Button id="stop" className="startStop" onClick={() => this.stop()}>
            STOP
          </Button>
          <br></br>
          <audio
            ref={(ref) => {
              this.player = ref;
            }}
            src="german-shepherd-daniel_simon.mp3"
          />
        </div>
      </div>
    );
  }
}

export default Countdown;
