// Inicializa el contador del carrito a 0.
let productosEnCarrito = [];
let productsList = [];

// Función para aumentar la cantidad en el carrito de un producto específico.
function agregarAlCarrito(productId) {
  const product = productsList.find(p => p.id === productId);

  if (product.stock > 0) {
    product.stock--;
    productosEnCarrito.push(productId);
  }

  displayProductos();
  actualizarContadorCarrito();
  actualizarCantidadEnCarrito(productId);
}

// Función para disminuir la cantidad en el carrito de un producto específico.
function quitarDelCarrito(productId) {
  const index = productosEnCarrito.indexOf(productId);

  if (index !== -1) {
    const product = productsList.find(p => p.id === productId);
    product.stock++;
    productosEnCarrito.splice(index, 1);
    displayProductos();
    actualizarContadorCarrito();
    actualizarCantidadEnCarrito(productId);
  }
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
function displayProductos() {
  let productoHTML = '';
  productsList.forEach((p, index) => {
    let buttonHTML = '';

    if (p.stock <= 0) {
      buttonHTML = `<button disabled class="agregar">Sin stock</button>`;
    } else {
      buttonHTML = `<button class="agregar" onclick="agregarAlCarrito(${p.id})">Agregar al Carrito</button>`;
    }

    productoHTML +=
      `<div class="producto" data-product-id="${p.id}">
         <img src="${p.image}" alt="Producto 1">
         <h3>${p.name}</h3>
         <p>precio $${p.price}</p>
         <p>Cantidad en el carrito: <span class="cantidad">0</span></p>
         ${buttonHTML}
         <button class="quitar" onclick="quitarDelCarrito(${p.id})">Quitar del Carrito</button>
      </div>`;
  });
  document.getElementById('page-content').innerHTML = productoHTML;
}

window.onload = async () => {
  productsList = await (await fetch("/api/productos")).json();
  displayProductos();
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
    const precioProductoStr = producto.querySelector('p').textContent.replace('$', '').replace(/[^0-9.]/g, '');
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
  
  async function completarCompra() {
    try {
      // Envía la lista de productos en el carrito al backend
      const response = await fetch("/api/pay", {
        method: "post",
        body: JSON.stringify(productosEnCarrito),
        headers: {
          "content-type": "application/json",
        },
      });
  
      if (response.ok) {
        const productsList = await response.json();
        console.log("Compra completada exitosamente:", productsList);
      } else {
        console.log("Error al procesar la compra");
      }
  
      productosEnCarrito = [];
    } catch (error) {
      console.error("Error en completarCompra:", error);
    }
  }
  
 // Agrega esta función al final de tu archivo app.js
// Modifica esta función al final de tu archivo app.js
const hamburguesaContainer = document.getElementById('hamburguesa-container');
const hamburguesaIcon = document.getElementById('hamburguesa-icon');
const menuDesplegable = document.getElementById('menu-desplegable');

hamburguesaContainer.addEventListener('click', function() {
  menuDesplegable.style.left = (menuDesplegable.style.left === '0px') ? '-250px' : '0px';
  hamburguesaIcon.classList.toggle('cerrar');
});

// Si deseas que el menú se cierre al hacer clic en cualquier parte del documento, puedes agregar el siguiente código:
document.addEventListener('click', function(event) {
  if (!hamburguesaContainer.contains(event.target) && !menuDesplegable.contains(event.target)) {
    menuDesplegable.style.left = '-250px';
    hamburguesaIcon.classList.remove('cerrar');
  }
});


