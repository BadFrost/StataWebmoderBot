'use strict'

const bot = require('./server/server');
const mongo = require('./server/mongo');
const token = require('./server/config').token;
const axios = require('axios').default;

let deleteMessage = async (chatId, messageId) => {
    axios.post(`https://api.telegram.org/bot${token}/deleteMessage`, {
        chat_id: chatId,
        message_id: messageId
    })
    .catch(async (err) => {
        console.log(err)
    });
};

let getAdmins = async (msg, callback) => {
    if (msg.chat.type === 'private') {
        // Список id глобальных админов
        let globalAdmins = [458463336, 515374476, 841645118, 316878433, 238008224, 509343581, 217796279, 777000, 443465055];
        // Ищем пользователя в списке
        let gIndex = globalAdmins.findIndex(x => x === msg.from.id);
        // Если глобальный админ
        if (gIndex !== -1) {
            return callback(true);
        }
        // Если не глобальный админ
        else {
            return callback(false);
        };
    }
    else {
        return callback(false);
    };
};

bot.hears(/^\/start/, async (ctx) => {
    let msg = ctx.update.message;
    getAdmins(msg, async (isAdmin) => {
        if (isAdmin) {
            await deleteMessage(msg.chat.id, msg.message_id);
            axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
                chat_id: msg.chat.id,
                text: `👍`,
                disable_web_page_preview: true,
                parse_mode: 'HTML'
            })
            .catch(async (err) => {
                console.log(err)
            });
        }
        else if (!isAdmin) {
            console.log('Some error');
        };
    });
});

bot.hears(/^\/stata/, async (ctx) => {
    let db = mongo.getDb();
    let msg = ctx.update.message;
    getAdmins(msg, async (isAdmin) => {
        if (isAdmin) {
            await deleteMessage(msg.chat.id, msg.message_id);
            let groupCount = await db.collection('groups').find({}).count();
            let usersCount = await db.collection('users').find({}).count();
            let rulesCount = await db.collection('rulesusers').find({}).count();
            let adminsCount = await db.collection('admins').find({}).count();
            axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
                chat_id: msg.chat.id,
                text: `📌 <b>Стата:</b>\n\n<b><i>Группы:</i></b> ${groupCount}\n<b><i>Юзеры:</i></b> ${usersCount}\n<b><i>Правила:</i></b> ${rulesCount}\n<b><i>Админы:</i></b> ${adminsCount}`,
                disable_web_page_preview: true,
                parse_mode: 'HTML'
            })
            .catch(async (err) => {
                console.log(err)
            });
        }
        else if (!isAdmin) {
            console.log('Some error');
        };
    });
});