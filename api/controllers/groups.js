const User = require("../models/user");
const Group = require("../models/group");
const GroupMessage = require("../models/groupMessage");
const asyncwrapper = require("../middleware/aysnc");
const { createCustomError } = require("../error/customErrorHandler");

//endpoint to getting user groups
const getUserGroups = asyncwrapper(async (req, res, next) => {
  try {
    const loggedInUserId = req.params.userId;

    // Query the database to find groups where the user is a member
    const userGroups = await Group.find({ members: loggedInUserId })
      .populate("members", "name email image")
      .exec();

    res.status(200).json(userGroups);
  } catch (error) {
    console.error(error);
    return next(createCustomError(`Internal Server Error`, 500));
  }
});

//end points to create new groups
const createNewGroup = asyncwrapper(async (req, res, next) => {
  try {
    const { groupName, memberIds } = req.body;

    // Create a new group document in your MongoDB
    const group = new Group({
      name: groupName,
      members: memberIds,
    });

    // Save the group document
    await group.save();

    // Update the user documents to include the group
    for (const memberId of memberIds) {
      const user = await User.findById(memberId);
      user.groups.push(group); // Add the group to the user's groups
      await user.save();
    }

    res.status(201).json({ message: "Group created successfully" });
  } catch (error) {
    console.error(error);
    return next(createCustomError(`Internal Server Error`, 500));
  }
});

//endpoint for deleting user group
const deleteGroupMessages = asyncwrapper(async (req, res, next) => {
  const messageIds = req.body.messageIds;

  try {
    // Check if there are message IDs provided
    if (!messageIds || messageIds.length === 0) {
      return res.status(400).json({ error: "No message IDs provided" });
    }

    // Delete messages by their IDs
    await GroupMessage.deleteMany({ _id: { $in: messageIds } });

    // Update the corresponding group's messages array
    const groupId = req.body.groupId; // Assuming you send the groupId in the request body
    if (groupId) {
      await Group.findByIdAndUpdate(
        groupId,
        { $pull: { messages: { _id: { $in: messageIds } } } },
        { new: true }
      );
    }

    // Optionally, you can send a success response
    res.status(200).json({ message: "Messages deleted successfully" });
  } catch (error) {
    console.error(error);
    return next(createCustomError(`Internal Server Error`, 500));
  }
});

//endpoint for adding new members to the group
const addMembers = asyncwrapper(async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { memberIds } = req.body; // An array of user IDs to add

    // Find the group document by its ID
    const group = await Group.findById(groupId);

    if (!group) {
      return next(createCustomError(`Group not found`, 404));
    }

    // Add member IDs to the group's members array
    group.members.push(...memberIds);
    await group.save();

    // Update the user documents to include the group ID
    await User.updateMany(
      { _id: { $in: memberIds } },
      { $addToSet: { groups: groupId } }
    );

    res
      .status(200)
      .json({ message: "Members added to the group successfully" });
  } catch (error) {
    console.error(error);
    return next(createCustomError(`Internal Server Error`, 500));
  }
});

//endpoint for getting group Messages
const getGroupMessage = asyncwrapper(async (req, res, next) => {
  try {
    const { groupId } = req.params;

    // Find the group document by its ID
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Retrieve all messages associated with the group ID
    const messages = await GroupMessage.find({ _id: { $in: group.messages } });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    return next(createCustomError(`Internal server error`, 500));
  }
});

//endpoint for posting group Messages
const postGroupMessage = asyncwrapper(async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { senderId, messageType, messageText } = req.body;

    // Create a new message document
    const newMessage = new GroupMessage({
      groupId,
      senderId,
      messageType,
      message: messageText,
      timestamp: new Date(),
      imageUrl: messageType === "image" ? req.file.path : null,
    });

    // Find the group document by its ID
    const group = await Group.findById(groupId);

    if (!group) {
      return next(createCustomError(`Group not found`, 404));
    }

    // Add the new message to the group's message array
    group.messages.push(newMessage);

    // Save the new message and update the group document
    await newMessage.save();
    await group.save();

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    return next(createCustomError(`Internal server error`, 500));
  }
});

const getGroupLastMessage = asyncwrapper(async (req, res, next) => {
  try {
    const { groupId } = req.params;

    // Find the group by its ID
    const group = await Group.findById(groupId);

    if (!group) {
      return next(createCustomError(`Group not found`, 404));
    }

    // Find the last message for the specified group
    const lastMessage = await GroupMessage.findOne(
      { groupId: group._id },
      {},
      { sort: { timestamp: -1 } } // Sort by timestamp in descending order to get the latest message
    ).populate("senderId", "name"); // Populate sender details

    if (!lastMessage) {
      return next(createCustomError(`No messages found for this group`, 404));
    }

    // Send the last message and sender details
    res.status(200).json({
      groupId: group._id,
      groupName: group.name,
      lastMessage: lastMessage.message,
      lastMessageTimestamp: lastMessage.timestamp,
      lastMessageSender: lastMessage.senderId,
      lastMessageType: lastMessage.messageType,
    });
  } catch (error) {
    console.error(error);
    return next(createCustomError(`Internal server error`, 500));
  }
});

module.exports = {
  getUserGroups,
  createNewGroup,
  deleteGroupMessages,
  addMembers,
  getGroupMessage,
  postGroupMessage,
  getGroupLastMessage,
};
