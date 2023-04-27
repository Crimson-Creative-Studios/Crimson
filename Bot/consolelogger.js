var logger = function logger(info, type) {
  function log(info) {
    console.log(info)
  }
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
  if (process.argv.includes("--gui")) {
    var br = "<br>"
  } else {
    var br = ""
  }
  
  if (type === "info") {
    log(`[ ${dayOfWeek} | ${hour}:${minutes}:${seconds} | Info ] ${info}${br}`)
    log(br)
    
  } else if (type === "warn") {
    log(`[ ${dayOfWeek} | ${hour}:${minutes}:${seconds} | Warn ] ${info}${br}`)
    log(br)

  } else if (type === "error") {
    log(`[ ${dayOfWeek} | ${hour}:${minutes}:${seconds} | Error ] ${info}${br}`)
    log(br)

  } else if (type === "hint") {
    log(`[ ${dayOfWeek} | ${hour}:${minutes}:${seconds} | Hint ] ${info}${br}`)
    log(br)

  } else if (type === "action") {
    log(`[ ${dayOfWeek} | ${hour}:${minutes}:${seconds} | User Action ] ${info}${br}`)
    log(br)

  } else if (type === "logCommand") {
    log(`[ ${dayOfWeek} | ${hour}:${minutes}:${seconds} | Logger Command ] ${info}${br}`)

  } else if (type === "start") {
    log(`[ ${dayOfWeek} | ${hour}:${minutes}:${seconds} | Start-Up ] ${info}${br}`)
    log(br)

  } else if (type === "raw") {
    log(info)
    log(br)
    log(br)

  } else {
    log(`[ ${dayOfWeek} | ${hour}:${minutes}:${seconds} ] ${info}${br}`)
    log(br)
  }
  
}

module.exports.logger = logger