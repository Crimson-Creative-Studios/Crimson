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
document.documentElement.style.setProperty("--buttontext", "#000000")

document.documentElement.style.setProperty("--cnslbg", "var(--button)")
try {
    document.getElementById("cnsl").style.color = "black"
} catch(err) {}

loadColors()