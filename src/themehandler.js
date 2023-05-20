function loadColors() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.style.setProperty('--background', document.getElementById("backgroundmainchange").value)
        document.documentElement.style.setProperty('--backgroundalt', document.getElementById("backgroundaltchange").value)
        document.documentElement.style.setProperty('--color', document.getElementById("textmainchange").value)
        document.documentElement.style.setProperty('--coloralt', document.getElementById("textaltchange").value)
        document.documentElement.style.setProperty('--button', document.getElementById("buttonmainchange").value)
        document.documentElement.style.setProperty('--buttonhov', document.getElementById("buttonhovchange").value)
        document.documentElement.style.setProperty('--buttonact', document.getElementById("buttonactchange").value)
        document.documentElement.style.setProperty('--buttonacthov', document.getElementById("buttonhovactchange").value)
    } else {
        document.documentElement.style.setProperty('--background', document.getElementById("backgroundmainchangel").value)
        document.documentElement.style.setProperty('--backgroundalt', document.getElementById("backgroundaltchangel").value)
        document.documentElement.style.setProperty('--color', document.getElementById("textmainchangel").value)
        document.documentElement.style.setProperty('--coloralt', document.getElementById("textaltchangel").value)
        document.documentElement.style.setProperty('--button', document.getElementById("buttonmainchangel").value)
        document.documentElement.style.setProperty('--buttonhov', document.getElementById("buttonhovchangel").value)
        document.documentElement.style.setProperty('--buttonact', document.getElementById("buttonactchangel").value)
        document.documentElement.style.setProperty('--buttonacthov', document.getElementById("buttonhovactchangel").value)
    }
    const guicfg = JSON.stringify({
        theme: {
            dark: {
                background: {
                    main: document.getElementById("backgroundmainchange").value,
                    alt: document.getElementById("backgroundaltchange").value
                },
                text: {
                    main: document.getElementById("textmainchange").value,
                    alt: document.getElementById("textaltchange").value
                },
                button: {
                    main: document.getElementById("buttonmainchange").value,
                    hov: document.getElementById("buttonhovchange").value,
                    act: document.getElementById("buttonactchange").value,
                    acthov: document.getElementById("buttonhovactchange").value
                }
            },
            light: {
                background: {
                    main: document.getElementById("backgroundmainchangel").value,
                    alt: document.getElementById("backgroundaltchangel").value
                },
                text: {
                    main: document.getElementById("textmainchangel").value,
                    alt: document.getElementById("textaltchangel").value
                },
                button: {
                    main: document.getElementById("buttonmainchangel").value,
                    hov: document.getElementById("buttonhovchangel").value,
                    act: document.getElementById("buttonactchangel").value,
                    acthov: document.getElementById("buttonhovactchangel").value
                }
            }
        }
    }, null, 4)
    crimAPI.jsonRequest(["setJSON", "guicfg.json", guicfg])
}

window.loadColors = loadColors