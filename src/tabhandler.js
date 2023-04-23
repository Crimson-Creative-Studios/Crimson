var currentTab = null

async function openTab(tabName, override = null, option = "") {
    if (tabName.startsWith("falseErrorTest")) {
        tabcontent = document.getElementsByClassName("tabcontent")
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none"
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
        document.getElementById("ErrorFound").style.display = "block"
    } else {
        if (currentTab === tabName) {
            return
        }
        currentTab = tabName
        var i, tabcontent, tablinks, presence
        var key = 'bigimg'
        try {
            var options = JSON.parse(option)
            if (await darkMode.get()) {
                document.documentElement.style.setProperty('--background', options.dark.background.main)
                document.documentElement.style.setProperty('--backgroundalt', options.dark.background.alt)
                document.documentElement.style.setProperty('--button', options.dark.button.main)
                document.documentElement.style.setProperty('--buttonhov', options.dark.button.hov)
                document.documentElement.style.setProperty('--buttonact', options.dark.button.act)
                document.documentElement.style.setProperty('--buttonacthov', options.dark.button.hovact)
            } else {
                document.documentElement.style.setProperty('--background', options.light.background.main)
                document.documentElement.style.setProperty('--backgroundalt', options.light.background.alt)
                document.documentElement.style.setProperty('--button', options.light.button.main)
                document.documentElement.style.setProperty('--buttonhov', options.light.button.hov)
                document.documentElement.style.setProperty('--buttonact', options.light.button.act)
                document.documentElement.style.setProperty('--buttonacthov', options.light.button.hovact)
            }
        } catch (err) {
            document.documentElement.style.setProperty('--background', '')
            document.documentElement.style.setProperty('--backgroundalt', '')
            document.documentElement.style.setProperty('--button', '')
            document.documentElement.style.setProperty('--buttonhov', '')
            document.documentElement.style.setProperty('--buttonact', '')
            document.documentElement.style.setProperty('--buttonacthov', '')
        }

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
            tabcontent[i].style.display = "none"
        }

        var currentMenu

        try {
            document.getElementById(tabName).style.display = "block"
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
            document.getElementById("ErrorFound").style.display = "block"
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