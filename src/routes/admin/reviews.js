import { ObjectId } from 'mongodb'
import { isNil } from 'ramda'

export default (app, database) => {
    app.get('/admin/reviews', async (req, res) => {
        try {
            const data = await database.collection('reviews').find().toArray()
            res.status(200).send(data)
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not get reviews.' })
        }
    })

    app.get('/admin/reviews/:id', async (req, res) => {
        try {
            const id = req.params.id
            const data = await database.collection('reviews').findOne({ '_id': new ObjectId(id) })
            res.status(200).send(data)
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not get review.' })
        }
    })

    app.post('/admin/reviews', async (req, res) => {
        try {
            const { name, company, role, message } = req.body
            const review = {
                name,
                company,
                role,
                message,
                isPublished: false,
                createdAt: new Date(2017, 1, 13, 20, 12, 0)
            }
            const result = await database.collection('reviews').insertOne(review)
            if (isNil(result)) throw new Error(`Error: review [${name}] could not be inserted.`)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })

    app.post('/admin/reviews/publish', async (req, res) => {
        try {
            const { id } = req.body
            const review = {
                isPublished: true
            }
            const result = await database.collection('reviews').findOneAndUpdate({ '_id': new ObjectId(id) }, { $set: review })
            if (isNil(result)) throw new Error(`Error: review [${id}] could not be approved.`)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })

    app.post('/admin/reviews/unpublish', async (req, res) => {
        try {
            const { id } = req.body
            const review = {
                isPublished: false
            }
            const result = await database.collection('reviews').findOneAndUpdate({ '_id': new ObjectId(id) }, { $set: review })
            if (isNil(result)) throw new Error(`Error: review [${id}] could not be approved.`)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })

    app.put('/admin/reviews', async (req, res) => {
        try {
            const { id, name, company, role, message } = req.body
            const review = {
                name,
                company,
                role,
                message
            }
            const result = await database.collection('reviews').findOneAndUpdate({ '_id': new ObjectId(id) }, { $set: review })
            if (isNil(result.value)) throw new Error(`Error: review [${id}] could not be updated.`)
            res.status(200).send(result.value)
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })

    app.delete('/admin/reviews/:id', async (req, res) => {
        try {
            const id = req.params.id
            const result = await database.collection('reviews').findOneAndDelete({ '_id': new ObjectId(id) })
            if (isNil(result.value)) { throw new Error(`Delete review [${id}] failed.`) }
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })
}
