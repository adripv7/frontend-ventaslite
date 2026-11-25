<<<<<<< HEAD
# VentasLite Frontend

SPA de VentasLite con React, TypeScript, Vite y Tailwind CSS. Este proyecto vive junto al backend `backend-ventaslite` y consume su API REST.

## Estructura

- `src/app`: rutas y proveedores globales.
- `src/features`: módulos por dominio (autenticación, dashboard, ventas, reportes).
- `src/shared`: cliente HTTP y componentes reutilizables.
- `src/styles`: estilos globales y tokens de diseño.

## API local

En desarrollo, Vite redirige `/api` a `http://127.0.0.1:8000` para que el navegador no necesite CORS entre puertos. Ajusta `VITE_PROXY_API_TARGET` si Laravel corre en otra dirección.

En Vercel configura `VITE_API_BASE_URL` con la URL HTTPS pública del backend y el sufijo `/api`. El backend debe permitir el dominio de Vercel en `CORS_ALLOWED_ORIGINS`.

La sesión usa token Bearer de Sanctum guardado en `sessionStorage`; al volver a cargar la página valida el token con `GET /api/user`. El token no se comparte con código del lado servidor ni se guarda en el repositorio.

## Módulo implementado

- Login conectado a `POST /api/login`.
- Restauración y validación de sesión con `GET /api/user`.
- Cierre de sesión con `POST /api/logout`.
- Manejo de errores de validación, credenciales, red y límite 429.
- Pantalla protegida provisional para comprobar el flujo antes de construir los módulos del prototipo.
=======
# frontend-ventaslite
Proyecto prueba tecnica front end
>>>>>>> 217ae190f7759eefe3ae2ab3ae5c46fb8eeb5463
