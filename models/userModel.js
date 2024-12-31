const { User, ChatsPair, Chat } = require("../config/schema/schema");
const bcrypt = require("bcrypt")


module.exports = {
    getChattedUsersWithCurrentUser: async (user_id) => {
        const { chattedUsers } = await User.findById(user_id);
        const CHATTED_USERS = chattedUsers.length ? Promise.all(chattedUsers.map(async userId => await User.findById(userId))) : []
        return CHATTED_USERS;
    },

    registerUser: async (entries) => {
        const userExists = await User.findOne({username: entries.username});
        const email = await User.findOne({email: entries.email});
        if (userExists?.username) {
            return false
        }
        const user = new User({
            firstName: entries.firstname,
            lastName: entries.lastname,
            username: entries.username,
            password: await bcrypt.hash(entries.password, 10),
            email: entries.email,
            allowedUsersToChat: [],
            isActive: false,
            chattedUsers: [],
            preferences: {
                alowedChats: "everyone",
                theme: "light",
                canTheySearchYou: true
            }
        })
        await user.save()
        return true
    },

    getUsersWithSearchKey: async (search_key) => {
        const user = await User.findOne({username: search_key});
        if (user && user.preferences.canTheySearchYou) {
            return user
        } else {
            return {}
        }
    },
    getSingleUser: async (user_id) => {
        const user = await User.findById(user_id);
        return user;
    },
    // getTargetedUserForChat: async (targeted_user_id) => {
    //     const targetedUser = await User.findById(targeted_user_id)
    //     return targetedUser
    // },

    deleteAllUser: async () => {
        await User.deleteMany()
    },
    getUsers: async () => {
        console.log(await User.find())
    },
    makeUserOffline: async (user_id) => {
        await User.findByIdAndUpdate(user_id, { isActive: false })
    },
    makeUserOnline: async (user_id) => {
        await User.findByIdAndUpdate(user_id, { isActive: true })
    },
    updateChatBehavior: async (entries, user) => {
        const { theme, allowed_chats, allow_search, selectedUsersForChat } = entries;
        const userCurrent = await User.findById(user._id);

        userCurrent.preferences.theme = theme;
        userCurrent.preferences.alowedChats = allowed_chats;
        userCurrent.preferences.canTheySearchYou = allow_search === "allow" ? true : false
        userCurrent.allowedUsersToChat = selectedUsersForChat
        await userCurrent.save()
        // await User.findByIdAndUpdate(user._id, {
        //     allowedUsersToChat: selectedUsersForChat,
        //     $set: {
        //             "preferences.theme": theme,
        //             "preferences.alowedChats": allowed_chats,
        //             "preferences.canTheySearchYou": allow_search === "allow" ? true : false
        //         },
        // })
    },
    updateBasicInfo: async (entries, user) => {
        const userExists = await User.findOne({ $or: [{username: entries.username}, {email: entries.email}]})
        if (!userExists._id.equals(user._id)) {
            return false
        }
        await User.findByIdAndUpdate(user._id, {
            firstName: entries.firstname,
            lastName: entries.lastname,
            username: entries.username, // check validations constraints for username
            email: entries.email // check validations constraints for email
        })
        return true
    },
    updatePassword: async (entries, user) => {
        const  { old_password, new_password } = entries;
        const realUser = await User.findById(user._id);
        const matches = await bcrypt.compare(old_password, realUser.password);

        if (matches) {
            const new_pwd = await bcrypt.hash(new_password, 10);
            await User.findByIdAndUpdate(user._id, {
                password: new_pwd
            })
            return true
        } else {
            return false
        }
    },
    getUser: async () => {
        console.log(await User.findOne({username: "uname"}))
    },

    getMultipleUsersById: async (bodyData) => {
        console.log(bodyData)
        const multipleUsers = await Promise.all(bodyData.users.map(async id => {
            return await User.findById(id)
        }))
        return multipleUsers
    },
    operateDeleteChat: async (current, target) => {

        const currentUser = await User.findById(current);
        const targetUser = await User.findById(target);

        const newChatListForCurrent = currentUser.chattedUsers.filter(user => !user.equals(target))
        const newChatListForTarget = targetUser.chattedUsers.filter(user => !user.equals(current))

        currentUser.chattedUsers = newChatListForCurrent
        targetUser.chattedUsers = newChatListForTarget

        await currentUser.save();
        await targetUser.save();


        const chatPair = await ChatsPair.findOne({ userPair: {$all: [current, target] }});

        await Promise.all(chatPair.chats.map(async chat => await Chat.findByIdAndDelete(chat)))
        await ChatsPair.findOneAndDelete({userPair: {$all: [current, target] }});

        const { chattedUsers } = await User.findById(current);
        const CHATTED_USERS = chattedUsers.length ? Promise.all(chattedUsers.map(async userId => await User.findById(userId))) : []
        return CHATTED_USERS;
    }
}

// module.exports.getUser()
// module.exports.operateDeleteChat()



