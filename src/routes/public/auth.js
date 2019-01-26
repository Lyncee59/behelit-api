import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../../config'
import { isNil } from 'ramda'

export default (app, database) => {
    app.post('/token', async (req, res) => {
        try {
            const { username, password } = req.body
            const user = await database.collection('users').findOne({ 'username': username })
            if (isNil(user)) throw new Error(`Error: invalid user`)
            const isPasswordValid = await bcrypt.compare(password, user.hash)
            if (!isPasswordValid) throw new Error(`Error: password invalid for user [${username}]`)
            const payload = {
                user: user.username,
                isAdmin: user.isAdmin
            }
            const token = await jwt.sign(payload, config.token.secret)

            const cookieOptions = {
                domain: config.cookie.domain,
                path: '/',
                maxAge: 1000 * 60 * 15,
                httpOnly: true,
                signed: true,
                secure: true
            }

            res.cookie(config.cookie.name, token, cookieOptions)
            res.status(200).send({ 'result': 'Authentication successful!' })
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })
}
