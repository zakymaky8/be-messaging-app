const { Router } = require("express");
const { chatPairsByBothGet, getMessagesWithself, deleteMsgWithSelf, updateMsgWithSelf, createMsgWithSelf } = require("../controllers/chatController");
const { authenticateUser } = require("../auth/jwt_auth");

const chatRouter = Router();


chatRouter.get("/api/chats/conversations_with/self/me", authenticateUser, getMessagesWithself)
chatRouter.post("/api/chats/conversations_with/self", authenticateUser, createMsgWithSelf)
chatRouter.put("/api/chats/conversations_with/self/:chat_id", authenticateUser, updateMsgWithSelf)
chatRouter.delete("/api/chats/conversations_with/self/:chat_id", authenticateUser, deleteMsgWithSelf)

chatRouter.get("/api/chats/conversations_with/:target", authenticateUser, chatPairsByBothGet)


module.exports = chatRouter;