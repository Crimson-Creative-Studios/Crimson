window.addEventListener('click', function(e) {
    if (e.target.classList.contains("select-wrapper") || e.target.classList.contains("select__trigger") || e.target.classList.contains("select") || e.target.classList.contains("force-open") || e.target.classList.contains("disabled-option")) return
    if (e.target.classList.contains("custom-option")) {
        if (!e.target.classList.contains("disabled-option")) {
            e.target.parentElement.parentElement.parentElement.dataset.currentval = e.target.dataset.value
            if (!e.target.parentElement.parentElement.querySelector(".select__trigger").classList.contains("no-guild")) {
                e.target.parentElement.parentElement.querySelector(".select__trigger").querySelector("span").innerHTML = e.target.innerHTML + " - " + e.target.dataset.guildname
            } else {
                e.target.parentElement.parentElement.querySelector(".select__trigger").querySelector("span").innerHTML = e.target.innerHTML
            }
            for (const child of e.target.parentElement.parentElement.querySelector(".select__trigger").querySelector("span").childNodes) {
                if (child.nodeName === "DIV") {
                    child.remove()
                }
            }
            for (const element of document.querySelectorAll(".custom-option")) {
                element.classList.remove("selected")
            }
            e.target.classList.add("selected")
        }
    }
    for (const element of document.querySelectorAll(".select")) {
        element.classList.remove("open")
    }
})