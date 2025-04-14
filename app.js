const express = require("express");
const cors = require("cors");
const indexRouter = require("./routes/indexRouter")
const chatRouter = require("./routes/chatRouter");

require("dotenv").config()

const { Server } = require("socket.io")
const http = require("http");

const Chat = require("./models/chatsModel");
const User = require("./models/userModel");

const { authenticateUser } = require("./auth/jwt_auth");

const app = express()
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_APP_FOR_SOCKET || "https://chatwithchatter.vercel.app",
        methods: "*",
        credentials: true
    }
})

io.on("connection", (socket) => {
    socket.on("send message", async (message) => {

        const { currentUserId, targetedUserId, chat_msg, chat_pair, replied_to } = message;

        await Chat.createChatMessage(currentUserId, targetedUserId, chat_msg, replied_to);
        const chatCollections = await Chat.getConversationsByTwo(currentUserId, targetedUserId)
        io.emit("get message", {chatCollections, chat_pair})
    })


    socket.on("delete message", async (data) => {
        const { msgId, target, current, chat_pair } = data;
        await Chat.deleteChatById(msgId, target, current);
        const chatCollections = await Chat.getConversationsByTwo(current, target)
        io.emit("get reminants", {chatCollections, chat_pair})
    })

    socket.on("edit message", async (message) => {
        const  {msgId, current, target, updatedText, chat_pair} = message;
        Chat.editChatMessageText(msgId, current, target, updatedText)
        const chatCollections = await Chat.getConversationsByTwo(current, target)
        io.emit("get updated", {chatCollections, chat_pair})
    })


    socket.on("go offline", async (user_id)=>{
        await User.makeUserOffline(user_id)
        const offUser = await User.getUser(user_id)
        io.emit("get_new_online_status", { user: offUser })
    })

    socket.on("go online", async (user_id) => {
        await User.makeUserOnline(user_id);
        const activeUser = await User.getUser(user_id)
        io.emit("get_new_online_status", { user: activeUser })
    })

    socket.on("delete chat", async message => {
        const {current, target, type} = message;
        const chattedUsers = await User.operateDeleteChat(current, target, type)
        io.emit("get chat list")
    })

})

app.use(cors())

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use("/", indexRouter)
app.use("/", chatRouter)



app.get("/api/current_user", authenticateUser, async (req, res) => {
    const grantedUsers = await Promise.all(req.user.allowedUsersToChat.map((userId) => User.getUser(userId)));
    return res
            .status(200)
            .json({ success: true, message: "Successful!", data: {current: {...req.user, allowedUsersToChat: grantedUsers}}})
})



server.listen(1234, () => {
    console.log("server is listening on port", 1234)
})


























    // ;(async function () {
    //     // const user = new User({
    //     //     firstName: "d",
    //     //     lastName: "some name",
    //     //     username: "12345",
    //     //     password: "23444",
    //     //     email: "4848484"
    //     // })
    //     // await user.save();
    //     await User.deleteMany()
    //     // console.log(users)
    // })()