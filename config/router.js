const authController = require('../controllers/authController')
const homeController = require('../controllers/homeController')
const courseController = require('../controllers/courseController')
const searchController = require('../controllers/searchController')


module.exports = (app) => {
   app.use('/', homeController)
   app.use('/auth', authController)
   app.use('/course', courseController)
   app.use('/search', searchController)
}