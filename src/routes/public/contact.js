import { sendContact } from '../../services/mail'

export default (app, services) => {
    app.post('/contact', (req, res) => {
        try {
            const { subject, name, address, message } = req.body
            sendContact(subject, name, address, message)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not send email.' })
        }
    })
}
