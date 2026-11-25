# Frontend React — VentasLite

## Instrucción principal

Construir el frontend como un proyecto independiente llamado `frontend-ventaslite`, ubicado en la raíz `prueba-tecnica` al mismo nivel que `backend-ventaslite`. Usar React con TypeScript y Vite, Tailwind CSS, componentes y módulos separados por dominio, estilos en archivos propios y llamadas al API Laravel existente. Seguir el prototipo visual entregado como referencia, reemplazando sus datos simulados por respuestas reales del backend. Avanzar módulo por módulo para que cada parte pueda revisarse y entenderse.

## Decisiones de arquitectura

- `src/app`: rutas, proveedores globales y protección de páginas.
- `src/features`: módulos aislados como autenticación, punto de venta, historial y reportes.
- `src/shared`: cliente HTTP, utilidades y componentes comunes.
- `src/styles`: estilos globales; Tailwind se integra mediante el plugin oficial de Vite.
- Axios usa `VITE_API_BASE_URL`; localmente Vite proxya `/api` a Laravel para evitar CORS en el navegador.
- Autenticación con token Bearer de Sanctum. El token se guarda en `sessionStorage`, se valida al restaurar la página con `GET /api/user` y se revoca con `POST /api/logout`.
- Sonner presenta notificaciones; los errores importantes también permanecen visibles junto al formulario o acción correspondiente.
- Producción requiere URL HTTPS del API en Vercel y una lista CORS explícita en Laravel; no usar `*` para credenciales ni incluir secretos Groq en React.
- Vercel debe reescribir rutas de la SPA a `index.html` para que rutas como `/dashboard` funcionen al recargar.

## Módulo inicial

Implementar primero el login del boceto y conectarlo a `POST /api/login`. Mostrar errores de credenciales, validación, conexión y límite de intentos. El dashboard y los demás módulos se conectan después, siguiendo el orden acordado, sin conservar los arreglos simulados del prototipo como fuente real de datos.

## Cambio de alcance aprobado — implementación integral

El avance por módulos es la guía por defecto, pero el usuario puede pedir completar todos los módulos en una sola entrega para probar el sistema completo. Al hacerlo, integrar Dashboard/Reportes, POS e Historial con endpoints reales, respetar permisos, no usar datos simulados, mantener el asistente IA al final de Reportes y revisar diseño responsive.

## Ajuste de usabilidad posterior

El panel de IA se muestra inmediatamente después de los filtros, antes de la gráfica y tablas, para ser visible sin desplazarlo al final de la página. Dashboard, POS e Historial usan skeletons al cargar. La gráfica permite alternar ventas MXN/operaciones y enfocar puntos para ver cifras exactas. El drawer móvil se cierra con botón interno, backdrop, selección de ruta o `Escape`.
