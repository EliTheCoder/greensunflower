const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const eliapi = require("./eliapi.js");
const express = require('express');
const app = express();
const port = 80;
app.use(express.static(path.join(__dirname, '/static')));

const server = app.listen(process.env.PORT || port, () => {
  eliapi.logMessage(0, "SERVER RUNNING: PORT: " + port);
});
const io = require('socket.io')(server);

const token = JSON.parse(fs.readFileSync('tokenconfig.json')).token;
eliapi.logMessage(4, `bot running with token: ${token}`);

const client = new Discord.Client();
client.login(token);

// process.stdin.resume();
// process.stdin.setEncoding('utf8');

// process.stdin.on('data', function(text) {
//   if (text.trim() === 'quit') {
//     done();
//   }
//   try {
//     eliapi.logMessage(3, eval(text.trim()));
//   } catch (err) {
//     eliapi.logMessage(2, err.toString());
//   }
// });
//
// function done() {
//   console.log('Quiting..');
//   process.exit();
// }

client.on("message", msg => {
  eliapi.logMessage(4, `${msg.guild.name}: #${msg.channel.name}: <${msg.author.username}> ${msg.content}`);
  io.emit("rmsg", `${msg.guild.name}: #${msg.channel.name}: <${msg.author.username}> ${msg.content}`);
});

io.on('connection', socket => {
  // eliapi.logMessage(0, "CLIENT CONNECTED WITH IP ADDRESS: " + socket.request.connection.remoteAddress.split(':').slice(3)[0]);

  socket.on("smsg", msg => {
    eliapi.logMessage(4, msg);
    client.channels.get("473301193766993942").send(msg);
  });
});
