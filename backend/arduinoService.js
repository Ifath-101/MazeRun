import { SerialPort, ReadlineParser } from 'serialport';

const port = new SerialPort({ path: 'COM3', baudRate: 9600 }); // Replace with your COM port
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

let freezeDetected = false;
let trophyCollected = false;

parser.on('data', (line) => {
  console.log("Received:", line);
  if (line === "FREEZE") {
    freezeDetected = true;
  }
  if (line === "TROPHY") {
    trophyCollected = true;
  }
});

export const checkIRStatus = (() => {
  let freezeDetected = false;
  let trophyCollected = false;

  return () => {
    const result = {
      freeze: freezeDetected,
      trophy: trophyCollected,
    };
    freezeDetected = false;
    trophyCollected = false;
    return result;
  };
})();
