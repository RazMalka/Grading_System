const mongoose = require("mongoose");

let User = mongoose.model("User", {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, required: true },
    courses: { type: Array, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
}, 'Users');

module.exports = User;