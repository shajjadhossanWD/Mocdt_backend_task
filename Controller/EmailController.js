const nodemailer = require('nodemailer');
const Email = require('../Model/EmailModels');
const User = require('../Model/UserSignUpSignInModel');

const sendEmail = async (req, res) => {
  try {
    const { recipient, subject, body } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    console.log("to : " + recipient)
    console.log("subject : " + subject)
    console.log("body : " + body)
    console.log("to : " + userId)

    // Check if recipient exists
    const recipientUser = await User.findOne({ email: recipient });

    if (!recipientUser) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: user.email,
        pass: user.imapPassword,
      },
    });

    await transporter.sendMail({
      from: user.email,
      to: recipient,
      subject,
      text: body,
    });

    // Save email to the database
    const email = new Email({
      userId,
      subject,
      body,
      recipient,
      from: user.email
    });

    await email.save();

    res.status(201).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
    console.log(error);
  }
};


const getAllEmails = async (req, res) => {
  try {
    const emails = await Email.find();
    return res.status(200).json(emails);
  } catch (error) {
    console.error("Error getting emails:", error);
    return res.status(500).json({
      message: "An error occurred while fetching emails.",
    });
  }
};

const getEmailById = async (req, res) => {
  const emailId = req.params.id;
  try {
    const email = await Email.findById(emailId);
    if (!email) {
      return res.status(404).json({
        message: "Email not found.",
      });
    }
    return res.status(200).json(email);
  } catch (error) {
    console.error("Error getting email:", error);
    return res.status(500).json({
      message: "An error occurred while fetching the email.",
    });
  }
};

const deleteEmailById = async (req, res) => {
  const emailId = req.params.id;
  try {
    const deletedEmail = await Email.findByIdAndDelete(emailId);
    if (!deletedEmail) {
      return res.status(404).json({
        message: "Email not found.",
      });
    }
    return res.status(200).json({
      message: "Email deleted successfully.",
      deletedEmail: deletedEmail,
    });
  } catch (error) {
    console.error("Error deleting email:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the email.",
    });
  }
};

const getAllByEmailRecipient = async (req, res) => {
  const recipientEmail = req.params.recipient;
  try {
    const emails = await Email.find({ recipient: recipientEmail });
    return res.status(200).json(emails);
  } catch (error) {
    console.error("Error getting emails by recipient:", error);
    return res.status(500).json({
      message: "An error occurred while fetching emails by recipient.",
    });
  }
};


const sendReplyEmail = async (req, res) => {

  console.log("hitteddddd")
  try {
    const emailId = req.params.emailId;
    const { body } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    // Find the original email
    const originalEmail = await Email.findById(emailId);

    console.log("originalEmailmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm " + originalEmail)

    if (!originalEmail) {
      return res.status(404).json({ error: "Original email not found" });
    }

    // Send reply email using nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: user.email,
        pass: user.imapPassword,
      },
    });

    await transporter.sendMail({
      from: user.email,
      to: originalEmail.from,
      subject: `Re: ${originalEmail.subject}`,
      text: body,
    });

    // Save the reply email to the database
    const replyEmail = new Email({
      userId,
      subject: `Re: ${originalEmail.subject}`,
      body,
      recipient: originalEmail.from,
      from: user.email,
      parentEmail: emailId, // Store the ID of the original email
    });

    await replyEmail.save();

    res.status(201).json({ message: "Reply email sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
    console.log(error);
  }
};


const searchByEmailSender = async (req, res) => {
  try {
    const senderEmail = req.params.senderEmail;
    const emails = await Email.find({ from: senderEmail });

    return res.status(200).json(emails);
  } catch (error) {
    console.error("Error searching emails by sender:", error);
    return res.status(500).json({
      message: "An error occurred while searching emails by sender.",
    });
  }
};



module.exports = {
  sendEmail,
  searchByEmailSender,
  getAllEmails,
  getEmailById,
  deleteEmailById,
  getAllByEmailRecipient,
  sendReplyEmail
};
