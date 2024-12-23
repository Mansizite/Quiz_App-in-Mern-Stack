const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    score: { type: Number, required: true,default: 0 },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
