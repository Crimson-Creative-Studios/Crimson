window.gradon = false

document.getElementById('debugCHROME').innerText = versions.chrome()

document.getElementById('debugELECTRON').innerText = versions.electron()

document.getElementById('debugNODE').innerText = versions.node()

async function handleModalTest() {
    for (const modal of document.querySelectorAll(".modal5s")) {
        handleNotification(modal.id, 5000)
        await new Promise(resolve => setTimeout(resolve, 5100))
    }

    for (const modal of document.querySelectorAll(".modal2s")) {
        handleNotification(modal.id, 2000)
        await new Promise(resolve => setTimeout(resolve, 2100))
    }
}
window.handleModalTest = handleModalTest

function copy(thing) {
    navigator.clipboard.writeText(thing)
    handleNotification('copiedModal', 2000)
}

window.copy = copy

ipc.handleAdd((event, arg) => {
    var id = arg[0]
    var content = arg[1]
    document.getElementById(id).insertAdjacentHTML("beforeend", content)
})

codeAdditions.mainAdd.forEach(addition => {
    document.getElementById("main").innerHTML += addition
})

codeAdditions.extensions.forEach(extension => {
    var extensionList = [...extension]
    var name = extensionList[0]
    extensionList.shift()
    for (const item of extensionList) {
        document.getElementById(name).insertAdjacentHTML("beforeend", item)
    }
    document.getElementById(name).insertAdjacentHTML("beforeend", '<button id="' + name + 'save" class="button savebtn">Save Settings</button><br>')
    if (codeAdditions.islib[extension]) {
        document.getElementById(name).insertAdjacentHTML("beforeend", `<p>${codeAdditions.libtext[extension].text}</p><button class="button" onclick="crimAPI.openSite('${codeAdditions.libtext[extension].buttonlink}')">${codeAdditions.libtext[extension].buttontext}</button>`)
    }
    document.getElementById(name).insertAdjacentHTML("beforeend", '<br><br><br><br>')
    document.getElementById(name + "save").addEventListener('click', () => {
        var items = []
        var vals = []
        var value = document.getElementById(name + "input").checked
        console.log(value)
        items.push("enabled")
        vals.push(String(value))
        for (const uuid of Object.keys(codeAdditions.userCFGS)) {
            var information = codeAdditions.userCFGS[uuid]
            if (information.extension === name) {
                var value = document.getElementById(uuid).value
                items.push(information.item)
                vals.push(value)
            }
        }
        crimAPI.jsonRequest(["setValBulkNotStyle", `../Extensions/${name}/${information.file}`, items, vals])
    })
})

codeAdditions.configs.forEach(config => {
    document.getElementById('Configuration').insertAdjacentHTML("beforeend", config)
})

codeAdditions.errs.forEach(err => {
    console.log(err)
})

for (var uuid of Object.keys(codeAdditions.userCFGS)) {
    document.getElementById(uuid).defaultValue = codeAdditions.defaults[uuid]
}

const funfacts = ["CrimsonGUI is written in Electron", "CrimsonGUI had 2 open beta 1s, odd isn't it?", "Crimson <i>will</i> have a mixin like capability", "<b>There will be no beans theme</b>"]
var funfact = funfacts[Math.floor((Math.random() * funfacts.length))]

document.getElementById('funfact').innerHTML = `Fun Fact: ${funfact}`

//! Saving and modals

var btns = document.getElementsByClassName("savebtn")

for (let i = 0; i < btns.length; i++) {
    btns[i].onclick = async function () {
        handleNotification("savingModal", 5000)
    }
}

document.getElementById("CopyERR").addEventListener("click", async (event) => {
    navigator.clipboard.writeText(window.copyERROR)
    handleNotification("copiedModal", 2000)
})

var mainCfg = document.getElementById("saveMainCFG")

mainCfg.onclick = async function (e) {
    e.preventDefault()
    handleNotification("savingModal", 5000)
    var information = {
        token: document.getElementById('token').value,
        clientid: document.getElementById('cid').value,
        adminname: document.getElementById('adprefix').value
    }
    crimAPI.saveENV(information)
}

crimAPI.handleNotificationMain((event, arg) => {
    new Promise(resolve => setTimeout(() => {
        handleNotification(arg[0], arg[1])
        resolve()
    }, arg[2]))
})

crimAPI.handleVer((event, arg) => {
    if (arg.replace("\n", "") !== "Open Beta 3") {
        document.getElementById('versionut').innerHTML = `New version found!<br>Current version: Open Beta 3<br>Found version: ${arg}`
    } else {
        document.getElementById('versionut').innerHTML = "No new versions found."
    }
})

