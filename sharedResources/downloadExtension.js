const path = require('path')
const axios = require('axios')
const fs = require('fs')
const JSZip = require('jszip')
const { exec } = require("child_process")

const downloadAndUnzip = async (zipUrl, unzipPath, npmPackages) => {
    const response = await axios.get(zipUrl, { responseType: 'arraybuffer' })
    const zip = await JSZip.loadAsync(response.data)
    await Promise.all(Object.keys(zip.files).map(async (fileName) => {
        const content = await zip.files[fileName].async('nodebuffer')
        const filePath = path.join(unzipPath, fileName)
        fs.mkdirSync(path.dirname(filePath), { recursive: true })
        fs.writeFileSync(filePath, content)
    }))
    process.chdir("../")
    if (npmPackages) {
        exec(`npm i ${npmPackages}`)
    }
    process.chdir("src")
}

module.exports = {
    downloadAndUnzip
}