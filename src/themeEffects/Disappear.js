for (const element of document.querySelectorAll(".tile")) {
    element.style.opacity = "0"
}

themeEffectNow = "Disappear.js"
async function animationDisappear() {
    if (themeEffectNow !== "Disappear.js") {
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