var logger = function logger(info, type){
  var hour = new Date().getHours()
  var minutes = new Date().getMinutes()
  var seconds = new Date().getSeconds()
  var hlength = String(hour).length
  var mlength = String(minutes).length
  var slength = String(seconds).length
  if (hlength === 1) { var hour = "0" + String(hour) }
  if (mlength === 1) { var minutes = "0" + String(minutes) }
  if (slength === 1) { var seconds = "0" + String(seconds) }
  var day = new Date().getDay()
  let dayWord = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  var dayOfWeek = dayWord[day]
  
  if (type === "info") {
    console.log('\x1b[32m%s\x1b[0m', `[ ${dayOfWeek} | ${hour}:${minutes}:${seconds} | Info ] ${info}`);
    console.log("")
  }

  else if (type === "warn") {
    console.log('\x1b[33m%s\x1b[0m', `[ ${dayOfWeek} | ${hour}:${minutes}:${seconds} | Warn ] ${info}`);
    console.log("")
  }

  else if (type === "error") {
    console.log('\x1b[31m%s\x1b[0m', `[ ${dayOfWeek} | ${hour}:${minutes}:${seconds} | Error ] ${info}`);
    console.log("")
  }

  else if (type === "hint") {
    console.log('\x1b[35m%s\x1b[0m', `[ ${dayOfWeek} | ${hour}:${minutes}:${seconds} | Hint ] ${info}`);
    console.log("")
  }

  else if (type === "action") {
    console.log('\x1b[36m%s\x1b[0m', `[ ${dayOfWeek} | ${hour}:${minutes}:${seconds} | User Action ] ${info}`);
    console.log("")
  }

  else if (type === "logCommand") {
    console.log('\x1b[37m%s\x1b[0m', `[ ${dayOfWeek} | ${hour}:${minutes}:${seconds} | Logger Command ] ${info}`);
  }

  else if (type === "start") {
    console.log('\x1b[34m%s\x1b[0m', `[ ${dayOfWeek} | ${hour}:${minutes}:${seconds} | Start-Up ] ${info}`);
    console.log("")
  }

  else {
    console.log('\x1b[90m%s\x1b[0m', `[ ${dayOfWeek} | ${hour}:${minutes}:${seconds} ] ${info}`);
    console.log("")
  }
  
};

module.exports.logger = logger;