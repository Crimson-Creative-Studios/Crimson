var themeNow = "", themeEffectNow = ""
var animations = []
var animationFunctions = []
var guicfg = crimAPI.guicfg()

function applyColor(el, options) {
    if (options && !document.getElementById("extensionThemeOverride").checked) {
        try {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                el.style.setProperty('--background', options.dark.background.main)
                el.style.setProperty('--backgroundalt', options.dark.background.alt)
                el.style.setProperty('--button', options.dark.button.main)
                el.style.setProperty('--buttonhov', options.dark.button.hov)
                el.style.setProperty('--buttonact', options.dark.button.act)
                el.style.setProperty('--buttonacthov', options.dark.button.hovact)
            } else {
                el.style.setProperty('--background', options.light.background.main)
                el.style.setProperty('--backgroundalt', options.light.background.alt)
                el.style.setProperty('--button', options.light.button.main)
                el.style.setProperty('--buttonhov', options.light.button.hov)
                el.style.setProperty('--buttonact', options.light.button.act)
                el.style.setProperty('--buttonacthov', options.light.button.hovact)
            }
            return
        } catch (err) {
            loadColors()
        }
    } else {
        el.style.setProperty('--background', document.getElementById("backgroundmainchange").value)
        el.style.setProperty('--backgroundalt', document.getElementById("backgroundaltchange").value)
        el.style.setProperty('--color', document.getElementById("textmainchange").value)
        el.style.setProperty('--coloralt', document.getElementById("textaltchange").value)
        el.style.setProperty('--button', document.getElementById("buttonmainchange").value)
        el.style.setProperty('--buttonhov', document.getElementById("buttonhovchange").value)
        el.style.setProperty('--buttonact', document.getElementById("buttonactchange").value)
        el.style.setProperty('--buttonacthov', document.getElementById("buttonhovactchange").value)
    }
}

function loadColors(options) {
    if (document.getElementById("element").value) {
        const elements = document.querySelectorAll(document.getElementById("element").value)
        for (const element of elements) {
            applyColor(element, options)
        }
    } else {
        applyColor(document.documentElement, options)
    }
    document.documentElement.style.setProperty('--darkness', String(Number(document.getElementById("darknessControl").value) / 1000))
    document.title = document.getElementById("texttitle").innerHTML
}

function clearColor() {
    window.onmousemove = undefined
    window.onmousedown = undefined
    animations.forEach(clearInterval)
    animationFunctions.forEach((func) => {
        func = function () { }
    })
    animations = []
    animationFunctions = []
    try {
        script.remove()
        effectScript.remove()
        effectScript = undefined
    } catch (err) { }
    themeNow = ""
    themeEffectNow = ""
    if (iscrinsom) {
        document.getElementById("texttitle").innerHTML = "CrinsomGUI"
    } else {
        document.getElementById("texttitle").innerHTML = "CrimsonGUI"
    }
    document.getElementById("element").value = ""
    document.getElementById("backgroundmainchange").value = ""
    document.getElementById("backgroundaltchange").value = ""
    document.getElementById("textmainchange").value = ""
    document.getElementById("textaltchange").value = ""
    document.getElementById("buttonmainchange").value = ""
    document.getElementById("buttonhovchange").value = ""
    document.getElementById("buttonactchange").value = ""
    document.getElementById("buttonhovactchange").value = ""
    loadColors()

    for (const thing of document.querySelectorAll("*")) {
        if (thing.id !== "tiles" && thing.id !== "changeColorsDev") {
            if (thing.classList.contains("role-dot")) {
                thing.setAttribute("style", `--rcolor: ${getComputedStyle(thing).getPropertyValue("--rcolor")};`)
            } else if (thing.classList.contains("tile")) {
                thing.setAttribute("style", `--delay: ${getComputedStyle(thing).getPropertyValue("--delay")};`)
            } else {
                thing.setAttribute("style", "")
            }
        }

        if (thing.classList.contains("exbtnid")) {
            thing.setAttribute("style", "width: 120px; height: 135px; display: inline;")
        }

        if (thing.classList.contains("eximgbtn")) {
            thing.setAttribute("style", "border-radius: 10px; border-style: solid; border-width: 2px; border-color: white;")
        }

        if (thing.classList.contains("theme-deco")) {
            thing.remove()
        }
    }

    var guioptions = {
        theme: themeNow,
        themeEffect: themeEffectNow,
        darkness: document.getElementById("darknessControl").value,
        override: document.getElementById("extensionThemeOverride").checked
    }
    try {
        crimAPI.sendThemeData(guioptions)
    } catch (err) { }
}

function resetEl() {
    document.getElementById("element").value = ""
}

function setBackgroundColor(colors) {
    document.getElementById("backgroundmainchange").value = colors.main ?? ""
    document.getElementById("backgroundaltchange").value = colors.alt ?? ""
    document.documentElement.style.setProperty("--cnslbg", colors.console ?? "")
}

