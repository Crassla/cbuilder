const express = require('express')
const router = express.Router()
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser')
const User = require('../models/suser')
const auth = require('../middleware/auth')


router.get('/login', (req, res) => {
    res.render('students/login')
})

router.get('/', (req, res) => {
    res.render('students/login')
})

router.get('/me/:token/:name', auth, async (req, res) => {
    try {
      res.render('students/index', {username: req.params.name} );
    } catch (e) {
      res.render('students/index',{ errorMessage: "Error in Fetching user" });
    }
  });

router.post( '/login', async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }
      var name = req.body.name
      name = name.charAt(0).toUpperCase() + name.slice(1)
      const email = req.body.email
      const password = req.body.password

      try {
        let user = await User.findOne({
          email
        });
        if (!user)
          return res.render('students/index',{
            errorMessage: 'User Not Exist'
          });
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.render('teachers/index', {
            errorMessage: 'Incorrect Password !'
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
            var url = 'me/' + token + '/' + name
            res.redirect(url)

          }
        );
      } catch (e) {
        console.error(e);
        res.render('students/index', {
          errorMessage: 'Server Error'
        });
      }
    }
  );

function toTitleCase( str ) {
   return str.split(/\s+/).map( s => s.charAt( 0 ).toUpperCase() + s.substring(1).toLowerCase() ).join( " " );
}

module.exports = router