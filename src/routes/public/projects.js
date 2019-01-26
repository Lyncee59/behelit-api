import { assoc, compose, map, mergeAll, prop, reverse, sortBy, toLower } from 'ramda'
import moment from 'moment'

export default (app, database) => {
    app.get('/projects', async (req, res) => {
        try {
            const tags = await database.collection('tags').find().toArray()
            const projects = await database.collection('projects').find({ 'isPublished': true }).toArray()
            const sortedProjects = reverse(sortBy(prop('year'), projects))
            const tagDictionnary = mergeAll(map(x => ({ [prop('_id', x)]: prop('title', x) }), tags))
            const transformTags = a => assoc('tags', sortBy(x => toLower(x), map(x => prop(x, tagDictionnary), a.tags)), a)
            const transformTime = a => assoc('createdAt', moment(a.createdAt).format('DD/MM/YYYY HH:mm'), a)
            const transform = compose(transformTags, transformTime)
            const result = map(a => transform(a), sortedProjects)
            res.status(200).send(result)
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: 'Could not get projects.' })
        }
    })
}
