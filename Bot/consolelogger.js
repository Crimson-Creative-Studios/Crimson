
const br = ""
const colors = {
    reset: "\x1b[0m",

    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        gray: "\x1b[90m",
        crimson: "\x1b[38m"
    }
}

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
    console.log(`[ ${formatDate()} | Info ] ${prntStr}${br}`)
    console.log(br)
}

function success(...infos) {
    var prntStr = ""
    for (const info of infos) {
        prntStr += info.toString() + " "
    }
    console.log(`${colors.color.green}[ ${formatDate()} | Success ] ${prntStr}${br}${colors.reset}`)
    console.log(br)
}

function warn(...infos) {
    var prntStr = ""
    for (const info of infos) {
        prntStr += info.toString() + " "
    }
    console.log(`${colors.color.yellow}[ ${formatDate()} | Warn ] ${prntStr}${br}${colors.reset}`)
    console.log(br)
}

function error(...infos) {
    var prntStr = ""
    for (const info of infos) {
        prntStr += info.toString() + " "
    }
    console.log(`${colors.color.red}[ ${formatDate()} | Error ] ${prntStr}${br}${colors.reset}`)
    console.log(br)
}

function hint(...infos) {
    var prntStr = ""
    for (const info of infos) {
        prntStr += info.toString() + " "
    }
    console.log(`${colors.color.magenta}[ ${formatDate()} | Hint ] ${prntStr}${br}${colors.reset}`)
    console.log(br)
}

function action(...infos) {
    var prntStr = ""
    for (const info of infos) {
        prntStr += info.toString() + " "
    }
    console.log(`${colors.color.cyan}[ ${formatDate()} | User Action ] ${prntStr}${br}${colors.reset}`)
    console.log(br)
}

function logCmd(...infos) {
    var prntStr = ""
    for (const info of infos) {
        prntStr += info.toString() + " "
    }
    console.log(`\x1b[36m[ ${formatDate()} | Log Command ] ${prntStr}${br}${colors.reset}`)
    console.log(br)
}

function start(...infos) {
    var prntStr = ""
    for (const info of infos) {
        prntStr += info.toString() + " "
    }
    console.log(`${colors.color.blue}[ ${formatDate()} | Start ] ${prntStr}${br}${colors.reset}`)
    console.log(br)
}

function raw(...infos) {
    console.log(...infos)
    console.log(br)
    console.log(br)
}

function custom(options) {
    var str
    if (!options.content) {
        error("Invalid custom logger command found, missing content to log, passed in options:", options)
        return
    }
    if (options.color) {
        if (colors.color[options.color]) {
            str += colors.color[options.color]
        }
    }
    if (options.name) {
        str += `[ ${formatDate()} | ${options.name} ] `
    } else {
        str += `[ ${formatDate()} ] `
    }
    str += options.content
    if (options.color) {
        if (colors.color[options.color]) {
            str += colors.reset
        }
    }
    console.log(str)
    console.log(br)
    console.log(br)
}

module.exports = {
    log: info,
    info,
    warn,
    error,
    hint,
    action,
    logCmd,
    start,
    raw,
    err: error,
    custom,
    success
}