import { ObjectId } from 'mongodb'
import { isNil } from 'ramda'

export default (app, database) => {
    app.get('/admin/comments', async (req, res) => {
        try {
            const data = await database.collection('comments').find().toArray()
            res.status(200).send(data)
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not get comments.' })
        }
    })

    app.post('/admin/comments/publish', async (req, res) => {
        try {
            const { id } = req.body
            const comment = {
                isPublished: true
            }
            const result = await database.collection('comments').findOneAndUpdate({ '_id': new ObjectId(id) }, { $set: comment })
            if (isNil(result)) throw new Error(`Error: comment [${id}] could not be approved.`)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })

    app.post('/admin/comments/unpublish', async (req, res) => {
        try {
            const { id } = req.body
            const comment = {
                isPublished: false
            }
            const result = await database.collection('comments').findOneAndUpdate({ '_id': new ObjectId(id) }, { $set: comment })
            if (isNil(result)) throw new Error(`Error: comment [${id}] could not be approved.`)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })

    app.delete('/admin/comments/:id', async (req, res) => {
        try {
            const id = req.params.id
            const result = await database.collection('comments').findOneAndDelete({ '_id': new ObjectId(id) })
            if (isNil(result.value)) { throw new Error(`Delete comment [${id}] failed.`) }
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })
}
