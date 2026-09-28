const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
        trim: true,
        min:3,
        max:50
    },
    lastName: {
        type: String
        
    },
    emailId: {
        type: String,
        required:true,
        trim: true,
        unique:true,
        lowercase: true,
        trim: true,
        validate(value) {
            if  (!validator.isEmail(value)){
                throw new Error("Please enter a valid email id");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
           if (!validator.isStrongPassword(value)) {
                throw new Error("Please enter a strong password");
            }
        }
        
    },
    age: {
        type: Number,
        min : 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        },
    },
    photoUrl: {
        type: String,
        default: "https://www.nicepng.com/png/full/136-1366211_group-of-10-guys-login-user-icon-png.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo URL: "+value+".\n Please enter a valid URL")
            }
            }
    },
    about : {
        type: String,
        default: "This is a default about of a user!",
    },
    skills: {
        type : [String],
        validate: {
        validator: function(value) {
            return value.length <= 10;
        },
        message: "You can add a maximum of 10 skills."
    }
        
    },
},
{
    timestamps: true,
}
);


userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({_id : user._id}, "#Devtinder999", 
                     { expiresIn: '1d' });
    
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    
    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );
    return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
