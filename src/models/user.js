const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: [4, 'Your username cannot be shorter than 4 characters']

        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: [6, 'Your password cannot be shorter than 6 characters'],
            trim: true
        },
        address: {
            type: String,
            required: true,
            maxlength: [100, 'Your address cannot be longer than 100 characters']
        },
        lastName: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        description: {
            type: String,
            maxlength: [200, 'Your description cannot be longer than 100 characters']
        },
        avatar: {
            type: String,
        }
    }, {
        timestamps: true
    })
    // khởi tạo tokens
    // userSchema.virtual(
    //     'posts', {
    //         ref: 'Posts',
    //         localField: '_id',
    //         foreignField: 'author'
    //     }
    // )

userSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName
})

userSchema.virtual('fullName').set(function(name) {
    let str = name.split(' ')
    this.firstName = str[0]
    this.lastName = str[1]
})

// giấu/ giới hạn loại dữ liệu được trả về dưới dạng JSON 
userSchema.methods.toJSON = function() {
    const user = this
        // chuyển user thành object
    const userObject = user.toObject()
        // những biến dữ liệu không muốn trả về
    delete userObject.password
    return userObject
}


// với các hàm dựa vào methods, statics chúng ta ko nên dùng kiểu viết arrow function
// kiểm tra password
userSchema.methods.validPassword = function(password) {
    const user = this
        // console.log(password)
        // console.log(user)
        // const user = await User.findOne({ username: username })
    const isMatch = bcrypt.compareSync(password, user.password)
        // console.log(isMatch)
    return isMatch
}


// sẽ xữ lí trước khi save
userSchema.pre('save', function(next) {
    const user = this

    // kiểm tra xem mật khẩu có bị thay đổi ko. vì mật khẩu có thể dc cấp nhật, thay đổi bởi người dùng. Nếu mk ko có thay đổi gì thì ko cần hash lại tốn thời gian
    if (user.isModified('password')) {
        user.password = bcrypt.hashSync(user.password, 8)
    }

    next()
})



const User = mongoose.model('User', userSchema)
module.exports = User