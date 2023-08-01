function indexToPosition(index, columns) {
    const x = index % columns
    const y = Math.floor(index / columns)
    return { x, y }
  }

window.addEventListener("load", (event) => {
    const wrapper = document.getElementById("tiles")

    let columns = 0,
        rows = 0

    const createTile = (index, x, y) => {
        const tile = document.createElement("div")

        const delay = Math.floor(Math.random() * index)

        tile.style.setProperty('--delay', delay)
        tile.dataset.col = x
        tile.dataset.row = y
        tile.dataset.index = index
        //! Cool ass design
        //tile.style.setProperty('--delay', (index % col) + (index / col))

        tile.classList.add("tile")

        return tile
    }

    const createTiles = (quantity, col) => {
        Array.from(Array(quantity)).map(async (tile, index) => {
            const {x,y} = indexToPosition(index, col)
            wrapper.appendChild(createTile(index, x, y))
        })
    }

    const createGrid = () => {
        wrapper.innerHTML = ""

        columns = Math.floor(document.body.clientWidth / 95)
        rows = Math.floor(document.body.clientHeight / 95)

        wrapper.style.setProperty("--columns", columns)
        wrapper.style.setProperty("--rows", rows)

        createTiles(columns * rows, columns)
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