# VentasLite — Frontend

Aplicación web SPA construida con React, TypeScript, Vite y Tailwind CSS. Consume el API Laravel de `../backend-ventaslite`. Frontend y backend son proyectos/repositorios independientes.

## Requisitos

- Node.js y npm compatibles con Vite 7.
- Backend iniciado en `http://127.0.0.1:8000` y base inicializada para tener acceso a los datos.

## Arrancar todo en local

Primero, en una terminal, prepara e inicia Laravel desde `../backend-ventaslite` siguiendo su README. Luego abre otra terminal en la raíz `frontend-ventaslite`:

```bash
npm install
npm run dev
```

Abre la dirección que reporte Vite, normalmente `http://localhost:5173`. Deja abiertas las dos terminales. Vite proxya las peticiones `/api` a Laravel, así que en desarrollo no se necesita habilitar CORS para el navegador.

Si el backend escucha en otro lugar, crea `frontend-ventaslite/.env.local` con:

```dotenv
VITE_PROXY_API_TARGET=http://127.0.0.1:8000
```

Para reiniciar, detén y vuelve a iniciar ambos servidores con `Ctrl+C` y los comandos anteriores.

## Cuenta de prueba

- Admin: `admin@ventaslite.test` / `password`.
- Vendedor: `vendedor.s01.01@ventaslite.test` / `password`.

Se crean al ejecutar `php artisan migrate --seed` en el backend. Son cuentas locales de desarrollo.

## Demo pública

- Aplicación: [VentasLite en Netlify](https://frontend-ventaslite.netlify.app/login).
- API: `https://prueba-tecnica-production-cf17e5ac.up.railway.app/api`.
- Administrador: `admin@ventaslite.test` / `password`.
- Vendedor: `vendedor.s01.01@ventaslite.test` / `password`.

Las cuentas son para la demostración de la prueba técnica y usan datos sembrados. No reutilices estas contraseñas fuera de ese entorno.

## Wireframe inicial

El prototipo previo al desarrollo está en Figma: [Prototipo VentasLite](https://www.figma.com/design/4afz1UyHiP5B5ETJtXBRzi/Prototipo-ventasLite?node-id=0-1&t=EvkQ7iMEhg9GzWAE-1). Asegúrate de que el enlace permita verlo a las personas que evalúen la prueba.

## Funciones

- Login, restauración de sesión, cierre de sesión y permisos con Laravel Sanctum.
- Dashboard con filtros, indicadores, ventas por mes, productos, ranking, matriz por sucursal/categoría, márgenes y exportación CSV.
- Panel de IA para preguntas sobre reportes y resumen ejecutivo, con estado del proveedor y consumo de tokens reportado por el backend.
- Punto de venta con catálogo, filtro, existencias, carrito y registro de ventas.
- Historial con filtros, detalle y cancelación autorizada.
- Diseño responsivo, estados de carga, avisos, y temas claro/oscuro.

## Organización del código

- `src/app`: rutas, guards, proveedores globales y layout.
- `src/features`: módulos por dominio (`auth`, `catalog`, `dashboard`, `pos`, `sales`).
- Cada módulo organiza sus páginas, componentes, tipos y acceso API donde corresponde.
- `src/shared`: cliente Axios y utilidades comunes.
- `src/styles`: estilos globales; los estilos de un módulo viven junto a ese módulo.
- `docs/`: notas técnicas del frontend y correcciones registradas.

Las páginas coordinan datos y estado de cada pantalla; componentes hijos renderizan áreas concretas y reciben datos/acciones mediante props. Así se puede cambiar una pieza sin convertir todas las pantallas en un único componente gigante.

## Comandos útiles

```bash
npm run dev       # Servidor local con recarga rápida
npm run lint      # Revisión estática de ESLint
npm run build     # Verificación TypeScript y compilación de producción
npm run preview   # Servir localmente la compilación para revisión manual
```

## Conexión y despliegue

Por defecto Axios usa `/api` y Vite lo redirige al Laravel local. Para producción define `VITE_API_BASE_URL` con la URL HTTPS pública terminada en `/api`, por ejemplo `https://api.ejemplo.com/api`. Esa URL es pública; no pongas secretos ni la llave de Groq en variables `VITE_*`.

En Railway configura `CORS_ALLOWED_ORIGINS=https://frontend-ventaslite.netlify.app`. Netlify aplica el fallback de rutas SPA definido en `public/_redirects` para que `/login`, `/dashboard`, `/pos` y `/sales` funcionen al abrir o refrescar esas rutas.

La sesión conserva el token temporalmente en `sessionStorage` y lo valida contra `GET /api/user` al abrir o recargar la aplicación. Laravel sigue siendo responsable de las reglas de permisos y sucursal; ocultar un botón en React nunca sustituye la autorización del backend.

Para más detalle de componentes, autenticación y endpoints, revisa `docs/implementacion-frontend.md` y `docs/requisitos-frontend.md`.
