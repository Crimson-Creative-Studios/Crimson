var currentTab = null
var currentOverride = null
var currentOption = null
var currentMode = null
var custom = false

function attemptColorLoad() {
    try {
        if (currentOption) {
            loadColors(JSON.parse(currentOption))
        } else {
            loadColors()
        }
    } catch(err) {
        console.error(err)
        loadColors()
    }
}

async function openTab(tabName, override = null, option = "") {
    loadColors()
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
        currentTab = tabName
        document.getElementById("ErrorFound").classList.add("showentab")
    } else {
        if (currentTab === tabName) {
            attemptColorLoad()
            return
        }
        currentTab = tabName
        currentOverride = override
        currentOption = option
        var i, tabcontent, tablinks, presence
        var key = 'bigimg'
        attemptColorLoad()

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
            document.getElementById(tabName).tabIndex = 0
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
            presence = `${currentMenu} menu`
            if (currentMenu === "Configuration") {
                presence = "Config menu ⚙️"
                key = 'bigimgcog'
            } else {
                key = 'bigimg'
                if (currentMenu === "Home") {
                    presence += " 🏠"
                } else if (currentMenu === "Information") {
                    presence = "Info ℹ️"
                } else if (currentMenu === "Market") {
                    presence += " 🏘️"
                }
            }
        } else if (currentMenu === "DEBUG") {
            presence = 'Debugging 🪲'
            key = 'bigimg'
        } else if (currentMenu === "ErrorFound") {
            presence = 'Error! 😵'
        } else if (currentMenu === "CrimsonOptions") {
            presence = "Crimson settings ⚙️"
            key = 'bigimgcog'
        } else if (currentMenu === "Options") {
            presence = "CrimsonGUI settings ⚙️"
            key = 'bigimgcog'
        } else if (currentMenu === "ColorChanger" || currentMenu === "PreviewColors" || currentMenu === "InfoElement") {
            presence = "Customizing the theme 🖌️"
        } else if (currentMenu === "Nova" || currentMenu === "CCS" || currentMenu === "Vanquish" || currentMenu === "FA") {
            presence = "Checking out the credits 📃"
        } else if (currentMenu === "Ultra") {
            presence = "Ultra 🤔"
        } else if (currentMenu.endsWith("EXsettings")) {
            var metaname = crimAPI.codeAdditions.metanames[currentMenu.slice(0, -10)]
            presence = `${metaname} settings ⚙️`
            if (metaname === "PyRun") {
                key = 'pyrunlogo'
            } else {
                key = 'bigimgcog'
            }
        } else if (currentMenu.endsWith("markettab")) {
            var name = currentMenu.slice(0, -9)
            while (name.endsWith("¬")) {
                name = name.slice(0, -1)
            }
            presence = `Looking at ${name} 👌`
            if (currentMenu.slice(0, -9) === "PyRun") {
                key = 'pyrunlogo'
            }
        }
        if (!presence) {
            presence = 'Something has really gone wrong 😭'
        }
        crimAPI.rcpChange([presence, key])
    }
}