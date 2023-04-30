var currentTab = null
var currentOverride = null
var currentOption = null
var currentMode = null
var custom = false

async function openTab(tabName, override = null, option = "") {
    if (tabName.startsWith("falseErrorTest")) {
        tabcontent = document.getElementsByClassName("tabcontent")
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].classList.remove("showentab")
        }
        if (tabName.endsWith("markettab")) {
            document.getElementById("ErrorTXTM").innerHTML = "Oops, that extension's data wasn't found"
            document.getElementById("ErrorTXTS").innerHTML = `The extension tab "Example" could not be found so we redirected you to here, the error code was "ExtensionTabFailure", you can copy the entire error using the button below.<br>Sorry for the inconvience :(`
            window.copyERROR = `ERROR: ExtensionTabFailure\nInformation:\n    Tab: Example\n    Full error: Example Error\n    Note: If the full error contains "Cannot read properties of null" then the tab likely didn't download properly.`
            var old_element = document.getElementById("GoBackERR")
            var new_element = old_element.cloneNode(true)
            new_element.addEventListener('click', () => {
                openTab('Market', 'MarketButton')
            })
            new_element.innerHTML = "Go Back to Market"
            old_element.parentNode.replaceChild(new_element, old_element)
        } else {
            document.getElementById("ErrorTXTM").innerHTML = "Oops, that tab wasn't found"
            document.getElementById("ErrorTXTS").innerHTML = `The tab "Example" could not be found so we redirected you to here, the error code was "FetchTabFailure", you can copy the entire error using the button below.<br>Sorry for the inconvience :(`
            window.copyERROR = `ERROR: FetchTabFailure\nInformation:\n    Tab: Example\n    Full error: Example Error\n    Note: If the full error contains "Cannot read properties of null" then the tab likely doesn't exist.`
            var old_element = document.getElementById("GoBackERR")
            var new_element = old_element.cloneNode(true)
            new_element.addEventListener('click', () => {
                openTab('Home', 'BotButton')
            })
            new_element.innerHTML = "Go Back Home"
            old_element.parentNode.replaceChild(new_element, old_element)
        }
        currentMenu = "ErrorFound"
        document.getElementById("ErrorFound").classList.add("showentab")
    } else {
        if (currentTab === tabName) {
            handleChange()
            return
        }
        currentTab = tabName
        currentOverride = override
        currentOption = option
        var i, tabcontent, tablinks, presence
        var key = 'bigimg'
        handleChange()

        try {
            if (!document.getElementById(override).classList.contains("active")) {
                tablinks = document.getElementsByClassName("tablinks")
                for (i = 0; i < tablinks.length; i++) {
                    tablinks[i].className = tablinks[i].className.replace(" active", "")
                }
                document.getElementById(override).classList.add("active")
            }
        } catch (err) { }

        tabcontent = document.getElementsByClassName("tabcontent")
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].classList.remove("showentab")
        }

        var currentMenu

        try {
            document.getElementById(tabName).classList.add("showentab")
            currentMenu = tabName
        } catch (err) {
            if (tabName.endsWith("markettab")) {
                document.getElementById("ErrorTXTM").innerHTML = "Oops, that extension's data wasn't found"
                document.getElementById("ErrorTXTS").innerHTML = `The extension tab "${tabName}" could not be found so we redirected you to here, the error code was "ExtensionTabFailure", you can copy the entire error using the button below.<br>Sorry for the inconvience :(`
                window.copyERROR = `ERROR: ExtensionTabFailure\nInformation:\n    Tab: ${tabName}\n    Full error: ${err}\n    Note: If the full error contains "Cannot read properties of null" then the tab likely didn't download properly.`
                var old_element = document.getElementById("GoBackERR")
                var new_element = old_element.cloneNode(true)
                new_element.addEventListener('click', () => {
                    openTab('Market', 'MarketButton')
                })
                new_element.innerHTML = "Go Back to Market"
                old_element.parentNode.replaceChild(new_element, old_element)
            } else {
                document.getElementById("ErrorTXTM").innerHTML = "Oops, that tab wasn't found"
                document.getElementById("ErrorTXTS").innerHTML = `The tab "${tabName}" could not be found so we redirected you to here, the error code was "FetchTabFailure", you can copy the entire error using the button below.<br>Sorry for the inconvience :(`
                window.copyERROR = `ERROR: FetchTabFailure\nInformation:\n    Tab: ${tabName}\n    Full error: ${err}\n    Note: If the full error contains "Cannot read properties of null" then the tab likely doesn't exist.`
                var old_element = document.getElementById("GoBackERR")
                var new_element = old_element.cloneNode(true)
                new_element.addEventListener('click', () => {
                    openTab('Home', 'BotButton')
                })
                new_element.innerHTML = "Go Back Home"
                old_element.parentNode.replaceChild(new_element, old_element)
            }
            currentMenu = "ErrorFound"
            document.getElementById("ErrorFound").classList.add("showentab")
        }

        if (currentMenu === "Home" || currentMenu === "Configuration" || currentMenu === "Information" || currentMenu === "Market") {
            presence = `Currently in the ${currentMenu} menu.`
            if (currentMenu === "Configuration") {
                key = 'bigimgcog'
            } else {
                key = 'bigimg'
            }
        } else if (currentMenu === "DEBUG") {
            presence = 'Currently DEBUGGING something...'
            key = 'bigimg'
        } else if (currentMenu === "ErrorFound") {
            presence = 'Currently in an error menu :('
        } else if (currentMenu === "Options") {
            presence = "Currently modifing CrimsonGUI's settings"
            key = 'bigimgcog'
        } else if (currentMenu.endsWith("markettab")) {
            var name = currentMenu.slice(0, -9)
            while (name.endsWith("¬")) {
                name = name.slice(0, -1)
            }
            presence = `Currently checking ${name} out.`
            if (currentMenu.slice(0, -9) === "PyRun") {
                key = 'pyrunlogo'
            }
        } else {
            var metaname = codeAdditions.metanames[currentMenu]
            presence = `Currently modifing ${metaname}'s settings.`
            if (metaname === "PyRun") {
                key = 'pyrunlogo'
            } else {
                key = 'bigimgcog'
            }
        }
        if (presence === null) {
            presence = 'Something has really gone wrong'
        }
        crimAPI.rcpChange([presence, key])
    }
}

