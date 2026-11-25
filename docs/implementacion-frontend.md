# Implementación del frontend — VentasLite

Este documento registra el trabajo realizado específicamente en el repositorio `frontend-ventaslite`, independiente de `backend-ventaslite`.

## Arquitectura de componentes

La aplicación está organizada por dominio bajo `src/features`. Las páginas actúan como componentes padre: coordinan permisos, estado y peticiones API. Sus componentes hijos reciben datos y callbacks mediante props, y se encargan de presentar secciones concretas. Esto mantiene cada módulo separado y facilita ampliarlo sin convertir el layout principal en una pantalla monolítica.

- **Autenticación:** login, persistencia de sesión, restauración con `/api/user` y cierre de sesión.
- **Dashboard y reportes:** la página consulta datos y coordina filtros, indicadores, gráfica mensual, top de productos, ranking de vendedores, matriz por sucursal/categoría, margen bruto, exportaciones y asistente IA. El asistente aparece al inicio de la zona de reportes, después de los filtros, para que esté visible sin ocultar los reportes.
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
| Consultar asistente IA y uso de tokens por respuesta | `POST /api/reports/assistant` |
| Estado de conexión y consumo mensual de IA | `GET /api/reports/assistant/status` |

Las rutas y acciones visibles se filtran con los permisos devueltos por Laravel; el backend sigue validando autenticación, permisos, existencias y cálculos.

## Conexión local y producción

En desarrollo Vite proxya `/api` a Laravel (`http://127.0.0.1:8000` por defecto), evitando una llamada cross-origin desde el navegador. El objetivo del proxy puede cambiarse con `VITE_PROXY_API_TARGET`. El usuario confirmó que el login valida la sesión contra Laravel.

En producción, `VITE_API_BASE_URL` debe apuntar al dominio HTTPS del backend y terminar en `/api`; el backend debe incluir el dominio del frontend en `CORS_ALLOWED_ORIGINS`. No se exponen llaves Groq ni secretos del servidor en variables `VITE_*`.

## Asistente de reportes

Las respuestas se muestran con `react-markdown` y `remark-gfm`, para listas y tablas Markdown sin insertar HTML arbitrario. Estas dependencias están declaradas en `package.json` y el lockfile se sincroniza con `npm install`.

El panel lateral consulta el estado del proveedor cada 90 segundos para mostrar conectado/desconectado y tokens del mes. El estado consulta Ollama `/api/tags` o Groq `/models`, sin generar una respuesta ni consumir tokens de inferencia. Cada respuesta de IA muestra sus tokens de entrada/salida; Laravel persiste únicamente los contadores, el usuario, el proveedor y el modelo, nunca la pregunta ni el contexto.

El registro de uso necesita la migración `ai_usage_logs`; después de actualizar el backend, ejecutar `php artisan migrate`. El acumulado mensual empieza desde esa migración y solo incluye llamadas donde el proveedor devuelve sus contadores.

El gráfico permite alternar importe en MXN y operaciones, y resalta el valor exacto al apuntar o enfocar un mes. Dashboard, POS e Historial muestran skeletons durante carga. El mismo control del navbar contrae/expande la barra fija en escritorio y abre/cierra el drawer en móvil, que se cierra al navegar, tocar fuera o con `Escape`. En escritorio la barra contraída queda como rail de iconos.

El tema claro/oscuro se controla desde el navbar. `ThemeProvider` persiste la selección en `localStorage` y aplica `data-theme` en el elemento raíz; los estilos del tema oscuro cubren reportes, tablas, formularios, controles, gráficas e inicio de sesión. El sidebar conserva su azul marino para mantener el sistema visual.

## Ajustes detectados al ejecutar Vite

- Se corrigió la ruta de importación de `dashboard.css` desde `pages/DashboardPage.tsx` a `../dashboard.css`.
- Se cambió el icono `Funnel` por `Filter`, disponible en la versión de `lucide-react` usada por el proyecto. `Funnel` causaba un error de exportación en tiempo de ejecución y dejaba la aplicación en blanco.
- La ruta CSS del dashboard se resolvió como `../dashboard.css` desde su carpeta de página.
- Si Vite informa que no encuentra `react-markdown`, ejecutar `npm install` en la raíz del frontend y reiniciar `npm run dev`.
