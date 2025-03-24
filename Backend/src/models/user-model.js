import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'



const userSchema=mongoose.Schema(
    {
        fullname:{
            firstname:{
                type:String,
                required:true,
                minlength:[4,"Name should have atleast 4 characters"]
            },
            lastname:{
                type:String,
                minlength:[4,"Name should have atleast 4 characters"]
            }
        },
        email:{
            type:String,
            required:true,
            minlength:[5,"Email must have 5 characters"]
        },
        password:{
            type:String,
            required:true,
            select:false//THis wil not be returned when we find the user by find method
        },
        socketId:{
            type:String
        }
    }
)

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
});

userSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({
        _id:this._id
    },
    process.env.TOKEN_SECRET,
    {
        expiresIn:'24h'
    }
)
return token
}

userSchema.methods.checkPassword=async function(password){
    return await bcrypt.compare(password,this.password)
}

//Creating a model out of userSchema
export const userModel=mongoose.model("User",userSchema)