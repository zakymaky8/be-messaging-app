const Chat = require("../models/chatsModel");
const User = require("../models/userModel");


const chatPairsByBothGet = async (req, res) => {
    const  { target } = req.params;
    if (req.user) {
        const chatCollections = await Chat.getConversationsByTwo(req.user._id, target)
        const targetedUser = await User.getSingleUser(target)
        return res
                .status(200)
                .json({ success: true, message: "Successful!", data: {currentUser: req.user, targetedUser, chatCollections}})
    } else {
        res
          .status(401)
          .json({ success: false, message: "Please Login!", data: null })
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