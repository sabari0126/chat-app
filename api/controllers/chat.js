const User = require("../models/user");
const Message = require("../models/message");
const asyncwrapper = require("../middleware/aysnc");
const { createCustomError } = require("../error/customErrorHandler");

// endpoint to access all the users except the user who's is currently logged in!
const getUsers = asyncwrapper(async (req, res, next) => {
  const loggedInUserId = req.params.userId;

  User.find({ _id: { $ne: loggedInUserId } })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log("Error retrieving users", err);
      return next(createCustomError(`Error retrieving users`, 500));
    });
});

//endpoint to show all the friend-requests of a particular user
const getAllFriendRequests = asyncwrapper(async (req, res, next) => {
  try {
    const { userId } = req.params;

    //fetch the user document based on the User id
    const user = await User.findById(userId)
      .populate("freindRequests", "name email image")
      .lean();

    const freindRequests = user.freindRequests;

    res.json(freindRequests);
  } catch (error) {
    console.log(error);
    return next(createCustomError(`Internal Server Error`, 500));
  }
});

//endpoint to send a request to a user
const sendFriendRequest = asyncwrapper(async (req, res, next) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    //update the recepient's friendRequestsArray!
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { freindRequests: currentUserId },
    });

    //update the sender's sentFriendRequests array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequests: selectedUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    return next(createCustomError(`Internal Server Error`, 500));
  }
});

//endpoint to get all friend request to a user
const getAllSentFriendRequest = asyncwrapper(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("sentFriendRequests", "name email image")
      .lean();

    const sentFriendRequests = user.sentFriendRequests;

    res.json(sentFriendRequests);
  } catch (error) {
    console.log("error", error);
    return next(createCustomError(`Internal Server Error`, 500));
  }
});

//endpoint to get all friends list
const getAllFriends = asyncwrapper(async (req, res, next) => {
  try {
    const { userId } = req.params;

    User.findById(userId)
      .populate("friends")
      .then((user) => {
        if (!user) {
          return next(createCustomError(`User not found`, 500));
        }

        const friendIds = user.friends.map((friend) => friend._id);

        res.status(200).json(friendIds);
      });
  } catch (error) {
    console.log("error", error);
    return next(createCustomError(`Internal Server Error`, 500));
  }
});

//endpoint to accept a friend-request of a particular person
const acceptFriendRequest = asyncwrapper(async (req, res, next) => {
  try {
    const { senderId, recepientId } = req.body;

    //retrieve the documents of sender and the recipient
    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);

    sender.friends.push(recepientId);
    recepient.friends.push(senderId);

    recepient.freindRequests = recepient.freindRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );

    sender.sentFriendRequests = sender.sentFriendRequests.filter(
      (request) => request.toString() !== recepientId.toString
    );

    await sender.save();
    await recepient.save();

    res.status(200).json({ message: "Friend Request accepted successfully" });
  } catch (error) {
    console.log(error);
    return next(createCustomError(`Internal Server Error`, 500));
  }
});

//endpoint to access all the friends of the logged in user!
const getAcceptedFriendsList = asyncwrapper(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "friends",
      "name email image"
    );
    const acceptedFriends = user.friends;
    res.json(acceptedFriends);
  } catch (error) {
    console.error(error);
    return next(createCustomError(`Internal Server Error`, 500));
  }
});

//endpoint to fetch the messages between two users in the chatRoom
const getUserMessage = asyncwrapper(async (req, res, next) => {
  try {
    const { senderId, recepientId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate("senderId", "_id name");

    res.json(messages);
  } catch (error) {
    console.log(error);
    return next(createCustomError(`Internal Server Error`, 500));
  }
});

///endpoint to get the userDetails to design the chat Room header
const getUserDetails = asyncwrapper(async (req, res, next) => {
  try {
    const { userId } = req.params;

    //fetch the user data from the user ID
    const recepientId = await User.findById(userId);

    res.json(recepientId);
  } catch (error) {
    console.log(error);
    return next(createCustomError(`Internal Server Error`, 500));
  }
});

//endpoint to delete the messages!
const deleteMessage = asyncwrapper(async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return next(createCustomError(`invalid req body!`, 400));
    }

    await Message.deleteMany({ _id: { $in: messages } });

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log(error);
    return next(createCustomError(`Internal Server Error`, 500));
  }
});

//endpoint to post Messages and store it in the backend
const postMessages = asyncwrapper(async (req, res, next) => {
  try {
    const { senderId, recepientId, messageType, messageText } = req.body;

    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      message: messageText,
      timestamp: new Date(),
      imageUrl: messageType === "image" ? req.file.path : null,
    });

    await newMessage.save();
    res.status(200).json({ message: "Message sent Successfully" });
  } catch (error) {
    console.log(error);
    return next(createCustomError(`Internal Server Error`, 500));
  }
});

module.exports = {
  getUsers,
  getAllFriendRequests,
  sendFriendRequest,
  getAllSentFriendRequest,
  getAllFriends,
  acceptFriendRequest,
  getAcceptedFriendsList,
  getUserMessage,
  getUserDetails,
  deleteMessage,
  postMessages,
};
