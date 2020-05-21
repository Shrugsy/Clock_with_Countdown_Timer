import React, { useEffect } from "react";

import { useState } from "react";
import Time from "./Time";

export default function Clock1() {
  const [date, setDate] = useState(() => new Date());

  useEffect(() => {
    const timerId = setInterval(() => tick(), 50);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  const tick = () => {
    setDate(new Date());
  };



  return (
    <div id="clock">
      <div className="container">

        <Time date={date} />
      </div>
    </div>
  );
}
