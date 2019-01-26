import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { dissoc, isNil, map } from 'ramda'

export default (app, database) => {
    app.get('/admin/users', async (req, res) => {
        try {
            const data = await database.collection('users').find().toArray()
            res.status(200).send(map(dissoc('hash'), data))
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not get users.' })
        }
    })

    app.post('/admin/users', async (req, res) => {
        try {
            const { username, email, password } = req.body
            const isUsernameUsed = await database.collection('users').findOne({ 'username': username })
            if (isUsernameUsed) throw new Error(`Error: user [${username}] already exists.`)
            const isEmailUsed = await database.collection('users').findOne({ 'email': email })
            if (isEmailUsed) throw new Error(`Error: email [${email}] is already used.`)
            const hash = await bcrypt.hash(password, 10)
            const user = {
                username,
                email,
                hash,
                createdAt: new Date(),
                isAdmin: false
            }
            const result = await database.collection('users').insertOne(user)
            if (isNil(result)) throw new Error(`Error: user [${username}] could not be inserted.`)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })

    app.put('/admin/users', async (req, res) => {
        try {
            const { id, username, email, isAdmin } = req.body
            const resultEmail = await database.collection('users').findOne({ 'email': email })
            if (!isNil(resultEmail)) throw new Error(`Error: email [${email}] is already used.`)
            const user = {
                'username': username,
                'email': email,
                'isAdmin': isAdmin
            }
            const result = await database.collection('users').findOneAndUpdate({ '_id': new ObjectId(id) }, { $set: user })
            if (isNil(result.value)) throw new Error(`Error: user [${id}] could not be updated.`)
            res.status(200).send(result.value)
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })

    app.delete('/admin/users/:id', async (req, res) => {
        try {
            const id = req.params.id
            const result = await database.collection('users').findOneAndDelete({ '_id': new ObjectId(id) })
            if (isNil(result.value)) { throw new Error(`Delete user [${id}] failed.`) }
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    })
}
