//The Code here imports all the libraries and additional code which I want to use and assigns it a constant variable
// As it is being imported the variables are constant as these shouldn't be changed. 
const express = require('express');
const { check, validationResult} = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../middleware/auth');
const bodyParser = require('body-parser');
const Suser = require('../models/suser');
const Tuser = require('../models/tuser')
const As = require('../models/as');
const { route } = require('./student');
const AsNames = require('../models/asnames');

//renders the login page when the user wants it
router.get('/login', (req, res) => {
  res.render('teachers/login');
});

//if the user trys to access the login page without the token or username it 
router.get('/', (req, res) => {
  res.redirect('/teachers/123/123');
});

//when the user logs in it authenticats them then renders the homepage for the teachers
router.get('/:token/:name', auth, async (req, res) => {
  //adds all of the needed databases and varibales
  const asnames = await AsNames.find().sort({ name: 1 });
  const snames = await Suser.find();
  const token = req.params.token;
  const name = req.params.name;
  var sdupe = [];
  var asdupe = [];
  var sdupeo = [];
  var asdupeo = [];
  asnames.forEach( asnames =>{
    sdupe.push(asnames.name);
    asdupe.push(asnames.asname);
  });
  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < sdupe.length; j++) { 
      for (k = 0; k < sdupeo.length; k++) { 
          if ( sdupe[j] == sdupeo[k] ) { 
              start = true; 
          };
      };
      count++; 
      if (count == 1 && start == false) { 
        sdupeo.push(sdupe[j]); 
      };
      start = false; 
      count = 0; 
  };

  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < asdupe.length; j++) { 
      for (k = 0; k < asdupeo.length; k++) { 
          if ( asdupe[j] == asdupeo[k] ) { 
              start = true; 
          }; 
      };
      count++; 
      if (count == 1 && start == false) { 
        asdupeo.push(asdupe[j]); 
      }; 
      start = false; 
      count = 0; 
  };
  //adds token and name to the header
  res.header('token', token);
  res.header('name', name);
  const as = await As.find({});
    try {
      //trys to render the page
      res.render('teachers/index', {
        username: req.params.name,
        as: as,
        asnames: asnames,
        suser: snames, 
        dupnames: sdupeo, 
        dupas: asdupeo 
      });
    } catch (e) {
      //if there is an error it logs the error and redirects to the login with an error message
      console.log(e)
      res.render('teachers/login',{ errorMessage: "Error in Fetching user" });
    };
  });


//this runs whe the user clicks the login button
router.post('/login', async (req, res) => {
  //adds all needed variables and checks for errors if there is an error it reports it
  const as = await As.find({});
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    };
    const username = req.body.username;
    name = username.charAt(0).toUpperCase() + username.slice(1);
    const email = req.body.email;
    const password = req.body.password;

    //checks if all the nessesary fields have been entered
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
      });

      if (!usernames)
        return res.render('teachers/login',{
          errorMessage: 'Error: User Does Not Exist'
      });

      //check if the encrypted password matches the users password if it doesn't returns an error
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
      //creates a random token for a random string and then redirects it with the token
      jwt.sign(
        payload,
        'randomString',
        {
          expiresIn: 100
        },
        (err, token) => {
          if (err) throw err;
          var url = token + '/' + name;
          res.redirect(url);

        }
      );
    } catch (e) {
      //if there is an error it logs the error and redirects to the home page
      console.error(e);
      res.redirect('/', {
        errorMessage: 'Error: Server Error'
      });
    };
});

