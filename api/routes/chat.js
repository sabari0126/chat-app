const express = require("express");
const router = express.Router();
const { loginUser, registerUser } = require("../controllers/auth");
const {
  getUserGroups,
  createNewGroup,
  deleteGroupMessages,
  addMembers,
  getGroupMessage,
  postGroupMessage,
  getGroupLastMessage,
} = require("../controllers/groups");

const {
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
} = require("../controllers/chat");

const multer = require("multer");

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// routes for login and register
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);

// routes for one to one user
router.route("/users/:userId").get(getUsers);
router.route("/friend-request/:userId").get(getAllFriendRequests);
router.route("/friend-request").post(sendFriendRequest);
router.route("/friend-requests/sent/:userId").get(getAllSentFriendRequest);
router.route("/friends/:userId").get(getAllFriends);
router.route("/friend-request/accept").post(acceptFriendRequest);
router.route("/accepted-friends/:userId").get(getAcceptedFriendsList);
router.route("/messages/:senderId/:recepientId").get(getUserMessage);
router.route("/user/:userId").get(getUserDetails);
router.route("/deleteMessages").post(deleteMessage);
router.route("/messages").post(upload.single("imageFile"), postMessages);

// routes for groups
router.route("/groups/:userId").get(getUserGroups);
router.route("/groups").post(createNewGroup);
router.route("/groups/messages").post(deleteGroupMessages);
router.route("/groups/:groupId/last-message").get(getGroupLastMessage);
router.route("/addMembers/:groupId").put(addMembers);
router
  .route("/groupMessages/:groupId")
  .get(getGroupMessage)
  .post(upload.single("imageFile"), postGroupMessage);

module.exports = router;
