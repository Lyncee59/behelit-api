import express from 'express'
import bodyParser from 'body-parser'
import { MongoClient } from 'mongodb'

import config from './config'
import initPublicRoutes from './routes/public'
import initAdminRoutes from './routes/admin'
import authorize from './middleware/authorize'
import initRequestHeaders from './middleware/initRequestHeaders'

const dbOptions = {
    useNewUrlParser: true
}

// Database
MongoClient.connect(config.mongo.uri, dbOptions, async function (err, client) {
    if(err) throw err
    console.log('Connected to database')

    // Initialization
    const db = client.db('test')
    const port = config.server.port
    const app = express()

    // Use body parser so we can get info from POST and/or URL parameters
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    // Database
    console.log('Init database...')
     const collections = await db.listCollections().toArray()
    if (collections.filter(x => x.name === 'articles').length === 0) database.createCollection('articles')
    if (collections.filter(x => x.name === 'comments').length === 0) database.createCollection('comments')
    if (collections.filter(x => x.name === 'projects').length === 0) database.createCollection('projects')
    if (collections.filter(x => x.name === 'reviews').length === 0) database.createCollection('reviews')
    if (collections.filter(x => x.name === 'tags').length === 0) database.createCollection('tags')
    if (collections.filter(x => x.name === 'users').length === 0) database.createCollection('users')

    // Public headers
    console.log('Init headers middleware...')
    initRequestHeaders(app)

    // Authorize secured routes
    console.log('Init authorize middleware...')
    authorize(app)

    // Public routes
    console.log('Init public routes...')
    initPublicRoutes(app, db)

    // Secured routes
    console.log('Init admin routes...')
    initAdminRoutes(app, db)

    // Start
    app.listen(port, () => {
        console.log(`Api running at http://${config.server.hostname}:${config.server.port}`)
    })
})
