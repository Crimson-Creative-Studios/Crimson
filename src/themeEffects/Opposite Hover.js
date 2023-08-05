for (const element of document.querySelectorAll(".tile")) {
    element.style.opacity = "0"
}

var lastX = 0
var lastY = 0
themeEffectNow = "Opposite Hover.js"
window.onmousemove = function (event) {
    if (themeEffectNow === "Opposite Hover.js") {
        const tileSizeX = window.innerWidth / columns
        const tileSizeY = window.innerHeight / rows
        const x = Math.floor(event.clientX / tileSizeX)
        const y = Math.floor(event.clientY / tileSizeY)
        for (const element of document.querySelectorAll(".tile")) {
            if (columns - (x + 1) === Number(element.dataset.col) && rows - (y + 1) === Number(element.dataset.row)) {
                if (lastX !== x || lastY !== y) {
                    if (element.style.opacity === "0") {
                        element.style.opacity = "1"
                    } else {
                        element.style.opacity = "0"
                    }
                }
                lastX = x
                lastY = y
            }
        }
    } else {
        window.onmousemove = undefined
    }
}