import nodemailer from 'nodemailer'
import config from '../config'

const contactTemplate = (name, address, message) => `
<html>
  <body>
    <div style='padding:15px'>
      <span style='width:70px; font-size: 16px;font-weight:bold;'>Name:</span>
      <span style='font-size: 16px;'>${name}</span>
    </div>
    <div style='padding:15px'>
      <span style='width:70px; font-size: 16px;font-weight:bold;'>Email:</span>
      <span style='font-size: 16px;'>${address}</span>
    </div>
    <div style='padding:15px'>
      <span style='width:70px; font-size: 16px;font-weight:bold;'>Message:</span>
      <span style='font-size: 16px;'>${message}</span>
    </div>
  </body>
</html>
`
const sendHtmlEmail = (subject, body) => {
    const mailOptions = {
        from: config.from,
        to: config.to,
        subject: subject,
        html: body
    }

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    nodemailer.createTransport(config.smtp).sendMail(mailOptions, (err, info) => {
        if (err) { return console.log(err) }
        console.log('Message sent: %s', info.messageId)
    })
}

const sendContact = (subject, name, address, message) => {
    return sendHtmlEmail(subject, contactTemplate(name, address, message))
}

export {
    sendContact
}
