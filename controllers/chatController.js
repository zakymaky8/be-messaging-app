const Chat = require("../models/chatsModel");
const User = require("../models/userModel");


const chatPairsByBothGet = async (req, res) => {
    const  { target } = req.query;
    if (req.user) {
        const chatCollections = await Chat.getSortedChatPairByCreationTime(req.user._id, target)
        const targetedUser = await User.getSingleUser(target)
        res.json({currentUser: req.user, targetedUser, chatCollections})
    } else {
        res.sendStatus(403)
    }
}


const createChatMessagePost = async (req, res) => {
    if (req.user) {
        const { chat_msg } = req.body;
        const { target } = req.query;

        await Chat.createChatMessage(req.user._id, target, chat_msg);
    } else {
        res.sendStatus(403)
    }
}


module.exports = {
    chatPairsByBothGet,
    createChatMessagePost
}