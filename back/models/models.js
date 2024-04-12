const mongoose = require('mongoose');


// Channel Model
const channelSchema = new mongoose.Schema({
    name: String,
}, { collection: 'channel', versionKey: false }); // Specify the collection name
channelSchema.index({ name: 1 });

const channel = mongoose.model('Channel', channelSchema);

// User Model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    accessibleChannels: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    }
}, { collection: 'users', versionKey: false }); // Specify the collection name
userSchema.index({ name: 1 });

const user = mongoose.model('users', userSchema);

// Message Model
const MessageSchema = new mongoose.Schema({
    message: String,
    sender: String,
    recipient: String,
    time: { type: Date, default: Date.now },
    channel: String
}, { collection: 'message', versionKey: false }); // Specify the collection name
MessageSchema.index({ channel: 1 });

const message = mongoose.model('message', MessageSchema);

module.exports = {
    channel,
    user,
    message,
};

