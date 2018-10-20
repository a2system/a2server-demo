/**
 *  @module boot - Settings iniciales para App
 *  @description Si existe entonces se ejecuta.
 *   En este se pueden colocar Servicios o settings iniciales
 *  @example
 *    fs.access('./app/servers/ubikable.js', fs.R_OK , (err) => {
    if(!err){
      var UbikableServer = require('./servers/ubikable');
      new UbikableServer(App);
    }else {
      log.error(err);      
    }
}
 */
module.exports = Boot;

var log;
function Boot(App) {
  let initMS = (new Date()).getTime();
  var log    = App.log.child({ module: 'boot' });

  log.info('Boot Init');

  // Geo IP
  log.info('Loading GeoIP lite...');
  let geoip = require('geoip-lite');
  // geoip.startWatchingDataUpdate();
  // // storage reference list
  // log.info('Loading Storage References...');
  // let storageReferences = {
  //   'temporal': { service: 'local',  container: 'temporal-uploads',   pathPrefix: '' },
  //   'profile':  { service: 'gcloud', container: 'tourme-3-141592653', pathPrefix: 'profile/' },
  //   'vehicle':  { service: 'gcloud', container: 'tourme-3-141592653', pathPrefix: 'vehicle/' }
  // };
  // App.Storage.setReferences(storageReferences);
  
  // Inicialización de Push
  App.push.init();

  log.info('Total Boot time: ' + ((new Date()).getTime() - initMS) + 'ms');
}
