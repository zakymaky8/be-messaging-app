const { Router } = require("express");
const { chatPairsByBothGet } = require("../controllers/chatController");
const { authenticateUser } = require("../auth/jwt_auth");

const chatRouter = Router();


chatRouter.get("/api/chats/conversations_with/:target", authenticateUser, chatPairsByBothGet)

module.exports = chatRouter;