import { assoc, compose, dissoc, isNil, map, prop, sort } from 'ramda'
import moment from 'moment'

export default (app, database) => {
    app.get('/comments/:articleId', async (req, res) => {
        try {
            const id = req.params.articleId
            const comments = await database.collection('comments').find({ 'isPublished': true, 'articleId': id }).toArray()
            const sortedComments = sort(prop('createdAt'), comments)
            const transformTime = a => assoc('createdAt', moment(a.createdAt).format('DD/MM/YYYY HH:mm'), a)
            const transform = compose(
                dissoc(prop('ipAddress')),
                dissoc(prop('articleId')),
                transformTime
            )
            const result = map(a => transform(a), sortedComments)
            res.status(200).send(result)
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not get comments.' })
        }
    })

    app.post('/comments', async (req, res) => {
        try {
            const { name, email, message, articleId } = req.body
            const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            const comment = {
                name,
                email,
                message,
                articleId,
                ipAddress,
                createdAt: new Date(),
                isPublished: true
            }
            const result = await database.collection('comments').insertOne(comment)
            if (isNil(result)) throw new Error(`Error: comment [${name}] could not be inserted.`)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not create comment.' })
        }
    })
}
