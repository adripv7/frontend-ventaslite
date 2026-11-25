# Implementación del frontend — VentasLite

Este documento registra el trabajo realizado específicamente en el repositorio `frontend-ventaslite`, independiente de `backend-ventaslite`.

## Arquitectura de componentes

La aplicación está organizada por dominio bajo `src/features`. Las páginas actúan como componentes padre: coordinan permisos, estado y peticiones API. Sus componentes hijos reciben datos y callbacks mediante props, y se encargan de presentar secciones concretas. Esto mantiene cada módulo separado y facilita ampliarlo sin convertir el layout principal en una pantalla monolítica.

- **Autenticación:** login, persistencia de sesión, restauración con `/api/user` y cierre de sesión.
- **Dashboard y reportes:** la página consulta datos y coordina filtros, indicadores, gráfica mensual, top de productos, ranking de vendedores, matriz por sucursal/categoría, margen bruto, exportaciones y asistente IA. El asistente aparece al final del dashboard.
- **Punto de venta:** la página administra búsqueda, sucursal, categoría, paginación del catálogo, carrito y envío de la venta. El catálogo y el panel del ticket son componentes hijos.
- **Historial:** la página administra filtros, paginación, carga y cancelación. Filtros, tabla, paginador, detalle y confirmación de cancelación son componentes hijos independientes.

Los estilos globales están en `src/styles`; el layout y cada módulo mantienen CSS separado. Las pantallas se adaptan a móvil y escritorio, con tablas desplazables cuando las columnas necesitan conservar su ancho.

## Integración con Laravel

El cliente Axios está centralizado en `src/shared/api/http.ts`. Añade el token Bearer de Sanctum a las peticiones autenticadas. Los módulos usan los endpoints existentes:

| Función | Endpoint |
| --- | --- |
| Iniciar sesión | `POST /api/login` |
| Restaurar sesión y permisos | `GET /api/user` |
| Cerrar sesión | `POST /api/logout` |
| Consultar sucursales, categorías y catálogo | `GET /api/branches`, `/api/categories`, `/api/products` |
| Crear venta | `POST /api/sales` |
| Consultar historial y detalle | `GET /api/sales`, `GET /api/sales/{id}` |
| Cancelar venta | `PATCH /api/sales/{id}/cancel` |
| Obtener reportes y exportar CSV | `GET /api/reports/dashboard`, `GET /api/reports/dashboard/export` |
| Consultar asistente IA | `POST /api/reports/assistant` |

Las rutas y acciones visibles se filtran con los permisos devueltos por Laravel; el backend sigue validando autenticación, permisos, existencias y cálculos.

## Conexión local y producción

En desarrollo Vite proxya `/api` a Laravel (`http://127.0.0.1:8000` por defecto), evitando una llamada cross-origin desde el navegador. El objetivo del proxy puede cambiarse con `VITE_PROXY_API_TARGET`. El usuario confirmó que el login valida la sesión contra Laravel.

En producción, `VITE_API_BASE_URL` debe apuntar al dominio HTTPS del backend y terminar en `/api`; el backend debe incluir el dominio del frontend en `CORS_ALLOWED_ORIGINS`. No se exponen llaves Groq ni secretos del servidor en variables `VITE_*`.

## Asistente de reportes

Las respuestas se muestran con `react-markdown` y `remark-gfm`, para listas y tablas Markdown sin insertar HTML arbitrario. Estas dependencias están declaradas en `package.json` y el lockfile se sincroniza con `npm install`.

## Ajustes detectados al ejecutar Vite

- Se corrigió la ruta de importación de `dashboard.css` desde `pages/DashboardPage.tsx` a `../dashboard.css`.
- Se cambió el icono `Funnel` por `Filter`, disponible en la versión de `lucide-react` usada por el proyecto. `Funnel` causaba un error de exportación en tiempo de ejecución y dejaba la aplicación en blanco.
- Si Vite informa que no encuentra `react-markdown`, ejecutar `npm install` en la raíz del frontend y reiniciar `npm run dev`.
