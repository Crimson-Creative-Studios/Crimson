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
        const delay = (Number(document.getElementById("darknessControl").value) + 1) / 100
        if (delay < 1) {
            await new Promise(resolve => setTimeout(resolve, 500))
        } else {
            await new Promise(resolve => setTimeout(resolve, 500 / ((Number(document.getElementById("darknessControl").value) + 1) / 10)))
        }
        animationColumns()
    }
}

animationColumns()

animationFunctions.push(animationColumns)