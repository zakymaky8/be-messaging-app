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
                minLength: 5,
                maxLength: 7
              },
    password: { type: String, required: true},

    email: {
                type: String,
                required: true,
                // validate: {
                //     validator: (val) => val.includes("@") ,
                //     message: props => "Ivalid email " + props.message
                // }
            },
    chattedUsers: [{type: mongoose.SchemaTypes.ObjectId, ref: "User"}],
    allowedUsersToChat: [{type: mongoose.SchemaTypes.ObjectId, ref: "User"}],
    isActive: {type: Boolean, default: false},
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
    user_id: {type: mongoose.SchemaTypes.ObjectId, ref: "User"},
    chatted_to: {type: mongoose.SchemaTypes.ObjectId, ref: "User"},
    messageText: String,
    createdAt: { type: Date, default: () => Data.now(), immutable: true },
    updatedAt: { type: Date, default: () => Data.now(), immutable: true },
    isUpdated: { type: Boolean, default: false }
})

//  chats pair schema to signify double user chats
const chatsPairSchema = new mongoose.Schema({
    userPair: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User"}],
    currentUser: { type: mongoose.SchemaTypes.ObjectId, ref: "User"},
    chattedUser: { type: mongoose.SchemaTypes.ObjectId, ref: "User"},
    chats: [{type: mongoose.SchemaTypes.ObjectId, ref: "Chat"}]
})

//  work on multiuser schema for making a group
// const User = mongoose.model("User", userSchema).fin



async function connectDb() {
    await mongoose.connect("mongodb://localhost/chatter")

}

module.exports = {
    User: mongoose.model("User", userSchema),
    Chat: mongoose.model("Chat", chatSchema),
    ChatsPair: mongoose.model("ChatPair", chatsPairSchema),
    Pref: mongoose.model("Pref", prefSchema),
    connectDb: connectDb
}