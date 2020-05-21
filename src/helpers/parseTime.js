export default function parseTime(time) {

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