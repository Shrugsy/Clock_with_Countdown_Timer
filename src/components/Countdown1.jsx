import React, { useState, useEffect, useRef, useCallback } from "react";
import isElectron from "is-electron";
import { Button, Icon } from "semantic-ui-react";
import Counter from "./Counter";
import arrayOfSizeSixToMilliseconds from "../helpers/arrayOfSizeSixToMilliseconds";
import parseTime from "../helpers/parseTime";

function Countdown1() {
  const [countdownVis, setCountdownVis] = useState(false);
  // const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [formattedTime, setFormattedTime] = useState(() => Array(6).fill(0));
  const [counting, setCounting] = useState(false);
  const [inputMode, setInputMode] = useState(false);

  const audioRef = useRef(null);
  const timerIDRef = useRef(null);

  const tickCountdown = useCallback(
    (startTime) => {
      let newTimeRemaining = duration - new Date().getTime() + startTime;
      if (newTimeRemaining <= 0) {
        clearInterval(timerIDRef.current);
        newTimeRemaining = 0;
        audioRef.current.play();
      }
      setTimeRemaining(newTimeRemaining);
      setFormattedTime(parseTime(newTimeRemaining));
    },
    [duration]
  );

  const startCountdown = useCallback(() => {
    const startTime = new Date().getTime();
    timerIDRef.current = setInterval(() => tickCountdown(startTime), 50);
    setCounting(true);
  }, [tickCountdown]);

  const stopCountdown = (hard = false) => {
    clearInterval(timerIDRef.current);
    audioRef.current.pause();
    setCounting(false);
    setDuration(hard ? 0 : timeRemaining);
    if (hard) setFormattedTime(Array(6).fill(0));
  };

  const handleNums = useCallback(
    (event) => {
      console.log(event);
      if (inputMode) {
        let newFormattedTime = [...formattedTime];
        if (isFinite(event.key)) {
          newFormattedTime.shift();
          newFormattedTime.push(event.key);
        } else if (event.key === "Backspace") {
          newFormattedTime.pop();
          newFormattedTime.unshift(0);
        } else if (event.key === "Enter") {
          startCountdown();
        }
        let duration = arrayOfSizeSixToMilliseconds(newFormattedTime);
        setDuration(duration);
        setTimeRemaining(duration);
        setFormattedTime(newFormattedTime);
      }
    },
    [inputMode, formattedTime, startCountdown]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleNums);
    return () => {
      document.removeEventListener("keydown", handleNums);
    };
  }, [handleNums]);

  const enterInputMode = () => {
    stopCountdown();
    setInputMode(true);
    setDuration(0);
    setTimeRemaining(0);
    setFormattedTime(Array(6).fill(0));
  };

  const toggleCountdown = () => {
    if (countdownVis) {
      if (isElectron()) {
        window.ipcRenderer.send("make-small");
      }
    } else {
      if (isElectron()) {
        window.ipcRenderer.send("make-large");
      }
    }

    setCountdownVis(!countdownVis);
  };
  return (
    <div>
      <Button
        style={{ padding: "0.25em", fontSize: "1.5rem" }}
        className="button-toggle"
        active
        onClick={toggleCountdown}
      >
        <Icon
          style={{ margin: 0 }}
          name={countdownVis ? "toggle on" : "toggle off"}
        />
      </Button>
      {countdownVis && (
        <div className="countdown-container">
          <Counter
            onClick={() => enterInputMode()}
            time={formattedTime}
            inputMode={inputMode}
          />
          <span className="vertical">
            {!counting && (
              <Button
                size="tiny"
                className="button-countdown"
                positive
                onClick={() => startCountdown()}
              >
                START
              </Button>
            )}
            {counting && (
              <Button
                size="tiny"
                className="button-countdown"
                negative
                onClick={() => stopCountdown()}
              >
                STOP
              </Button>
            )}

            <Button
              size="tiny"
              className="button-countdown"
              color="orange"
              onClick={() => stopCountdown(true)}
            >
              RESET
            </Button>
          </span>
        </div>
      )}
      <audio ref={audioRef} src="german-shepherd-daniel_simon.mp3" />
    </div>
  );
}

export default Countdown1;