function setTextColor(colors) {
    document.getElementById("textmainchange").value = colors.main ?? ""
    document.getElementById("textaltchange").value = colors.alt ?? ""
}

function setButtonColor(colors) {
    document.getElementById("buttonmainchange").value = colors.main ?? ""
    document.getElementById("buttonhovchange").value = colors.hover ?? ""
    document.getElementById("buttonactchange").value = colors.active ?? ""
    document.getElementById("buttonhovactchange").value = colors.hoveractive ?? ""
    document.documentElement.style.setProperty("--buttontext", colors.text ?? "")
}

function setConsoleColors(colors) {
    document.documentElement.style.setProperty("--console-black", colors.black ?? "")
    document.documentElement.style.setProperty("--console-red", colors.red ?? "")
    document.documentElement.style.setProperty("--console-green", colors.green ?? "")
    document.documentElement.style.setProperty("--console-yellow", colors.yellow ?? "")
    document.documentElement.style.setProperty("--console-blue", colors.blue ?? "")
    document.documentElement.style.setProperty("--console-magenta", colors.magenta ?? "")
    document.documentElement.style.setProperty("--console-cyan", colors.cyan ?? "")
    document.documentElement.style.setProperty("--console-white", colors.white ?? "")
    document.documentElement.style.setProperty("--console-crimson", colors.crimson ?? "")
    document.documentElement.style.setProperty("--console-grey", colors.grey ?? "")
}

function setTitle(text) {
    document.getElementById("texttitle").innerHTML = text
}

window.loadColors = loadColors
const crinsom = Math.floor(Math.random() * 50)
var iscrinsom = false
if (crinsom === 1) {
    document.getElementById("texttitle").innerHTML = "CrinsomGUI"
    iscrinsom = true
}

function changeWinText() {
    setTimeout(() => {
        document.title = document.getElementById("texttitle").innerHTML
    }, 200)
}

var script, effectScript

function addTheme(name, type = "theme") {
    if (type === "effect") {
        if (name !== themeEffectNow) {
            if (effectScript) {
                addTheme(themeNow)
            }
            effectScript = document.createElement("script")
            effectScript.setAttribute("src", "./themeEffects/" + name)
            effectScript.onload = () => {
                themeEffectNow = name
                var guioptions = {
                    theme: themeNow,
                    themeEffect: themeEffectNow,
                    darkness: document.getElementById("darknessControl").value,
                    override: document.getElementById("extensionThemeOverride").checked
                }
                try {
                    crimAPI.sendThemeData(guioptions)
                } catch (err) { }
            }
            document.head.appendChild(effectScript)
        }
    } else {
        script = document.createElement("script")
        script.setAttribute("src", "./themes/" + name)
        script.onload = () => {
            themeNow = name
            var guioptions = {
                theme: themeNow,
                themeEffect: themeEffectNow,
                darkness: document.getElementById("darknessControl").value,
                override: document.getElementById("extensionThemeOverride").checked
            }
            try {
                crimAPI.sendThemeData(guioptions)
            } catch (err) { }
        }
        document.head.appendChild(script)
    }
}

window.onload = async () => {
    if (guicfg.theme) {
        addTheme(guicfg.theme)
    }
    await new Promise(resolve => setTimeout(resolve, 10))
    if (guicfg.themeEffect) {
        addTheme(guicfg.themeEffect, "effect")
    }
    if (guicfg.darkness) {
        document.documentElement.style.setProperty('--darkness', String(Number(guicfg.darkness) / 1000))
    }
    if (guicfg.override) {
        document.getElementById("extensionThemeOverride").checked = true
    }

    for (const theme of crimAPI.themes()) {
        const button = document.createElement("button")
        button.classList.add("button")
        button.setAttribute("onclick", `addTheme("${theme}")`)
        button.innerHTML = theme.slice(0, -3)
        document.getElementById("themesBTNHolder").insertAdjacentHTML("beforeend", button.outerHTML)
    }

    for (const themeEffect of crimAPI.themeEffects()) {
        const button = document.createElement("button")
        button.classList.add("button")
        button.setAttribute("onclick", `addTheme("${themeEffect}", "effect")`)
        button.innerHTML = themeEffect.slice(0, -3)
        document.getElementById("themeEffectsBTNHolder").insertAdjacentHTML("beforeend", button.outerHTML)
    }

    crimAPI.show()
}

function saveGUISettings() {
    const options = {
        theme: themeNow,
        themeEffect: themeEffectNow,
        darkness: document.getElementById("darknessControl").value,
        override: document.getElementById("extensionThemeOverride").checked
    }
    handleNotification("savingModal", 3000)
    try {
        crimAPI.jsonRequest(["setJSONNotStyle", "guicfg.json", JSON.stringify(options)])
    } catch (err) { }
}