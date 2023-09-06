for (const element of document.querySelectorAll(".tile")) {
    element.style.opacity = "0"
}

var countingNum = 0

themeEffectNow = "Funky.js"
async function animationFunky() {
    if (themeEffectNow !== "Funky.js") {
        return
    } else {
        for (const element of document.querySelectorAll(".tile")) {
            if ((Number(element.dataset.index) + countingNum) % 8 == 0) {
                element.style.opacity = "0"
            } else {
                element.style.opacity = "1"
            }
        }
        countingNum++
        await new Promise(resolve => setTimeout(resolve, 500))
        animationFunky()
    }
}

animationFunky()