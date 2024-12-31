const express = require("express");
const cors = require("cors");
const indexRouter = require("./routes/indexRouter")
const chatRouter = require("./routes/chatRouter");
const jwt = require("jsonwebtoken");

require("dotenv").config()

const { Server } = require("socket.io")
const Chat = require("./models/chatsModel");

const http = require("http");
const User = require("./models/userModel");
const { authenticateUser } = require("./auth/jwt_auth");

const app = express()
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: "*"
    }
})

io.on("connection", (socket) => {
    socket.on("send message", async (message) => {

        const { currentUserId, targetedUserId, chat_msg } = message;

        await Chat.createChatMessage(currentUserId, targetedUserId, chat_msg);
        const chatCollections = await Chat.getSortedChatPairByCreationTime(currentUserId, targetedUserId)
        io.emit("get message", chatCollections)
    })
    socket.on("delete message", async (data) => {
        const { msgId, target, current } = data;
        await Chat.deleteChatById(msgId, target, current);
        const chatCollections = await Chat.getSortedChatPairByCreationTime(current, target)
        io.emit("get reminants", chatCollections)
    })

    socket.on("edit message", async (message) => {
        const  {msgId, current, target, updatedText} = message;
        Chat.editChatMessageText(msgId, current, target, updatedText)
        const chatCollections = await Chat.getSortedChatPairByCreationTime(current, target)
        io.emit("get updated", chatCollections)
    })
    socket.on("go offline", async (user_id)=>{
        await User.makeUserOffline(user_id)
    })

    socket.on("go online", async (user_id)=>{
        await User.makeUserOnline(user_id)
    })

    socket.on("delete chat", async message => {
        const {target, token} = message;
        const current = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const chattedUsers = await User.operateDeleteChat(current._id, target)
        io.emit("get chat list", { chatList: chattedUsers })
    })

})

app.use(cors())

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use("/", indexRouter)
app.use("/", chatRouter)



app.get("/current_user", authenticateUser, (req, res) => {
    res.json({current: req.user})
})





server.listen(1234, () => {
    console.log("app is listening on port", 1234)
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