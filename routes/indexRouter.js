const { Router }  = require("express");
const { authenticateUser, getUserToken } = require("../auth/jwt_auth");
const { chattedUsersGet, registerUserPost, userSearchResultsGet, updateUserInformation, multipleUsersGet, singleUserGet } = require("../controllers/indexContoller");

const indexRouter = Router();


indexRouter.get("/api/users", authenticateUser, chattedUsersGet)

indexRouter.post("/register", registerUserPost)

indexRouter.post("/auth/login", getUserToken)


indexRouter.get("/api/user/search", authenticateUser, userSearchResultsGet)

indexRouter.put("/api/user/:userId", authenticateUser, updateUserInformation)

indexRouter.post("/get_users_by_id", authenticateUser, multipleUsersGet)

indexRouter.get("/user/:userId", authenticateUser, singleUserGet)

module.exports = indexRouter