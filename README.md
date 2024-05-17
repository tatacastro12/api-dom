# API DOM con WebSocket

Este proyecto demuestra cómo utilizar WebSockets para comunicar cambios en el DOM entre un servidor y un cliente. Incluye funcionalidades para cambiar el color del texto, el tamaño del texto y el color de fondo de la página.

## Requisitos

- Node.js
- Un navegador web

## Instalación

1. Clona este repositorio o copia los archivos en tu máquina local.

2. Navega al directorio del proyecto y ejecuta el siguiente comando para instalar las dependencias necesarias:
   ```bash
   npm install

Inicia el servidor WebSocket ejecutando:
node server.js

Archivos
server.js

Este archivo contiene el código del servidor WebSocket

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
    console.log('Nuevo cliente conectado');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Mensaje recibido del cliente:', data);

            if (['colorChange', 'sizeChange', 'backgroundChange'].includes(data.type)) {
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(data));
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


index.html

Este archivo contiene el código del cliente y debe abrirse en un navegador web.

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API DOM</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            transition: background-color 0.3s, color 0.3s;
        }
        .color-option {
            display: inline-block;
            width: 30px;
            height: 30px;
            margin-right: 10px;
            cursor: pointer;
            border-radius: 50%;
        }
        .size-option {
            display: inline-block;
            padding: 5px 10px;
            margin-right: 10px;
            cursor: pointer;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h1 id="titulo">Este es un título</h1>
    <p id="parrafo">Este es un párrafo de ejemplo.</p>

    <div id="colorOptions">
        <div class="color-option" style="background-color: red;" onclick="selectColor('red')"></div>
        <div class="color-option" style="background-color: blue;" onclick="selectColor('blue')"></div>
        <div class="color-option" style="background-color: green;" onclick="selectColor('green')"></div>
        <div class="color-option" style="background-color: yellow;" onclick="selectColor('yellow')"></div>
        <div class="color-option" style="background-color: orange;" onclick="selectColor('orange')"></div>
        <div class="color-option" style="background-color: purple;" onclick="selectColor('purple')"></div>
    </div>

    <div id="sizeOptions">
        <div class="size-option" onclick="decreaseSize()">Pequeño</div>
        <div class="size-option" onclick="selectSize('20px')">Mediano</div>
        <div class="size-option" onclick="increaseSize()">Grande</div>
    </div>

    <button onclick="toggleBackground()">Cambiar Fondo</button>

    <script>
        const ws = new WebSocket('ws://localhost:3000');
        let fontSize = 20;
        let backgroundColor = 'white';

        ws.onopen = () => {
            console.log('Conectado al servidor WebSocket');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Mensaje recibido:', data);

            if (data.type === 'colorChange') {
                const color = data.color;
                document.getElementById('titulo').style.color = color;
                document.getElementById('parrafo').style.color = color;
            } else if (data.type === 'sizeChange') {
                const size = data.size;
                document.getElementById('titulo').style.fontSize = size;
                document.getElementById('parrafo').style.fontSize = size;
            } else if (data.type === 'backgroundChange') {
                const bgColor = data.backgroundColor;
                document.body.style.backgroundColor = bgColor;
                updateContrastColor(bgColor);
            }
        };

        function selectColor(color) {
            const message = {
                type: 'colorChange',
                color: color
            };
            ws.send(JSON.stringify(message));
        }

        function selectSize(size) {
            const message = {
                type: 'sizeChange',
                size: size
            };
            ws.send(JSON.stringify(message));
        }

        function increaseSize() {
            fontSize += 2;
            const size = fontSize + 'px';
            const message = {
                type: 'sizeChange',
                size: size
            };
            ws.send(JSON.stringify(message));
        }

        function decreaseSize() {
            fontSize = Math.max(10, fontSize - 2);
            const size = fontSize + 'px';
            const message = {
                type: 'sizeChange',
                size: size
            };
            ws.send(JSON.stringify(message));
        }

        function updateContrastColor(bgColor) {
            const isDark = bgColor === 'black';
            const textColor = isDark ? 'white' : 'black';
            document.getElementById('titulo').style.color = textColor;
            document.getElementById('parrafo').style.color = textColor;
        }

        function toggleBackground() {
            backgroundColor = backgroundColor === 'white' ? 'black' : 'white';
            const message = {
                type: 'backgroundChange',
                backgroundColor: backgroundColor
            };
            ws.send(JSON.stringify(message));
        }
    </script>
</body>
</html>

Funcionamiento
Servidor (server.js)

    Configura un servidor WebSocket que escucha en el puerto 3000.
    Al recibir una conexión, muestra un mensaje en la consola.
    Al recibir un mensaje de un cliente, lo analiza y reenvía el mensaje a todos los clientes conectados.

Cliente (index.html)

    Conecta al servidor WebSocket en ws://localhost:3000.
    Proporciona opciones de color para cambiar el color del texto del título y del párrafo.
    Proporciona opciones de tamaño para cambiar el tamaño del texto del título y del párrafo.
    Proporciona un botón para alternar el color de fondo entre blanco y negro.
    Al recibir mensajes del servidor, actualiza el DOM en consecuencia.

Funciones del Cliente

    selectColor(color): Envía un mensaje al servidor para cambiar el color del texto.
    selectSize(size): Envía un mensaje al servidor para cambiar el tamaño del texto.
    increaseSize(): Aumenta el tamaño del texto y envía un mensaje al servidor.
    decreaseSize(): Disminuye el tamaño del texto y envía un mensaje al servidor.
    updateContrastColor(bgColor): Actualiza el color del texto según el color de fondo.
    toggleBackground(): Alterna el color de fondo entre blanco y negro y envía un mensaje al servidor.

Uso

    Inicia el servidor WebSocket con node server.js.
    Abre index.html en un navegador web.
    Usa los controles de la página para cambiar el color del texto, el tamaño del texto y el color de fondo.

Notas

    Asegúrate de que el servidor WebSocket esté en ejecución antes de abrir index.html en el navegador.
    Si el servidor no está en ejecución, el cliente no podrá enviar ni recibir mensajes.
