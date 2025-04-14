const User = require("../models/userModel");

const chattedUsersGet = async (req, res) => {
    const user = req.user;
    if (user) {
        const CHATTED_USERS = await User.getChattedUsersWithCurrentUser(user._id)
        return res
                .status(200)
                .json({success: true, message: "Successful", data: {chattedUsers: CHATTED_USERS, currentUser: req.user}})
    } else {
        return res
                .status(401)
                .json({success: false, message: "Please Login!", data: null})
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
        const { found, allowed, user } = await User.getUsersWithSearchKey(search_key.trim(), req.user);
        if ( found && allowed ) {
            return res
                     .status(200)
                     .json({success: true, message: "Successful!", data: { user }})
        }

        if ( found && !allowed ) {
            return res
                    .status(404)
                    .json({success: false, message: "Seek hindered by user restrictions for searching!", data: {user: null}})
        }

        if (!found || (!found && !allowed)) {
            return res
                    .status(404)
                    .json({ success: false, message: "User wasn't found", data: { user: null } })
        }
    }

    else {
        return res
                .status(401)
                .json({ success: false, message: "Please Login!", data: { user: null } })
}
}

const registerUserPost = async (req, res) => {
    const isValid = await User.registerUser(req.body);
    if (!isValid) {
        return res.status(409).json({success: false, message: "Username or Email exists!"})
    }
    return res.status(200).json({success: true, message: "Registration successfull!"})
}

const updateUserInformation = async (req, res) => {

    const { type } = req.query;
    const { userId } = req.params;


    if (req.user && type === "basic") {
        if (userId !== req.user._id) {
            return res
                    .status(403)
                    .json({ success: false, message: "Action Not Allowed!" })
        }

        const updated = await User.updateBasicInfo(req.body, userId);

        return updated ?
                    res
                      .status(200)
                      .json({success: true, message: "Successfully Updated!", data: { updatedUser:  updated}}) :
                    res
                      .status(404)
                      .json({success: false, message: "Username or email has been taken!", data: { updatedUser: null }})

    }

    if (req.user && type === "pwd") {
        if (userId !== req.user._id) {
            return res
                    .status(403)
                    .json({ success: false, message: "Action Not Allowed!" })
        }
        const isChanged = await User.updatePassword(req.body, req.user);
        return isChanged ?
                    res
                      .status(200)
                      .json({success: true, message: "Password is successfully Updated!"}) :
                    res
                      .status(400)
                      .json({ success: false, message: "May Be You forgot old password"})
    }

    if (req.user && type === "behavior") {
        if (userId !== req.user._id) {
            return res
                    .status(403)
                    .json({ success: false, message: "Action Not Allowed!" })
        }

        await User.updateChatBehavior(req.body, req.user);
        return res
                .status(200)
                .json({success: true, message: "Behavior Updated Successfully"})
    }

    return res.status(404).json({succes: false, message: "Error Updating User Information!"})
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
