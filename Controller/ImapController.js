const Imap = require('node-imap');
const simpleParser = require('mailparser').simpleParser;
const User = require('../Model/UserSignUpSignInModel');
const Email = require('../Model/EmailModels');

exports.fetchEmails = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user's email credentials from the database
    const user = await User.findById(userId);
     
    console.log("userrrrr emailllll: " + user.email)
    // Connect to the user's mailbox using node-imap
    const imap = new Imap({
      user: user.email,
      password: user.imapPassword, 
      host: 'imap.gmail.com', //  IMAP server host
      port: 993,
      tls: true,
    });

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, mailbox) => {
        if (err) {
          imap.end();
          console.log("Error opening mailbox:", err);
          return res.status(500).json({ error: 'Error opening mailbox' });
        }

        const searchCriteria = ['UNSEEN'];
        const fetchOptions = {
          bodies: ['HEADER', 'TEXT'],
          markSeen: true,
        };

        const fetch = imap.search(searchCriteria, (fetchErr, results) => {
          if (fetchErr) {
            imap.end();
            console.log("Error fetching emails:", fetchErr);
            return res.status(500).json({ error: 'Error fetching emails' });
          }

          const emailPromises = results.map(result => {
            return new Promise((resolve, reject) => {
              const fetchStream = imap.fetch(result, fetchOptions);

              fetchStream.on('message', async (msg, seqno) => {
                const email = { userId, seen: true };

                msg.on('body', async (stream, info) => {
                  try {
                    const parsed = await simpleParser(stream);
                    const subject = parsed.subject || 'No Subject'; // Set default if subject is missing
                    const body = parsed.text || 'No body'; // Set default if subject is missing

                    const email = new Email({
                      userId,
                      subject, // Use the subject value
                      body,                    
                      recipient: user.email, 
                    });
                    await email.save();
                    resolve();
                  } catch (parseErr) {
                    console.log("Error parsing email:", parseErr);
                    reject(parseErr);
                  }
                });

                msg.once('end', () => {
                  resolve();
                });
              });

              fetchStream.once('error', fetchErr => {
                console.log("Error fetching stream:s", fetchErr);
                reject(fetchErr);
              });
            });
          });

          Promise.all(emailPromises)
            .then(() => {
              imap.end();
              res.json({ message: 'Emails fetched and saved successfully' });
            })
            .catch(error => {
              imap.end();
              console.log("Error saving fetched emails11:", error);
              res.status(500).json({ error: 'Error saving fetched emails' });
            });
        });
      });
    });

    imap.once('error', imapErr => {
      console.log("IMAP connection error3:", imapErr);
      res.status(500).json({ error: 'IMAP connection error' });
    });

    imap.connect();
  } catch (error) {
    console.log("An error occurred:", error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
