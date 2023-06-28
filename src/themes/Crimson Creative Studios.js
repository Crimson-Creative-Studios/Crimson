clearColor()
document.getElementById("element").value = ""
document.getElementById("backgroundmainchange").value = "#4d0025"
document.getElementById("backgroundaltchange").value = "rgba(0,0,0,0.075)"
document.getElementById("textmainchange").value = "white"
document.getElementById("textaltchange").value = "#c4c4c4"
document.getElementById("buttonmainchange").value = "#bd0a0a"
document.getElementById("buttonhovchange").value = "#aa0808"
document.getElementById("buttonactchange").value = "#970808"
document.getElementById("buttonhovactchange").value = "#840707"
document.documentElement.style.setProperty("--cnslbg", "var(--buttonact)")
loadColors()