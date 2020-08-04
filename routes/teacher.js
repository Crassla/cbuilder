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
const AsNames = require('../models/asnames')


router.get('/login', (req, res) => {
    res.render('teachers/login')
})

router.get('/', (req, res) => {
    res.redirect('/teachers/123/123')
})

router.get('/:token/:name', auth, async (req, res) => {
  const asnames = await AsNames.find().sort({ name: 1 })
  const snames = await Suser.find()
  const token = req.params.token
  const name = req.params.name
  var sdupe = []
  var asdupe = []
  var sdupeo = []
  var asdupeo = []
  asnames.forEach( asnames =>{
    sdupe.push(asnames.name)
    asdupe.push(asnames.asname)
  })
  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < sdupe.length; j++) { 
      for (k = 0; k < sdupeo.length; k++) { 
          if ( sdupe[j] == sdupeo[k] ) { 
              start = true; 
          } 
      } 
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
          } 
      } 
      count++; 
      if (count == 1 && start == false) { 
        asdupeo.push(asdupe[j]); 
      } 
      start = false; 
      count = 0; 
  }
  res.header('token', token)
  res.header('name', name)
  const as = await As.find({})
    try {
      res.render('teachers/index', {
        username: req.params.name,
        as: as,
        asnames: asnames,
        suser: snames, dupnames: sdupeo, dupas: asdupeo
      
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

router.post('/signup/:name', async (req, res) => {
  const asnames = await AsNames.find().sort({ name: 1 })
  const snames = await Suser.find()
  const usernames = req.params.name
  const as = await As.find({})
  var sdupe = []
  var asdupe = []
  var sdupeo = []
  var asdupeo = []
  asdata.forEach( asdata =>{
    sdupe.push(asdata.name)
    asdupe.push(asdata.asname)
  })
  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < sdupe.length; j++) { 
      for (k = 0; k < sdupeo.length; k++) { 
          if ( sdupe[j] == sdupeo[k] ) { 
              start = true; 
          } 
      } 
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
          } 
      } 
      count++; 
      if (count == 1 && start == false) { 
        asdupeo.push(asdupe[j]); 
      } 
      start = false; 
      count = 0; 
  }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400)({
            errors: errors.array()
        });
    }

    var username = req.body.username
    const email = req.body.email
    const password = req.body.password

    try {
        let suser = await Suser.findOne({
            email
        });

        if (suser) return res.render('teachers/index', {errorMessage:'Error: Email Exists',
        as: as, username: usernames, asnames: asnames,
        suser: snames});

        let userss = await Suser.findOne({
            username
        });

        if (userss) return res.render('teachers/index', {errorMessage:'Error: User Exists',
        as: as, username: usernames, asnames: asnames,
        suser: snames, dupnames: sdupeo, dupas: asdupeo});

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
        as: as, username: usernames, asnames: asnames,
        suser: snames, dupnames: sdupeo, dupas: asdupeo})
    } catch (err) {
        console.log(err.message);
        res.render('teachers/index', {errorMessage:'Error in Saving',
        as: as, username: usernames, asnames: asnames,
        suser: snames, dupnames: sdupeo, dupas: asdupeo});
    }
});

router.post('/tsignup/:name', async (req, res) => {
  const asnames = await AsNames.find().sort({ name: 1 })
  const snames = await Suser.find()
  const usernames = req.params.name
  const as = await As.find({})
  var sdupe = []
  var asdupe = []
  var sdupeo = []
  var asdupeo = []
  asdata.forEach( asdata =>{
    sdupe.push(asdata.name)
    asdupe.push(asdata.asname)
  })
  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < sdupe.length; j++) { 
      for (k = 0; k < sdupeo.length; k++) { 
          if ( sdupe[j] == sdupeo[k] ) { 
              start = true; 
          } 
      } 
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
          } 
      } 
      count++; 
      if (count == 1 && start == false) { 
        asdupeo.push(asdupe[j]); 
      } 
      start = false; 
      count = 0; 
  }
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
        as: as, username: usernames, asnames: asnames,
        suser: snames, dupnames: sdupeo, dupas: asdupeo});

        let tuserss = await Tuser.findOne({
            username
        });

        if (tuserss) return res.render('teachers/index', {errorMessage:'Error: User Exists',
        as: as, username: usernames, asnames: asnames,
        suser: snames, dupnames: sdupeo, dupas: asdupeo});

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
        as: as, username: usernames, asnames: asnames,
        suser: snames, dupnames: sdupeo, dupas: asdupeo})
    } catch (err) {
        console.log(err.message);
        res.render('teachers/index', {errorMessage:'Error in Saving',
        as: as, username: usernames, asnames: asnames,
        suser: snames, dupnames: sdupeo, dupas: asdupeo});
    }
});

