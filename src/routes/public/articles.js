import { ObjectId } from 'mongodb'
import { assoc, compose, map, mergeAll, prop, sortBy, sort, toLower } from 'ramda'
import moment from 'moment'

export default (app, database) => {
    app.get('/articles', async (req, res) => {
        try {
            const users = await database.collection('users').find().toArray()
            const tags = await database.collection('tags').find().toArray()
            const articles = await database.collection('articles').find({ 'isPublished': true }).toArray()
            const sortedArticles = sort(prop('createdAt'), articles)
            const tagDictionnary = mergeAll(map(x => ({ [prop('_id', x)]: prop('title', x) }), tags))
            const userDictionnary = mergeAll(map(x => ({ [prop('_id', x)]: prop('username', x) }), users))
            const transformTags = a => assoc('tags', sortBy(x => toLower(x), map(x => prop(x, tagDictionnary), a.tags)), a)
            const transformUsers = a => assoc('author', prop(a.author, userDictionnary), a)
            const transformTime = a => assoc('createdAt', moment(a.createdAt).format('DD/MM/YYYY HH:mm'), a)
            const transform = compose(transformTags, transformTime, transformUsers)
            const result = map(a => transform(a), sortedArticles)
            res.status(200).send(result)
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not get articles.' })
        }
    })

    app.get('/articles/:id', async (req, res) => {
        const id = req.params.id
        try {
            const users = await database.collection('users').find().toArray()
            const tags = await database.collection('tags').find().toArray()
            const article = await database.collection('articles').findOne({ '_id': new ObjectId(id) })
            const tagDictionnary = mergeAll(map(x => ({ [prop('_id', x)]: prop('title', x) }), tags))
            const userDictionnary = mergeAll(map(x => ({ [prop('_id', x)]: prop('username', x) }), users))
            const transformTags = a => assoc('tags', sortBy(x => toLower(x), map(x => prop(x, tagDictionnary), a.tags)), a)
            const transformUsers = a => assoc('author', prop(a.author, userDictionnary), a)
            const transformTime = a => assoc('createdAt', moment(a.createdAt).format('DD/MM/YYYY HH:mm'), a)
            const transform = compose(transformTags, transformTime, transformUsers)
            const result = transform(article)

            res.status(200).send(result)
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: `Could not get article [${id}].` })
        }
    })
}
