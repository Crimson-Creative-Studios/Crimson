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

var information = document.getElementById('debugCHROME')
information.innerText = versions.chrome()

var information = document.getElementById('debugELECTRON')
information.innerText = versions.electron()

var information = document.getElementById('debugNODE')
information.innerText = versions.node()

ipc.handleAdd((event, arg) => {
    var id = arg[0]
    var content = arg[1]
    console.log(id)
    document.getElementById(id).insertAdjacentHTML("beforeend", content)
})

codeAdditions.mainAdd.forEach(addition => {
    document.body.innerHTML += addition
})

codeAdditions.extensions.forEach(extension => {
    var extensionList = [...extension]
    var name = extensionList[0]
    extensionList.shift()
    for (const item of extensionList) {
        document.getElementById(name).insertAdjacentHTML("beforeend", item)
    }
    document.getElementById(name).insertAdjacentHTML("beforeend", '<br><br><button id="'+name+'save" class="button savebtn">Save Settings</button>')
    document.getElementById(name+"save").addEventListener('click', async () => {
        var value = document.getElementById(name+"input").checked
        console.log(value)
        crimAPI.jsonRequest(["setVal", `../Extensions/${name}/config.json`, "enabled", String(value)])
    })
})

codeAdditions.configs.forEach(config => {
    document.getElementById('Configuration').insertAdjacentHTML("beforeend", config)
})

ipc.debugMode((event, arg) => {
    openTab(null, 'DEBUG', null)
})

const funfacts = ["CrimsonGUI is written in Electron", "CrimsonGUI had 2 open beta 1s, odd isn't it?", "Open beta 1 was delayed by 2 days...", "Crimson <i>will</i> have a mixin like capability, yes, the Minecraft mixin"]
var funfact = funfacts[Math.floor((Math.random()*funfacts.length))]

document.getElementById('funfact').innerHTML = `Fun Fact: ${funfact}`

var modal = document.getElementById("savedModal");

var btns = document.getElementsByClassName("savebtn")

var gradon = false;

for (let i = 0; i < btns.length; i++) {
    btns[i].onclick = async function() {
        if (gradon === false) {
            gradon = true
            modal.style.display = "block";
            await new Promise(resolve => setTimeout(resolve, 5000));
            modal.style.display = "none";
            gradon = false
        }
    }
}