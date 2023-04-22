var maximised = false

crimAPI.handleWinControl((event, arg) => {
    if (arg === "max") {
        maximised = true
    } else if (arg === "unmax") {
        maximised = false
    }
    if (maximised) {
        document.body.classList.add('maximized')
    } else {
        document.body.classList.remove('maximized')
    }
})