import React from "react";
import PropTypes from "prop-types";

Time.propTypes = {
  date: PropTypes.object.isRequired,
};

function Time({ date }) {
  let hrs = date.getHours();
  if (hrs < 10) {
    hrs = "0" + hrs.toString();
  }

  let secs = date.getSeconds();
  if (secs < 10) {
    secs = "0" + secs.toString();
  }

  let mins = date.getMinutes();
  if (mins < 10) {
    mins = "0" + mins.toString();
  }

  return (
    <>
      <div className={"time-container"}>
        <span>{hrs}</span>
        <span>:</span>
        <span>{mins}</span>
        <span>:</span>
        <span>{secs}</span>
      </div>
      <span className="time-period">
        {date.toLocaleTimeString("en-us", { hour12: true }).slice(-2)}
      </span>
    </>
  );
}

export default Time;
