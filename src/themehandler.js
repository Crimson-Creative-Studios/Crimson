function loadColors(options, save = false) {
    if (options) {
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
                }
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
    loadColors()
})

function loadNeon() {
    document.getElementById("backgroundmainchange").value = "#6e006e"
    document.getElementById("backgroundaltchange").value = "#730073"
    document.getElementById("textmainchange").value = ""
    document.getElementById("textaltchange").value = ""
    document.getElementById("buttonmainchange").value = "#00a3a3"
    document.getElementById("buttonhovchange").value = "#008c8c"
    document.getElementById("buttonactchange").value = "#007a7a"
    document.getElementById("buttonhovactchange").value = "#006363"

    document.getElementById("backgroundmainchangel").value = "#ff6bff"
    document.getElementById("backgroundaltchangel").value = "#ff75ff"
    document.getElementById("textmainchangel").value = ""
    document.getElementById("textaltchangel").value = ""
    document.getElementById("buttonmainchangel").value = "#00a3a3"
    document.getElementById("buttonhovchangel").value = "#00b5b5"
    document.getElementById("buttonactchangel").value = "#00c4c4"
    document.getElementById("buttonhovactchangel").value = "#00d1d1"
    loadColors()
}

function loadBAB() {
    document.getElementById("backgroundmainchange").value = "#0F64AC"
    document.getElementById("backgroundaltchange").value = "#0a5391"
    document.getElementById("textmainchange").value = ""
    document.getElementById("textaltchange").value = ""
    document.getElementById("buttonmainchange").value = "#000000"
    document.getElementById("buttonhovchange").value = "#303030"
    document.getElementById("buttonactchange").value = "#505050"
    document.getElementById("buttonhovactchange").value = "#707070"

    document.getElementById("backgroundmainchangel").value = "#78c1ff"
    document.getElementById("backgroundaltchangel").value = "#85c7ff"
    document.getElementById("textmainchangel").value = ""
    document.getElementById("textaltchangel").value = ""
    document.getElementById("buttonmainchangel").value = "#000000"
    document.getElementById("buttonhovchangel").value = "#303030"
    document.getElementById("buttonactchangel").value = "#505050"
    document.getElementById("buttonhovactchangel").value = "#707070"
    loadColors()
}

function loadQC() {
    document.getElementById("backgroundmainchange").value = "#503624"
    document.getElementById("backgroundaltchange").value = "#4d3322"
    document.getElementById("textmainchange").value = ""
    document.getElementById("textaltchange").value = ""
    document.getElementById("buttonmainchange").value = "#77AB43"
    document.getElementById("buttonhovchange").value = "#628f35"
    document.getElementById("buttonactchange").value = "#4b7025"
    document.getElementById("buttonhovactchange").value = "#3f611d"

    document.getElementById("backgroundmainchangel").value = "#b38a6d"
    document.getElementById("backgroundaltchangel").value = "#b88d70"
    document.getElementById("textmainchangel").value = ""
    document.getElementById("textaltchangel").value = ""
    document.getElementById("buttonmainchangel").value = "#77AB43"
    document.getElementById("buttonhovchangel").value = "#85bd4d"
    document.getElementById("buttonactchangel").value = "#92cc58"
    document.getElementById("buttonhovactchangel").value = "#9dd962"
    loadColors()
}

// The morning be like
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