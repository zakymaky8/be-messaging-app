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


const getMessagesWithself = async (req, res) => {
    if (req.user) {
        const messages = await Chat.fetchSavedMessages(req.user)
        return res
                .status(200)
                .json({ success: true, message: "Successfull!", data: { messages } })
    }

    else {
        return res
                .status(401)
                .json({ success: false, message: "Please Login!", data: null })
    }
}


const deleteMsgWithSelf = async (req, res) => {
    const { chat_id } = req.params;

    if (req.user) {
        await Chat.deleteSavedMessage(req.user, chat_id)

        return res
                .status(200)
                .json({ success: true, message: "messsage successfully deleted!"})
    }

    else {
        return res
                .status(401)
                .json({ success: false, message: "Please Login!", data: null })
    }
}


const updateMsgWithSelf = async (req, res) => {
    const { chat_id } = req.params;

    if (req.user) {
        await Chat.updateSavedMessage(req.body.chat_msg, chat_id)

        return res
                .status(200)
                .json({ success: true, message: "messsage successfully updated!"})
    }

    else {
        return res
                .status(401)
                .json({ success: false, message: "Please Login!", data: null })
    }
}

const createMsgWithSelf = async (req, res) => {
    if (req.user) {
        await Chat.createSavedMessage(req.user, req.body.chat_msg)

        return res
                .status(200)
                .json({ success: true, message: "messsage successfully created!"})
    }

    else {
        return res
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
    createChatMessagePost,
    getMessagesWithself,
    deleteMsgWithSelf,
    updateMsgWithSelf,
    createMsgWithSelf
}