//this code runs when the user wants to ass a student user. 
router.post('/signup/:name', async (req, res) => {
  //gets all of the variables and information required
  const asnames = await AsNames.find().sort({ name: 1 });
  var snames = await Suser.find();
  const usernames = req.params.name;
  const as = await As.find({});
  var sdupe = [];
  var asdupe = [];
  var sdupeo = [];
  var asdupeo = [];
  asnames.forEach( asnames =>{
    sdupe.push(asnames.name);
    asdupe.push(asnames.asname);
  });
  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < sdupe.length; j++) { 
      for (k = 0; k < sdupeo.length; k++) { 
          if ( sdupe[j] == sdupeo[k] ) { 
              start = true; 
          }; 
      };
      count++; 
      if (count == 1 && start == false) { 
        sdupeo.push(sdupe[j]); 
      };
      start = false; 
      count = 0; 
  };

  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < asdupe.length; j++) { 
    for (k = 0; k < asdupeo.length; k++) { 
        if ( asdupe[j] == asdupeo[k] ) { 
            start = true; 
        }; 
    };
    count++; 
    if (count == 1 && start == false) { 
      asdupeo.push(asdupe[j]); 
    };
    start = false; 
    count = 0; 
  };
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400)({
            errors: errors.array()
        });
  };

  var username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  //checks if the user already exists
  try {
    let suser = await Suser.findOne({
        email
    });

    if (suser) return res.render('teachers/index', {errorMessage:'Error: Email Exists',
    as: as, 
    username: usernames, 
    asnames: asnames,
    suser: snames, 
    dupnames: sdupeo, 
    dupas: asdupeo});

    let userss = await Suser.findOne({
        username
    });

    if (userss) return res.render('teachers/index', {errorMessage:'Error: User Exists',
    as: as, 
    username: usernames, 
    asnames: asnames,
    suser: snames, 
    dupnames: sdupeo, 
    dupas: asdupeo});

    suser = new Suser({
        username,
        email,
        password
    });

    //generates an encrypted password
    const salt = await bcrypt.genSalt(10);
    suser.password = await bcrypt.hash(password, salt);

    await suser.save();

    const payload = {
        suser: {
        id: suser.id
        }
    };
    //renders the teachers home page
    var snames = await Suser.find();
    res.render('teachers/index', {successMessage:'Signup Successful',
    as: as, 
    username: usernames, 
    asnames: asnames,
    suser: snames, 
    dupnames: sdupeo, 
    dupas: asdupeo});
  } catch (err) {
    //when there is an error it logs the error message and renders the home page with this message
    console.log(err.message);
    res.render('teachers/index', {errorMessage:'Error in Saving',
    as: as, username: usernames, asnames: asnames,
    suser: snames, dupnames: sdupeo, dupas: asdupeo});
  };
});

//a new teacher user password
router.post('/tsignup/:name', async (req, res) => {
  //gets all of the information and variables needed
  const asnames = await AsNames.find().sort({ name: 1 });
  const snames = await Suser.find();
  const usernames = req.params.name;
  const as = await As.find({});
  var sdupe = [];
  var asdupe = [];
  var sdupeo = [];
  var asdupeo = [];
  asnames.forEach( asnames =>{
    sdupe.push(asnames.name);
    asdupe.push(asnames.asname);
  });
  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < sdupe.length; j++) { 
      for (k = 0; k < sdupeo.length; k++) { 
          if ( sdupe[j] == sdupeo[k] ) { 
              start = true; 
          };
      };
      count++; 
      if (count == 1 && start == false) { 
        sdupeo.push(sdupe[j]); 
      } 
      start = false; 
      count = 0; 
  }

  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < asdupe.length; j++) { 
    for (k = 0; k < asdupeo.length; k++) { 
        if ( asdupe[j] == asdupeo[k] ) { 
            start = true; 
        }; 
    }; 
    count++; 
    if (count == 1 && start == false) { 
      asdupeo.push(asdupe[j]); 
    }; 
    start = false; 
    count = 0; 
  };

  //checks for server errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400)({
          errors: errors.array()
      });
  };

  //gets new information to add to database
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  //checks that all the information has been properly added if it hasn't it returns an error message
  try {
    let tuser = await Tuser.findOne({
        email
    });

    if (tuser) return res.render('teachers/index', {errorMessage:'Error: Email Exists',
    as: as, username: usernames, asnames: asnames,
    suser: snames, dupnames: sdupeo, dupas: asdupeo});

    let tuserss = await Tuser.findOne({
        username
    });

    if (tuserss) return res.render('teachers/index', {errorMessage:'Error: User Exists',
    as: as, username: usernames, asnames: asnames,
    suser: snames, dupnames: sdupeo, dupas: asdupeo});

    //generates a new user to save
    tuser = new Tuser({
        username,
        email,
        password
    });

    //encrypts the password
    const salt = await bcrypt.genSalt(10);
    tuser.password = await bcrypt.hash(password, salt);
    //saves the new user to the database
    await tuser.save();

    const payload = {
        tuser: {
        id: tuser.id
        }
    };
    //adds a success message if succesfull
    res.render('teachers/index', {successMessage:'Signup Successful',
    as: as, username: usernames, asnames: asnames,
    suser: snames, dupnames: sdupeo, dupas: asdupeo})
  } catch (err) {
    //if there is an error the error is logged and it renders the error in the index teachers page
    console.log(err.message);
    res.render('teachers/index', {errorMessage:'Error in Saving',
    as: as, username: usernames, asnames: asnames,
    suser: snames, dupnames: sdupeo, dupas: asdupeo});
  }
});

