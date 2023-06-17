clearColor()
document.getElementById("element").value = ""
document.getElementById("backgroundmainchange").value = "#000000"
document.getElementById("backgroundaltchange").value = "transparent"
document.getElementById("textmainchange").value = "white"
document.getElementById("textaltchange").value = "#c4c4c4"
document.getElementById("buttonmainchange").value = "#000000"
document.getElementById("buttonhovchange").value = "#222222"
document.getElementById("buttonactchange").value = "#444444"
document.getElementById("buttonhovactchange").value = "#666666"

document.getElementById("buttonhovactchange").style.border = ""

function hightlight(el) {
    el.style.border = "1px solid var(--color)"
}

for (const thing of document.querySelectorAll(".button")) {
    hightlight(thing)
}

for (const thing of document.querySelectorAll(".tablinks")) {
    hightlight(thing)
}

loadColors()