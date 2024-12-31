const { User, Chat, ChatsPair, Pref } = require("../config/schema/schema")

//  major task try to eliminate chats pair model and use chat model only

module.exports = {
    getChatPairsByTwo: async (current_user_id, targeted_user_id) => {
        const chatPairs = await ChatsPair.findOne({currentUser: current_user_id, targetedUser: targeted_user_id})
        return chatPairs
    },

    getSortedChatPairByCreationTime: async (current, target) => {
        const chatPairs = await ChatsPair.findOne({userPair: { $all: [current, target]}});
        if (chatPairs) {
            const chatCollections = await Promise.all(chatPairs.chats.map(async chatId => await Chat.findById(chatId)));
            return chatCollections.sort((a, b) => a?.createdAt-b?.createdAt)
        } else {
            const chatpair = new ChatsPair({
                userPair: [target, current],
                currentUser: current,
                chattedUser: target,
                chats: []
            });
            await chatpair.save()
            await User.findByIdAndUpdate(current, { $push: { chattedUsers: target}})
            if (current !== target) {
                await User.findByIdAndUpdate(target, { $push: { chattedUsers: current}})
                return []
            } else {
                return []
            }
        }
    },
    fetchAllChatPairs: async () => {
        // console.log(await ChatsPair.find())
        // const users = await User.find({username: {$exists: true}});
        // await ChatsPair.updateMany({currentUser: {$exists: true}}, {chats: []})
        await User.updateMany({username: {$exists: true}}, {chattedUsers: []})
        console.log(await ChatsPair.deleteMany())
        console.log(await Chat.deleteMany())
        // console.log(await User.find())
        // console.log(await ChatsPair.find())

    },

    createChatPair: async (current, target) => {
        const chatPair = await  new ChatsPair({
            currentUser: current,
            chattedUser: target,
            chats: []
        }).save()
    },

    createChatMessage: async (current, target, chat_msg) => {
        const chat = new Chat({
            chatted_to: target,
            messageText: chat_msg,
            user_id: current,
            createdAt: new Date(),
            updatedAt: new Date(),
            isUpdated: false
        })
        await chat.save()
        await ChatsPair.findOneAndUpdate({userPair: { $all: [target, current] }}, { $push: { chats: chat._id } });
    },
    deleteChatById: async (msgId, target, current) => {
        const { _id, chats } = await ChatsPair.findOne({userPair: { $all: [target, current] }})
        const newChatCol = chats.filter(chat => !chat.equals(msgId));
        await ChatsPair.findByIdAndUpdate(_id, { chats: newChatCol })
        console.log(await ChatsPair.findById(_id))
        await Chat.findByIdAndDelete(msgId);
    },

    editChatMessageText: async (msgId, current, target, updatedText) => {
        await Chat.findByIdAndUpdate(msgId, {
            messageText: updatedText,
            isUpdated: true,
            updatedAt: new Date()
        })
    }
}

// module.exports.fetchAllChatPairs()