import React from 'react';
import './App.css';
import isElectron from 'is-electron';

//import Electron from 'electron';

//const {ipcRenderer} = window.require('electron');
//const {ipcRenderer} = require('electron');

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Clock />
        <Countdown />
      </header>
    </div>
  );
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      toggleClassName: 'fas fa-toggle-off'
    };
  }

  //upon mounting, start tick per interval length
  //setInterval runs function every interval length, as opposed to setTimeout which runs only once (and is nested within a function if expected to be recurring)
  //note that we have the interval set to 50ms rather than 1000ms in order to sync the seconds closer to the true time
  componentDidMount() {
    console.log(this)
    this.timerID = setInterval(() => this.tick(), 50);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    //console.log(this)
    //this.test()
    this.setState({
      date: new Date()
    });
  }

  toggle() {
    let x = document.getElementById('countdown');
    //x.style.display = (x.style.display === 'none') ? '' : 'none'
    let toggleClassName = this.state.toggleClassName

    if (toggleClassName === 'fas fa-toggle-off') {
      x.style.display = '';
      //tell electron-starter.js to resize the window (if in electron)
      if (isElectron()){
        window.ipcRenderer.send('make-large')
      }
      toggleClassName = 'fas fa-toggle-on'
    } else {
      x.style.display = 'none';
      if (isElectron()) {
        window.ipcRenderer.send('make-small')
      }
      toggleClassName = 'fas fa-toggle-off'
    }

    this.setState({
     toggleClassName: toggleClassName
    });

  }

  //replace 'Toggle timer' with an icon later
  render() {
    return (
      <div style={{width: '100%'}}>
        <span className = 'time'>
          {this.state.date.toLocaleTimeString('en-us', {hour12: true})}
        </span>
        <hr style={{width: '100%'}}></hr>
        <button className='btn btn-primary expand' onClick={() => this.toggle()}><i className='far fa-clock'></i> <i className={this.state.toggleClassName}></i></button>
      </div>
              
    )
  }
}

function arrayOfSizeSixToMilliseconds(arr) {
  let hrs = parseInt(arr[0].toString() + arr[1].toString())
  let mins = parseInt(arr[2].toString() + arr[3].toString())
  let secs = parseInt(arr[4].toString() + arr[5].toString())

  let ms = hrs * 3600000 + mins * 60000 + secs * 1000
  return ms
}

class Countdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: 0,
      duration: 0,
      timeRemaining: 0,
      formattedTime: Array(6).fill(0),
      inputMode: false
    }
  }

  componentDidMount() {
    //TODO: maybe have this enter a certain state upon mounting (click a dropdown arrow to display & mount?)
    console.log('mounted')
    //inputMode = true;
    document.getElementById('stop').style.display = 'none'
    document.addEventListener('keydown', this.handleNums)
    this.player.addEventListener('ended', () => {
      this.player.play();
    })
  }

  componentWillUnmount() {
    document.removeEventListener('nums', this.handleNums);
  }

  handleNums = (event) => {
    if (this.state.inputMode) {
      let formattedTime = this.state.formattedTime

      //if a number:
      if (isFinite(event.key)) {
        formattedTime.shift()
        formattedTime.push(event.key)
      } else if (event.key === 'Enter') {
        this.start()
      } else if (event.key === 'Backspace') {
        formattedTime.pop()
        formattedTime.unshift(0)
      }
      let duration = arrayOfSizeSixToMilliseconds(formattedTime)

      this.setState({
        duration: duration,
        timeRemaining: duration,
        formattedTime: formattedTime
      })
    }
  }

  enterInputMode() {
    this.stop()
    this.setState({
      duration: 0,
      timeRemaining: 0,
      inputMode: true,
      formattedTime: Array(6).fill(0)
    })
  }

  tick() {
    //timeRemaining = duration minus elapsed time since starting countdown
    let timeRemaining = this.state.duration - (new Date().getTime()) + this.state.startTime
    
    if (timeRemaining <= 0) {
      clearInterval(this.timerID)
      timeRemaining = 0
      this.player.play()
      //run 'alarm' function also
      //change button to 'OK'? or keep as 'stop'
    }
  
    this.setState({
      timeRemaining: timeRemaining,
      formattedTime: parseTime(timeRemaining)
    })
  }

  start() {
    let startTime = new Date().getTime()
    this.timerID = setInterval(() => this.tick(), 50)

    document.getElementById('stop').style.display = ''
    document.getElementById('start').style.display = 'none'

    this.setState({
      startTime : startTime,
      inputMode: false
    })
  }

  stop() {
    clearInterval(this.timerID)
    this.player.pause()
    this.player.currentTime = 0;
    document.getElementById('stop').style.display = 'none'
    document.getElementById('start').style.display = ''

    this.setState({
      duration: this.state.timeRemaining
    })
  }

  render() {
    return (
      <div id='countdown' style={{display: 'none'}}>
        <Counter
          onClick = {() => this.enterInputMode()}
          time = {this.state.formattedTime}
          inputMode = {this.state.inputMode}
        />
        <button id='start' className = 'btn btn-primary' onClick={()=>this.start()}>START</button> <button id='stop' className = 'btn btn-primary' onClick={()=>this.stop()}>STOP</button>
        <br></br>
        <audio ref={ref => {this.player = ref}} src="german-shephard-daniel_simon.mp3"/>
      </div>
    )
  }
}

function parseTime(time) {

  //getDigit courtesy https://stackoverflow.com/questions/13955738/javascript-get-the-second-digit-from-a-number
  function getDigit(number, n) {
    return Math.floor((number / Math.pow(10, n - 1)) % 10);
  }

  //note that we expect time to have no more than 2 digits for hrs
  //e.g. max time should be 99 hrs, 99 mins, 99 secs (in milliseconds)
  let hrs = Math.floor(time / 3600000);
  let mins = Math.floor((time - (hrs * 3600000)) / 60000);
  let secs = Math.floor((time - ((hrs * 3600000) + (mins * 60000)))/1000);

  return [getDigit(hrs, 2), getDigit(hrs, 1), getDigit(mins, 2), getDigit(mins, 1), getDigit(secs, 2), getDigit(secs, 1)]
}

function Counter(props) {
  let t = props.time
  let timeClassName = (props.inputMode) ? 'time-input' : 'time'

  return (
    <div
      onClick = {props.onClick}
    >
      <span className = {timeClassName}>{t[0]}</span>
      <span className = {timeClassName}>{t[1]}</span>
      <span className = 'separator'>h</span>
      &nbsp;
      <span className = {timeClassName}>{t[2]}</span>
      <span className = {timeClassName}>{t[3]}</span>
      <span className = 'separator'>m</span>
      &nbsp;
      <span className = {timeClassName}>{t[4]}</span>
      <span className = {timeClassName}>{t[5]}</span>
      <span className = 'separator'>s</span>
    </div>

  )
}

export default App;