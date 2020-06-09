'use strict'

const telegraf = require('telegraf');
const extIP = require('external-ip');
const os = require('os');
const netInterfaces = os.networkInterfaces().eth0;
const config = require('./config');
const mongoUtil = require('./mongo');
const bot = new telegraf(config.token);
 
let getIP = extIP({
    replace: true,
    services: ['https://ipinfo.io/ip', 'http://ifconfig.co/x-real-ip', 'http://ifconfig.io/ip'],
    timeout: 600,
    getIP: 'parallel',
    userAgent: 'Chrome 15.0.874 / Mac OS X 10.8.1'
});

mongoUtil.connectToServer(async (err) => {
    if (err) console.log(err);

    console.log('DB Connected!')
});

let dev = false;

bot.telegram.deleteWebhook().then(res => {
    if (res === true) {
        // Server
        if (dev === false) {
            bot.telegram.setWebhook(...[netInterfaces[0].address, null, 8443])
            console.log('Bot running on server!')
            bot.launch()
        } 
        // Local
        else if (dev === true) {
            getIP((err, ip) => {
                if (err) throw err
                bot.telegram.setWebhook(...[ip, null, 6000])
                console.log(`Bot running on local machine!\nIP: ${ip}`)
                bot.launch()
            });
        }
    }
});

module.exports = bot