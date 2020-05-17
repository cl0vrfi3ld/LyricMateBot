//LyricMate by MaddieX (Mojo)
//Copyright 2020 MaddieX
//This is not the latest version of LyricMate, it is an earlier version that is simple enough for anyone to pick apart and develop upon
//This code is liscensed under the AGPLv3 lisence, you must follow the terms of this liscense to use this code
require('dotenv').config({});

const Discord = require('discord.js');
const { Client } = require("discord.js");
const client = new Client({
  disableEveryone: true
});

const ffmpeg = require('ffmpeg-static');


const YouTube = require("discord-youtube-api");
const youtube = new YouTube(process.env.YT_KEY);

const ytdl = require('ytdl-core');

//Logs in our Bot to Discord's API
client.login(process.env.TOKEN);

//sets status
client.on("ready", () => {
    client.user.setStatus("online");
    client.user.setActivity("some nice beats | //help", { type: "LISTENING"});

});

//create global demand to join vc
const VCErrorJoin = "You need to join a voice channel first, mate!";
//global feature-incomplete error
const incompleteFeatureMessage = "This feature is not complete, please check back later"
//prefix
const prefix = process.env.PREFIX;

//on bot join, send embed to "general" channel
client.on('guildCreate', (guild1) => {
  const welcomeEmbed = new Discord.MessageEmbed()
	.setColor('#e36692')
	.setTitle('Thanks for inviting LyricMate!')
	.setAuthor('LyricMate', 'https://lyricmate.xyz/images/lyricmate-icon.png', 'https://lyricmate.xyz/')
	.setDescription('LyricMate is a brand new take on music bots!')
	.setThumbnail('https://lyricmate.xyz/images/lyricmate-icon-round.png')
	.addFields(
		{ name: 'Need Help?', value: 'Simply type in //help for a list of commands!' },
		{ name: '\u200B', value: '\u200B' },
	)
	.setTimestamp()
	.setFooter('LyricMate Welcome Message');

const generalChannel = guild1.channels.cache.find(ch => ch.name === "general");
console.log(generalChannel);
generalChannel.send(welcomeEmbed);
});