//when the teacher wants to add a new achievement standard
router.post('/asadd/:name', async (req, res) => { 
  //gets all of the data and variables required
  const asnames = await AsNames.find().sort({ name: 1 });
  const snames = await Suser.find();
  const usernames = req.params.name;
  var as = await As.find({});
  const errors = validationResult(req);
  var sdupe = [];
  var asdupe = [];
  var sdupeo = [];
  var asdupeo = [];
  asnames.forEach( asnames =>{
    sdupe.push(asnames.name);
    asdupe.push(asnames.asname);
  });
  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < sdupe.length; j++) { 
      for (k = 0; k < sdupeo.length; k++) { 
          if ( sdupe[j] == sdupeo[k] ) { 
              start = true; 
          }; 
      }; 
      count++; 
      if (count == 1 && start == false) { 
        sdupeo.push(sdupe[j]); 
      }; 
      start = false; 
      count = 0; 
  };

  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < asdupe.length; j++) { 
      for (k = 0; k < asdupeo.length; k++) { 
          if ( asdupe[j] == asdupeo[k] ) { 
              start = true; 
          }; 
      };
      count++; 
      if (count == 1 && start == false) { 
        asdupeo.push(asdupe[j]); 
      }; 
      start = false; 
      count = 0; 
  };
  if (!errors.isEmpty()) {
      return res.status(400)({
          errors: errors.array()
      });
  };
  //gets the information from the form
  const name = req.body.name;
  const description = req.body.description;
  const credits = req.body.credits;
  const weeks = req.body.weeks;

  try {
    //checks if the as already exists, if it does it throws and error
    let asname = await As.findOne({
      name
    });

    if (asname) return res.render('teachers/index', {errorMessage:'Error: AS Exists',
    as: as, username: usernames, asnames: asnames,
    suser: snames, dupnames: sdupeo, dupas: asdupeo});

    //creates new as to save into database
    asname = new As({
      name,
      description,
      credits,
      weeks
    });
    //saves into database
    await asname.save();
    var as = await As.find({});
    res.render('teachers/index', {successMessage:'AS Successfully Added',
    as: as, username: usernames, asnames: asnames,
    suser: snames, dupnames: sdupeo, dupas: asdupeo});

  } catch (err){
    //if there is an error the error is logged and it renders the error in the index teachers page
    console.log(err.message);
    res.render('teachers/index', {errorMessage:'Error in Saving',
      as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo});
  };
});

