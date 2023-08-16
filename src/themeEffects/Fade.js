for (const element of document.querySelectorAll(".tile")) {
    element.style.opacity = "0"
}

var countingNum = 0

themeEffectNow = "Fade.js"
async function animationFade() {
    if (themeEffectNow !== "Fade.js") {
        return
    } else {
        for (const element of document.querySelectorAll(".tile")) {
            if ((Number(element.dataset.col)) + Number(element.dataset.row) === countingNum % (columns + rows - 1)) {
                if (element.style.opacity === "0") {
                    element.style.opacity = "1"
                } else {
                    element.style.opacity = "0"
                }
            }
        }
        countingNum++
        await new Promise(resolve => setTimeout(resolve, 200))
        animationFade()
    }
}

animationFade()