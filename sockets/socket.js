const Usuario = require("../modelos/usuario");
const Producto = require("../modelos/producto");

function socket(io) {
    io.on("connection", async (socket) => {
        // Funciones relacionadas con usuarios
        async function mostrarUsuarios() {
            try {
                var usuarios = await Usuario.find();
                io.emit("servidorEnviarUsuarios", usuarios);
            } catch (err) {
                console.log("Error al obtener los usuarios");
            }
        }

        socket.on("clienteGuardarUsuario", async (usuario) => {
            try {
                if (usuario.id == "") {
                    await new Usuario(usuario).save();
                    io.emit("servidorUsuarioGuardado", "Usuario guardado correctamente");
                } else {
                    await Usuario.findByIdAndUpdate(usuario.id, usuario);
                    io.emit("servidorUsuarioGuardado", "Usuario actualizado");
                }
                mostrarUsuarios();
            } catch (err) {
                console.log("Error al registrar al usuario");
            }
        });

        socket.on("clienteObtenerUsuarioId", async (id) => {
            io.emit("servidorObtenerUsuarioId", await Usuario.findById(id));
        });

        socket.on("clienteBorrarUsuario", async (id) => {
            await Usuario.deleteOne({ _id: id });
            mostrarUsuarios();
        });

        // Funciones relacionadas con productos
        async function mostrarProductos() {
            try {
                var productos = await Producto.find();
                io.emit("servidorEnviarProductos", productos);
            } catch (err) {
                console.log("Error al obtener los productos");
            }
        }

        socket.on("clienteGuardarProducto", async (producto) => {
            try {
                if (producto.id == "") {
                    await new Producto(producto).save();
                    io.emit("servidorProductoGuardado", "Producto guardado correctamente");
                } else {
                    await Producto.findByIdAndUpdate(producto.id, producto);
                    io.emit("servidorProductoGuardado", "Producto actualizado");
                }
                mostrarProductos();
            } catch (err) {
                console.log("Error al registrar al producto");
            }
        });

        socket.on("clienteObtenerProductoId", async (id) => {
            io.emit("servidorObtenerProductoId", await Producto.findById(id));
        });

        socket.on("clienteBorrarProducto", async (id) => {
            await Producto.deleteOne({ _id: id });
            mostrarProductos();
        });
        
        // Llamadas a funciones para mostrar usuarios y productos al establecer la conexión
        mostrarUsuarios();
        mostrarProductos();
    });
}

module.exports = socket;
