require("dotenv").config();

const mongoose = require("mongoose");

// user schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true},
    username: {
                type: String,
                required: true,
                unique: true,
                lowercase: true,
              },

    password: { type: String, required: true},

    email: { type: String, required: true},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date },
    profilePic: { type: String },
    savedMessages: { type: [mongoose.SchemaTypes.ObjectId] },

    isActive: {type: Boolean, default: false},

    allowedUsersToChat: [{type: mongoose.SchemaTypes.ObjectId, ref: "User"}],

    chattedUsers: [{type: mongoose.SchemaTypes.ObjectId, ref: "User"}],
    chatsWithOneUser:[{
                       user_id: mongoose.SchemaTypes.ObjectId,
                       chats: [mongoose.SchemaTypes.ObjectId]
                     }],
    //  consider adding dedicated document (eg. chatsWithOneUser: [chattedUser: {userId}, chats: [{chatId}]])
    //  to store chats with a particular user to
    // maintain selected end chat deletion.
    preferences: {
        alowedChats: { type: String, default: "everyone"}, // with-request, nobody selected_users
        theme: {type: String, default: "light"},
        canTheySearchYou: { type: Boolean, default: true }
    }
})
//  user preference schema
const prefSchema = new mongoose.Schema({
    user_id: {type: mongoose.SchemaTypes.ObjectId, ref: "User"},
    alowedChats: { type: String, default: "everyone"},
    theme: {type: String, default: "light"},
})

//  single chat schema
const chatSchema = new mongoose.Schema({
    // user pair userPair: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User"}]
    user_id: {type: mongoose.SchemaTypes.ObjectId, ref: "User"},
    chatted_to: {type: mongoose.SchemaTypes.ObjectId, ref: "User"},
    messageText: String,
    replied_to: {type: mongoose.SchemaTypes.ObjectId, ref: "Chat"},
    createdAt: { type: Date, default: () => Data.now(), immutable: true },
    updatedAt: { type: Date, default: () => Data.now()},
    isUpdated: { type: Boolean, default: false }
})

//  chats pair schema to signify double user chats
const chatsPairSchema = new mongoose.Schema({
    userPair: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User"}],
    // currentUser: { type: mongoose.SchemaTypes.ObjectId, ref: "User"},
    // chattedUser: { type: mongoose.SchemaTypes.ObjectId, ref: "User"},
    chats: [{type: mongoose.SchemaTypes.ObjectId, ref: "Chat"}]
})

// const alertSchema = new mongoose.Schema({
//     type: String,
//     message: String,
//     user_id: { type: String, ref: "User" }
// })

//  work on multiuser schema for making a group
// const User = mongoose.model("User", userSchema).fin



async function connectDb() {
    await mongoose.connect(process.env.DB_URL)

}

module.exports = {
    User: mongoose.model("User", userSchema),
    Chat: mongoose.model("Chat", chatSchema),
    ChatsPair: mongoose.model("ChatPair", chatsPairSchema),
    Pref: mongoose.model("Pref", prefSchema),
    connectDb: connectDb
}