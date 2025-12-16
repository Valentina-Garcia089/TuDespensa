# TuDespensa

TuDespensa es una aplicación web para la gestión de listas de supermercado personalizadas. Permite a cada usuario registrar los productos que necesita, administrar sus 
compras y simular pedidos para recoger en tienda, facilitando la organización y evitando olvidos.

Este proyecto corresponde a un trabajo grupal universitario. En esta versión se presenta el frontend, desarrollado por mí, utilizando datos simulados debido a que el backend
y la base de datos no fueron desplegados. Esta ultima fue una base de datos local.

---

## Características

- Gestión de listas de supermercado por usuario.
- Agregar, editar y eliminar productos de la lista.
- Simulación de pedido virtual para recoger en tienda o uso como lista personal.
- Visualización del historial de compras realizadas.
- Gestión de métodos de pago.
- Sistema de inicio de sesión con roles de usuario y administrador.
- Interfaz clara y orientada a la usabilidad.

---

## Tecnologías utilizadas

- HTML
- CSS
- JavaScript Vanilla

> Actualmente el proyecto no utiliza una base de datos activa.  
> Se trabajó originalmente con una base de datos local y se cuenta con el diagrama de diseño utilizado durante el desarrollo académico.

---

## Contexto del proyecto

Este proyecto fue desarrollado como parte de una asignatura universitaria y se realizó en equipo.  
Mi participación se centró en el desarrollo del frontend, incluyendo:

- Maquetación y diseño de la interfaz
- Lógica del lado del cliente
- Flujo de interacción del usuario
- Integración visual con datos simulados

El backend y la base de datos no forman parte de esta versión mostrada.

---

## Modelo de base de datos

Durante el desarrollo del proyecto se diseñó un modelo de base de datos relacional para soportar la gestión de usuarios, productos, compras y roles.

Aunque la base de datos no fue desplegada en esta versión, el diagrama refleja la estructura pensada para el sistema y fue utilizado durante el desarrollo
académico del proyecto.

![Diagrama de base de datos](/frontend/assets/Diagrama.png)


---

## Usuarios de prueba

Debido al uso de datos quemados, el acceso se realiza con usuarios predefinidos:

```js
{
    id: 1,
    nombre: "Valentina",
    correo: "vale@test.com",
    contrasena: "1234",
    rol: "usuario"
},
{
    id: 2,
    nombre: "Admin",
    correo: "admin@test.com",
    contrasena: "admin",
    rol: "admin"
}
```
---

## Estado del proyecto

Finalizado.
