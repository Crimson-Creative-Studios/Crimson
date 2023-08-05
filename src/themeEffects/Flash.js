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
        await new Promise(resolve => setTimeout(resolve, 500))
        for (const element of document.querySelectorAll(".tile")) {
            element.style.opacity = "1"
        }
        await new Promise(resolve => setTimeout(resolve, 500))
        animationFlash()
    }
}

animationFlash()