router.post('/asadd/:name', async (req, res) => { 
  const asnames = await AsNames.find().sort({ name: 1 })
  const snames = await Suser.find()
  const usernames = req.params.name
  const as = await As.find({})
  const errors = validationResult(req);
  var sdupe = []
  var asdupe = []
  var sdupeo = []
  var asdupeo = []
  asdata.forEach( asdata =>{
    sdupe.push(asdata.name)
    asdupe.push(asdata.asname)
  })
  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < sdupe.length; j++) { 
      for (k = 0; k < sdupeo.length; k++) { 
          if ( sdupe[j] == sdupeo[k] ) { 
              start = true; 
          } 
      } 
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
          } 
      } 
      count++; 
      if (count == 1 && start == false) { 
        asdupeo.push(asdupe[j]); 
      } 
      start = false; 
      count = 0; 
  }
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
      as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo});

      asname = new As({
        name,
        description,
        credits,
        weeks
      })

      await asname.save();
      res.render('teachers/index', {successMessage:'AS Successfully Added',
      as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo})

    } catch (err){
      console.log(err.message);
      res.render('teachers/index', {errorMessage:'Error in Saving',
        as: as, username: usernames, asnames: asnames,
        suser: snames, dupnames: sdupeo, dupas: asdupeo});
    }
  

})

router.post('/studentasadd/:name', async (req, res) => {
  const asnames = await AsNames.find().sort({ name: 1 })
  const snames = await Suser.find()
  var sdupe = []
  var asdupe = []
  var sdupeo = []
  var asdupeo = []
  asnames.forEach( asnames =>{
    sdupe.push(asnames.name)
    asdupe.push(asnames.asname)
  })
  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < sdupe.length; j++) { 
      for (k = 0; k < sdupeo.length; k++) { 
          if ( sdupe[j] == sdupeo[k] ) { 
              start = true; 
          } 
      } 
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
          } 
      } 
      count++; 
      if (count == 1 && start == false) { 
        asdupeo.push(asdupe[j]); 
      } 
      start = false; 
      count = 0; 
  }
  try {
    const as = await As.find({})
    const asname = req.body.asname
    const usernames = req.params.name
    const name = req.body.name
    
    asdata = await AsNames.find({'name': name})

    var ifexists = await AsNames.find({'name': name})
    var exists = []
    ifexists.forEach( ifexists =>{
      exists.push(ifexists.asname)
    })

    number = Number(asname)

    var test = (exists.includes(number))

    if (test == true) return res.render('teachers/index', {errorMessage:'As already exists',
    as: as, username: usernames, asnames: asnames,
    suser: snames, dupnames: sdupeo, dupas: asdupeo})
    
    if (!asname) return res.render('teachers/index',{
      errorMessage: 'Error: As does not exist',
      as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo
    })

    if (!name) return res.render('teachers/index',{
      errorMessage: 'Error: Student does not exist',
      as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo
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


    var assave = new AsNames({
      name,
      asname,
      asdate
    })
    
    await assave.save()

    res.render('teachers/index',{
      successMessage: 'As succesfully added',
      as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo
    })


  } catch (e){
    console.error(e);
        res.redirect('/')
  }
})

