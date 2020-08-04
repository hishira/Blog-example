const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)))
                throw new Error("Errror with email")
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        trim:true
    },
    role:{
        type:String,
        required:true,
        enum:["USER","ADMIN"],
        default:"USER"
    },
    description:{
        type:String,
        default:"",
        trim:true
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }
    ],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    watched:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
})
userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password'))
        user.password = await bcrypt.hash(user.password,8)
    next()
})
userSchema.methods.validatePassword = function(password){
    return bcrypt.compareSync(password,this.password)
}
const User = mongoose.model("User",userSchema)
module.exports = User