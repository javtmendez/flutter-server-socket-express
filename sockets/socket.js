const Client = require('socket.io/lib/client');
const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands =new Bands()
bands.addBand(new Band('LUNA AZUL'));
bands.addBand(new Band('CANTERA'));
bands.addBand(new Band('GLOBAL'));
bands.addBand(new Band('XELAJU'));
//mensajes de sockets

io.on('connection', client => {
    console.log( 'cliente conectado' ); 
 
    client.emit('active-bands',bands.getBands());
  
    client.on('disconnect', () => {
      console.log( 'cliente desconectado' )
    });

    client.on('mensaje',(payload)=>{
        console.log('mensaje',payload);
        //emite un mensaje atraves del payload
        io.emit('mensaje',{admin:'nuevo mensaje'});
    }
    );
    //votacion de las bandas
    client.on('vote-band',(payload)=>{
        bands.voteBand(payload.id);
        io.emit('active-bands',bands.getBands());

    });
    
    client.on('add-band',(payload)=>{
        const newBand=new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands',bands.getBands());

    }) ;
    client.on('delete-band',(payload)=>{
        bands.deleteBAnd(payload.id);
        io.emit('active-bands',bands.getBands());

    }); 
    // client.on('emitir-mensaje',(payload)=>{
       
    //     //emite un mensaje atraves del payload
    //     // io.emit('nuevo-mensaje',payload);
    //     //emite unicamente a los otros menos a mi
    //     client.broadcast.emit('nuevo-mensaje',payload);
    // }
    // );

});
