var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.send('hello, I am the Admin')
  res.render('index', { title: 'Admin' });
});

module.exports = router;
