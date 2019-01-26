import articles from './articles'
import auth from './auth'
import comments from './comments'
import contact from './contact'
import projects from './projects'
import reviews from './reviews'

export default (app, services) => {
    articles(app, services)
    auth(app, services)
    comments(app, services)
    contact(app, services)
    projects(app, services)
    reviews(app, services)
}
