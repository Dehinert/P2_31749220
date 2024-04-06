var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', otra : 'HOLA MUNDO', 
  firstname: 'Dehinert', lastname: 'Moran' , id: '31749220', sec: '2' 
});
});

module.exports = router;
