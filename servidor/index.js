const express = require('express')
const app = express()
const port = 3000
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public2'))

var usuariosConectados = 0;
// app.get('/', (req, res) => {
//   res.send('<h1>Segunda prueba con NodeJS</h1>')
// })

io.on('connection', (socket) => {
    socket.nombre="";
    usuariosConectados ++;
    console.log('Usuario conectado, hay un total de ' + usuariosConectados + ' usuarios conectados');

    // recibe el nombre del usuario
    socket.on('nombre', function(nombre) {
        console.log('Usuario: ' + nombre);
        datoNombre = {
          nuevoNombre:nombre,
          antiguoNombre:socket.nombre
        };

        socket.nombre = nombre;

        io.emit('nuevoUsuarioServidor', datoNombre);
        io.emit('alerta', false);
        // socket.broadcast.emit('nuevoUsuarioServidor', nombre);

    });

    // muestra cuando se desconecta un usuario
    socket.on('disconnect', () => {
        usuariosConectados --;
        console.log(`Usuario ${socket.nombre} desconectado, hay un total de ` + usuariosConectados + ' usuarios conectados');
        // io.on.emit('numUsuarios', usuariosConectados);
    });

    // recibe el mensaje del usuario
    socket.on('mensajeChat', function(mensaje) {
      if(socket.nombre==""){
        io.emit('alerta', true);
      }
      else{
        io.emit('alerta', false);
        datosMensaje = {
          mensaje:mensaje,
          nombre:socket.nombre
        };
        io.emit('mensajeServidor', datosMensaje);
      }
    });

});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})