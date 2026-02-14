const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT } = process.env;
import nodemailer from "nodemailer";
import smtp from "nodemailer-smtp-transport";
import inlineBase64 from "nodemailer-plugin-inline-base64";

let transporter = nodemailer.createTransport(
  smtp({
    service: EMAIL_SERVICE,
    host: EMAIL_HOST, //hostname
    port: parseInt(EMAIL_PORT!),
    secure: false,
    auth: {
      user: EMAIL_USER, // generated ethereal user
      pass: EMAIL_PASS, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  }),
);
// console.log('count :>> ', transporter.listenerCount(''));
// transporter.close();
if (process.env.NODE_ENV !== "test")
  transporter.verify((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Ready to Send");
    }
  });

export const sendMail = async (recipients: Array<string>, subject: string, html: string) => {
  try {
    if (process.env.NODE_ENV !== "test") {
      console.log("hit sendMail");

      let approvedRecipients = [];
      approvedRecipients = [...new Set(recipients)];
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing

      // create reusable transporter object using the default SMTP transport

      // send mail with defined transport object
      transporter.use("compile", inlineBase64({ cidPrefix: "somePrefix_" }));
      let info = await transporter.sendMail({
        from: `solab Agents Support" <noreply@mail.com>`, // sender address
        to: approvedRecipients.join(", "), // list of receivers
        subject, // Subject line
        //   text: "Hello world?", // plain text body
        html, // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
  } catch (error) {
    console.log("error :>> ", error);
  }
};

export const getEmailAddressComponents = (emailAddress: string) => {
  return {
    name: emailAddress.substring(0, emailAddress.lastIndexOf("@")),
    domain: emailAddress.substring(emailAddress.lastIndexOf("@") + 1),
  };
};

// import sgMail from '@sendgrid/mail';

// const { SENDGRID_API_KEY } = process.env;


// sgMail.setApiKey(SENDGRID_API_KEY!);


// export const sendMail = async (recipients: string[], subject: string, html: string) => {
//   try {
//     if (process.env.NODE_ENV !== "test") {
//       console.log("hit sendMail");

//       const approvedRecipients = [...new Set(recipients)];

//       const msg = {
//         to: approvedRecipients, 
//         from: 'noreply@eadshortlets.com', 
//         subject: subject, 
//         html: html,
//       };

      
//       const response = await sgMail.sendMultiple(msg);

//       console.log("Message sent: %s", recipients);
//     }
//   } catch (error) {
//     console.error("Error sending email: %s", error);
//   }
// };


// export const getEmailAddressComponents = (emailAddress: string) => {
//   return {
//     name: emailAddress.substring(0, emailAddress.lastIndexOf("@")),
//     domain: emailAddress.substring(emailAddress.lastIndexOf("@") + 1),
//   };
// };
