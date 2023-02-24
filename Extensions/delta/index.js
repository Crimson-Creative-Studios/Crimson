client.on(Events.MessageCreate, async message => {
    var messagestr = message.toString()
    var isGetBedrockInfoGT = messagestr.startsWith('!bedrockinfogt ')
    var isGetBedrockInfoXUID = messagestr.startsWith('!bedrockinfoxuid ')
    var isGetBedrockInfoFUUID = messagestr.startsWith('!bedrockinfofuuid ')
    if (isGetBedrockInfoGT === true || isGetBedrockInfoXUID === true || isGetBedrockInfoFUUID === true) {
        const msg = await message.reply("Please wait while I get the requested information from the Xbox API...");
        var isGetBedrockInfoGT = messagestr.startsWith('!bedrockinfogt ')
        var isGetBedrockInfoXUID = messagestr.startsWith('!bedrockinfoxuid ')
        var isGetBedrockInfoFUUID = messagestr.startsWith('!bedrockinfofuuid ')
        async function finish(responce) {
            const body = await responce.json();
            try {
                var icon = body.icon
                var gamertag = body.gamertag
                var xuid = body.xuid
                var floodgateuid = body.floodgateuid
            }
            catch (err) {
                try {
                    var message = body.message;
                }
                catch (err) {
                    console.logger(err, "error")
                    msg.edit(`Uh oh, something went wrong! I could not get the API error message, the API may currently be down.`)
                }
            }
            try {
                const xboxUserEmbed = new EmbedBuilder()
                    .setColor(0x0084D1)
                    .setTitle(`${gamertag}'s Info`)
                    .setThumbnail(icon)
                    .setDescription(`**Gamertag:**\n${gamertag}\n\n**XUID:**\n${xuid}\n\n**Floodgate UUID:**\n${floodgateuid}`)
                msg.edit("Here is the requested user's information!")
                msg.edit({ embeds: [xboxUserEmbed] })
            }
            catch (err) {
                try {
                    msg.edit(`An error has occured, the user may not exist!
                    
        API Error : ${message}`);
                }
                catch (err) {
                    console.logger(err, "error")
                }
                console.logger("Xbox user not found!", "warn");
            }
        }
        if (isGetBedrockInfoGT === true) {
            var user_info = messagestr.slice(15);
            var res = await fetch(`https://uuid.kejona.dev/api/v1/gamertag/${user_info}`)
            finish(res)
        }
        else if (isGetBedrockInfoFUUID === true) {
            var user_info = messagestr.slice(18);
            var res = await fetch(`https://uuid.kejona.dev/api/v1/fuid/${user_info}`)
            finish(res)
        }
        else if (isGetBedrockInfoXUID === true) {
            var user_info = messagestr.slice(17);
            var res = await fetch(`https://uuid.kejona.dev/api/v1/xuid/${user_info}`)
            finish(res)
        }
        else {
            var user_info = messagestr.split(" ").pop();
            var res = await fetch(`https://uuid.kejona.dev/api/v1/gamertag/${user_info}`)
            finish(res)
        }
    }
})