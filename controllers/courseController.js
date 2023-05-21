const { createCourse, getOneById, update, deleteById, enroll } = require('../services/courseService');
const parseErrors = require('../util/parseError');

const courseController = require('express').Router();


courseController.get('/create', (req, res) => {

    res.render('create')

})

courseController.post('/create', async (req, res) => {

    const date = new Date();
    const options = {
        weekday: 'short',   
        month: 'short',     
        day: 'numeric',      
        hour: 'numeric',   
        minute: 'numeric',   
        second: 'numeric',  
        hour12: false

    }
    const formattedDate = date.toLocaleString('en-US', options)

    const course = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        duration: req.body.duration,
        created: formattedDate,
        owner: req.user._id

    }
    try {
        if (Object.values(course).some(f => !f)) {
            throw new Error('All fields are mandatory')
        }
        await createCourse(course);
        res.redirect('/')


    } catch (error) {

        res.render('create', {
            title: 'Create Page',
            body: course,
            errors: parseErrors(error)
        })

    }

})



courseController.get('/:id/details', async (req, res) => {

    const course = await getOneById(req.params.id)

    
    

    if (course.owner == req.user._id) {
        course.isOwner = true
    } else if(course.enrolledUsers.some(r => r == req.user._id)) {
        course.isEnrolled = true
    }
    
    res.render('details', { title: 'Details Page', course })

})


courseController.get('/:id/edit', async (req,res) => {
    const course = await getOneById(req.params.id)
    console.log(course);

    res.render('edit', {title: 'Edit page', course})
})


courseController.post('/:id/edit', async (req,res) => {

    const course = await getOneById(req.params.id)
    const editedCourse = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        duration: req.body.duration,
       
    }
    
    try {
        if(course.owner != req.user._id) {
            return res.redirect('/auth/login')
        }
        if (Object.values(editedCourse).some(f => !f)) {
            throw new Error('All fields are mandatory')
        }

       await update(editedCourse,req.params.id)
       console.log(`course/${req.params.id}/details`);
        res.redirect(`/course/${req.params.id}/details`)


    } catch (error) {

        res.render('edit', {
            title: 'Edit Page',
            course: Object.assign(editedCourse,{_id:req.params.id }),
            errors: parseErrors(error)
        })

    }
})

courseController.get('/:id/delete', async (req,res) => {

    const course = await getOneById(req.params.id)

    if(course.owner != req.user._id) {
        return res.redirect('/auth/login')
    }
    await deleteById(req.params.id);
    res.redirect('/')

})

courseController.get('/:id/enroll', async (req,res) => {
    const course = await getOneById(req.params.id)

    try {
        
        if(course.owner == req.user._id) {
            course.isOwner = true;
            throw new Error('You can enroll for your own course!')
        }
        await enroll(req.params.id,req.user._id)
        res.redirect(`/course/${req.params.id}/details`)



    } catch (error) {
        res.render('details', {
            title: 'Details page',
            course,
            errors: parseErrors(error)    
            })
    }

 
})





module.exports = courseController

