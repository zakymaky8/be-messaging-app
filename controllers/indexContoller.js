const User = require("../models/userModel");

const chattedUsersGet = async (req, res) => {
    const user = req.user;
    if (user) {
        const CHATTED_USERS = await
         User.getChattedUsersWithCurrentUser(user._id)
        res.json({chattedUsers: CHATTED_USERS, currentUser: req.user})
    } else {
        res.sendStatus(404)
    }
}

const userSearchResultsGet = async (req, res) => {
    const { search_key } = req.query;
    if (req.user) {
        const userResult = await User.getUsersWithSearchKey(search_key);
        res.json({userResult})
    } else {
        res.sendStatus(401)
    }
}

const registerUserPost = async (req, res) => {
    console.log(req.body)
    await User.registerUser(req.body)
    res.status(200).json({message: "Registration successfull!"})
}


module.exports = {
    chattedUsersGet,
    registerUserPost,
    userSearchResultsGet
}