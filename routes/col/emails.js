
let express = require('express');
let router  = express.Router();
let log     = App.log.child({module:'email'});


router.post('/send', (req, res, next) =>{
  log.info("Send Email: " + req.body.to);
  
  App.email.send({
    to      : req.body.to,
    subject : req.body.subject,
    text    : req.body.text || undefined,
    html    : req.body.html || undefined
  })
  .then( resp => {
    log.info('Send Email OK');
    res.json({"resp": resp });
  })
  .catch( err => {
    log.error(err);
    next(App.err.notAcceptable(err));
  });
});

module.exports = router;
