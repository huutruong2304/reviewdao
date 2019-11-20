const localStrategy = require('passport-local').Strategy
const User = require('../models/user')
    // const flash = require('connect-flash')

module.exports = async(passport) => {
    //login feature
    passport.use('login', new localStrategy({
            passReqToCallback: true // khai báo thêm dòng này nếu muốn sử dụng và can thiệp vào req
        },
        (req, username, password, done) => {
            User.findOne({ username: username }, (error, user) => {
                //  nếu bị lỗi
                if (error) {
                    return done(err)
                }
                if (!user) {
                    return done(null, false, req.flash('message', 'User Not Found'))
                }
                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('message', 'Invalid Password'))
                }
                return done(null, user)
            })
        }
    ))

    //signup feature
    passport.use('signup', new localStrategy({
            passReqToCallback: true
        },
        (req, username, password, done) => {
            User.findOne({ username: username }, (error, user) => {
                if (error) {
                    return done(err)
                }
                if (user) {
                    return done(null, false, req.flash('message', 'User Already Exists'))
                } else {
                    const newUser = new User({...req.body })
                    console.log(newUser)
                    newUser.save(error => {
                        // if (error === null) {
                        //     return done(null, false, req.flash('message', 'Email Already Exists'))
                        // }
                        if (error) {
                            if (error.name === 'MongoError') {
                                return done(null, false, req.flash('message', 'Email Already Exists'))
                            }
                            // console.log(error)

                            // return 
                            const message = Object.keys(error.errors).map(key => error.errors[key].message)
                            console.log(message)
                            console.log(message.join('\n'))
                            return done(null, false, req.flash('message', message.join(' ')))
                        }
                        console.log(newUser)
                        return done(null, newUser)
                    })
                }
            })
        }
    ))


    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id, (error, user) => {
            done(error, user)
        })
    })
}