//code for rendering the home page of the cbuilder website
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;