//this code is to add an acheievement standard to the as.
router.post('/studentasadd/:name', async (req, res) => {
  //this gets all of the varibbles and data needed
  var asnames = await AsNames.find().sort({ name: 1 });
  const snames = await Suser.find();
  var sdupe = [];
  var asdupe = [];
  var sdupeo = [];
  var asdupeo = [];
  asnames.forEach( asnames =>{
    sdupe.push(asnames.name);
    asdupe.push(asnames.asname);
  });
  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < sdupe.length; j++) { 
    for (k = 0; k < sdupeo.length; k++) { 
        if ( sdupe[j] == sdupeo[k] ) { 
            start = true; 
        };
    };
    count++; 
    if (count == 1 && start == false) { 
      sdupeo.push(sdupe[j]); 
    }; 
    start = false; 
    count = 0; 
  };

  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < asdupe.length; j++) { 
      for (k = 0; k < asdupeo.length; k++) { 
          if ( asdupe[j] == asdupeo[k] ) { 
              start = true; 
          }; 
      };
      count++; 
      if (count == 1 && start == false) { 
        asdupeo.push(asdupe[j]); 
      }; 
      start = false; 
      count = 0; 
  };
  try {
    //gets all of the new information from the form
    const as = await As.find({});
    const asname = req.body.asname;
    const usernames = req.params.name;
    const name = req.body.name;
    //checks if the student has already added the acheivement standard
    asdata = await AsNames.find({'name': name});

    var ifexists = await AsNames.find({'name': name});
    var exists = [];
    ifexists.forEach( ifexists =>{
      exists.push(ifexists.asname);
    });

    number = Number(asname);

    var test = (exists.includes(number));

    if (test == true) return res.render('teachers/index', {errorMessage:'As already exists',
    as: as, username: usernames, asnames: asnames,
    suser: snames, dupnames: sdupeo, dupas: asdupeo
    });
    //checks if the as exists
    if (!asname) return res.render('teachers/index',{
      errorMessage: 'Error: As does not exist',
      as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo
    });
    //check if the user exists
    if (!name) return res.render('teachers/index',{
      errorMessage: 'Error: Student does not exist',
      as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo
    });
    //adds the data it takes in weeks to todays date
    var asnew = await (await As.find({'name': asname}, {'weeks': 1, '_id': 0}));
    var asdates = [];
    asnew.forEach( asnew =>{
      asdates.push(asnew.weeks * 7);
    });

    Date.prototype.addDays = function (days) {
      let date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
    let date = new Date();
    asdate = date.addDays(asdates[0]);

    //creates the thing you save into the database
    var assave = new AsNames({
      name,
      asname,
      asdate
    });
    //saves it into the database
    await assave.save()
    //renders a success message
    var asnames = await AsNames.find().sort({ name: 1 });
    res.render('teachers/index',{
      successMessage: 'As succesfully added',
      as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo
    });

  } catch (e){
    //if there is an error the error is logged and they are redirected to the homepage
    console.error(e);
    res.redirect('/');
  }
});

