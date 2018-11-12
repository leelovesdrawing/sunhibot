
var Discord = require('discord.js');
var bot = new Discord.Client();
var fs = require('fs');
var profanities = require('profanities')


var userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
var commandsList = fs.readFileSync('Storage/commands.txt', 'utf8');
bot.commands = new Discord.Collection();

function loadCmds () {
fs.readdir('./commands/', (err, files) => {
  if(err) console.error(err);

  var jsfiles = files.filter(f => f.split('.').pop() === 'js');
  if (jsfiles.length <= 0) { return console.log('No Commands Found...')}
  else { console.log(jsfiles.length + ' Commands Found.') }

  jsfiles.forEach((f, i) => {
      delete require.cache[require.resolve(`./commands/${f}`)];
      var cmds = require(`./commands/${f}`);
      console.log(`Command ${f} Loading...`);
      bot.commands.set(cmds.config.command, cmds);
  })


})

}

function userInfo(user, guild) {
  var finalString = '';


  finalString += '**' + user.username + '**, With The **ID** Of **' + user.id + '**';


  var userCreated = user.createdAt.toString().split(' ');
  finalString += ', Was **Created On ' + userCreated[1] + ' ' + userCreated[2] + ', ' + userCreated[3] + '.**'


  finalString += ' Since Then, You Have **Sent ' + userData[user.id + guild.id].messagesSent + ' Messages** To Pop Nation!, Good Job!^^'



  return finalString;
}

loadCmds();

bot.on('message', message => {


    var sender = message.author;
    var msg = message.content.toUpperCase();
    var prefix = '-'
    var cont  = message.content.slice(prefix.length).split(" ");
    var args = cont.slice(1);


    if (!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id] = {
        messagesSent: 0
    }


    userData[sender.id + message.guild.id].messagesSent++;



    if (!message.content.startsWith(prefix)) return;

    var cmd = bot.commands.get(cont[0])
    if (cmd) cmd.run(bot, message, args);

    if (msg === prefix + 'RELOAD') {
        message.channel.send({embed:{description:"All Commands Reloaded"}})
        message.channel.send('All Commands Reloaded')
        loadCmds()
    }


    for (x = 0; x < profanities.length; x++) {
        if (message.content.toUpperCase() === profanities[x].toUpperCase()) {
          message.channel.send('Watch Your Language Here!:rage:')
          message.delete();
          return;
        }
    }


    if (sender.id === '511550281599942666') {
      return;
    }



    if (msg === prefix + 'ROLES') {

      message.channel.send({embed:{
          color: 0xFFC4B7,
          fields:[
            {
              name:"Thanks For Choosing A Role!^^",
              value:"I Hope Your Happy With Your Role, Because You Are Awesome!^^",
              inline:true,
            },
          ],
          timestamp: new Date(),
          footer: {
            text: 'UwU',
            icon_url: "https://cdn.discordapp.com/attachments/505153903567044628/511626111344443392/a_9bd69b4d32d9b0370c4d3c0ebda803ee.gif",
          }
      }})
    }


    if (message.channel.id === '505510283565858836') {
      if (isNaN(message.content)) {
        message.delete()
        message.author.send('Your Message Has Been Deleted!')
      }
    }


    if (msg.includes('HATE')) {
        message.delete();
        message.author.send('Please Do Not Use That Hurtful Word **Hate** Here, Thanks!')
    }


    if (msg.startsWith(prefix + 'USERINFO')) {

      if (msg === prefix + 'USERINFO') {
        message.channel.send(userInfo(sender, message.guild));
      }
    }


    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err);
    });

});


bot.on('ready', () => {
    console.log('The Bot Is Ready!...')






bot.user.setStatus('Online')


bot.user.setGame('Sun-hi Pop Nation!')

bot.user.setGame('Sun-hi Pop Nation!', 'https://www.twitch.tv/leelovesdrawing');

});


bot.on('guildMemberAdd', member => {

    console.log('Kpop Beginner ' + member.user.username + ' Has Joined The Pop Nation!')


    var role = member.guild.roles.find('name', 'Kpop Beginner');


    member.addRole(role)


    member.guild.channels.get('505537155431530507').send('**' + member.user.username + '**, Has Joined The Pop Nation!^^');


});



bot.on('guildMemberRemove', member => {


  member.guild.channels.get('505537155431530507').send('**' + member.user.username + '**, Has Left The Pop Nation, Bye!');



});

bot.login('NTExNTUwMjgxNTk5OTQyNjY2.DsslWg.KV-sLfrXIhz5y1RigLBJ5cKCXus')
