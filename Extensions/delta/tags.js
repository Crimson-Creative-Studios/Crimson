const tags = [{
    label: "!bedrockinfofuuid",
    description: "Get a Bedrock user's information based off of there Floodgate UUID.",
    value: "bedrockinfofuuid",
    detail: "This command can get a user's XUID and Gamertag from there FUUID, the command's syntax is `!bedrockinfofuuid insertFUUIDHere`",
    extension: "Delta",
    enabled: "true",
},
{
    label: "!bedrockinfoxuid",
    description: "Get a Bedrock user's information based off of there XUID.",
    value: "bedrockinfoxuid",
    detail: "This command can get a user's Gamertag and FUUID from there XUID, the command's syntax is `!bedrockinfocuid insertXUIDHere`",
    extension: "Delta",
    enabled: "true",
},
{
    label: "!bedrockinfogt",
    description: "Get a Bedrock user's information based off of there Gamertag.",
    value: "bedrockinfogt",
    detail: "This command can get a user's XUID and FUUID from there Gamertag, the command's syntax is `!bedrockinfofuuid insertGamertagHere`",
    extension: "Delta",
    enabled: "true",
}]

module.exports = {
    tags
}