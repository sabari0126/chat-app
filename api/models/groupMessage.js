const mongoose = require("mongoose");

const groupMessageSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messageType: {
    type: String,
    enum: ["text", "image"],
    required: true,
  },
  message: String, // Text message content
  imageUrl: String, // URL for image messages
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const groupMessage = mongoose.model("groupMessage", groupMessageSchema);

module.exports = groupMessage;
