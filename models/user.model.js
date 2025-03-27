import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, "Please enter a valid email address"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter valid email address'],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
    }

}, {timestamps: true} );

const User = mongoose.model("User", userSchema);

export default User;
