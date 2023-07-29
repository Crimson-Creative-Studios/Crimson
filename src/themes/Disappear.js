clearColor()
document.getElementById("element").value = ""
document.getElementById("backgroundmainchange").value = "#2f3136"
document.getElementById("backgroundaltchange").value = "#2c2e32"
document.getElementById("textmainchange").value = "white"
document.getElementById("textaltchange").value = "#c4c4c4"
document.getElementById("buttonmainchange").value = "#cc0c39"
document.getElementById("buttonhovchange").value = "#b80b33"
document.getElementById("buttonactchange").value = "#a30a2e"
document.getElementById("buttonhovactchange").value = "#8f0828"
for (const element of document.querySelectorAll(".tile")) {
    element.style.opacity = "0"
}

loadColors()
themeNow = "Disappear.js"
async function animationDisappear() {
    if (themeNow !== "Disappear.js") {
        return
    } else {
        const collection = document.querySelectorAll(".tile")
        const indexNum = Math.floor(Math.random() * collection.length)
        if (collection[indexNum].style.opacity === "0") {
            collection[indexNum].style.opacity = "1"
        } else {
            collection[indexNum].style.opacity = "0"
        }
        const delay = (Number(document.getElementById("darknessControl").value) + 1) / 100
        if (delay < 1) {
            await new Promise(resolve => setTimeout(resolve, 500))
        } else {
            await new Promise(resolve => setTimeout(resolve, 500 / ((Number(document.getElementById("darknessControl").value) + 1) / 10)))
        }
        animationDisappear()
    }
}

animationDisappear()