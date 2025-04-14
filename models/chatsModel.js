const { User, Chat, ChatsPair, Pref, connectDb } = require("../config/schema/schema")

//  major task try to eliminate chats pair model and use chat model only


connectDb()

module.exports = {

    // getChatPairsByTwo: async (current_user_id, targeted_user_id) => {
    //     const chatPairs = await ChatsPair.findOne({currentUser: current_user_id, targetedUser: targeted_user_id})
    //     return chatPairs
    // },

    getConversationsByTwo: async (current, target) => {


        // if (current === target) {

        // }
        const chatPairs = await ChatsPair.findOne({userPair: { $all: [current, target]}});
        // const chatPairs = await ChatsPair.findOne({userPair: [target, current]});
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
        // const users = await User.find({username: {$exists: true}});
        // await ChatsPair.updateMany({currentUser: {$exists: true}}, {chats: []})
        // await User.updateMany({username: {$exists: true}}, {chattedUsers: []})
        // console.log(await ChatsPair.deleteMany())
        // console.log(await ChatsPair.find())
        // console.log(await Chat.deleteMany())
        // console.log(await Chat.find())
        // await User.deleteMany()
        await User.updateMany({ savedMessages: [] })
        // console.log(await ChatsPair.find())
        const user = await User.find({ firstName: { $ne: null } })
        // user.forEach(usr => usr.chattedUsers = [])
        // await Promise.all(user.map(async usr => await usr.save()))
        // console.log(user)

    },

    createChatPair: async (current, target) => {
        const chatPair = await  new ChatsPair({
            currentUser: current,
            chattedUser: target,
            chats: []
        }).save()
    },

    createChatMessage: async (current, target, chat_msg, replied_to) => {

        const chat = new Chat({
            chatted_to: target,
            messageText: chat_msg,
            user_id: current,
            createdAt: new Date(),
            updatedAt: new Date(),
            isUpdated: false
        })
        Boolean(replied_to) ? chat.replied_to = replied_to : null;
        await chat.save()
        await ChatsPair.findOneAndUpdate({userPair: { $all: [target, current] }}, { $push: { chats: chat._id } });
    },

    deleteChatById: async (msgId, target, current) => {
        const { _id, chats } = await ChatsPair.findOne({userPair: { $all: [target, current] }})
        const newChatCol = chats.filter(chat => !chat.equals(msgId));
        await ChatsPair.findByIdAndUpdate(_id, { chats: newChatCol })
        await Chat.findByIdAndDelete(msgId);
    },

    editChatMessageText: async (msgId, current, target, updatedText) => {
        await Chat.findByIdAndUpdate(msgId, {
            messageText: updatedText,
            isUpdated: true,
            updatedAt: new Date()
        })
    },

    fetchSavedMessages: async (user) => {
        const userr = await User.findById(user._id)
        const messages = userr.savedMessages ? await Promise.all(userr.savedMessages.map( id => Chat.findById(id))) : [];
        return messages.filter(message => Boolean(message) !== false)
    },

    createSavedMessage: async (user, text) => {
        const chat = new Chat({
            messageText: text,
            user_id: user._id,
            createdAt: new Date(),
            updatedAt: new Date(),
            isUpdated: false
        })
        await chat.save();

        const userCurrent = await User.findById(user._id);
        const addedSaves = [...userCurrent.savedMessages, chat._id];
        await User.findByIdAndUpdate(user._id, { savedMessages: [...addedSaves] } )
    },

    deleteSavedMessage: async (user, chat_id) => {
        const cuser = await User.findById(user._id);
        const filtered = cuser.savedMessages.filter(msgs => !msgs.equals(chat_id))
        cuser.savedMessages = filtered
        await cuser.save()
        await Chat.deleteOne({ _id: chat_id })

    },

    updateSavedMessage: async ( updatedText, chat_id ) => {
        await Chat.findByIdAndUpdate(chat_id, {
            messageText: updatedText,
            isUpdated: true,
            updatedAt: new Date()
        })
    },

}



// module.exports.fetchAllChatPairs()