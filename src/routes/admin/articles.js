import { ObjectId } from 'mongodb'
import { isNil } from 'ramda'

export default (app, database) => {

    app.get('/admin/articles', async (req, res) => {
        try {
            const data = await database.collection('articles').find().toArray()
            res.status(200).send(data)
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not get articles.' })
        }
    })

    app.get('/admin/articles/:id', async (req, res) => {
        try {
            const id = req.params.id
            const data = await database.collection('articles').findOne({ '_id': new ObjectId(id) })
            res.status(200).send(data)
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not get article.' })
        }
    })

    app.post('/admin/articles', async (req, res) => {
        try {
            const { title, description, content, author, category, tags } = req.body
            const article = {
                title,
                description,
                content,
                author,
                category,
                tags,
                isPublished: false,
                createdAt: new Date()
            }
            const result = await database.collection('articles').insertOne(article)
            if (isNil(result)) throw new Error(`Error: article [${title}] could not be inserted.`)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not create article' })
        }
    })

    app.post('/admin/articles/publish', async (req, res) => {
        try {
            const { id } = req.body
            const article = {
                isPublished: true
            }
            const result = await database.collection('articles').findOneAndUpdate({ '_id': new ObjectId(id) }, { $set: article })
            if (isNil(result)) throw new Error(`Error: article [${id}] could not be approved.`)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })

    app.post('/admin/articles/unpublish', async (req, res) => {
        try {
            const { id } = req.body
            const article = {
                isPublished: false
            }
            const result = await database.collection('articles').findOneAndUpdate({ '_id': new ObjectId(id) }, { $set: article })
            if (isNil(result)) throw new Error(`Error: article [${id}] could not be approved.`)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })

    app.put('/admin/articles', async (req, res) => {
        try {
            const { id, title, description, content, author, category, tags } = req.body
            const article = {
                title,
                description,
                content,
                author,
                category,
                tags
            }
            const result = await database.collection('articles').findOneAndUpdate({ '_id': new ObjectId(id) }, { $set: article })
            if (isNil(result.value)) throw new Error(`Error: article [${id}] could not be updated.`)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not update article.' })
        }
    })

    app.delete('/admin/articles/:id', async (req, res) => {
        try {
            const id = req.params.id
            const result = await database.collection('articles').findOneAndDelete({ '_id': new ObjectId(id) })
            if (isNil(result.value)) { throw new Error(`Delete article [${id}] failed.`) }
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })
}
