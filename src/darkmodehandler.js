async function toggleDarkMode() {
    try {
        var isDarkMode = await window.darkMode.toggle()
        document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
    }
    catch (err) {
        console.log(err)
    }
}

async function sysDarkMode() {
    try {
        await window.darkMode.system()
        document.getElementById('theme-source').innerHTML = 'System'
    }
    catch (err) {
        console.log(err)
    }
}