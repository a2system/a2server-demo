
let express = require('express');
let router  = express.Router();
let log     = App.log.child({module:'geo'}); //<-Sustituir por el nombre

let geoip = require('geoip-lite');
let exec = require('child_process').exec;

router.get('/git-test', (req, res, next) =>{
  let branch = 'master';
  
  res.json({
    'resp': 'Prueba GIT: ésta es la rama -->> ' + branch + ' <<--',
    'branch': branch
  });
});

router.get('/donde', (req, res, next) =>{ 
  let geo;
  let ip    = req.headers["X-Forwarded-For"] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (ip) {
    ip       = ip.substring( ip.lastIndexOf(':') + 1 );
  }
  geo  = geoip.lookup(ip);
  if (ip && geo) {
    geo.ip = ip;
    res.json(geo);
  } else {
    next(App.err.notFound('Country not found (IP: ' + ip + ')'));
  }
});

router.get('/exec', (req, res, next) =>{ 

  exec('php -v', (error, stdout, stderr) => {
    if (!error) {
      res.json({
        'stdout': stdout,
        'stderr': stderr
      });
    } else {
      next(App.err.notAcceptable(error));
    }
  });
});


router.post('/exec', (req, res, next) =>{ 
  let type = req.body.type;
  let file = req.body.file;
  let cli;
  
  switch(type){
    case 'php': {
      cli = 'php -f ' + 'app/scripts/' + file;
    } break;
    case 'node': {
      cli = 'node ' + 'app/scripts/' + file;
    } break;
    case 'bin': {
      cli = 'app/scripts/' + file + ' app/scripts/';
    } break;
  }

  exec(cli, (error, stdout, stderr) => {
    if (!error) {
      res.json({
        'stdout': stdout,
        'stderr': stderr
      });
    } else {
      next(App.err.notAcceptable(error));
    }
  });
});


module.exports = router;
