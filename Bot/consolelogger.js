
const br = ""

function formatDate() {
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
    return `${dayOfWeek} | ${hour}:${minutes}:${seconds}`
}

function info(...infos) {
    var prntStr = ""
    for (const info of infos) {
        prntStr += info.toString() + " "
    }
    console.log(`\x1b[32m[ ${formatDate()} | Info ] ${prntStr}${br}\x1b[0m`)
    console.log(br)
}

function warn(...infos) {
    var prntStr = ""
    for (const info of infos) {
        prntStr += info.toString() + " "
    }
    console.log(`\x1b[33m[ ${formatDate()} | Warn ] ${prntStr}${br}\x1b[0m`)
    console.log(br)
}

function error(...infos) {
    var prntStr = ""
    for (const info of infos) {
        prntStr += info.toString() + " "
    }
    console.log(`\x1b[31m[ ${formatDate()} | Error ] ${prntStr}${br}\x1b[0m`)
    console.log(br)
}

function hint(...infos) {
    var prntStr = ""
    for (const info of infos) {
        prntStr += info.toString() + " "
    }
    console.log(`\x1b[35m[ ${formatDate()} | Hint ] ${prntStr}${br}\x1b[0m`)
    console.log(br)
}

function action(...infos) {
    var prntStr = ""
    for (const info of infos) {
        prntStr += info.toString() + " "
    }
    console.log(`\x1b[36m[ ${formatDate()} | User Action ] ${prntStr}${br}\x1b[0m`)
    console.log(br)
}

function logCmd(...infos) {
    var prntStr = ""
    for (const info of infos) {
        prntStr += info.toString() + " "
    }
    console.log(`\x1b[36m[ ${formatDate()} | Log Command ] ${prntStr}${br}\x1b[0m`)
    console.log(br)
}

function start(...infos) {
    var prntStr = ""
    for (const info of infos) {
        prntStr += info.toString() + " "
    }
    console.log(`\x1b[34m[ ${formatDate()} | Start ] ${prntStr}${br}\x1b[0m`)
    console.log(br)
}

function raw(...infos) {
    var prntStr = ""
    for (const info of infos) {
        prntStr += info.toString() + " "
    }
    console.log(prntStr)
    console.log(br)
    console.log(br)
}

module.exports = {
    info,
    warn,
    error,
    hint,
    action,
    logCmd,
    start,
    raw,
    err: error
}