import * as functions from 'firebase-functions';
import { UserRecord } from 'firebase-functions/lib/providers/auth';
import * as nodemailer from 'nodemailer';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello World!');
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().mail.auth.user, // gmail user
    pass: functions.config().mail.auth.pass // gmail generated password
  }
});

const sendMailToAdmin = function(message: { subject: string; body: string }) {
  return transporter.sendMail({
    from: functions.config().mail.admin.from,
    to: functions.config().mail.admin.to,
    subject: message.subject,
    html: message.body
  });
};

const sendWelcomeEmail = function(user: UserRecord) {
  const dest = user.email;
  const displayName = user.displayName;

  const mailOptions = {
    from: functions.config().mail.from, // contact email adresse
    to: dest,
    subject: `Welcome!`,
    html: `Welcome ${displayName}`
  };

  return sendMailToAdmin({ subject: `New user`, body: `email: ${user.email}<br>displayName: ${user.displayName}` }).then(() =>
    transporter.sendMail(mailOptions)
  );
};

exports.userOnCreate = functions.auth.user().onCreate((user: UserRecord) => {
  return sendWelcomeEmail(user);
});
