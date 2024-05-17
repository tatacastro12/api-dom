const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
    console.log('Nuevo cliente conectado');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);  // Asegúrate de que el mensaje se interpreta como JSON
            console.log('Mensaje recibido del cliente:', data);

            // Reenviar el mensaje a todos los clientes conectados
            if (['colorChange', 'sizeChange', 'backgroundChange'].includes(data.type)) {
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(data));  // Envía el mensaje como JSON
                    }
                });
            }
        } catch (error) {
            console.error('Error al procesar el mensaje:', error);
        }
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

console.log('Servidor WebSocket está escuchando en ws://localhost:3000');


