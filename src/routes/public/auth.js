import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../../config'

export default (app, database) => {
    app.post('/token', async (req, res) => {
        try {
            const { username, password } = req.body
            const user = await database.collection('users').findOne({ 'username': username })
            const isPasswordValid = await bcrypt.compare(password, user.hash)
            if (!isPasswordValid) throw new Error(`Error: password invalid for user [${username}]`)
            const payload = {
                user: user.username,
                isAdmin: user.isAdmin
            }
            const token = await jwt.sign(payload, config.secret)
            res.status(200).send({ token })
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })
}
