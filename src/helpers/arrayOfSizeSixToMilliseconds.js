export default function arrayOfSizeSixToMilliseconds(arr) {
    let hrs = parseInt(arr[0].toString() + arr[1].toString());
    let mins = parseInt(arr[2].toString() + arr[3].toString());
    let secs = parseInt(arr[4].toString() + arr[5].toString());
  
    let ms = hrs * 3600000 + mins * 60000 + secs * 1000;
    return ms;
  }