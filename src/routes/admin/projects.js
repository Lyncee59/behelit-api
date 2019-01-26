import { ObjectId } from 'mongodb'
import { isNil } from 'ramda'

export default (app, database) => {
    app.get('/admin/projects', async (req, res) => {
        try {
            const data = await database.collection('projects').find().toArray()
            res.status(200).send(data)
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not get projects.' })
        }
    })

    app.post('/admin/projects', async (req, res) => {
        try {
            const { title, summary, description, company, year, tags } = req.body
            const project = {
                title,
                summary,
                description,
                company,
                year,
                tags,
                isPublished: true,
                createdAt: new Date()
            }
            const result = await database.collection('projects').insertOne(project)
            if (isNil(result)) throw new Error(`Error: project [${title}] could not be inserted.`)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not create project' })
        }
    })

    app.post('/admin/projects/publish', async (req, res) => {
        try {
            const { id } = req.body
            const project = {
                isPublished: true
            }
            const result = await database.collection('projects').findOneAndUpdate({ '_id': new ObjectId(id) }, { $set: project })
            if (isNil(result)) throw new Error(`Error: project [${id}] could not be approved.`)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })

    app.post('/admin/projects/unpublish', async (req, res) => {
        try {
            const { id } = req.body
            const project = {
                isPublished: false
            }
            const result = await database.collection('projects').findOneAndUpdate({ '_id': new ObjectId(id) }, { $set: project })
            if (isNil(result)) throw new Error(`Error: project [${id}] could not be approved.`)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })

    app.put('/admin/projects', async (req, res) => {
        try {
            const { id, title, summary, description, company, year, tags } = req.body
            const project = {
                title,
                summary,
                description,
                company,
                year,
                tags
            }
            const result = await database.collection('projects').findOneAndUpdate({ '_id': new ObjectId(id) }, { $set: project })
            if (isNil(result.value)) throw new Error(`Error: project [${id}] could not be updated.`)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not update project.' })
        }
    })

    app.delete('/admin/projects/:id', async (req, res) => {
        try {
            const id = req.params.id
            const result = await database.collection('projects').findOneAndDelete({ '_id': new ObjectId(id) })
            if (isNil(result.value)) { throw new Error(`Delete project [${id}] failed.`) }
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })
}
