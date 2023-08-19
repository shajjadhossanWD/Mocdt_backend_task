const express = require("express");
const router = express.Router();
const { 
    sendEmail, 
    getAllEmails, 
    getEmailById, 
    deleteEmailById, 
    getAllByEmailRecipient,
    sendReplyEmail,
    searchByEmailSender
    } = require("../Controller/EmailController");

const {fetchEmails} = require("../Controller/ImapController");

const auth = require("../Middleware/SignUpSignInMiddleware");


router.post("/reply/:emailId", auth, sendReplyEmail);
router.get("/search/by-sender/:senderEmail", searchByEmailSender);
router.post("/send-email", auth, sendEmail);
router.get('/fetch-email', auth, fetchEmails);
router.get("/", getAllEmails);
router.get("/:id", getEmailById);
router.get('/recipient/:recipient', getAllByEmailRecipient);
router.delete("/:id", deleteEmailById);


module.exports = router;
