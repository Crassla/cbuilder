//The Code here imports all the libraries and additional code which I want to use and assigns it a constant variable
// As it is being imported the variables are constant as these shouldn't be changed. 
const express = require('express');
const router = express.Router();
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const User = require('../models/suser');
const auth = require('../middleware/auth');
const As = require('../models/as');
const AsNames = require('../models/asnames');
const { isNullOrUndefined } = require('mongoose/lib/utils');

//When the user wants to go to the login page
router.get('/login', (req, res) => {
  res.render('students/login');
});

///When the user wants to go to the login page
router.get('/', (req, res) => {
    res.render('students/login');
});

//Redirects the user to the /me/:token/:name to ensure that the user cannot have an undefined name or token
router.get('/me', (req, res) => {
  res.redirect('     me/error/error');
});

router.get('/asall', async (req, res) => {
  try {
    const as = await As.find({});
    res.render('allas/index', {
      as: as
    })
  } catch(e) {
    res.redirect('/')
    console.log(e)
  }
})

//When the users trys to login this code runs and checks if they are authenticated
router.get('/me/:token/:name', auth, async (req, res) => {
  var as = await As.find({});
  const username = req.params.name.toLowerCase();
  const token = req.params.token;
  const asdata = await AsNames.find({'name': username});
  res.header('username', username);
  try { 
    // if the user is authenticated it trys to render the students index page
    res.render('students/index', {
      username: res.getHeader('username'),
      as: as,
      asdata: asdata
    });
  } catch (e) {
    // if there is an error the error is recorded in the log and it returns an error
    console.log(e)
    res.render('students/login',{ errorMessage: "Error in Fetching user" });
  };
});

//This code runs when a student wants to add an ascheivement standard
router.post('/asadd/:name', async (req, res) => {
  try {
    var as = await As.find()
    const asname = req.body.asname
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
    var asdata = await AsNames.find({'name': name})

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
});

//this runs when the student wants to login
//it first checks if there is an error in the server and then returns the error if there is one
router.post( '/login', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  //it collects all of the nessesary data from the form
  const username = req.body.name
  name = username.charAt(0).toUpperCase() + username.slice(1)
  const email = req.body.email
  const password = req.body.password

  try {
    //it checks that everything has been entered and that it is valid (that the thing exists in the database)
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
    
    // it decrypts the password as all passwords added to the database are encrypted if the password is incorrect it throws an error
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.render('students/login', {
        errorMessage: 'Error: Incorrect Password !'
      });
    //creates a random string with a random key using payload and jwt for the token then redirects to the url with the token
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
        var url = 'me/' + token + '/' + name;
        res.redirect(url);
    });
  } catch (e) {
    //if there is an error the error is logged and it redirects to the homepage
    console.error(e);
    res.redirect('/');
  };
});

//this code runs when the student wants to delete a standard
router.post('/asdelete/:name', async (req, res) => {
  //it gets all of the information it needs
  const name = req.params.name.toLowerCase();
  const asname = req.body.asname;
  var asdata = await AsNames.find({'name': name});
  var as = await As.find();
  //checks if the student has selected an acheievment standard from the dropdownlist and if they haven't returns an error message
  if (!as) return res.render('students/index',{
    errorMessage: 'As does not exist',
    username: name,
    as: as,
    asdata: asdata
  });
  try {
    //it deletes the as from the database
    await AsNames.deleteOne({'name': name, 'asname': asname});
    var asdata = await AsNames.find({'name': name});
    res.render('students/index',{
      successMessage: 'As Deleted',
      username: name,
      as: as,
      asdata: asdata
    });
  } catch(e) {
    //if there is an error it logs it and redirects them to the homepage
    console.error(e);
    res.redirect('/');
  };
});

//exports the code as a router.
module.exports = router;