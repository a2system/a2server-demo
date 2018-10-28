
/* 
 * Modelo de datos 
 * @module 
 * @author 
*/

let mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

let log = App.log.child({module:'vehiculo Schema'});

let modelSchema = new Schema({  
  modelo    : {type: String, required: true, trim: true},
  matricula : {type: String, required: true, trim: true, unique: true},
  year      : {type: Number, required: true, min: 1900, max: 2018},
  detalles  : {type: String, trim: true},
  notificar : {type: String, trim: true},
  cDate     : {type: Date, default: Date.now}
});

modelSchema.pre('save', function(next, ctx) {
  log.debug('Pre Save - vehiculo');
  
  if(this.isModified('year')){
    if(this.year < 2000){
      this.detalles = 'Coche antiguo';
    } else if(this.year < 2015){
      this.detalles = 'Coche no tan antiguo';
    } else {
      this.detalles = 'Coche nuevo';
    }
  }
  
  next(); 
});

modelSchema.post('remove', function(doc){
  log.debug('Post Delete - vehiculo');

  let prom;
  
  if (doc.notificar) {
    prom = App.email.send({
      to      : doc.notificar,
      subject : 'Vehículo eliminado (' + doc.matricula + ')',
      text    : 'Modelo: ' + doc.modelo + '\nMatrícula: ' + doc.matricula + '\nAño: ' + doc.year
    });
  }
  
  Promise.resolve(prom)
    .then( resp => {
      log.debug('Notificación Inventario OK');
    })
    .catch( err => log.error(err));
});

module.exports = modelSchema; 

