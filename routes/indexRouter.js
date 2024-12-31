const { Router }  = require("express");
const { authenticateUser, getUserToken } = require("../auth/jwt_auth");
const { chattedUsersGet, registerUserPost, userSearchResultsGet, updateUserInformation, multipleUsersGet, singleUserGet } = require("../controllers/indexContoller");

const indexRouter = Router();


indexRouter.get("/users", authenticateUser, chattedUsersGet)

indexRouter.post("/register", registerUserPost)

indexRouter.post("/login", getUserToken)


indexRouter.get("/search", authenticateUser, userSearchResultsGet)

indexRouter.put("/update_user_info", authenticateUser, updateUserInformation)

indexRouter.post("/get_users_by_id", authenticateUser, multipleUsersGet)

indexRouter.get("/user/:userId", authenticateUser, singleUserGet)

module.exports = indexRouter