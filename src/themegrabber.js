crimAPI.handleThemeData((event, arg) => {
    const options = {
        theme: themeNow,
        darkness: document.getElementById("darknessControl").value,
        override: document.getElementById("extensionThemeOverride").checked
    }
    crimAPI.sendThemeData(options)
})