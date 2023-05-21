const { getAll } = require('../services/courseService')

const homeController = require('express').Router()



homeController.get('/', async (req, res) => {

    let courses = await getAll()
    let isUser = false

    if (req.user != undefined) {
        isUser = true;
        courses.forEach(r => {
            r.enrolledUsers = Number(r.enrolledUsers.length)
            r.isUser = isUser})
        courses.sort((a, b) => a.created - b.created)
    } else {
        courses.forEach(r => {
            r.enrolledUsers = Number(r.enrolledUsers.length)})
            courses.sort((a, b) => b.enrolledUsers - a.enrolledUsers)
        courses.splice(3)

    }


   


    res.render('home', {
        title: 'Home page',
        courses


    })

})








module.exports = homeController