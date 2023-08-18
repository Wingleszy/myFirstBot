const TelegramApi = require('node-telegram-bot-api')

const {gameOptions, againOptions} = require('./options.js')


const token = "6003789842:AAEiiPv1TXH8EPybPBIVaz_9w5KrUsUi6m0"

const bot = new TelegramApi(token, {polling: true})

const chats = {

}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, попробуй угадай!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    return bot.sendMessage(chatId, "Отгадывай!", gameOptions)
}

bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Информация о пользователе'},
    {command: '/game', description: 'Сыграть!'}
])



const start = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
            return bot.sendMessage(chatId, `Добро пожаловать!`)
        }
    
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.username}!`)
        }

        if (text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Я тебя не понял!')

    })

    

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return startGame(chatId)
        }
        if (+data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Угадал! Цифра: ${chats[chatId]}`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `Не угадал! Цифра, которую я загадал была ${chats[chatId]}`, againOptions)
        } 
    })
}

start()