router.post('/asdelete/:name', async (req, res) => {
  const usernames = req.params.name
  const name = req.body.name
  const asname = req.body.asname
  const as = await As.find()
  const asnames = await AsNames.find().sort({ name: 1 })
  const snames = await Suser.find()
  var sdupe = []
  var asdupe = []
  var sdupeo = []
  var asdupeo = []
  asnames.forEach( asnames =>{
    sdupe.push(asnames.name)
    asdupe.push(asnames.asname)
  })
  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < sdupe.length; j++) { 
      for (k = 0; k < sdupeo.length; k++) { 
          if ( sdupe[j] == sdupeo[k] ) { 
              start = true; 
          } 
      } 
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
          } 
      } 
      count++; 
      if (count == 1 && start == false) { 
        asdupeo.push(asdupe[j]); 
      } 
      start = false; 
      count = 0; 
  }
 
  if (!asname) return res.render('teachers/index',{
    errorMessage: 'As does not exist',
    as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo
  })

  if (!name) return res.render('teachers/index',{
    errorMessage: 'Student does not exist',
    as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo
  })

  name.toLowerCase()

  var ifexists = await AsNames.find({'name': name})
  var exists = []
  ifexists.forEach( ifexists =>{
    exists.push(ifexists.asname)
  })

  number = Number(asname)

  var test = (exists.includes(number))

  if (test == false) return res.render('teachers/index', {errorMessage:'As does not exist for student',
  as: as, username: usernames, asnames: asnames,
  suser: snames, dupnames: sdupeo, dupas: asdupeo})

  try {
    await AsNames.deleteOne({'name': name, 'asname': asname})
    res.render('teachers/index',{
      successMessage: 'As Deleted',
      as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo})
  } catch(e) {
    console.error(e);
    res.redirect('/')
  }
})

router.post('/asdate/:name', async (req, res) => {
  const usernames = req.params.name
  var name = req.body.name
  const asname = req.body.asname
  const as = await As.find()
  const asnames = await AsNames.find().sort({ name: 1 })
  var asdata = await AsNames.find({'name': name})
  var sdupe = []
  var asdupe = []
  var sdupeo = []
  var asdupeo = []
  asnames.forEach( asnames =>{
    sdupe.push(asnames.name)
    asdupe.push(asnames.asname)
  })
  var count = 0;    
  // Start variable is used to set true 
  // if a repeated duplicate value is  
  // encontered in the output array. 
  var start = false; 
    
  for (j = 0; j < sdupe.length; j++) { 
      for (k = 0; k < sdupeo.length; k++) { 
          if ( sdupe[j] == sdupeo[k] ) { 
              start = true; 
          } 
      } 
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
          } 
      } 
      count++; 
      if (count == 1 && start == false) { 
        asdupeo.push(asdupe[j]); 
      } 
      start = false; 
      count = 0; 
  }

  const snames = await Suser.find()
 
  if (!asname) return res.render('teachers/index',{
    errorMessage: 'As does not exist',
    as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo
  })

  if (!name) return res.render('teachers/index',{
    errorMessage: 'Student does not exist',
    as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo
  })

  name.toLowerCase()

  var exists = []
  asdata.forEach( asdata =>{
    exists.push(asdata.asname)
  })

  number = Number(asname)

  var test = (exists.includes(number))

  if (test == false) return res.render('teachers/index', {errorMessage:'As does not exist for student',
  as: as, username: usernames, asnames: asnames,
  suser: snames, dupnames: sdupeo, dupas: asdupeo})

  var asdate = new Date()
  asdate = req.body.date

  try {
    await AsNames.updateOne({'name': name, 'asname': asname}, {'asdate': asdate})
    res.render('teachers/index',{
      successMessage: 'Due Date Updated',
      as: as, username: usernames, asnames: asnames,
      suser: snames, dupnames: sdupeo, dupas: asdupeo})
  } catch(e) {
    console.error(e);
    res.redirect('/')
  }
})

function toTitleCase( str ) {
  return str.split(/\s+/).map( s => s.charAt( 0 ).toUpperCase() + s.substring(1).toLowerCase() ).join( " " );
}




module.exports = router