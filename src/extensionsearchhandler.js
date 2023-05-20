function handleInputChange(input) {
    const btns = document.getElementsByClassName("exbtnid")
    for (let i = 0; i < btns.length; i++) {
        var btn = btns[i]
        if (!btn.classList.contains("filterhide")) {
            if (input === "") {
                btn.style.display = "inline"
            } else {
                if (btn.dataset.search.toLowerCase().startsWith(input.toLowerCase())) {
                    btn.style.display = "inline"
                } else {
                    btn.style.display = "none"
                }
            }
        } else {
            btn.style.display = "none"
        }
    }
}

var offhid = false
var unoffhid = false
window.offhid = offhid
window.unoffhid = unoffhid

function toggleOfficial() {
    if (offhid) {
        for (const btn of document.getElementById("officialarea").children) {
            btn.classList.remove("filterhide")
            btn.style.display = "inline"
        }
        offhid = false
        window.offhid = offhid
        document.getElementById("officialtext").style.display = "block"
    } else {
        for (const btn of document.getElementById("officialarea").children) {
            btn.classList.add("filterhide")
            btn.style.display = "none"
        }
        offhid = true
        window.offhid = offhid
        document.getElementById("officialtext").style.display = "none"
    }
    handleInputChange(document.getElementById("exsearch").value)
}

function toggleUnofficial() {
    if (unoffhid) {
        for (const btn of document.getElementById("unofficialarea").children) {
            btn.classList.remove("filterhide")
            btn.style.display = "inline"
        }
        unoffhid = false
        window.unoffhid = unoffhid
        document.getElementById("unofficialtext").style.display = "block"
    } else {
        for (const btn of document.getElementById("unofficialarea").children) {
            btn.classList.add("filterhide")
            btn.style.display = "none"
        }
        unoffhid = true
        window.unoffhid = unoffhid
        document.getElementById("unofficialtext").style.display = "none"
    }
    handleInputChange(document.getElementById("exsearch").value)
}