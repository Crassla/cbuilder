const express = require('express')
const { check, validationResult} = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router()

const Suser = require('../models/suser');

router.get('/login', (req, res) => {
    res.render('teachers/login')
})

router.get('/', (req, res) => {
    res.render('teachers/index')
})

router.get('/me', async (req, res) => {
    try {
      // request.user is getting fetched from Middleware after token authentication
      const user = await User.findById(req.user.id);
      res.render('students/index', {user: user} );
    } catch (e) {
      res.render('teacher/index',{errorMessage: "Error in Fetching user" });
    }
  });

router.post('/tlogin', (req, res) => {
    res.redirect('teachers/index')
})

router.post('/signup', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400)({
            errors: errors.array()
        });
    }

    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    try {
        let suser = await Suser.findOne({
            email
        });

        suser = new Suser({
            username,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        suser.password = await bcrypt.hash(password, salt);

        await suser.save();

        const payload = {
            suser: {
            id: suser.id
            }
        };
        res.render('teachers/index', {successMessage:'Signup Successful'})
    } catch (err) {
        console.log(err.message);
        res.render('teachers/index', {errorMessage:'Error in Saving'});
    }

    
}
);





module.exports = router