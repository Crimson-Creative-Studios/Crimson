function decimalToHex(decimal) {
    var hex = decimal.toString(16)
    return hex.length === 1 ? "0" + hex : hex
}

function generateRainbowColors(steps) {
    var colors = []

    var frequency = 2 * Math.PI / steps

    for (var i = 0; i <= steps; i++) {
        var red = Math.sin(frequency * i + 0) * 127 + 128
        var green = Math.sin(frequency * i + (2 * Math.PI / 3)) * 127 + 128
        var blue = Math.sin(frequency * i + (4 * Math.PI / 3)) * 127 + 128

        var hexColor =
            "#" +
            decimalToHex(Math.round(red)) +
            decimalToHex(Math.round(green)) +
            decimalToHex(Math.round(blue))

        colors.push(hexColor)
    }

    return colors
}

function darkenHexColor(hexColor, amount) {
    hexColor = hexColor.slice(1)

    var red = parseInt(hexColor.substr(0, 2), 16)
    var green = parseInt(hexColor.substr(2, 2), 16)
    var blue = parseInt(hexColor.substr(4, 2), 16)

    red = Math.max(0, red - amount)
    green = Math.max(0, green - amount)
    blue = Math.max(0, blue - amount)

    var darkenedHexColor =
        "#" +
        decimalToHex(red) +
        decimalToHex(green) +
        decimalToHex(blue)

    return darkenedHexColor
}

const rainbowColors = generateRainbowColors(75)
var rainbowCurrent = 0

function activateGAMER() {
    window.setInterval(() => {
        const index = rainbowCurrent % rainbowColors.length
        document.getElementById("buttonmainchange").value = rainbowColors[index]
        document.getElementById("buttonhovchange").value = darkenHexColor(rainbowColors[index], 16)
        document.getElementById("buttonactchange").value = darkenHexColor(rainbowColors[index], 32)
        document.getElementById("buttonhovactchange").value = darkenHexColor(rainbowColors[index], 48)
        loadColors()
        rainbowCurrent++
    }, 75)
}