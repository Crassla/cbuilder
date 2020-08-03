const express = require('express')
const router = express.Router()
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser')
const User = require('../models/suser')
const auth = require('../middleware/auth')
const As = require('../models/as');
const AsNames = require('../models/asnames');
const { isNullOrUndefined } = require('mongoose/lib/utils');
const { exists } = require('../models/asnames');

router.get('/login', (req, res) => {
  res.render('students/login')
})

router.get('/', (req, res) => {
    res.render('students/login')
})

router.get('/me', (req, res) => {
  res.redirect('/me/error/error')
})

router.get('/me/:token/:name', auth, async (req, res) => {
  const as = await As.find({})
  const username = req.params.name
  const token = req.params.token
  const asdata = await AsNames.find({'name': username})
  res.header('username', username)
  try {
    res.render('students/index', {
      username: res.getHeader('username'),
      as: as,
      asdata: asdata
    });
  } catch (e) {
    res.render('students/login',{ errorMessage: "Error in Fetching user" });
  }
})

router.post('/asadd/:name', async (req, res) => {
  try {
    const as = await As.find({})
    const asname = req.body.name
    const name = req.params.name
    asdata = await AsNames.find({'name': name})

    var ifexists = await AsNames.find({'name': name})
    var exists = []
    ifexists.forEach( ifexists =>{
      exists.push(ifexists.asname)
    })

    number = Number(asname)

    var test = (exists.includes(number))

    if (test == true) return res.render('students/index',{
      errorMessage: 'Error: As already added',
      username: name,
      as: as,
      asdata: asdata
    })
    
    if (!asname) return res.render('students/index',{
      errorMessage: 'Error: As does not exist. (I have no idea how you managed to get this error, but if you did, good work!)',
      username: name,
      as: as,
      asdata: asdata
    })
    
    var asnew = await (await As.find({'name': asname}, {'weeks': 1, '_id': 0}))
    var asdates = []
    asnew.forEach( asnew =>{
      asdates.push(asnew.weeks * 7)
    })

    Date.prototype.addDays = function (days) {
      let date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    }
    let date = new Date();
    asdate = date.addDays(asdates[0])


    var asnames = new AsNames({
      name,
      asname,
      asdate
    })
    
    await asnames.save()

    res.render('students/index',{
      successMessage: 'As succesfully added',
      username: name,
      as: as,
      asdata: asdata
    })


  } catch (e){
    console.error(e);
        res.redirect('/')
}




})

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
        res.redirect('/')
      }
    }
  );

router.post('/asdelete/:name', async (req, res) => {
  const name = req.params.name
  const asname = req.body.name
  asdata = await AsNames.find({'name': name})
  var as = await As.find()
  if (!as) return res.render('students/index',{
    errorMessage: 'As does not exist',
    username: name,
    as: as,
    asdata: asdata
  })
  try {
    await AsNames.deleteOne({'name': name, 'asname': asname})
    res.render('students/index',{
      successMessage: 'As Deleted',
      username: name,
      as: as,
      asdata: asdata
    })
  } catch(e) {
    console.error(e);
    res.redirect('/')
  }
})

function toTitleCase( str ) {
   return str.split(/\s+/).map( s => s.charAt( 0 ).toUpperCase() + s.substring(1).toLowerCase() ).join( " " );
}

module.exports = router