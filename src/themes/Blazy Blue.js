clearColor()
document.getElementById("element").value = ""
document.getElementById("backgroundmainchange").value = "#0084b8"
document.getElementById("backgroundaltchange").value = "#0079a8"
document.getElementById("textmainchange").value = "white"
document.getElementById("textaltchange").value = "#c4c4c4"
document.getElementById("buttonmainchange").value = "#cc5602"
document.getElementById("buttonhovchange").value = "#ba4d00"
document.getElementById("buttonactchange").value = "#ad4800"
document.getElementById("buttonhovactchange").value = "#9c4100"
document.documentElement.style.setProperty("--cnslbg", "var(--buttonact)")
loadColors()