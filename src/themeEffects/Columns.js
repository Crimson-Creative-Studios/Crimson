for (const element of document.querySelectorAll(".tile")) {
    element.style.opacity = "0"
}

var countingNum = 0

themeEffectNow = "Columns.js"
async function animationColumns() {
    if (themeEffectNow !== "Columns.js") {
        return
    } else {
        for (const element of document.querySelectorAll(".tile")) {
            if ((Number(element.dataset.col) + countingNum) % 2 == 0) {
                element.style.opacity = "0"
            } else {
                element.style.opacity = "1"
            }
        }
        countingNum++
        await new Promise(resolve => setTimeout(resolve, 500))
        animationColumns()
    }
}

animationColumns()