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
      res.render('students/login',{ errorMessage: "Error in Fetching user" });
    }
  });

router.post( '/login', async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }
      const username = req.body.name
      name = username.charAt(0).toUpperCase() + username.slice(1)
      const email = req.body.email
      const password = req.body.password

      try {
        let user = await User.findOne({
          email
        });
        if (!user)
          return res.render('students/login',{
            errorMessage: 'Error: Email Does Not Exist'
          });
        
        let usernames = await User.findOne({
            username
        })

        if (!usernames)
          return res.render('students/login',{
            errorMessage: 'Error: User Does Not Exist'
          });
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.render('students/login', {
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
            expiresIn: 10
          },
          (err, token) => {
            if (err) throw err;
            var url = 'me/' + token + '/' + name
            res.redirect(url)

          }
        );
      } catch (e) {
        console.error(e);
        res.redirect('/', {
          errorMessage: 'Error: Server Error'
        });
      }
    }
  );

function toTitleCase( str ) {
   return str.split(/\s+/).map( s => s.charAt( 0 ).toUpperCase() + s.substring(1).toLowerCase() ).join( " " );
}

module.exports = router