clearColor()
document.getElementById("element").value = ""
document.getElementById("backgroundmainchange").value = "#000000"
document.getElementById("backgroundaltchange").value = "transparent"
document.getElementById("textmainchange").value = "white"
document.getElementById("textaltchange").value = "#c4c4c4"
document.getElementById("buttonmainchange").value = "#ffffff"
document.getElementById("buttonhovchange").value = "#dddddd"
document.getElementById("buttonactchange").value = "#bbbbbb"
document.getElementById("buttonhovactchange").value = "#999999"

document.getElementById("buttonhovactchange").style.setProperty

function hightlight(el) {
    el.style.setProperty("--buttontext", "#000000")
}

for (const thing of document.querySelectorAll(".button")) {
    hightlight(thing)
}

for (const thing of document.querySelectorAll(".tablinks")) {
    hightlight(thing)
}

loadColors()