//this runs when it needs to delete a students standard
router.post('/asdelete/:name', async (req, res) => {
  //gets all of the information from the forms, the variables, and the data needed
  const usernames = req.params.name;
  const name = req.body.name;
  const asname = req.body.asname;
  const as = await As.find();
  var asnames = await AsNames.find().sort({ name: 1 });
  const snames = await Suser.find();
  var sdupe = [];
  var asdupe = [];
  var sdupeo = [];
  var asdupeo = [];
  asnames.forEach( asnames =>{
    sdupe.push(asnames.name);
    asdupe.push(asnames.asname);
  });
  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < sdupe.length; j++) { 
      for (k = 0; k < sdupeo.length; k++) { 
          if ( sdupe[j] == sdupeo[k] ) { 
              start = true; 
          }; 
      };
      count++; 
      if (count == 1 && start == false) { 
        sdupeo.push(sdupe[j]); 
      }; 
      start = false; 
      count = 0; 
  };

  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < asdupe.length; j++) { 
      for (k = 0; k < asdupeo.length; k++) { 
          if ( asdupe[j] == asdupeo[k] ) { 
              start = true; 
          }; 
      }; 
      count++; 
      if (count == 1 && start == false) { 
        asdupeo.push(asdupe[j]); 
      }; 
      start = false; 
      count = 0; 
  };
  //checks if the as exists
  if (!asname) return res.render('teachers/index',{
    errorMessage: 'As does not exist',
    as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo
  });
  //checks if the student exists
  if (!name) return res.render('teachers/index',{
    errorMessage: 'Student does not exist',
    as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo
  });
  //checks if the as exists in for the student
  name.toLowerCase();

  var ifexists = await AsNames.find({'name': name});
  var exists = [];
  ifexists.forEach( ifexists =>{
    exists.push(ifexists.asname);
  });

  number = Number(asname);

  var test = (exists.includes(number));

  if (test == false) return res.render('teachers/index', {errorMessage:'As does not exist for student',
  as: as, username: usernames, asnames: asnames,
  suser: snames, dupnames: sdupeo, dupas: asdupeo});

  try {
    //trys to delete the as for the student if succesfull displays a success message
    await AsNames.deleteOne({'name': name, 'asname': asname});
    var asnames = await AsNames.find().sort({ name: 1 });
    res.render('teachers/index',{
      successMessage: 'As Deleted',
      as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo});
  } catch(e) {
    //if there is an error it is logged and the teacher is redirected to the main page
    console.error(e);
    res.redirect('/');
  };
});

//code for updating a students as's due date.
router.post('/asdate/:name', async (req, res) => {
  const usernames = req.params.name;
  var name = req.body.name;
  const asname = req.body.asname;
  const as = await As.find();
  var asnames = await AsNames.find().sort({ name: 1 });
  var asdata = await AsNames.find({'name': name});
  var sdupe = [];
  var asdupe = [];
  var sdupeo = [];
  var asdupeo = [];
  asnames.forEach( asnames =>{
    sdupe.push(asnames.name);
    asdupe.push(asnames.asname);
  });
  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < sdupe.length; j++) { 
      for (k = 0; k < sdupeo.length; k++) { 
          if ( sdupe[j] == sdupeo[k] ) { 
              start = true; 
          }; 
      }; 
      count++; 
      if (count == 1 && start == false) { 
        sdupeo.push(sdupe[j]); 
      };
      start = false; 
      count = 0; 
  };

  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < asdupe.length; j++) { 
    for (k = 0; k < asdupeo.length; k++) { 
        if ( asdupe[j] == asdupeo[k] ) { 
            start = true; 
        }; 
    };
    count++; 
    if (count == 1 && start == false) { 
      asdupeo.push(asdupe[j]); 
    } 
    start = false; 
    count = 0; 
  };
  //checks to see if the student and the as exists in their separate entities
  const snames = await Suser.find();
 
  if (!asname) return res.render('teachers/index',{
    errorMessage: 'As does not exist',
    as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo
  });

  if (!name) return res.render('teachers/index',{
    errorMessage: 'Student does not exist',
    as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo
  });
  //checks to see if the as exists for the student
  name.toLowerCase();

  var exists = [];
  asdata.forEach( asdata =>{
    exists.push(asdata.asname);
  });

  number = Number(asname);

  var test = (exists.includes(number));

  if (test == false) return res.render('teachers/index', {errorMessage:'As does not exist for student',
  as: as, username: usernames, asnames: asnames,
  suser: snames, dupnames: sdupeo, dupas: asdupeo});

  var asdate = new Date();
  asdate = req.body.date;

  try {
    //updates the date and returns a success message if successful
    await AsNames.updateOne({'name': name, 'asname': asname}, {'asdate': asdate});
    var asnames = await AsNames.find().sort({ name: 1 });
    res.render('teachers/index',{
      successMessage: 'Due Date Updated',
      as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo});
  } catch(e) {
    //if there is an error the error is logged and they are redirected to the main page. 
    console.error(e);
    res.redirect('/');
  }
})


module.exports = router;