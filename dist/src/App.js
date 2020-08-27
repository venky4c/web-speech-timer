import React, { useState, useEffect, useCallback } from "react";
import { useStopwatch } from "react-timer-hook";
import { useSpeechSynthesis } from "react-speech-kit";
import "./App.css";

export default function App() {
  const [timers, setTimers] = useState([
    { time: 2, text: "Nice to see" },
    { time: 5, text: "Play it on" },
    { time: 8, text: "Come over" },
  ]);
  const { seconds, isRunning, start, reset } = useStopwatch();
  const { speak, speaking, supported } = useSpeechSynthesis();
  const doReset = useCallback(() => reset(), []);
  //const doSpeak = useCallback((...p) => speak(...p), []);
  useEffect(() => {
    //speak({ text: "Hello this is working" });
    const foundTimer = timers.find((t) => t.time === seconds);

    //this is where we will speak out the text
    if (foundTimer) speak({ text: foundTimer.text });

    // check to see if the seconds > last timer's time
    if (seconds > timers[timers.length - 1].time) doReset();
  }, [seconds, timers, doReset]);

  function updateTimers(index, time, text) {
    const newTimers = [...timers];
    newTimers[index].time = time;
    newTimers[index].text = text;
    setTimers(newTimers);
  }

  function addTimer() {
    const newTimer = [
      ...timers,
      { time: timers[timers.length - 1].time + 3, text: "Adding more" },
    ];
    setTimers(newTimer);
  }
  if (!supported) return <div>Your Browser is Not supported.. Sorry!</div>;
  return (
    <div className="app">
      <h2>Talk the Talk</h2>

      <div className="timers">
        {/* timers go here */}
        {timers.map((timer, index) => (
          // Component derived from a function declared below
          <TimerSlot
            key={index}
            index={index}
            timer={timer}
            updateTimers={updateTimers}
          />
        ))}
        <button className="add-button" onClick={addTimer}>
          Add
        </button>
      </div>

      {/* seconds */}
      <h2>{seconds}</h2>

      {/* buttons */}
      <div className="buttons">
        {!isRunning && (
          <button className="start-button" onClick={start}>
            Start
          </button>
        )}
        {isRunning && (
          <button className="stop-button" onClick={reset}>
            Stop
          </button>
        )}

        {speaking && <p>I am speaking...</p>}
      </div>
    </div>
  );
}

//This function is declared in the same file as the parent App.js but
// called as a component along with some parameters
function TimerSlot({ index, timer, updateTimers }) {
  const [time, setTime] = useState(timer.time);
  const [text, setText] = useState(timer.text);
  function handleBlur() {
    updateTimers(index, time, text);
  }
  return (
    <div>
      <form className="timer" key={index}>
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(+e.target.value)}
          onBlur={handleBlur}
        />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
        />
      </form>
    </div>
  );
}
