const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
        min:3,
        max:50
    },
    lastName: {
        type: String
        
    },
    emailId: {
        type: String,
        required:true,
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

module.exports = mongoose.model("User", userSchema);

