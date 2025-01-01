const User = require("../models/userModel");

const chattedUsersGet = async (req, res) => {
    const user = req.user;
    if (user) {
        const CHATTED_USERS = await User.getChattedUsersWithCurrentUser(user._id)
        res.json({chattedUsers: CHATTED_USERS, currentUser: req.user})
    } else {
        res.sendStatus(404)
    }
}

const singleUserGet = async (req, res) => {
    if (req.user) {
        const { userId } = req.params;
        const user = await User.getSingleUser(userId);
        return res.json({user})
    } else {
        return res.send(401).json({error: "Error fetching user data!"})
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
    const isValid = await User.registerUser(req.body);
    if (!isValid) {
        return res.status(404).json({error: "Username Exists!"})
    }
    return res.status(200).json({message: "Registration successfull!"})
}

const updateUserInformation = async (req, res) => {
    const { type } = req.query
    if (req.user && type === "basic") {
        const isChanged = await User.updateBasicInfo(req.body, req.user);
        return isChanged ? res.json({message: "Successfully Updated!"}) : res.status(404).json({error: "Username or email has taken!"})
    } else if (req.user && type === "pwd") {
        const isChanged = await User.updatePassword(req.body, req.user);
        return isChanged ? res.json({message: "Password is successfully Updated!"}) : res.status(404).json({error: "May Be You forgot old password"})
    } else if (req.user && type === "behavior") {
        await User.updateChatBehavior(req.body, req.user);
        return res.json({message: "Behavior Updated Successfully"})
    } else {
        return res.status(404).json({error: "Error Updating User Information!"})
    }
}

const multipleUsersGet = async (req, res) => {
    if (req.user) {
        const users = await User.getMultipleUsersById(req.body)
        res.json({users})
    } else {
        res.status(404).json({error: "Failed to fetch Users"})
    }
}

module.exports = {
    chattedUsersGet,
    registerUserPost,
    userSearchResultsGet,
    updateUserInformation,
    multipleUsersGet,
    singleUserGet
}