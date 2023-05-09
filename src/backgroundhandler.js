window.addEventListener("load", (event) => {
    const wrapper = document.getElementById("tiles")

    let columns = 0,
        rows = 0

    const createTile = index => {
        const tile = document.createElement("div")

        var delay = Math.floor(Math.random() * 3)

        tile.style.setProperty('--delay', delay)

        tile.classList.add("tile")

        return tile
    }

    const createTiles = quantity => {
        Array.from(Array(quantity)).map(async (tile, index) => {
            wrapper.appendChild(createTile(index))
        })
    }

    const createGrid = () => {
        wrapper.innerHTML = ""

        columns = Math.floor(document.body.clientWidth / 75)
        rows = Math.floor(document.body.clientHeight / 75)

        wrapper.style.setProperty("--columns", columns)
        wrapper.style.setProperty("--rows", rows)

        createTiles(columns * rows)
    }

    createGrid()

    window.onresize = () => createGrid()
})

function toggleBG() {
    document.getElementById("tiles").classList.toggle("hiddentiles")
}