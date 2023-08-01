for (const element of document.querySelectorAll(".tile")) {
    element.style.opacity = "0"
}

themeEffectNow = "Flash.js"
async function animationFlash() {
    if (themeEffectNow !== "Flash.js") {
        return
    } else {
        for (const element of document.querySelectorAll(".tile")) {
            element.style.opacity = "0"
        }
        const delay = (Number(document.getElementById("darknessControl").value) + 1) / 100
        if (delay < 1) {
            await new Promise(resolve => setTimeout(resolve, 500))
        } else {
            await new Promise(resolve => setTimeout(resolve, 500 / ((Number(document.getElementById("darknessControl").value) + 1) / 10)))
        }
        for (const element of document.querySelectorAll(".tile")) {
            element.style.opacity = "1"
        }
        if (delay < 1) {
            await new Promise(resolve => setTimeout(resolve, 500))
        } else {
            await new Promise(resolve => setTimeout(resolve, 500 / ((Number(document.getElementById("darknessControl").value) + 1) / 10)))
        }
        animationFlash()
    }
}

animationFlash()

animationFunctions.push(animationFlash)