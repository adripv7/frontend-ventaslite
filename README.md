# VentasLite Frontend

Aplicación SPA de VentasLite construida con React, TypeScript, Vite y Tailwind CSS. El frontend es un repositorio independiente que consume la API REST de Laravel en `../backend-ventaslite`.

## Módulos

- Acceso y sesión con Laravel Sanctum (`POST /api/login`, `GET /api/user`, `POST /api/logout`).
- Dashboard de reportes con fechas y sucursal, indicadores, ventas mensuales, productos destacados, ranking de vendedores, matriz sucursal/categoría, márgenes y exportaciones CSV.
- Asistente analítico conectado a `POST /api/reports/assistant`, al final del dashboard. Renderiza Markdown sin HTML ejecutable.
- Punto de venta con catálogo por sucursal, búsqueda por SKU/nombre, categoría, inventario, carrito y registro por `POST /api/sales`.
- Historial con búsqueda, estado, sucursal y fechas, detalle y cancelación auditada cuando el usuario tiene permiso.

## Estructura

- `src/app`: rutas protegidas, layout y proveedor de autenticación.
- `src/features`: módulos separados por dominio, con tipos, API, páginas y componentes.
- `src/shared`: cliente Axios y utilidades compartidas.
- `src/styles`: estilos globales; cada módulo mantiene sus propios estilos junto a sus componentes.

Consulta [docs/implementacion-frontend.md](docs/implementacion-frontend.md) para el detalle de la arquitectura por componentes, endpoints y correcciones aplicadas durante la integración.

## Desarrollo local

Desde esta carpeta instala las dependencias (incluidas las de Markdown del asistente) y arranca Vite:

```bash
npm install
npm run dev
```

Inicia Laravel por separado desde `../backend-ventaslite` con `php artisan serve`. El proxy de Vite envía `/api` a `http://127.0.0.1:8000`, así que el navegador usa el mismo origen y no requiere CORS durante el desarrollo. Para otra dirección local, define `VITE_PROXY_API_TARGET`.

## Producción

En Vercel configura `VITE_API_BASE_URL` con la URL HTTPS pública del backend y el sufijo `/api`. En Laravel agrega el dominio del frontend a `CORS_ALLOWED_ORIGINS`. No incluyas secretos del backend en variables `VITE_*`.

La sesión se conserva en `sessionStorage` y se valida al recargar mediante `GET /api/user`. Los menús y rutas se filtran con los permisos enviados por Laravel.
