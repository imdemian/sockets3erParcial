const socket = io();

// MOSTRAR PRODUCTOS
socket.on("servidorEnviarProductos", (productos) => {
    let tr = "";
    productos.forEach((producto, idLocal) => {
        tr += `
            <tr>
                <td>${(idLocal + 1) * 10}</td>
                <td>${producto.nombre}</td>
                <td>${producto.precio}</td>
                <td>${producto.cantidad}</td>
                <td>
                    <a href="#" onclick="editarProducto('${producto._id}')">Editar</a> / 
                    <a href="#" onclick="borrarProducto('${producto._id}')">Borrar</a>
                </td>
            </tr>
        `;
    });
    document.getElementById("datos").innerHTML = tr;
});

// GUARDAR PRODUCTO
var formNuevoProducto = document.getElementById("formNuevoProducto");
var datosProductos = document.getElementById("datos");
var mensajesProductos = document.getElementById("mensajesProductos");
formNuevoProducto.addEventListener("submit", (e) => {
    e.preventDefault();
    var producto = {
        id: document.getElementById("id").value,
        nombre: document.getElementById("nombre").value,
        precio: document.getElementById("precio").value,
        cantidad: document.getElementById("cantidad").value
    }
    socket.emit("clienteGuardarProducto", producto);
    socket.on("servidorProductoGuardado", (mensaje) => {
        console.log("Producto guardado");
        mensajesProductos.innerHTML = mensaje;
        document.getElementById("nombre").value = "";
        document.getElementById("precio").value = "";
        document.getElementById("cantidad").value = "";
        document.getElementById("nombre").focus();
        setTimeout(() => { mensajesProductos.innerHTML = "" }, 3000);
    });
});

// EDITAR PRODUCTO
function editarProducto(id) {
    console.log("Estás en editar producto " + id);
    socket.emit("clienteObtenerProductoId", id);
    socket.on("servidorObtenerProductoId", (producto) => {
        document.getElementById("tituloFormulario").innerHTML = "Editar producto";
        document.getElementById("textoBoton").innerHTML = "Editar producto";
        document.getElementById("id").value = producto._id;
        document.getElementById("nombre").value = producto.nombre;
        document.getElementById("precio").value = producto.precio;
        document.getElementById("cantidad").value = producto.cantidad;
    });
}

// BORRAR PRODUCTO
function borrarProducto(id) {
    socket.emit("clienteBorrarProducto", id);
}
