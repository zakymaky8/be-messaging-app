const { User, ChatsPair, Chat, connectDb } = require("../config/schema/schema");
const bcrypt = require("bcrypt")

connectDb();

module.exports = {
    getChattedUsersWithCurrentUser: async (user_id) => {
        const { chattedUsers } = await User.findById(user_id);
        const CHATTED_USERS =
                    chattedUsers.length ?
                        Promise.all(chattedUsers.map(async userId => await User.findById(userId))) : []
        return CHATTED_USERS;
    },

    registerUser: async (entries) => {
        const userExists = await User.findOne({username: entries.username});
        const email = await User.findOne({email: entries.email});
        if (userExists?.username || email?.email) {
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

    getUsersWithSearchKey: async (search_key, seeker) => {
        const user = await User.findOne({username: search_key});
        const isMe = user ? seeker.username === user.username : false

        if (user && user.preferences.canTheySearchYou && !isMe) {
            delete user.password
            return { found: true, user, allowed: true }
        }

        else if (!user || isMe){
            return { found: false, user: null, allowed: null }
        }

        else if (user && !user.preferences.canTheySearchYou) {
            return { found: true, user: null, allowed: false }
        }

        return { found: null, user: null, allowed: null }
    },


    getSingleUser: async (user_id) => {
        const user = await User.findById(user_id);
        return user;
    },

    deleteAllUser: async () => {
        await User.deleteMany()
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
        userCurrent.allowedUsersToChat = [...selectedUsersForChat]

        await userCurrent.save()
    },
    updateBasicInfo: async (entries, userId) => {

        const { username: initUname, email: initEmail }= await User.findById(userId);

        if (initUname !== entries.username || initEmail !== entries.email) {
            const userExists = await User.findOne({ $and: [{username: entries.username}, {email: entries.email}]})
            if (userExists) {
                return false
            }
            await User.findByIdAndUpdate(userId, {
                firstName: entries.firstname,
                lastName: entries.lastname,
                username: entries.username,
                email: entries.email
            })
            const updatedUser = await User.findById(userId)
            return updatedUser
        }

        if (initUname !== entries.username) {

        }

        await User.findByIdAndUpdate(userId, {
            firstName: entries.firstname,
            lastName: entries.lastname,
            username: entries.username,
            email: entries.email
        })
        const updatedUser = await User.findById(userId)
        return updatedUser
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

    getUser: async (user_id) => {
        return await User.findById(user_id)
    },

    getMultipleUsersById: async (bodyData) => {
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

        await Promise.all(chatPair.chats.map(chat => Chat.findByIdAndDelete(chat)))
        await ChatsPair.findOneAndDelete({userPair: {$all: [current, target] }});
    }
}
