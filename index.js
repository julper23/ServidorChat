const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

//Puerto del servidor
const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

//Conexion con el cliente
io.on("connection", (socket) => {
  console.log(`El ciente ${socket.id} se ha conectado`);

  // recogemos la id de la sala a la cual queremos conectar el cliente
  const { roomId } = socket.handshake.query;
  //Conectamos el cliente a la sala
  socket.join(roomId);

  //Si el cliente envia un mensaje, lo reenviamos
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    /*Cuando tenemos un nuevo mensaje lanzamos el evento 
    *de nuevo mensaje a la sala en la que esta el cliente
    *enviando la id del cliente que lo ha enviado y el mensaje como tal
    *En este punto se reenvia tambien al provio cliente que lo ha enviado
    */
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  //Si el cliente se cierra, se le desconecta del servidor
  socket.on("disconnect", () => {
    console.log(`El cliente ${socket.id} se ha desconectado`);
    socket.leave(roomId);
  });
});

//Lanzamos el servidor por el puerto especificado
server.listen(PORT, () => {
  console.log(`Escuchando en el puerto: ${PORT}`);
});
