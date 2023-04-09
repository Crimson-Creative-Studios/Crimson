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

async function wait(time) {
    await new Promise(resolve => setTimeout(resolve, time));
}

document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        handleWindowControls();
    }
};

var maximised = false

function handleWindowControls() {
    document.getElementById('min-button').addEventListener("click", event => {
        crimAPI.winmin()
    });

    document.getElementById('max-button').addEventListener("click", event => {
        maximised = true
        crimAPI.winmax()
        toggleMaxRestoreButtons()
    });

    document.getElementById('restore-button').addEventListener("click", event => {
        maximised = false
        crimAPI.winunmax()
        toggleMaxRestoreButtons()
    });

    document.getElementById('close-button').addEventListener("click", event => {
        crimAPI.winclose()
    });

    document.getElementById('restart-button').addEventListener("click", event => {
        crimAPI.winrestart()
    })

    crimAPI.handleWinControl((event, arg) => {
        if (arg === "max") {
            maximised = true
            toggleMaxRestoreButtons()
        } else if (arg === "unmax") {
            maximised = false
            toggleMaxRestoreButtons()
        }
    })

    toggleMaxRestoreButtons()

    function toggleMaxRestoreButtons() {
        if (maximised) {
            document.body.classList.add('maximized');
        } else {
            document.body.classList.remove('maximized');
        }
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
    document.getElementById(name).insertAdjacentHTML("beforeend", '<button id="'+name+'save" class="button savebtn">Save Settings</button><br><br><br><br>')
    if (codeAdditions.islib[extension]) {
        document.getElementById(name).insertAdjacentHTML("beforeend", `<p>${codeAdditions.libtext[extension].text}</p><button class="button" onclick="crimAPI.openSite('${codeAdditions.libtext[extension].buttonlink}')">${codeAdditions.libtext[extension].buttontext}</button>`)
    }
    document.getElementById(name+"save").addEventListener('click', () => {
        var items = []
        var vals = []
        var value = document.getElementById(name+"input").checked
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
        crimAPI.jsonRequest(["setValBulk", `../Extensions/${name}/${information.file}`, items, vals])
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

ipc.debugMode((event, arg) => {
    openTab(null, 'DEBUG', null)
})

const funfacts = ["CrimsonGUI is written in Electron", "CrimsonGUI had 2 open beta 1s, odd isn't it?", "Crimson <i>will</i> have a mixin like capability", "<b>There will be no beans theme</b>"]
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

var mainCfg = document.getElementById("saveMainCFG")

mainCfg.onclick = async function(e) {
    e.preventDefault()
    if (gradon === false) {
        gradon = true
        modal.style.display = "block";
        await new Promise(resolve => setTimeout(resolve, 5000));
        modal.style.display = "none";
        gradon = false
    }
    var information = {
        token: document.getElementById('token').value,
        clientid: document.getElementById('cid').value,
        adminname: document.getElementById('adprefix').value,
        testServer: document.getElementById('tstsver').value
    }
    crimAPI.saveENV(information)
}