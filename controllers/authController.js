const { register, login } = require('../services/userService')
const parseErrors = require('../util/parseError')

const authController = require('express').Router()

const pattern = /^[a-zA-Z0-9]{5,}$/i
authController.get('/register', (req,res) => {
    res.render('register', {title : 'Register Page'})
})

authController.post('/register', async (req,res) => {

    try {
        const checkUsername = pattern.test(req.body.username)
        if(!checkUsername) {
            throw new Error('Username should be 5 characters at least')
        }
        const checkPassword = pattern.test(req.body.password)
        if(!checkPassword) {
            throw new Error('Password should be 5 characters at least')
        }

        if(req.body.password != req.body.rePassword) {
            throw new Error ('Passwords do not match!')
        }

        const token = await register(req.body.username, req.body.password)
        res.cookie ('token', token);
        res.redirect('/')

        
    } catch (error) {
        res.render('register', {
            title :' Register Page',
            errors : parseErrors(error),
            body :{
                username: req.body.username
            }


        })
    }
   
})

authController.get('/login', (req,res) => {
    res.render('login', {title : 'Login Page'})
})

authController.post('/login', async (req,res) => {

    try {
        if(req.body.username == '' || req.body.password == '') {
            throw new Error('All fields are required')
        }
        const token = await login(req.body.username, req.body.password);
        res.cookie('token', token)
        res.redirect('/')
    } catch (error) {

        res.render('login', {
            title: 'Login Page',
            errors: parseErrors(error),
            body : {username :req.body.username}

        })
    }

})

authController.get('/logout',(req,res) => {
res.clearCookie('token')
res.redirect('/')

} )


module.exports = authController