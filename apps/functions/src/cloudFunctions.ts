import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { UserRecord } from 'firebase-functions/lib/providers/auth';
import * as nodemailer from 'nodemailer';
import { app } from './app';

const expressServer = express();

const createServer = async () => {
  await app(new ExpressAdapter(expressServer)).then(nestServer => nestServer.init());
};

createServer();
exports.webApi = functions.https.onRequest(expressServer);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().mail.auth.user, // gmail user
    pass: functions.config().mail.auth.pass // gmail generated password
  }
});

const sendMailToAdmin = function (message: { subject: string; body: string }) {
  return transporter.sendMail({
    from: functions.config().mail.admin.from,
    to: functions.config().mail.admin.to,
    subject: message.subject,
    html: message.body
  });
};

const sendWelcomeEmail = function (user: UserRecord) {
  // const dest = user.email;
  // const displayName = user.displayName;

  // const mailOptions = {
  //   from: functions.config().mail.from, // contact email adresse
  //   to: dest,
  //   subject: `Welcome!`,
  //   html: `Welcome ${displayName}`
  // };

  return sendMailToAdmin({ subject: `New user`, body: `${JSON.stringify(user)}` });
  //.then(() =>
  //  transporter.sendMail(mailOptions)
  //)
};

exports.userOnCreate = functions.auth.user().onCreate((user: UserRecord) => {
  return sendWelcomeEmail(user);
});
