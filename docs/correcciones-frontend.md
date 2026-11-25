# Correcciones registradas

## 2026-11-25 — Ubicación y conexión del frontend React

**Corrección del usuario:** el frontend debe ser otro proyecto en la raíz `prueba-tecnica`, como hermano de `backend-ventaslite`, no dentro del backend.

**Implementación:** se creó `frontend-ventaslite` con React, TypeScript, Vite y Tailwind CSS. El primer módulo es login real con Sanctum; el resto se integrará por etapas. En local, Vite redirige `/api` a Laravel para evitar CORS desde el navegador. Para producción, Laravel permite orígenes explícitos mediante `CORS_ALLOWED_ORIGINS`; no se habilita acceso universal ni cookies cross-site.

**Seguridad y sesión:** el token Bearer se guarda en `sessionStorage`, se valida al recargar mediante `GET /api/user` y se revoca con `POST /api/logout`. Las llamadas HTTP están centralizadas en Axios y el frontend no recibe secretos de Groq.

**Configuración relacionada:** `.env.example` del backend tenía `OLLAMA_URL` apuntando por error a Groq; se corrigió a `http://127.0.0.1:11434`. El `.env` local no se modificó. No se instalaron dependencias ni se ejecutaron comandos o pruebas.

## 2026-11-25 — Limitar temas del asistente y proteger información

**Solicitud:** aceptar únicamente consultas relacionadas con reportes y métricas del MVP VentasLite y rechazar temas ajenos o peticiones de información sensible.

**Corrección aplicada:** el prompt ahora define métricas permitidas, datos que puede mencionar solo si aparecen en los agregados, solicitudes prohibidas y un texto fijo de rechazo. Se añadieron aserciones para comprobar que las reglas estén presentes en el mensaje de sistema enviado a Ollama.

**Reducción adicional de datos:** el backend quita IDs internos de vendedores, sucursales, productos y categorías antes de enviar el contexto al modelo. El cliente React sigue recibiendo los filtros normales de la respuesta.

## 2026-11-25 — Pendientes importantes de la revisión final

**Solicitud:** corregir los pendientes principales detectados al comparar el backend con el PDF y el prototipo frontend.

**Correcciones aplicadas:**

- Se creó el `.gitignore` del backend para excluir `.env`, base SQLite, dependencias, cachés y artefactos de PHPUnit, permitiendo únicamente `.env.example` entre los archivos de entorno.
- Se agregó `sales.view_own` para vendedores; el historial queda limitado en servidor al usuario autenticado, el detalle de otra persona devuelve 404 y el administrador puede filtrar por `seller_id`.
- Se alinearon las ocho categorías y productos semilla con la distribuidora de herramientas del boceto. Los SKU usan Faker `unique()->bothify()` con prefijo por categoría. El seeder transforma los nombres/SKU semilla previos conservando IDs y referencias.
- Se agregó `AI_LOG.md` en la raíz del repositorio backend con diez entradas en el formato solicitado por el PDF.
- La lectura de salida de Ollama acepta JSON rodeado por code fences o texto auxiliar, mantiene error controlado ante JSON incompleto/no válido y registra únicamente modelo/longitud, sin guardar respuesta ni datos del reporte.

**Validación pendiente:** no se ejecutaron comandos, Artisan, Composer ni pruebas. Se agregó una migración incremental que crea/asigna `sales.view_own` en una base existente. El usuario debe correr `php artisan migrate`, luego los seeders `CategorySeeder` y `ProductSeeder` para actualizar el catálogo sin reinicializar inventario/ventas, y ejecutar `php artisan test --filter=SaleHistoryTest`, `php artisan test --filter=RolePermissionTest` y `php artisan test --filter=ReportAssistantTest`. El filtro del test administrativo por vendedor quedó combinado con `status=pagada` para separar la venta cancelada del fixture. El tracking de `.env` se verificó después y se documenta en la entrada siguiente.

**Pendiente de entrega final (frontend/deploy):** crear React, guardar el wireframe/capturas/video dentro del repositorio y completar hosting/CORS cuando se elija proveedor.

## 2026-11-25 — Consultas válidas de rendimiento y Groq solo en producción

**Solicitud:** permitir rankings agregados de vendedores sin exponer datos privados; admitir productos más vendidos por periodo; preparar Groq para producción y mantener Ollama local; responder con lógica cuando no existan ventas.