function repoLink(thing, link = "https://github.com/SkyoProductions/OfficialCrimsonRepo/raw/main/") {
    return link + thing
}

const exsitent = []

async function handleExtensionData(key, data) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            var info = data[key]
            var authors = info.authors
            var name = info.name
            var id = info.folder
            var file = info.zip
            var ui = info.ui
            var logo = await axios.get(repoLink(`${id}/${ui.logo}`), { responseType: "arraybuffer" })

            const blob = new Blob([logo.data])
            const url = URL.createObjectURL(blob)
            const img = new Image()

            img.onload = function () {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')

                canvas.width = 100
                canvas.height = 100
                ctx.drawImage(img, 0, 0, 100, 100)
                canvas.toBlob(function (blob) {
                    const reader = new FileReader()
                    reader.onload = function () {
                        const resizedArrayBuffer = reader.result
                        const base64 = btoa(new Uint8Array(resizedArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))
                        var optionsobj = {
                            light: {
                                background: {
                                    main: ui.light.background.main.replace("default", ""),
                                    alt: ui.light.background.alt.replace("default", "")
                                },
                                button: {
                                    main: ui.light.button.main.replace("default", ""),
                                    hov: ui.light.button.hov.replace("default", ""),
                                    act: ui.light.button.act.replace("default", ""),
                                    hovact: ui.light.button.hovact.replace("default", "")
                                }
                            },
                            dark: {
                                background: {
                                    main: ui.dark.background.main.replace("default", ""),
                                    alt: ui.dark.background.alt.replace("default", "")
                                },
                                button: {
                                    main: ui.dark.button.main.replace("default", ""),
                                    hov: ui.dark.button.hov.replace("default", ""),
                                    act: ui.dark.button.act.replace("default", ""),
                                    hovact: ui.dark.button.hovact.replace("default", "")
                                }
                            }
                        }
                        var options = JSON.stringify(optionsobj).replaceAll('"', '&quot;')
                        if (exsitent.includes(name)) {
                            var namething = name + "¬"
                            exsitent.push(namething)
                        } else {
                            var namething = name
                            exsitent.push(namething)
                        }
                        resolve([`<button id="${namething}market" class="button appearbtn exbtnid" onClick="openTab('${namething}markettab', 'MarketButton', '${options}')" style="width: 120px; height: 135px; display: none;" data-search="${name}">${name}<img style="border-radius: 5px; border-style: solid; border-width: 1px; border-color: white;" src="data:image/png;base64,${base64}" /></button>`, `${namething}market`, `<div id="${namething}markettab" class="tabcontent"><h3>${name}</h3><button class="button" onclick="openTab('Market', 'MarketButton')">Go back</button><p>Made by: ${authors.join(", ")}</p><p>${ui.description}</p><button class="button" onclick="crimAPI.extensionDownload('https://github.com/SkyoProductions/OfficialCrimsonRepo/raw/main/${id}/${file}'); handleNotification('downloadingModal')">Download</button></div>`, ui.type])
                    }
                    reader.readAsArrayBuffer(blob)
                })
            }

            img.src = url
        }, 300)
    })
}

async function getExtensions() {
    var exts = await axios.get("https://raw.githubusercontent.com/SkyoProductions/OfficialCrimsonRepo/main/all.json", {
        responseType: "text",
        headers: {
            'Content-Type': 'text/plain'
        }
    })
    exts.data = JSON.parse(exts.data)
    for (const key of Object.keys(exts.data)) {
        var extension = await handleExtensionData(key, exts.data)
        try {
            document.getElementById("exloadtxt").remove()
        } catch (err) { }
        document.getElementById(extension[3] + "area").insertAdjacentHTML("beforeend", extension[0])
        new Promise(resolve => setTimeout(() => {
            document.getElementById(extension[1]).classList.remove("appearbtn")
            resolve()
        }, 250))
        document.getElementById("extensionsHolder").innerHTML += extension[2]
        var input = document.getElementById("exsearch").value
        if (input === "") {
            document.getElementById(extension[1]).style.display = "inline"
        } else {
            if (document.getElementById(extension[1]).dataset.search.toLowerCase().startsWith(input.toLowerCase())) {
                document.getElementById(extension[1]).style.display = "inline"
            } else {
                document.getElementById(extension[1]).style.display = "none"
            }
        }
    }
}
getExtensions()

function startBot() {
    crimAPI.BotStart()
}
window.addEventListener('load', function () {
    var information = crimAPI.cfg
    document.getElementById("token").defaultValue = information.token
    document.getElementById("cid").defaultValue = information.clientid
    document.getElementById("adprefix").defaultValue = information.adminname
})

window.startBot = startBot

crimAPI.handleGUICFG((event, arg) => {
    var cfg = JSON.parse(arg)
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