require("dotenv").config()

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const  { User, connectDb } = require("../config/schema/schema")

connectDb()


//  logging the user in ( getting the token)

const getUserToken = async (req, res) => {
    const { email_uname, password } = req.body;

    const user = await User.findOne({ $or: [{username: email_uname}, {email: email_uname}]});

    const pwdMatches = user ? await bcrypt.compare(password, user.password) : false

    if (!user || (user && !pwdMatches)) {
        return res.status(401).json({error: "Incorrect Credential!"})
    } else {
        const token = jwt.sign(user.toObject(), process.env.ACCESS_TOKEN_SECRET);
        await User.findByIdAndUpdate(user._id, {isActive: true})
        return res.json({message: "Successfully Logged in!", token, user})
    }
}


// an auth for protected routes

const authenticateUser = async (req, res, next) => {

    const bearerHeader = req.headers["authorization"];

    try {
        if (bearerHeader) {
            const token = bearerHeader.split(" ")[1];
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return res
                            .status(403)
                            .json({ success: false, message: "Invalid Token!", token: null })
                }
                req.user = user
                next()
            })
        } else {
            return res
                    .status(401)
                    .json({ success: false, message: "Token is missing!" })
        }

    } catch {
        return res
                .status(401)
                .json({ success: false, message: "Please Login!" })
    }
}

module.exports = {
    getUserToken,
    authenticateUser
}