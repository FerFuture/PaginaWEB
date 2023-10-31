// Inicializa el contador del carrito a 0.
const carritoCount = [];

// Función para aumentar la cantidad en el carrito de un producto específico.
function agregarAlCarrito(index) {
  if (!carritoCount[index]) {
    carritoCount[index] = 1;
  } else {
    carritoCount[index]++;
  }
  actualizarContadorCarrito();
  actualizarCantidadEnCarrito(index);
}

// Función para disminuir la cantidad en el carrito de un producto específico.
function quitarDelCarrito(index) {
  if (carritoCount[index] > 0) {
    carritoCount[index]--;
    actualizarContadorCarrito();
    actualizarCantidadEnCarrito(index);
  }
}

// Función para actualizar el contador del carrito en el DOM.
function actualizarContadorCarrito() {
  const contadorCarrito = document.querySelector('.contador-carrito');
  contadorCarrito.textContent = carritoCount.reduce((total, cantidad) => total + cantidad, 0);
}

// Función para actualizar la cantidad en el carrito de un producto en el DOM.
function actualizarCantidadEnCarrito(index) {
  const cantidadEnCarrito = document.querySelectorAll('.cantidad')[index];
  if (cantidadEnCarrito) {
    cantidadEnCarrito.textContent = carritoCount[index];
  }
}

// Generar productos en el html
function displayProductos(productsList) {
  let productoHTML = '';
  productsList.forEach((element, index) => {
    productoHTML +=
      `<div class="producto">
         <img src="${element.image}" alt="Producto 1">
         <h3>${element.name}</h3>
         <p>${element.price}</p>
         <p>Cantidad en el carrito: <span class="cantidad">0</span></p>
         <button class="agregar" onclick="agregarAlCarrito(${index})">Agregar al Carrito</button>
         <button class="quitar" onclick="quitarDelCarrito(${index})">Quitar del Carrito</button>
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
  
    // Calcular el total y llenar el contenido del carrito
    let total = 0;
  
    carritoCount.forEach((cantidad, index) => {
      if (cantidad > 0) {
        const producto = document.getElementById('page-content').getElementsByClassName('producto')[index];
        const imagenProducto = producto.querySelector('img').src; // Obtiene la URL de la imagen
        const precioProductoStr = producto.querySelector('p').textContent.replace('$', ''); // Elimina el signo "$"
        const precioProducto = parseFloat(precioProductoStr); // Convierte el precio a número
        const subtotal = precioProducto * cantidad;
        total += subtotal;
  
        // Agrega la imagen del producto al carrito con una clase para el tamaño
        carritoProductos.innerHTML += `<div class="producto-carrito">
          <img class="imagen-carrito" src="${imagenProducto}" alt="Producto en el carrito">
          <p>Cantidad: ${cantidad}</p>
          <p>Subtotal: $${subtotal.toFixed(2)}</p>
        </div>`;
      }
    });
  
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
  