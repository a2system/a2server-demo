let mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

let log = App.log.child({module:'producto Schema'});

let pruebaProductoSchema = new Schema({
  nombre    : {type: String, required: true},
  sku       : {type: String, required: true, unique: true},
  categoria : {type: [String]},
  precio    : {type: Number, min: 0},
  inventario: {type: Number, min: 0},
  detalles  : {type: String},
  cDate     : {type: Date, default: Date.now} 
});

pruebaProductoSchema.pre('save', function(next, ctx) {
  if(this.isModified('inventario')){
    if(this.inventario < 5){
      this.detalles = 'Quedan pocos...';
    } else this.detalles = 'Quedan muchos!';
   }
  next(); 
});

pruebaProductoSchema.post('remove', function(doc){
  let smsService = new App.SMS();
  let telAdmin = 34673350577;  // Number: en formato 34600123123
  let correoAdmin = 'maga.napanga@gmail.com';  // String
  let msg = doc.nombre + ' ha sido removido del inventario!';
  
  App.email.send({
    to      : correoAdmin,
    subject : 'Correo de Administración: Prueba-Productos v7',
    text    : msg
  })
  .then( resp => smsService.sendSms({to: telAdmin, msg: msg}))
  .then( resp => {
    log.debug('Notificación Inventario OK');
  })
  .catch( err => log.error(err));
});

module.exports = pruebaProductoSchema;