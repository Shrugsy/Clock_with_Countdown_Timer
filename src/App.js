import React from "react";
import "./App.css";
// import Clock from "./components/Clock";
// import Countdown from "./components/Countdown";
import Clock1 from "./components/Clock1";
import { Divider } from "semantic-ui-react";
import Countdown1 from "./components/Countdown1";

//import Electron from 'electron';

//const {ipcRenderer} = window.require('electron');
//const {ipcRenderer} = require('electron');

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Clock1 />
        <Divider />
        <Countdown1 />
        {/* <Clock /> */}
        {/* <Countdown /> */}
      </header>
    </div>
  );
}

export default App;
