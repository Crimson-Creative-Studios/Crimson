for (const element of document.querySelectorAll(".tile")) {
    element.style.opacity = "0"
}

var countingNum = 0

themeEffectNow = "Morph.js"
async function animationMorph() {
    if (themeEffectNow !== "Morph.js") {
        return
    } else {
        for (const element of document.querySelectorAll(".tile")) {
            if ((Number(element.dataset.index) + countingNum) % 3 == 0) {
                element.style.opacity = "0"
            } else {
                element.style.opacity = "1"
            }
        }
        countingNum++
        await new Promise(resolve => setTimeout(resolve, 500))
        animationMorph()
    }
}

animationMorph()