**Corrección aplicada:** se aclara en el prompt que el nombre puede aparecer al informar métricas agregadas del vendedor y se bloquean preguntas de domicilio/contacto antes de llamar a la IA. Umbrales de venta y extremos/rankings de vendedores se calculan desde el backend. Las preguntas de productos reciben únicamente el top agregado correspondiente del dashboard para que el modelo redacte la respuesta sin rankings ajenos. La fecha explícita en la pregunta se contrasta con los filtros y se devuelve una aclaración si no coinciden; periodos sin ventas reciben una explicación natural con fechas, sin rechazo genérico. `AI_PROVIDER` conserva Ollama local y permite Groq en producción, con autenticación secreta, JSON Schema y errores controlados por cuota/credenciales/conectividad.

**Verificación:** el usuario reportó `php artisan test --filter=ReportAssistantTest` aprobado: 10 pruebas y 29 aserciones. La suite simula Ollama y valida el flujo local; la llamada real a Groq sigue pendiente para cuando se configure el secreto `GROQ_API_KEY` en el hosting. No se debe enviar la llave por el chat ni versionarla.

**Ajuste posterior al test reportado:** `ReportAssistantTest` falló porque `productRankingAnswer` respondía en Laravel y evitaba la llamada HTTP que esa prueba verifica para consultas analíticas de productos. Se retiró esa respuesta directa: el modelo vuelve a recibir únicamente el agregado de productos pertinente y formula la respuesta. El usuario volvió a ejecutar la suite y reportó 10 pruebas y 29 aserciones aprobadas.
# 2026-11-25 — Caché de reportes

**Solicitud:** completar el requisito de caché de reportes antes de comenzar React.

**Implementación:** el dashboard guarda el resultado agregado por 60 segundos, usando fechas y sucursal como filtros de la llave. El CSV ya consume el mismo servicio, por lo que aprovecha el mismo resultado. Después de registrar o cancelar una venta, el backend incrementa una versión global para que la siguiente consulta recalcule todas las métricas. No se usan tags, para que funcione con el store de base de datos configurado y con `array` en pruebas. Si falla la caché, el endpoint vuelve a calcular el reporte sin bloquear la operación.

**Configuración:** `REPORTS_CACHE_TTL` en `.env.example` define la duración en segundos.

**Prueba agregada:** `DashboardReportCacheTest` verifica reutilización por mismos filtros, aislamiento por sucursal e invalidación. Pendiente de ejecutar por el usuario; no se ejecutaron comandos.

**Higiene de secretos:** se dejó `GROQ_API_KEY` vacía en `.env.example`; las plantillas versionadas no deben contener llaves reales.

# 2026-11-25 — Quitar respuestas analíticas hardcodeadas del asistente

**Corrección del usuario:** la IA debe interpretar reportes y razonar para preguntas no previstas, no depender de una lista creciente de respuestas por patrones.

**Cambio:** se quitaron del flujo analítico las respuestas preparadas para ranking/umbrales de vendedor, fechas que contradicen filtros y periodos sin ventas. También se retiró la clasificación por expresiones regulares que elegía qué sección enviar. El modelo ahora recibe de una sola vez los agregados compactos completos del dashboard, sin IDs ni ventas individuales, y decide qué sección usar, cómo comparar y cómo explicar datos ausentes. Laravel continúa calculando métricas, validando permisos/filtros/JSON y bloqueando preventivamente solicitudes de datos sensibles; estas últimas son un control de acceso, no una respuesta analítica delegada al modelo.

**Pruebas:** se actualizaron para exigir todas las secciones agregadas en el contexto y confirmar que preguntas de umbral, mes distinto y periodo sin operaciones lleguen a Ollama. Pendiente de ejecución por el usuario; no se corrieron comandos.

**Ajuste de prueba:** el usuario reportó 12 pruebas aprobadas y una aserción fallida porque buscaba una frase literal del prompt anterior. Se actualizó para revisar la frase equivalente del prompt nuevo. La prueba debe ejecutarse otra vez por el usuario.

# 2026-11-25 — Mantener tema y periodo solicitados

**Reporte:** al pedir los productos más vendidos de diciembre de 2024 con filtros activos de agosto a noviembre de 2026, Qwen3:4b respondió sobre margen por categoría e inventó categorías ajenas al catálogo.

**Ajuste:** se precisó un procedimiento general para que el modelo identifique primero tema y periodo, no cambie de sección, contraste fechas con los filtros activos, use solo nombres/cifras del contexto y responda en formato de lista cuando la pregunta lo pida. Los arreglos de productos ahora se nombran explícitamente por unidades e importe. Se redujo la temperatura a 0.1 para Ollama y Groq. Como se envían todas las secciones agregadas, el contexto Ollama pasó a ser configurable y su valor por defecto aumentó a 8,192 tokens para reducir la posibilidad de truncar instrucciones/datos. No se añadieron respuestas preparadas por pregunta.

