function loadColors(options, save = false) {
    if (options && !document.getElementById("extensionThemeOverride").checked) {
        try {
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
            return
        } catch (err) {
            loadColors()
        }
    } else {
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
    document.documentElement.style.setProperty('--darkness', String(Number(document.getElementById("darknessControl").value)/100))
    if (save) {
        const guicfg = JSON.stringify({
            theme: {
                dark: {
                    background: {
                        main: document.getElementById("backgroundmainchange").value,
                        alt: document.getElementById("backgroundaltchange").value
                    },
                    text: {
                        main: document.getElementById("textmainchange").value,
                        alt: document.getElementById("textaltchange").value
                    },
                    button: {
                        main: document.getElementById("buttonmainchange").value,
                        hov: document.getElementById("buttonhovchange").value,
                        act: document.getElementById("buttonactchange").value,
                        acthov: document.getElementById("buttonhovactchange").value
                    }
                },
                light: {
                    background: {
                        main: document.getElementById("backgroundmainchangel").value,
                        alt: document.getElementById("backgroundaltchangel").value
                    },
                    text: {
                        main: document.getElementById("textmainchangel").value,
                        alt: document.getElementById("textaltchangel").value
                    },
                    button: {
                        main: document.getElementById("buttonmainchangel").value,
                        hov: document.getElementById("buttonhovchangel").value,
                        act: document.getElementById("buttonactchangel").value,
                        acthov: document.getElementById("buttonhovactchangel").value
                    }
                },
                override: String(document.getElementById("extensionThemeOverride").checked),
                darkness: String(Number(document.getElementById("darknessControl").value)/100)
            }
        }, null, 4)
        handleNotification("savingModal", 5000)
        crimAPI.jsonRequest(["setJSONNotStyle", "guicfg.json", guicfg])
    }
}

window.addEventListener("load", () => {
    const cfg = crimAPI.guicfg()

    document.getElementById("backgroundmainchange").value = cfg.theme.dark.background.main
    document.getElementById("backgroundaltchange").value = cfg.theme.dark.background.alt
    document.getElementById("textmainchange").value = cfg.theme.dark.text.main
    document.getElementById("textaltchange").value = cfg.theme.dark.text.alt
    document.getElementById("buttonmainchange").value = cfg.theme.dark.button.main
    document.getElementById("buttonhovchange").value = cfg.theme.dark.button.hov
    document.getElementById("buttonactchange").value = cfg.theme.dark.button.act
    document.getElementById("buttonhovactchange").value = cfg.theme.dark.button.acthov

    document.getElementById("backgroundmainchangel").value = cfg.theme.light.background.main
    document.getElementById("backgroundaltchangel").value = cfg.theme.light.background.alt
    document.getElementById("textmainchangel").value = cfg.theme.light.text.main
    document.getElementById("textaltchangel").value = cfg.theme.light.text.alt
    document.getElementById("buttonmainchangel").value = cfg.theme.light.button.main
    document.getElementById("buttonhovchangel").value = cfg.theme.light.button.hov
    document.getElementById("buttonactchangel").value = cfg.theme.light.button.act
    document.getElementById("buttonhovactchangel").value = cfg.theme.light.button.acthov

    if (cfg.theme.override === "true") {
        document.getElementById("extensionThemeOverride").checked = true
    } else {
        document.getElementById("extensionThemeOverride").checked = false
    }
    document.getElementById("darknessControl").value = Number(cfg.theme.darkness) * 100
    loadColors()
})

//Best theme is first theme
function loadNeon() {
    document.getElementById("backgroundmainchange").value = "#730073"
    document.getElementById("backgroundaltchange").value = "#6e006e"
    document.getElementById("textmainchange").value = ""
    document.getElementById("textaltchange").value = ""
    document.getElementById("buttonmainchange").value = "#00a3a3"
    document.getElementById("buttonhovchange").value = "#008c8c"
    document.getElementById("buttonactchange").value = "#007a7a"
    document.getElementById("buttonhovactchange").value = "#006363"

    document.getElementById("backgroundmainchangel").value = "#ff75ff"
    document.getElementById("backgroundaltchangel").value = "#ff6bff"
    document.getElementById("textmainchangel").value = "white"
    document.getElementById("textaltchangel").value = "#c4c4c4"
    document.getElementById("buttonmainchangel").value = "#00a3a3"
    document.getElementById("buttonhovchangel").value = "#00b5b5"
    document.getElementById("buttonactchangel").value = "#00c4c4"
    document.getElementById("buttonhovactchangel").value = "#00d1d1"
    loadColors()
}

//Cool color, COLORS WOW
function loadBAB() {
    document.getElementById("backgroundmainchange").value = "#0F64AC"
    document.getElementById("backgroundaltchange").value = "#0a5391"
    document.getElementById("textmainchange").value = ""
    document.getElementById("textaltchange").value = ""
    document.getElementById("buttonmainchange").value = "#000000"
    document.getElementById("buttonhovchange").value = "#303030"
    document.getElementById("buttonactchange").value = "#505050"
    document.getElementById("buttonhovactchange").value = "#707070"

    document.getElementById("backgroundmainchangel").value = "#85c7ff"
    document.getElementById("backgroundaltchangel").value = "#78c1ff"
    document.getElementById("textmainchangel").value = ""
    document.getElementById("textaltchangel").value = ""
    document.getElementById("buttonmainchangel").value = "#000000"
    document.getElementById("buttonhovchangel").value = "#303030"
    document.getElementById("buttonactchangel").value = "#505050"
    document.getElementById("buttonhovactchangel").value = "#707070"
    loadColors()
}

//QuestCraft is BestCraft
function loadQC() {
    document.getElementById("backgroundmainchange").value = "#503624"
    document.getElementById("backgroundaltchange").value = "#4d3322"
    document.getElementById("textmainchange").value = ""
    document.getElementById("textaltchange").value = ""
    document.getElementById("buttonmainchange").value = "#77AB43"
    document.getElementById("buttonhovchange").value = "#628f35"
    document.getElementById("buttonactchange").value = "#4b7025"
    document.getElementById("buttonhovactchange").value = "#3f611d"

    document.getElementById("backgroundmainchangel").value = "#b88d70"
    document.getElementById("backgroundaltchangel").value = "#b38a6d"
    document.getElementById("textmainchangel").value = ""
    document.getElementById("textaltchangel").value = ""
    document.getElementById("buttonmainchangel").value = "#77AB43"
    document.getElementById("buttonhovchangel").value = "#85bd4d"
    document.getElementById("buttonactchangel").value = "#92cc58"
    document.getElementById("buttonhovactchangel").value = "#9dd962"
    loadColors()
}

//hehe, pp
function loadPP() {
    document.getElementById("backgroundmainchange").value = "#7a2370"
    document.getElementById("backgroundaltchange").value = "#75216c"
    document.getElementById("textmainchange").value = ""
    document.getElementById("textaltchange").value = ""
    document.getElementById("buttonmainchange").value = "#af2ad4"
    document.getElementById("buttonhovchange").value = "#9f21c2"
    document.getElementById("buttonactchange").value = "#901cb0"
    document.getElementById("buttonhovactchange").value = "#7f169c"

    document.getElementById("backgroundmainchangel").value = "#e88bdd"
    document.getElementById("backgroundaltchangel").value = "#db7fd0"
    document.getElementById("textmainchangel").value = "white"
    document.getElementById("textaltchangel").value = "#c4c4c4"
    document.getElementById("buttonmainchangel").value = "#af2ad4"
    document.getElementById("buttonhovchangel").value = "#9f21c2"
    document.getElementById("buttonactchangel").value = "#901cb0"
    document.getElementById("buttonhovactchangel").value = "#7f169c"
    loadColors()
}

//birb
function loadP() {
    document.getElementById("backgroundmainchange").value = "#106f75"
    document.getElementById("backgroundaltchange").value = "#0c5c69"
    document.getElementById("textmainchange").value = ""
    document.getElementById("textaltchange").value = ""
    document.getElementById("buttonmainchange").value = "#8c602e"
    document.getElementById("buttonhovchange").value = "#7a5326"
    document.getElementById("buttonactchange").value = "#66441e"
    document.getElementById("buttonhovactchange").value = "#523617"

    document.getElementById("backgroundmainchangel").value = "#04C4CA"
    document.getElementById("backgroundaltchangel").value = "#16bdc9"
    document.getElementById("textmainchangel").value = "white"
    document.getElementById("textaltchangel").value = "#c4c4c4"
    document.getElementById("buttonmainchangel").value = "#F7BB77"
    document.getElementById("buttonhovchangel").value = "#DC9C56"
    document.getElementById("buttonactchangel").value = "#C28142"
    document.getElementById("buttonhovactchangel").value = "#AD7239"
    loadColors()
}

//Discord moment
function loadAmoled() {
    document.getElementById("backgroundmainchange").value = "#000000"
    document.getElementById("backgroundaltchange").value = "#000000"
    document.getElementById("textmainchange").value = ""
    document.getElementById("textaltchange").value = ""
    document.getElementById("buttonmainchange").value = ""
    document.getElementById("buttonhovchange").value = ""
    document.getElementById("buttonactchange").value = ""
    document.getElementById("buttonhovactchange").value = ""

    document.getElementById("backgroundmainchangel").value = "#ffffff"
    document.getElementById("backgroundaltchangel").value = "#ffffff"
    document.getElementById("textmainchangel").value = ""
    document.getElementById("textaltchangel").value = ""
    document.getElementById("buttonmainchangel").value = ""
    document.getElementById("buttonhovchangel").value = ""
    document.getElementById("buttonactchangel").value = ""
    document.getElementById("buttonhovactchangel").value = ""
    loadColors()
}

//Visual studio :waaaa:
function loadVS() {
    document.getElementById("backgroundmainchange").value = "#293462"
    document.getElementById("backgroundaltchange").value = "#242e59"
    document.getElementById("textmainchange").value = ""
    document.getElementById("textaltchange").value = ""
    document.getElementById("buttonmainchange").value = "#ec9b3b"
    document.getElementById("buttonhovchange").value = "#f24c4c"
    document.getElementById("buttonactchange").value = "#d63c3c"
    document.getElementById("buttonhovactchange").value = "#ba3030"

    document.getElementById("backgroundmainchangel").value = "#b3c0f2"
    document.getElementById("backgroundaltchangel").value = "#a6b4ed"
    document.getElementById("textmainchangel").value = ""
    document.getElementById("textaltchangel").value = ""
    document.getElementById("buttonmainchangel").value = "#ec9b3b"
    document.getElementById("buttonhovchangel").value = "#f24c4c"
    document.getElementById("buttonactchangel").value = "#d63c3c"
    document.getElementById("buttonhovactchangel").value = "#ba3030"
    loadColors()
}

//Skyo Productions reference?!
function loadBB() {
    document.getElementById("backgroundmainchange").value = "#0084b8"
    document.getElementById("backgroundaltchange").value = "#0079a8"
    document.getElementById("textmainchange").value = ""
    document.getElementById("textaltchange").value = ""
    document.getElementById("buttonmainchange").value = "#cc5602"
    document.getElementById("buttonhovchange").value = "#ba4d00"
    document.getElementById("buttonactchange").value = "#ad4800"
    document.getElementById("buttonhovactchange").value = "#9c4100"

    document.getElementById("backgroundmainchangel").value = "#00b4e8"
    document.getElementById("backgroundaltchangel").value = "#00a9d8"
    document.getElementById("textmainchangel").value = "white"
    document.getElementById("textaltchangel").value = "#c4c4c4"
    document.getElementById("buttonmainchangel").value = "#cc5602"
    document.getElementById("buttonhovchangel").value = "#ba4d00"
    document.getElementById("buttonactchangel").value = "#ad4800"
    document.getElementById("buttonhovactchangel").value = "#9c4100"
    loadColors()
}

//images :eyes:
function loadGradHev() {
    document.getElementById("backgroundmainchange").value = 'url("../backgrounds/gradienthevimg.png")'
    document.getElementById("backgroundaltchange").value = 'transparent'
    document.getElementById("textmainchange").value = ""
    document.getElementById("textaltchange").value = ""
    document.getElementById("buttonmainchange").value = "black"
    document.getElementById("buttonhovchange").value = "#222"
    document.getElementById("buttonactchange").value = "#444"
    document.getElementById("buttonhovactchange").value = "#666"

    document.getElementById("backgroundmainchangel").value = 'url("../backgrounds/gradienthevimg.png")'
    document.getElementById("backgroundaltchangel").value = 'transparent'
    document.getElementById("textmainchangel").value = "white"
    document.getElementById("textaltchangel").value = "#c4c4c4"
    document.getElementById("buttonmainchangel").value = "black"
    document.getElementById("buttonhovchangel").value = "#222"
    document.getElementById("buttonactchangel").value = "#444"
    document.getElementById("buttonhovactchangel").value = "#666"
    loadColors()
}

//beep boop, testing testing
function loadTT1() {
    document.getElementById("backgroundmainchange").value = 'black'
    document.getElementById("backgroundaltchange").value = "white"
    document.getElementById("textmainchange").value = "white"
    document.getElementById("textaltchange").value = "black"
    document.getElementById("buttonmainchange").value = "black"
    document.getElementById("buttonhovchange").value = "white"
    document.getElementById("buttonactchange").value = "lightblue"
    document.getElementById("buttonhovactchange").value = "blue"

    document.getElementById("backgroundmainchangel").value = 'white'
    document.getElementById("backgroundaltchangel").value = "black"
    document.getElementById("textmainchangel").value = "black"
    document.getElementById("textaltchangel").value = "white"
    document.getElementById("buttonmainchangel").value = "black"
    document.getElementById("buttonhovchangel").value = "white"
    document.getElementById("buttonactchangel").value = "orange"
    document.getElementById("buttonhovactchangel").value = "red"
    loadColors()
}

//nothing left, gone, HEHEHEHA
function clearColor() {
    document.getElementById("backgroundmainchange").value = ""
    document.getElementById("backgroundaltchange").value = ""
    document.getElementById("textmainchange").value = ""
    document.getElementById("textaltchange").value = ""
    document.getElementById("buttonmainchange").value = ""
    document.getElementById("buttonhovchange").value = ""
    document.getElementById("buttonactchange").value = ""
    document.getElementById("buttonhovactchange").value = ""

    document.getElementById("backgroundmainchangel").value = ""
    document.getElementById("backgroundaltchangel").value = ""
    document.getElementById("textmainchangel").value = ""
    document.getElementById("textaltchangel").value = ""
    document.getElementById("buttonmainchangel").value = ""
    document.getElementById("buttonhovchangel").value = ""
    document.getElementById("buttonactchangel").value = ""
    document.getElementById("buttonhovactchangel").value = ""
    loadColors()
}

window.loadColors = loadColors
const inputs = document.getElementsByClassName("inputcolorcheck")

Array.from(inputs).forEach(inputText => {
    const chkevnts = ["oninput", "onpaste", "oncopy", "oncut"]

    for (evnt in chkevnts) {
        inputText.setAttribute(chkevnts[evnt], 'loadColors()')
    }
})

const crinsom = Math.floor(Math.random() * 100)
if (crinsom === 73) {
    document.getElementById("texttitle").innerHTML = "CrinsomGUI"
}

fetch("themepreload.js", { method: "HEAD" })
    .then(response => {
        if (response.ok) {
            const script = document.createElement("script")
            script.setAttribute("src", "./themepreload.js")
            setTimeout(() => {
                document.head.appendChild(script)
            }, 100)
        }
    })
    .catch(error => {
        console.error(error)
    })