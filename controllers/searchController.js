const { searchCourse } = require('../services/courseService');
const parseErrors = require('../util/parseError');

const searchController = require('express').Router()



searchController.post('/', async (req, res) => {

    const query = req.body.search
    let isUser = false



    try {
        if (req.user != undefined) {
            isUser = true
        }
        const found = await searchCourse(query);
        found.forEach(r => {
            r.enrolledUsers = Number(r.enrolledUsers.length)
            r.isUser = isUser
        })
        found.sort((a, b) => b.enrolledUsers - a.enrolledUsers)


        res.render('search', {
            title: 'Search Page',
            found,
            query
        })

    } catch (error) {
        res.render('search', {
            title: 'Search Page',
            errors: parseErrors(error)
        })
    }


})

module.exports = searchController