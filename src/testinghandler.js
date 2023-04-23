function loadColors() {
    console.log(document.getElementById("backgroundmainchange").value)
    document.documentElement.style.setProperty('--background', document.getElementById("backgroundmainchange").value)
    document.documentElement.style.setProperty('--backgroundalt', document.getElementById("backgroundaltchange").value)
    document.documentElement.style.setProperty('--button', document.getElementById("buttonmainchange").value)
    document.documentElement.style.setProperty('--buttonhov', document.getElementById("buttonhovchange").value)
    document.documentElement.style.setProperty('--buttonact', document.getElementById("buttonactchange").value)
    document.documentElement.style.setProperty('--buttonacthov', document.getElementById("buttonhovactchange").value)
}