for (const element of document.querySelectorAll(".tile")) {
    element.style.opacity = "0"
}

var lastX = 0
var lastY = 0
themeEffectNow = "Random Hover.js"
window.onmousemove = function (event) {
    if (themeEffectNow === "Random Hover.js") {
        const collection = document.querySelectorAll(".tile")
        const tileSizeX = window.innerWidth / columns
        const tileSizeY = window.innerHeight / rows
        const x = Math.floor(event.clientX / tileSizeX)
        const y = Math.floor(event.clientY / tileSizeY)
        const rand = Math.floor(Math.random() * collection.length)
        for (const element of collection) {
            if (collection[rand] === element) {
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