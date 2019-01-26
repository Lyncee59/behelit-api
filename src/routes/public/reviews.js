import { assoc, isNil, map, prop, reverse, sort } from 'ramda'
import moment from 'moment'

export default (app, database) => {
    app.get('/reviews', async (req, res) => {
        try {
            const reviews = await database.collection('reviews').find({ 'isPublished': true }).toArray()
            const sortedReviews = reverse(sort(prop('createdAt'), reviews))
            const transformTime = a => assoc('createdAt', moment(a.createdAt).format('DD/MM/YYYY HH:mm'), a)
            const result = map(a => transformTime(a), sortedReviews)
            res.status(200).send(result)
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not get reviews.' })
        }
    })

    app.post('/reviews', async (req, res) => {
        try {
            const { name, company, role, message } = req.body
            const review = {
                name,
                company,
                message,
                role,
                createdAt: new Date(),
                isPublished: false
            }
            const result = await database.collection('reviews').insertOne(review)
            if (isNil(result)) throw new Error(`Error: review [${name}] could not be inserted.`)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not create review.' })
        }
    })
}
