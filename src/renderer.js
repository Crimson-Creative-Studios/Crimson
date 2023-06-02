window.gradon = false

document.getElementById('debugCHROME').innerText = versions.chrome()

document.getElementById('debugELECTRON').innerText = versions.electron()

document.getElementById('debugNODE').innerText = versions.node()

document.getElementById('guiver').innerText = "Version - " + versions.crimson()

document.addEventListener('keydown', (e) => {
    if (e.key === "Tab") {
        e.preventDefault()
    }
})

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

const funfacts = ["CrimsonGUI is written in Electron", "CrimsonGUI had 2 open beta 1s, odd isn't it?", "Crimson can completely kill your computer if an extension is malicous :D", "<b>There will be no beans theme</b>"]
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

const versionHistory = ["Open Beta 1", "Open Beta 2", "Open Beta 3", "Open Beta 4", "V1 Pre-release 1", "V1 Pre-release 2", "Version 1"]
if (!versionHistory.includes(versions.crimson())) {
    document.getElementById('versionut').innerHTML = `Invalid version found! Local version ${versions.crimson()} is not known. You may want to update to the current latest version (${versions.crimOnline()})`
} else {
    if (versionHistory.includes(versions.crimOnline().replace("\n", ""))) {
        if (versionHistory.indexOf(versions.crimOnline().replace("\n", "")) <= versionHistory.indexOf(versions.crimson())) {
            document.getElementById('versionut').innerHTML = "No new versions found."
        } else {
            document.getElementById('versionut').innerHTML = `New version found!<br>Current version: ${versions.crimson()}<br>Found version: ${versions.crimOnline()}`
        }
    } else {
        document.getElementById('versionut').innerHTML = `New version found!<br>Current version: ${versions.crimson()}<br>Found version: ${versions.crimOnline()}`
    }
}

const exsitent = []

function bytesArrToBase64(arr) {
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    const bin = n => n.toString(2).padStart(8, 0)
    const l = arr.length
    let result = ''

    for (let i = 0; i <= (l - 1) / 3; i++) {
        let c1 = i * 3 + 1 >= l
        let c2 = i * 3 + 2 >= l
        let chunk = bin(arr[3 * i]) + bin(c1 ? 0 : arr[3 * i + 1]) + bin(c2 ? 0 : arr[3 * i + 2])
        let r = chunk.match(/.{1,6}/g).map((x, j) => j == 3 && c2 ? '=' : (j == 2 && c1 ? '=' : abc[+('0b' + x)]))
        result += r.join('')
    }

    return result
}

async function handleExtensionData(key, data) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            var info = data[key]
            var authors = info.authors
            var name = info.name
            var id = info.folder
            var file = info.zip
            var ui = info.ui
            var logo = await axios.get(`https://github.com/VanquishStudios/OfficialCrimsonRepo/raw/main/${id}/${ui.logo}`, { responseType: "arraybuffer" })

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
                        const base64 = bytesArrToBase64(new Uint8Array(resizedArrayBuffer))
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
                        resolve([`<button id="${namething}market" class="button appearbtn exbtnid" onClick="openTab('${namething}markettab', 'MarketButton', '${options}')" style="width: 120px; height: 135px; display: none;" data-search="${name}">${name}<img style="border-radius: 10px; border-style: solid; border-width: 2px; border-color: white;" src="data:image/png;base64,${base64}" /></button>`, `${namething}market`, `<div id="${namething}markettab" class="tabcontent"><h3>${name}</h3><button class="button" onclick="openTab('Market', 'MarketButton')">Go back</button><p>Made by: ${authors.join(", ")}</p><p>${ui.description}</p><button class="button" onclick="crimAPI.extensionDownload('https://github.com/VanquishStudios/OfficialCrimsonRepo/raw/main/${id}/${file}'); handleNotification('downloadingModal')">Download</button></div>`, ui.type])
                    }
                    reader.readAsArrayBuffer(blob)
                })
            }

            img.src = url
        }, 300)
    })
}

async function finishExtensionData(key, data) {
    var extension = await handleExtensionData(key, data)
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

async function getExtensions() {
    var exts = await axios.get("https://raw.githubusercontent.com/VanquishStudios/OfficialCrimsonRepo/main/all.json", {
        responseType: "text",
        headers: {
            'Content-Type': 'text/plain'
        }
    })
    exts.data = JSON.parse(exts.data)
    for (const key of Object.keys(exts.data)) {
        finishExtensionData(key, exts.data)
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