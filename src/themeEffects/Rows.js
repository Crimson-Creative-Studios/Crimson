for (const element of document.querySelectorAll(".tile")) {
    element.style.opacity = "0"
}

var countingNum = 0

themeEffectNow = "Rows.js"
async function animationRows() {
    if (themeEffectNow !== "Rows.js") {
        return
    } else {
        for (const element of document.querySelectorAll(".tile")) {
            if ((Number(element.dataset.row) + countingNum) % 2 == 0) {
                element.style.opacity = "0"
            } else {
                element.style.opacity = "1"
            }
        }
        countingNum++
        await new Promise(resolve => setTimeout(resolve, 500))
        animationRows()
    }
}

animationRows()