**Validación:** se actualizaron las aserciones del prompt y contexto. Esto no demuestra que Qwen siga correctamente la instrucción en una llamada real: el usuario debe probar nuevamente el mismo caso con Ollama. El contexto mayor puede usar más memoria y tardar más en procesarse. El cambio no promete respuestas perfectas; si el modelo vuelve a desviarse, será necesario valorar un modelo con mejor seguimiento de instrucciones o un flujo de agente con herramientas de reportes.

**Corrección de test reportada:** volvió a fallar la misma prueba de integración HTTP porque una aserción aún esperaba la frase `Responde en máximo cuatro frases`; el prompt ahora permite elementos de lista además del límite de frases. Se alineó la aserción a la redacción actual. El usuario debe ejecutar de nuevo el filtro; no se ejecutaron comandos.

# 2026-11-25 — Completar frontend React para prueba integral

**Solicitud:** implementar en una sola pasada los módulos del prototipo, conectarlos a los endpoints existentes, poner el asistente IA al final de Reportes y hacer el diseño responsive.

**Implementación:** React separa autenticación, catálogo, dashboard/reportes, punto de venta e historial por features. El dashboard consulta filtros, métricas, ranking, matriz, margen y exportaciones CSV; el asistente recibe los filtros activos y queda al final. El POS busca por nombre/SKU, filtra por categoría/sucursal, pagina el catálogo, limita el carrito a seis productos distintos, valida stock en interfaz y registra por `POST /api/sales` (el servidor sigue siendo la fuente de precios e impuestos). Historial filtra, pagina, muestra detalle y cancela ventas con confirmación/motivo cuando el permiso lo permite. Layout y estilos propios de los módulos contemplan pantallas pequeñas; las rutas y navegación se filtran por permisos.

**Instalación:** se añadieron `react-markdown` y `remark-gfm` para mostrar respuestas/listas/tablas del asistente sin inyectar HTML. Ejecutar `npm install` en `frontend-ventaslite` para sincronizar `package-lock.json` y después `npm run dev`.

**Validación:** no se ejecutaron pruebas ni build; queda pendiente que el usuario pruebe las pantallas con backend y datos sembrados.

**Refactor posterior:** el historial quedó como página orquestadora; filtros, tabla, paginación, detalle y confirmación de cancelación son componentes hijos separados, reciben información y callbacks por props. Las páginas de Dashboard y POS también delegan sus secciones visuales a componentes de sus respectivos dominios.

# 2026-11-25 — Hacer IA, reportes y navegación más visibles

**Solicitud:** adelantar el panel IA, dar interacción a la gráfica, mostrar estado de IA/consumo de tokens en la tarjeta de Laravel/Sanctum, usar skeletons, corregir el menú móvil y facilitar la vista de todas las sucursales.

**Frontend:** el panel IA ahora se muestra después de los filtros y antes de las métricas/gráficas. La gráfica permite alternar ventas cobradas en MXN y operaciones, ofrece cifra exacta al pasar el cursor o enfocar un punto, y anima la línea. Se agregaron skeletons al Dashboard, catálogo POS e Historial. El menú móvil ahora abre un drawer lateral y puede cerrarse desde su botón, tocando fuera, navegando o con Escape. Si se filtró una sucursal, la matriz ofrece volver a todas.

**Backend:** se añadió `GET /api/reports/assistant/status`, que revisa Ollama con `/api/tags` o Groq con `/models` y exige permiso `reports.view`. La respuesta del asistente incluye los tokens de entrada/salida cuando el proveedor los reporta. La nueva tabla `ai_usage_logs` guarda proveedor, modelo, usuario y conteos únicamente; no persiste preguntas ni contexto. El status agrega el uso desde el primer día del mes actual.

**Para probar:** ejecutar `php artisan migrate` para crear la tabla y luego reiniciar/recargar ambos servidores. El estado de IA depende de que Ollama esté corriendo con el modelo configurado o Groq tenga credenciales/modelo válidos. El consumo se acumula desde la migración y solo se registra cuando el proveedor devuelve los contadores. Seeding disponible: `vendedor.s01.01@ventaslite.test` / `password` (sucursal Ciudad de México).

**Validación:** no se ejecutaron suites ni build en esta entrega.

