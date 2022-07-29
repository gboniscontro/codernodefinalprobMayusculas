const passport = require("passport");
const local = require('passport-local')
const { MONGO_URI } = require('./config/globals')
const { createHash, isValidPassword } = require('./utils.js')


const mongoose = require('mongoose')
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => console.log('Connected users'))
const users = require('./models/User.js')




const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use(
        'register',
        new LocalStrategy(
            { passReqToCallback: true },
            async (req, username, password, done) => {
                try {
                    let user = await users.findOne({ username })
                    if (user) return done(null, false)
                    const newUser = {
                        username,
                        password: createHash(password),
                        email: req.body.email,
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        address: req.body.address,
                        age: req.body.age
                    }
                    try {
                        let result = await users.create(newUser)
                        return done(null, result)
                    } catch (err) {
                        // console.log(err)
                        done(err)
                    }
                } catch (err) {
                    // console.log(err)
                    done(err)
                }
            }
        )
    )

    passport.use(
        'login',
        new LocalStrategy(
            async (username, password, done) => {
                try {
                    console.log(username)
                    let user = await users.findOne({ username: username })
                    console.log(user)
                    if (!user) return done(null, false, { message: "User does not exists" })
                    if (!isValidPassword(user, password)) return done(null, false, { message: "Invalid password" })
                    return done(null, user)
                } catch (err) {
                    done(err)
                }
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser((id, done) => {
        users.findById(id, done)
    })
}
module.exports = initializePassport
