var maximised = false

crimAPI.handleWinControl(async (event, arg) => {
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

    await new Promise(resolve => setTimeout(resolve, 180))

    createGrid()
})