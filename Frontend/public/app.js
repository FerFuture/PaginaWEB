// Inicializa el contador del carrito a 0.
let productosEnCarrito = [];

// Función para aumentar la cantidad en el carrito de un producto específico.
function agregarAlCarrito(productId) {
  productosEnCarrito.push(productId); // Agregar el id del producto al array

  actualizarContadorCarrito();
  actualizarCantidadEnCarrito(productId);
}

// Función para disminuir la cantidad en el carrito de un producto específico.
function quitarDelCarrito(productId) {
  // Elimina el producto del array productosEnCarrito
  productosEnCarrito = productosEnCarrito.filter(id => id !== productId);

  actualizarContadorCarrito();
  actualizarCantidadEnCarrito(productId);
}


// Función para actualizar el contador del carrito en el DOM.
function actualizarContadorCarrito() {
  const contadorCarrito = document.querySelector('.contador-carrito');
  contadorCarrito.textContent = productosEnCarrito.length; // Usar la longitud del array
}

// Función para actualizar la cantidad en el carrito de un producto en el DOM.
function actualizarCantidadEnCarrito(productId) {
  // Encuentra todos los elementos con el atributo data-product-id igual al productId
  const cantidadElement = document.querySelectorAll(`[data-product-id="${productId}"] .cantidad`);
  
  if (cantidadElement) {
    const cantidad = productosEnCarrito.filter(id => id === productId).length;
    
    cantidadElement.forEach(element => {
      element.textContent = cantidad;
    });
  }
}



// Generar productos en el html
function displayProductos(productsList) {
  let productoHTML = '';
  productsList.forEach((element, index) => {
    productoHTML +=
  `<div class="producto" data-product-id="${element.id}">
     <img src="${element.image}" alt="Producto 1">
     <h3>${element.name}</h3>
     <p>${element.price}</p>
     <p>Cantidad en el carrito: <span class="cantidad">0</span></p>
     <button class="agregar" onclick="agregarAlCarrito(${element.id})">Agregar al Carrito</button>
     <button class="quitar" onclick="quitarDelCarrito(${element.id})">Quitar del Carrito</button>
  </div>`;
  });
  document.getElementById('page-content').innerHTML = productoHTML;
}

window.onload = async () => {
  const productsList = await (await fetch("/api/productos")).json();
  displayProductos(productsList);
}



// Función para abrir el carrito
function abrirCarrito() {
  const modal = document.getElementById('carrito-modal');
  modal.style.display = 'block';

  // Llenar el contenido del carrito
  const carritoProductos = document.getElementById('carrito-productos');
  carritoProductos.innerHTML = '';

  // Crear un objeto para realizar un seguimiento de las cantidades de cada producto
  const cantidadPorProducto = {};

  productosEnCarrito.forEach(productId => {
    if (!cantidadPorProducto[productId]) {
      cantidadPorProducto[productId] = 1;
    } else {
      cantidadPorProducto[productId]++;
    }
  });

  // Calcular el total y llenar el contenido del carrito
  let total = 0;

  for (const productId in cantidadPorProducto) {
    const cantidad = cantidadPorProducto[productId];
    const producto = document.querySelector(`[data-product-id="${productId}"]`);
    const imagenProducto = producto.querySelector('img').src;
    const precioProductoStr = producto.querySelector('p').textContent.replace('$', '');
    const precioProducto = parseFloat(precioProductoStr);
    const subtotal = precioProducto * cantidad;
    total += subtotal;

    // Agrega la imagen del producto al carrito con una clase para el tamaño
    carritoProductos.innerHTML += `<div class="producto-carrito">
      <img class="imagen-carrito" src="${imagenProducto}" alt="Producto en el carrito">
      <p>Cantidad: ${cantidad}</p>
      <p>Subtotal: $${subtotal.toFixed(2)}</p>
    </div>`;
  }

  // Mostrar el total
  const totalPrecio = document.getElementById('total-precio');
  totalPrecio.textContent = total.toFixed(2);
}

  
  

  // Función para cerrar el carrito (cerrar el modal)
function cerrarCarrito() {
    const modal = document.getElementById('carrito-modal');
    modal.style.display = 'none';
  }
  
  // Llamar a la función cerrarCarrito() cuando se haga clic en la "X" del modal
  document.querySelector('.close').addEventListener('click', cerrarCarrito);
  
  function completarCompra() {
    // Coloca aquí el código para completar la compra, como enviar los detalles del carrito al servidor, procesar el pago, etc.
    // Por ahora, solo mostraremos un mensaje de ejemplo.
    console.log(productosEnCarrito);
  }