var isInChannel = "false";
var channelName = "NULL";
var channelHolder;
var channelVar;
//Listener for messages
client.on('message', async message => {

  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.includes(prefix)) return;


  //meme command
  if (message.content === "thats depressing" || message.content === "that's depressing") {
    message.channel.send("ikr smh...");
  }
  //setting up code for args.
  //this creates an array with each word after the bot's prefix
  const args = message.content.slice(prefix.length).split(' ');
  //this gets the specific command from args, e.g play or ping, and shifts the entire array to lowercase
  const command = args.shift().toLowerCase();



  //ping
  //a simple test command
  if (command === 'ping') {
    message.channel.send('pong');
  }
  //help
  //shows the commands that our bot supports
  if (command === "help") {
    const helpEmbed = new Discord.MessageEmbed()
	.setColor('#e36692')
	.setTitle('Oi, looks like you could use some help!')
	.setAuthor('LyricMate', 'https://lyricmate.xyz/images/lyricmate-icon.png', 'https://lyricmate.xyz/')
	.setDescription('Heres a list of commands!')
	.setThumbnail('https://lyricmate.xyz/images/lyricmate-icon-round.png')
	.addFields(
    { name: 'Wanna play some music?', value: 'Try "//play"! You can give a link, or just a song name' },
    { name: 'Want the bot to shut up or just leave?', value: 'Try "//leave" or "//stop"! _Bots these days... so annoying..._' },
    { name: 'Wanna jam with ur mates?', value: 'Try "//jam"! This will make a temporary invite to your current voice channel, so you can jam all day long...' },
    { name: 'Dunno what to listen to?', value: 'Give "//playlists" a go! This feature is in **BETA** and will play one of our curated plalists for a variety of genres!'},
	)
	.setTimestamp()
	.setFooter('Dis bih needed some help smh...');

  message.channel.send(helpEmbed);

  }
  //sendtestembed
  //this sends a preview of the welcome embee
  if (command === "sendtestembed") {
  const welcomeEmbed = new Discord.MessageEmbed()
  .setColor('#e36692')
  .setTitle('Thanks for inviting LyricMate!')
  .setAuthor('LyricMate', 'https://lyricmate.xyz/images/lyricmate-icon.png', 'https://lyricmate.xyz/')
  .setDescription('LyricMate is a brand new take on music bots!')
  .setThumbnail('https://lyricmate.xyz/images/lyricmate-icon-round.png')
  .addFields(
    { name: 'Need Help?', value: 'Simply type in //help for a list of commands!' },
    { name: '\u200B', value: '\u200B' },
  )
  .setTimestamp()
  .setFooter('LyricMate Welcome Message');

  message.channel.send(welcomeEmbed);
  }

  //addbot
  if (command === "addbot") {
    message.reply('go to https://lyricmate.xyz/ to add!')
  }

  //stats
  //shows how many servers the bot has been invited to
  if (command === 'stats') {
		return message.channel.send(`${message.author} The number of servers that I've been invited to: ${client.guilds.cache.size}`);
  }



  //jam
  //creates a temp invite to ur vc so that ur mates can jam
  if (command === 'jam') {
    // We can only jam if someone's actually in a VC, checking:
    if (message.member.voice.channel) {
      const jamInvite = message.member.voice.channel.createInvite({ temporary = true} = {})
  .then(invite => message.reply(`wanna jam with your mates? Just send them this link! (Anyone sent this link will be kicked within 24 hours unless they are given a role) ` + process.env.INV_ROOT + `${invite.code}`))
  .catch(console.error);

    } else {
      message.reply(VCErrorJoin);
    }
  }

  //join
  //join the vc
  if (command === 'join') {
    // Only try to join the sender's voice channel if they are in one themselves
    console.log("Join command detected");
    if (message.author.bot) return;
    if (message.member.voice.channel) {
      isInChannel = "true";
      voiceChannel = message.member.voice.channel;
      joinRun(message.member.voice.channel);

    } else {
      message.reply(VCErrorJoin);
      console.log("Error, either user is not in channel or Maddie fucked up bad with her code...");
    }


  }
//stop
//stop playing music
  if (command === "stop") {
    if (message.member.voice.channel) {
      message.react('👍');
      message.guild.voice.connection.dispatcher.destroy();
      console.log("Stopping the dispatcher...");
    } else {
      message.reply(VCErrorJoin);
      console.log("Error, either user is not in channel or Maddie fucked up bad with her code...");
    }
  }

  //pause
  //pause the music
  if (command === "pause") {
    if (message.member.voice.channel) {
      message.react('⏸️');
      message.guild.voice.connection.dispatcher.pause();
      console.log("Pausing the dispatcher...");
    } else {
      message.reply(VCErrorJoin);
      console.log("Error, either user is not in channel or Maddie fucked up bad with her code...");
    }
  }

  //resume
  //resume the music
  if (command === "resume") {
    if (message.member.voice.channel) {
      message.react('▶️');
      message.guild.voice.connection.dispatcher.resume();
      console.log("Resuming the dispatcher...");
    } else {
      message.reply(VCErrorJoin);
      console.log("Error, either user is not in channel or Maddie fucked up bad with her code...");
    }
  }


  var reqMessage = message.member.toString();
  //playlists
  //shows a list of all available playlists
  if (command === "playlists") {
    const playlistsEmbed = new Discord.MessageEmbed()
	      .setColor('#e36692')
        .setTitle('LyricMate Playlists **BETA**')
	      .setAuthor('LyricMate', 'https://lyricmate.xyz/images/lyricmate-icon.png', 'https://lyricmate.xyz/')
	      .setDescription("Here's a list of all of LyricMate's curated playlists!")
        .addFields(
          { name: 'Synthwave Playlist', value: 'Try **//synthwave** ! This will play one of our favorite synthwave playlists, perfect for chilling.\n' },
          { name: '\u200B', value: '**Coming Soon:**' },
          { name: 'Pop Playlist', value: 'Try **//pop** ! This will play one of our favorite pop music playlists, perfect for some energetic tunes.' },
          { name: 'Lo-Fi', value: 'Try **//lofi** ! This will play one of our favorite Lo-Fi playlists, perfect for studying or relaxing.'},
          { name: 'Rap', value: "Try **//rap** ! This will play one of our favorite rap playlists, perfect if you're looking for some bars."},
          { name: '\u200B', value: '\u200B' },
          { name: "And there's more on the way!", value: '**Wanna add a playlist?** Take a look at [our website](https://lyricmate.xyz/) for submission details!'},
          //{ name: '<type>', value: 'Try **//command** ! This will play one of our favorite <type> playlists, perfect for <type description>.'},
        )
	      .setTimestamp()
	      .setFooter('Playlists');

      message.channel.send(playlistsEmbed);
  }

  //PLAYLIST CODE
  //the code that handles playing playlists, pretty self explanatory
  //genre compilation arrays:

  //synthwave
  const synthwaveComps = ["https://www.youtube.com/watch?v=ICcFMBzOnYs", "https://www.youtube.com/watch?v=ujPl75kj4Vw", "https://www.youtube.com/watch?v=6TEGPexTqr4", "https://www.youtube.com/watch?v=dgCnYsDTiXU", "https://www.youtube.com/watch?v=qv3QkrYir5w"];

  let compType = "NULL";
  //<genre>
  if (command === "synthwave") {
    // We can only play a playlist if someone's actually in a VC, checking:
    if (message.member.voice.channel) {
      //set the comp type
      compType = "synthwave"
      //get a random compilation
      const compsShuffle = synthwaveComps[Math.random() * synthwaveComps.length | 0];
      console.log(compsShuffle);
      //get comp info
      const getYTComp = await youtube.getVideo(compsShuffle)
      .then(console.log("Video is searching"))
      .catch(console.error);
      //logging info
      console.log(getYTComp);
      const compTitle = getYTComp.title;
      console.log(compTitle);
      //sending nowplaying embed
      const compPlayEmbed = new Discord.MessageEmbed()
          .setColor('#e36692')
          .setTitle('Now playing- ' + compTitle)
          .setURL(compsShuffle)
          .setAuthor('LyricMate', 'https://lyricmate.xyz/images/lyricmate-icon.png', 'https://lyricmate.xyz/')
          .setDescription("You wanted some " + compType + " and we delivered.")
          .addField('Requested By:', reqMessage)
          .addField('Tip:', "You can click the 'Now Playing' button to go to the video link!")
          .setTimestamp()
          .setFooter('Playlist');

        message.channel.send(compPlayEmbed);
      //play random compilation
      const compConnection = await message.member.voice.channel.join()
          .then( compConnection => { compConnection.play(ytdl(compsShuffle, { filter: 'audioonly' }))})
          .catch(console.error);
    } else {
      message.reply(VCErrorJoin);
    }
  }

    //<genre>
  if (command === "pop") {
    // We can only play a playlist if someone's actually in a VC, checking:
    if (message.member.voice.channel) {
      message.channel.send(incompleteFeatureMessage);

    } else {
      message.reply(VCErrorJoin);
    }
  }

    //<genre>
  if (command === "lofi") {
    // We can only play a playlist if someone's actually in a VC, checking:
    if (message.member.voice.channel) {
      message.channel.send(incompleteFeatureMessage);

    } else {
      message.reply(VCErrorJoin);
    }
  }

    //<genre>
  if (command === "rap") {
    // We can only play a playlist if someone's actually in a VC, checking:
    if (message.member.voice.channel) {
      message.channel.send(incompleteFeatureMessage);

    } else {
      message.reply(VCErrorJoin);
    }
  }

  //leave
  //leave the user's vc
  if (command === 'leave') {
    // Only try to leave the sender's voice channel if they are in one themselves

    if (message.member.voice.channel) {
      message.react('👋');
      isInChannel = "false";
      const connection = message.member.voice.channel.leave();
    } else if (isInChannel = "false") {
      message.reply("woah, I'm not even in a VC!");
    } else {
      message.reply("You're not even in a voice channel smh. Join one and try again");
    }
  }

  //stranger
  //fun stranger things cmd
  if (command === 'stranger') {
    const strangerGifs = ["https://media.giphy.com/media/fSN8IuBnajnXkyGFHC/giphy.gif", "https://media.giphy.com/media/WxJKwKzAmfLm1RazVi/giphy.gif", "https://media.giphy.com/media/xV6WvZzONxxtO99TwS/giphy.gif", "https://media.giphy.com/media/ehnNYpDEz5S1kRz15C/giphy.gif", "https://media.giphy.com/media/Ze8js1RkJRUImRsxn2/giphy.gif", "https://media.giphy.com/media/9Vo2COyJErrBs2pWaV/giphy.gif", "https://media.giphy.com/media/fe4695iudYhnGAiIia/giphy.gif", "https://media.giphy.com/media/WspnUsASDqdnq0v4ZW/giphy.gif"];

    // We can only play audio if someone's actually in a VC, checking:
    if (message.member.voice.channel) {
      const GIFShuffle = strangerGifs[Math.random() * strangerGifs.length | 0];
      const strangerGIFAttachment = new Discord.MessageAttachment(GIFShuffle);
      console.log('things are aboutta get strange...');
      //join channel, then react, then play audio
      const connection = await message.member.voice.channel.join()
          .then( connection => { connection.play('assets/strangerthings.mp3') })
          .then(message.react("👻"))
          .then(message.channel.send("Wait for it..."))
          .catch(console.error);
      //wait to send message
      setTimeout(function () {
          message.channel.send(GIFShuffle);
    }, 4200);
      //leave when done and clean up messages
      message.guild.voice.connection.dispatcher.on('finish', () => {
        message.member.voice.channel.leave();
        message.channel.bulkDelete(3)
          .then(messages => console.log(`Bulk deleted the stranger command messages`))
          .catch(console.error);
      });


    } else {
      message.reply(VCErrorJoin);
    }
  }

  //play
  //code to play music
  if (command === 'play') {
    // We can only play if someone's actually in a VC, checking:
    if (message.member.voice.channel) {
        //search code

        console.log(reqMessage);
        console.log(`${command}`);
        console.log(`${args}`);
        const strArgs = `${args}`
        const songArgs = strArgs.replace(/,/g, ' ');
        console.log(songArgs);
        const videoPullJSON = await youtube.searchVideos(songArgs)
        .then(console.log("Video is searching"))
        .catch(console.error);
        console.log(videoPullJSON);
        const videoURL = videoPullJSON.url.toString();
        const videoTitle = videoPullJSON.title;
        console.log(videoURL);
       // }
        const playEmbed = new Discord.MessageEmbed()
          .setColor('#e36692')
          .setTitle('Now Playing')
          .setURL(videoURL)
          .setAuthor('LyricMate', 'https://lyricmate.xyz/images/lyricmate-icon.png', 'https://lyricmate.xyz/')
          .setDescription(videoTitle)
          .addField('Requested By:', reqMessage)
          .addField('Tip:', "You can click the 'Now Playing' button to go to the video link!")
          .setTimestamp()
          .setFooter('Song Request');

        message.channel.send(playEmbed);

        const connection = await message.member.voice.channel.join()
          .then( connection => { connection.play(ytdl(videoURL, { filter: 'audioonly' }))})
          .catch(console.error);

    } else {
      message.reply(VCErrorJoin);

    }
  }


});

//runs once the //join command is sent
function joinRun(currentChannel) {
  console.log(channelName);
  const connection = voiceChannel.join()
    .then( connection => { connection.play('assets/gday.mp3')})
    .catch(console.error);

  console.log("joined!");
}

//checks to see if bot is alone
client.on('voiceStateUpdate', (oldState, newState) => {
  if(!oldState.channel) return; //stop if theres no channel
    //leave if no one is in vc
    console.log(oldState.channel.members.size);
      if (oldState.channel.members.size == 1) {
        oldState.channel.leave();
        console.log("Nobody's home in " + oldState.channel + ", I'mma head out");
      }
      else if (oldState.channel.members.size > 1){
        console.log("We got a buncha mates jamming in " + oldState.channel + "!");
      } else if (oldState.channel.members.size == 0){
        console.log("This channel (" + oldState.channel + ") is homeless");
      } else {
        console.log("Maddie, what the fuck did you do, this is not supposed to happen!")
      }
    });
