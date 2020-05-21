import React from "react";

function Counter(props) {
  let t = props.time;

  let classStringArray = ["hrs0", "hrs1", "mins0", "mins1", "secs0", "secs1"];

  function makeSpan(i) {
    let x = true;
    if (i === 5) {
      x = false;
    } else {
      for (let k = 0; k <= i; k++) {
        if (t[k] !== 0) {
          x = false;
        }
      }
    }

    if (x || props.inputMode) {
      return (
        <span className={"time time-" + classStringArray[i] + " time-inactive"}>
          {t[i]}
        </span>
      );
    } else {
      return <span className={"time time-" + classStringArray[i]}>{t[i]}</span>;
    }
  }

  return (
    <div onClick={props.onClick} className="time-container countdown">
      {makeSpan(0)}
      {makeSpan(1)}
      <span className="countdown-separator">h</span>
      &nbsp;
      {makeSpan(2)}
      {makeSpan(3)}
      <span className="countdown-separator">m</span>
      &nbsp;
      {makeSpan(4)}
      {makeSpan(5)}
      <span className="countdown-separator">s</span>
    </div>
  );
}

export default Counter;
