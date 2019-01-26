import jwt from 'jsonwebtoken'
import config from '../config'

export default (app) => {
    app.use('/admin/*', async (req, res, next) => {
        try {
            if (req.method === 'OPTIONS') { return next() }
            // check header or url parameters or post parameters for token
            const cookies = req.cookies
            console.log('cookies', cookies)
            const signedCookies = req.signedCookies
            console.log('signedCookies', signedCookies)
            // check if token is empty
            // if (!token) { return res.status(403).send({ message: 'Missing token.' }) }
            // // check if token is valid
            // const decoded = await jwt.verify(token, config.token.secret)
            // // continue
            // req.decoded = decoded
            next()
        } catch (e) {
            return res.status(401).send({ message: 'Failed to authenticate token.' })
        }
    })
}