async function toggleDarkMode() {
    try {
        currentMode = await window.darkMode.toggle()
        document.getElementById('theme-source').innerHTML = currentMode ? 'Dark' : 'Light'
    }
    catch (err) {
        console.log(err)
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 100))
}

async function sysDarkMode() {
    try {
        currentMode = await window.darkMode.system()
        document.getElementById('theme-source').innerHTML = 'System'
    }
    catch (err) {
        console.log(err)
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 100))
}

darkMode.handleDarkChange(async (event, arg) => {
    toggleDarkMode()
})

function handleChange() {
    try {
        var options = JSON.parse(currentOption)
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.getElementById("lightmodecolors").style.display = "none"
            document.getElementById("darkmodecolors").style.display = "block"
            document.documentElement.style.setProperty('--background', options.dark.background.main)
            document.documentElement.style.setProperty('--backgroundalt', options.dark.background.alt)
            document.documentElement.style.setProperty('--button', options.dark.button.main)
            document.documentElement.style.setProperty('--buttonhov', options.dark.button.hov)
            document.documentElement.style.setProperty('--buttonact', options.dark.button.act)
            document.documentElement.style.setProperty('--buttonacthov', options.dark.button.hovact)
        } else {
            document.getElementById("lightmodecolors").style.display = "block"
            document.getElementById("darkmodecolors").style.display = "none"
            document.documentElement.style.setProperty('--background', options.light.background.main)
            document.documentElement.style.setProperty('--backgroundalt', options.light.background.alt)
            document.documentElement.style.setProperty('--button', options.light.button.main)
            document.documentElement.style.setProperty('--buttonhov', options.light.button.hov)
            document.documentElement.style.setProperty('--buttonact', options.light.button.act)
            document.documentElement.style.setProperty('--buttonacthov', options.light.button.hovact)
        }
    } catch (err) {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.getElementById("lightmodecolors").style.display = "none"
            document.getElementById("darkmodecolors").style.display = "block"
            document.documentElement.style.setProperty('--background', document.getElementById("backgroundmainchange").value)
            document.documentElement.style.setProperty('--backgroundalt', document.getElementById("backgroundaltchange").value)
            document.documentElement.style.setProperty('--color', document.getElementById("textmainchange").value)
            document.documentElement.style.setProperty('--coloralt', document.getElementById("textaltchange").value)
            document.documentElement.style.setProperty('--button', document.getElementById("buttonmainchange").value)
            document.documentElement.style.setProperty('--buttonhov', document.getElementById("buttonhovchange").value)
            document.documentElement.style.setProperty('--buttonact', document.getElementById("buttonactchange").value)
            document.documentElement.style.setProperty('--buttonacthov', document.getElementById("buttonhovactchange").value)
        } else {
            document.getElementById("lightmodecolors").style.display = "block"
            document.getElementById("darkmodecolors").style.display = "none"
            document.documentElement.style.setProperty('--background', document.getElementById("backgroundmainchangel").value)
            document.documentElement.style.setProperty('--backgroundalt', document.getElementById("backgroundaltchangel").value)
            document.documentElement.style.setProperty('--color', document.getElementById("textmainchangel").value)
            document.documentElement.style.setProperty('--coloralt', document.getElementById("textaltchangel").value)
            document.documentElement.style.setProperty('--button', document.getElementById("buttonmainchangel").value)
            document.documentElement.style.setProperty('--buttonhov', document.getElementById("buttonhovchangel").value)
            document.documentElement.style.setProperty('--buttonact', document.getElementById("buttonactchangel").value)
            document.documentElement.style.setProperty('--buttonacthov', document.getElementById("buttonhovactchangel").value)
        }
    }
}

handleChange()

window.matchMedia("(prefers-color-scheme: dark)").addListener(handleChange)