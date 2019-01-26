import articles from './articles'
import comments from './comments'
import projects from './projects'
import reviews from './reviews'
import tags from './tags'
import users from './users'

export default (app, services) => {
    articles(app, services)
    comments(app, services)
    projects(app, services)
    reviews(app, services)
    tags(app, services)
    users(app, services)
}
