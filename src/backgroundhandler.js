window.addEventListener("load", (event) => {
    const wrapper = document.getElementById("tiles")

    let columns = 0,
        rows = 0

    const createTile = (index, col, row) => {
        const tile = document.createElement("div")

        const delay = Math.floor(Math.random() * index)

        tile.style.setProperty('--delay', delay)
        //! Cool ass design
        //tile.style.setProperty('--delay', (index % col) + (index / col))

        tile.classList.add("tile")

        return tile
    }

    const createTiles = (quantity, col, row) => {
        Array.from(Array(quantity)).map(async (tile, index) => {
            wrapper.appendChild(createTile(index, col, row))
        })
    }

    const createGrid = () => {
        wrapper.innerHTML = ""

        columns = Math.floor(document.body.clientWidth / 95)
        rows = Math.floor(document.body.clientHeight / 95)

        wrapper.style.setProperty("--columns", columns)
        wrapper.style.setProperty("--rows", rows)

        createTiles(columns * rows, columns, rows)
    }

    createGrid()

    window.createGrid = createGrid

    window.onresize = () => createGrid()
})

var tilesShowen = true

function toggleBG() {
    document.getElementById("tiles").classList.toggle("hiddentiles")
    if (tilesShowen) {
        tilesShowen = false
    } else {
        tilesShowen = true
    }
}