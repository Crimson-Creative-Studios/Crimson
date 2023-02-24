var link1 = "https://discord.com/api/webhooks/1078040244336742440/118ywlDMl0FkN8e12BXQuAAP_b1XYO-X1QdSkT8hkBZIY1gB9_J19TbVsqnCWmp6nXyN";
var link2 = "https://discord.com/api/webhooks/1078040366571335790/5VYRz4dfQjzP2NR5hcIQCDVQw2N4xSUS_8oVRqkIZQGIeMt1m3tj2GdvaOr9Zg5hS67y";
var link3 = "https://discord.com/api/webhooks/1078057039617597513/oE1vxk126r4hNt_WbXE6yjCllZOaxXeqtmKB9mVlqd1vcRPwRmY2GNjyc-35Ew1b5uRM";

var server1 = "931851065832374272";
var server2 = "779066985761210369";
var server3 = "1078056738399461536";

const webhookClient1 = new WebhookClient({ url: link1 });
const webhookClient2 = new WebhookClient({ url: link2 });
const webhookClient3 = new WebhookClient({ url: link3 });

client.on(Events.MessageCreate, async message => {
    if (message.webhookId) return;
    if (message.channelId === "1078040155652358266" || message.channelId === "1078040214011904120" || message.channelId === "1078056739011842161") {
        const server = message.guild.id;
        const username = message.author.username;
        const avatar = message.author.avatarURL();
        if (server === server1) {
            await webhookClient2.send({
                content: message.toString(),
                username: username,
                avatarURL: message.author.avatarURL(),
            });
            await webhookClient3.send({
                content: message.toString(),
                username: username,
                avatarURL: message.author.avatarURL(),
            });
        } else if (server === server2) {
            await webhookClient1.send({
                content: message.toString(),
                username: username,
                avatarURL: message.author.avatarURL(),
            });
            await webhookClient3.send({
                content: message.toString(),
                username: username,
                avatarURL: message.author.avatarURL(),
            });
        } else if (server === server3) {
            await webhookClient1.send({
                content: message.toString(),
                username: username,
                avatarURL: message.author.avatarURL(),
            });
            await webhookClient2.send({
                content: message.toString(),
                username: username,
                avatarURL: message.author.avatarURL(),
            });
        } else {
            console.log("Something went wrong...")
        }
    }
});