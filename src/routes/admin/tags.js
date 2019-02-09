import { ObjectId } from 'mongodb'
import { isNil } from 'ramda'

export default (app, database) => {
    app.get('/admin/tags', async (req, res) => {
        try {
            const data = await database.collection('tags').find().toArray()
            res.status(200).send(data)
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not get tags.' })
        }
    })

    app.get('/admin/tags/:id', async (req, res) => {
        try {
            const id = req.params.id
            const data = await database.collection('tags').findOne({ '_id': new ObjectId(id) })
            res.status(200).send(data)
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not get tag.' })
        }
    })

    app.post('/admin/tags', async (req, res) => {
        try {
            const { title } = req.body
            const isTagUsed = await database.collection('tags').findOne({ 'title': title })
            if (isTagUsed) throw new Error(`Error: tag [${title}] already exists.`)
            const tag = {
                title,
                createdAt: new Date()
            }
            const result = await database.collection('tags').insertOne(tag)
            if (isNil(result)) throw new Error(`Error: tag [${title}] could not be inserted.`)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })

    app.put('/admin/tags', async (req, res) => {
        try {
            const { id, title } = req.body
            const resultTitle = await database.collection('tags').findOne({ 'title': title })
            if (!isNil(resultTitle)) throw new Error(`Error: tag [${title}] already exists.`)
            const tag = {
                'title': title
            }
            const result = await database.collection('tags').findOneAndUpdate({ '_id': new ObjectId(id) }, { $set: tag })
            if (isNil(result.value)) throw new Error(`Error: tag [${id}] could not be updated.`)
            res.status(200).send(result.value)
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })

    app.delete('/admin/tags/:id', async (req, res) => {
        try {
            const id = req.params.id
            const result = await database.collection('tags').findOneAndDelete({ '_id': new ObjectId(id) })
            if (isNil(result.value)) { throw new Error(`Delete tag [${id}] failed.`) }
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })
}
