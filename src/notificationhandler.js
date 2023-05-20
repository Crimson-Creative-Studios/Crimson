var zindex = 999

async function handleNotification(id, time) {
    const element = document.getElementById(id).cloneNode(true)
    element.id = String(Math.random() * 1000000000)
    element.style.setProperty("z-index", String(zindex))
    element.querySelector(".close-button").addEventListener("click", (event)=> {
        element.remove()
    })
    zindex++
    document.body.appendChild(element)
    element.style.display = "block"
    new Promise(resolve => setTimeout(() => {
        element.style.display = "none"
        element.remove()
        resolve()
    }, time))
}

window.handleNotification = handleNotification