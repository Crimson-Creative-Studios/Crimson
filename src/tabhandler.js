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
    } catch (err) {
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

        const presences = {
            Home: {
                menu: "Home",
                presence: "Home menu 🏠"
            },
            Configuration: {
                menu: "Configuration",
                presence: "Config menu ⚙️",
                logo: "bigimgcog"
            },
            Information: {
                menu: "Information",
                presence: "Info ℹ️"
            },
            Market: {
                menu: "Market",
                presence: "Market menu 🏘️"
            },
            DEBUG: {
                menu: "DEBUG",
                presence: "Debugging 🪲"
            },
            Error: {
                menu: "ErrorFound",
                presence: "Error! 😵"
            },
            CrimsonOptions: {
                menu: "CrimsonOptions",
                presence: "Crimson settings ⚙️",
                logo: "bigimgcog"
            },
            Options: {
                menu: "Options",
                presence: "CrimsonGUI settings ⚙️",
                logo: "bigimgcog"
            },
            Themes: {
                menu: ["ColorChanger", "PreviewColors", "InfoElement"],
                presence: "Customizing the theme 🖌️"
            },
            Ultra: {
                menu: "Ultra",
                presence: "Ultra 🤔"
            },
            Credits: {
                endsWith: "Cr!",
                presence: "Checking out the credits 📃"
            },
            EXSettings: {
                endsWith: "EXsettings",
                presence: "$NAME settings ⚙️",
                logo: "bigimgcog",
                type: "Local"
            },
            EXMarket: {
                endsWith: "markettab",
                presence: "Looking at $NAME 👌",
                type: "Online"
            }
        }

        var success = false

        for (const tabType of Object.keys(presences)) {
            const tab = presences[tabType]
            if (tab.menu) {
                if (tab.menu instanceof Array) {
                    if (tab.menu.includes(currentMenu)) {
                        crimAPI.rcpChange([tab.presence, tab.key ?? "bigimg"])
                        success = true
                    }
                } else {
                    if (tab.menu === currentMenu) {
                        crimAPI.rcpChange([tab.presence, tab.key ?? "bigimg"])
                        success = true
                    }
                }
            } else if (tab.endsWith) {
                if (currentMenu.endsWith(tab.endsWith)) {
                    if (tab.type === "Online") {
                        var name = currentMenu.slice(0, -9)
                        while (name.endsWith("¬")) {
                            name = name.slice(0, -1)
                        }
                        crimAPI.rcpChange([tab.presence.replaceAll("$NAME", name), tab.key ?? "bigimg"])
                        success = true
                    } else if (tab.type === "Local") {
                        var name = crimAPI.codeAdditions.metanames[currentMenu.slice(0, -10)]
                        crimAPI.rcpChange([tab.presence.replaceAll("$NAME", name), tab.key ?? "bigimg"])
                        success = true
                    } else {
                        crimAPI.rcpChange([tab.presence, tab.key ?? "bigimg"])
                        success = true
                    }
                }
            }
        }

        if (!success) {
            crimAPI.rcpChange(["Unknown menu 😭", "bigimg"])
        }
    }
}