const express = require('express')
const { check, validationResult} = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router()
const auth = require('../middleware/auth')
const bodyParser = require('body-parser')

const Suser = require('../models/suser');
const Tuser = require('../models/tuser')
const As = require('../models/as');
const { route } = require('./student');


router.get('/login', (req, res) => {
    res.render('teachers/login')
})

router.get('/', (req, res) => {
    res.redirect('/teachers/123/123')
})

router.get('/:token/:name', auth, async (req, res) => {
  const token = req.params.token
  const name = req.params.name
  res.header('token', token)
  res.header('name', name)
  const as = await As.find({})
    try {
      res.render('teachers/index', {
        username: req.params.name,
        as: as
      
      } );
    } catch (e) {
      res.render('teachers/login',{ errorMessage: "Error in Fetching user" });
    }
  });

router.post('/login', async (req, res) => {
  const as = await As.find({})
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    const username = req.body.username
    name = username.charAt(0).toUpperCase() + username.slice(1)
    const email = req.body.email
    const password = req.body.password

    try {
      let user = await Tuser.findOne({
        email
      });

      if (!user)
        return res.render('teachers/login',{
          errorMessage: 'Error: Email Does Not Exist',

        });
      
      let usernames = await Tuser.findOne({
          username
      })

      if (!usernames)
        return res.render('teachers/login',{
          errorMessage: 'Error: User Does Not Exist'
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.render('teachers/login', {
          errorMessage: 'Error: Incorrect Password !'
        });

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        'randomString',
        {
          expiresIn: 100
        },
        (err, token) => {
          if (err) throw err;
          var url = token + '/' + name
          res.redirect(url)

        }
      );
    } catch (e) {
      console.error(e);
      res.redirect('/', {
        errorMessage: 'Error: Server Error'
      });
    }
})

router.post('/signup', async (req, res) => {
  const as = await As.find({})
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

        if (suser) return res.render('teachers/index', {errorMessage:'Error: Email Exists',
        as: as});

        let userss = await Suser.findOne({
            username
        });

        if (userss) return res.render('teachers/index', {errorMessage:'Error: User Exists',
        as: as});

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
        res.render('teachers/index', {successMessage:'Signup Successful',
        as: as})
    } catch (err) {
        console.log(err.message);
        res.render('teachers/index', {errorMessage:'Error in Saving',
        as: as});
    }
});

router.post('/tsignup', async (req, res) => {
  const as = await As.find({})
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
        let tuser = await Tuser.findOne({
            email
        });

        if (tuser) return res.render('teachers/index', {errorMessage:'Error: Email Exists',
        as: as});

        let tuserss = await Tuser.findOne({
            username
        });

        if (tuserss) return res.render('teachers/index', {errorMessage:'Error: User Exists',
        as: as});

        tuser = new Tuser({
            username,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        tuser.password = await bcrypt.hash(password, salt);

        await tuser.save();

        const payload = {
            tuser: {
            id: tuser.id
            }
        };
        res.render('teachers/index', {successMessage:'Signup Successful',
        as: as})
    } catch (err) {
        console.log(err.message);
        res.render('teachers/index', {errorMessage:'Error in Saving',
        as: as});
    }
});

router.post('/asadd', async (req, res) => { 
  const as = await As.find({})
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400)({
          errors: errors.array()
      });
  }

    const name = req.body.name
    const description = req.body.description
    const credits = req.body.credits
    const weeks = req.body.weeks

    try {
      let asname = await As.findOne({
        name
      })

      if (asname) return res.render('teachers/index', {errorMessage:'Error: AS Exists',
      as: as});

      asname = new As({
        name,
        description,
        credits,
        weeks
      })

      await asname.save();
      res.render('teachers/index', {successMessage:'AS Successfully Added',
      as: as})

    } catch (err){
      console.log(err.message);
      res.render('teachers/index', {errorMessage:'Error in Saving',
        as: as});
    }
    var url = res.getHeader('token') + '/' + res.getHeader('username')

})







module.exports = router