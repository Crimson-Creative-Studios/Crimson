clearColor()
document.getElementById("element").value = ""

if (iscrinsom) {
    document.getElementById("texttitle").innerHTML = "TCS"
} else {
    document.getElementById("texttitle").innerHTML = "TSC"
}

document.getElementById("backgroundmainchange").value = 'linear-gradient(135deg, rgba(76,77,89,1) 0%, rgba(27,27,31,1) 100%)'
document.getElementById("backgroundaltchange").value = "rgba(255,255,255,0.025)"
document.getElementById("textmainchange").value = "white"
document.getElementById("textaltchange").value = "#c4c4c4"
document.getElementById("buttonmainchange").value = "black"
document.getElementById("buttonhovchange").value = "#222"
document.getElementById("buttonactchange").value = "#444"
document.getElementById("buttonhovactchange").value = "#666"

loadColors()