const socket = io();

let usuario = '';

Swal.fire({
    title: 'Ingresa un correo',
    input: 'text',
    confirmButtonText: 'Ingresar'
}).then((result) => {
    usuario = result.value;
});

const caja = document.getElementById('caja');
const contenido = document.getElementById('contenido');

caja.addEventListener('change', (e) => {
    socket.emit('mensaje', {
        correo: usuario,
        mensaje: e.target.value,
        fecha: new Date(),
        tiempo: new Date().toLocaleString()
    });
});

socket.on('nuevoMensaje', (data) => {
    const mensajes = data.map(({correo, mensaje, tiempo}) => {
        return `<p> ${tiempo} - ${correo} comentó: ${mensaje}</p>`;
    });

    contenido.innerHTML = mensajes.join('');
});