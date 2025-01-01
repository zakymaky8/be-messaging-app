require("dotenv").config()

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const  { User, connectDb } = require("../config/schema/schema")

connectDb()

const getUserToken = async (req, res) => {
    const { email_uname, password } = req.body;

    //  check existence
    const user = await User.findOne({ $or: [{username: email_uname}, {email: email_uname}]});

    const pwdMatches = user ? await bcrypt.compare(password, user.password) : false

    if (!user || (user && !pwdMatches)) {
        return res.status(401).json({error: "Incorrect Credential!"})
    } else {
        const token = jwt.sign(user.toObject(), process.env.ACCESS_TOKEN_SECRET);
        await User.findByIdAndUpdate(user._id, {isActive: true})
        return res.json({token, user})
    }
}



const authenticateUser = async (req, res, next) => {
    const bearerHeader = req.headers["authorization"];

    try {
        const token = bearerHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }
            req.user = user
            next()
        })
    } catch {
        return res.sendStatus(401)
    }
}

module.exports = {
    getUserToken,
    authenticateUser
}