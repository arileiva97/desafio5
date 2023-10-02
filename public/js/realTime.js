const socket = io(); 

const productsContainer = document.getElementById('products');

socket.on('products', (products) => {
    const titles = products.map((product) => product.title);

    productsContainer.innerHTML = titles.join('<br/>');
});

socket.on('actualizarProductos', (products) => {
    const titles = products.map((product) => product.title);

    productsContainer.innerHTML = titles.join('<br/>');
});