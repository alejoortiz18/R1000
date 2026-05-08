# RICKOIN — Plan de Sprints

**Proyecto:** Rickoin — Plataforma de rifas digitales con moneda virtual  
**Metodología:** Scrum / Shape Up híbrido  
**Versión:** 1.0 — Mayo 2026  
**Duración de sprint:** 2 semanas  
**Total de sprints:** 17  
**Equipo base:** 1 diseñador + 2 desarrolladores  

> **Relación con Shape Up:** Los 5 ciclos de 6 semanas del Shape Up se descomponen en sprints de 2 semanas cada uno. Cada ciclo equivale a 3 sprints consecutivos. Los cool-down entre ciclos se mapean a sprints de consolidación/estabilización. Los últimos sprints cubren control de cambios, deuda técnica y despliegue final. 
> **Nota:** OTP = One-Time Password (contraseña de un solo uso para verificación de identidad).

---

## RESUMEN EJECUTIVO DE SPRINTS

| Sprint | Nombre | Ciclo Shape Up | Fechas estimadas |
|---|---|---|---|
| Sprint 01 | Estructura de base de datos y documentación técnica | Ciclo 1 | Sem 1-2 |
| Sprint 02 | Registro, OTP y Modo Observador | Ciclo 1 | Sem 3-4 |
| Sprint 03 | Login, recuperación de contraseña y panel admin | Ciclo 1 | Sem 5-6 |
| Sprint 04 | Step-Up Auth y monedero — saldo y movimientos | Ciclo 2 | Sem 9-10 |
| Sprint 05 | Compra de Rickoin e integración pasarela de pago | Ciclo 2 | Sem 11-12 |
| Sprint 06 | Retiros, gestión admin y asignación de Fichas | Ciclo 2 | Sem 13-14 |
| Sprint 07 | Creación de rifas y catálogo público | Ciclo 3 | Sem 17-18 |
| Sprint 08 | Compra de boletas y control de concurrencia | Ciclo 3 | Sem 19-20 |
| Sprint 09 | Historial de boletas, validaciones y ajustes de rifas | Ciclo 3 | Sem 21-22 |
| Sprint 10 | Motor de sorteos — configuración y cierre automático | Ciclo 4 | Sem 25-26 |
| Sprint 11 | Registro de resultados, validación de ganador y fallback | Ciclo 4 | Sem 27-28 |
| Sprint 12 | Notificación al ganador, selección de premio y vista pública | Ciclo 4 | Sem 29-30 |
| Sprint 13 | Notificaciones por correo (SendGrid) y configuración global | Ciclo 5 | Sem 33-34 |
| Sprint 14 | Dashboard admin, reportes, logs y documentos legales | Ciclo 5 | Sem 35-36 |
| Sprint 15 | Control de Cambios | Post-ciclos | Sem 37-38 |
| Sprint 16 | Deuda Técnica | Post-ciclos | Sem 39-40 |
| Sprint 17 | Despliegue Final y Puesta en Marcha | Go-live | Sem 41-42 |

> **Semanas 7-8, 15-16, 23-24, 31-32:** Cool-down entre ciclos Shape Up — no hay sprints formales. Se usan para revisión de entregables, refinamiento del backlog del siguiente ciclo y resolución de deuda técnica menor.

---

## SPRINT 01 — Estructura de Base de Datos y Documentación Técnica

**Ciclo Shape Up:** Ciclo 1 — Identidad y Acceso (semanas 1-2)  
**Objetivo del sprint:** Diseñar y crear la estructura completa de la base de datos de la plataforma con todas sus tablas, relaciones y restricciones. Documentar el modelo de datos, la arquitectura del sistema y las convenciones técnicas del proyecto que servirán de referencia para todos los sprints siguientes.

### Tareas técnicas

| ID | Descripción | Tipo |
|---|---|---|
| TEC-01-01 | Crear solución .NET Core MVC con 7 proyectos: `Rickoin.Constants`, `Rickoin.Models`, `Rickoin.Domain`, `Rickoin.Helpers`, `Rickoin.Infrastructure`, `Rickoin.Application`, `Rickoin.Web` | Técnica |
| TEC-01-02 | Configurar Entity Framework Core con SQL Server — DbContext base y configuración de conexión | Técnica |
| TEC-01-03 | Diseñar y crear todas las tablas del dominio de Identidad: `Usuarios` (incluye campos OTP y bloqueo de cuenta — sin tabla `Roles` separada, sin `AccountStatusHistory`) | Base de datos |
| TEC-01-04 | Diseñar y crear todas las tablas del dominio Financiero: `Wallets`, `Transacciones`, `Retiros` | Base de datos |
| TEC-01-05 | Diseñar y crear todas las tablas del dominio de Rifas: `Rifas`, `Boletas` | Base de datos |
| TEC-01-06 | Diseñar y crear todas las tablas del dominio de Sorteos: `Loterias`, `ResultadosSorteo`, `Premios` (sin tabla `RaffleDrawConfig` — la configuración del sorteo vive en la entidad `Rifas`) | Base de datos |
| TEC-01-07 | Diseñar y crear tablas transversales: `AuditLogs`, `ConfiguracionSistema` | Base de datos |
| TEC-01-08 | Definir índices, claves foráneas, restricciones `NOT NULL` y valores por defecto en todas las tablas | Base de datos |
| TEC-01-09 | Generar migración inicial de EF Core y aplicarla sobre la base de datos en el ambiente de desarrollo | Técnica |
| TEC-01-10 | Documentar el diagrama entidad-relación (DER) completo con todas las tablas y relaciones | Documentación |
| TEC-01-11 | Documentar la arquitectura del sistema: capas, responsabilidades, flujo de una solicitud HTTP | Documentación |
| TEC-01-12 | Definir y documentar convenciones del proyecto: naming, estructura de carpetas, estándares de código y flujo de ramas Git | Documentación |
| TEC-01-13 | Configurar gestión de secretos con Azure Key Vault — connection strings y variables de entorno | Técnica |
| TEC-01-14 | Configurar logging estructurado (Serilog) con salida a consola y archivo | Técnica |

### Criterios de aceptación del sprint

- [ ] La solución .NET compila sin errores en todos los ambientes del equipo
- [ ] Todas las tablas están creadas en la base de datos de desarrollo con sus índices y restricciones correctas
- [ ] La migración inicial de EF Core se aplica exitosamente de forma idempotente
- [ ] El diagrama entidad-relación está documentado y refleja fielmente la estructura de la BD creada
- [ ] El documento de arquitectura describe los 7 proyectos (`Constants`, `Models`, `Domain`, `Helpers`, `Infrastructure`, `Application`, `Web`) y sus responsabilidades
- [ ] Las convenciones del proyecto están documentadas y son accesibles para todo el equipo
- [ ] No hay credenciales ni connection strings en el código fuente

### Definición de Done

- Migración de base de datos aplicada y verificada en Dev
- Diagrama ER exportado y versionado junto al código
- Documentación de arquitectura y convenciones publicada en el repositorio
- Deploy exitoso en Azure Dev

---

## SPRINT 02 — Registro, OTP y Modo Observador

**Ciclo Shape Up:** Ciclo 1 — Identidad y Acceso (semanas 3-4)  
**Objetivo del sprint:** El visitante puede registrarse en la plataforma, recibir y validar el código OTP por correo, y quedar en estado Modo Observador con acceso de solo lectura.

### Historias de usuario

| ID | Historia | Referencia HU |
|---|---|---|
| SP02-01 | Registro de nueva cuenta con validaciones | USR-C1-001 |
| SP02-02 | Confirmación de cuenta por código OTP | USR-C1-002 |
| SP02-03 | Reenvío de código OTP expirado | USR-C1-003 |
| SP02-04 | Dashboard en Modo Observador — solo lectura | USR-C1-004 |
| SP02-05 | Bloqueo backend de acciones protegidas para Observador | USR-C1-005 |
| SP02-06 | Subir documento de identidad en PDF | USR-C1-006 |
| SP02-07 | Envío de correo con PDF y botones de aprobación al sistema | USR-C1-006 |

### Tareas técnicas de soporte

| ID | Descripción |
|---|---|
| TEC-02-01 | Migración EF Core: tabla `Usuarios` con campos de OTP (código, expiración) y bloqueo de cuenta — sin tabla `IdentityDocuments` (el PDF se envía por correo, no se persiste) |
| TEC-02-02 | Configurar servicio de envío de correo (mock/console en Dev, SendGrid en Prod preparado) |
| TEC-02-03 | Implementar hash y salt de contraseñas con **HMACSHA512** — clase estática `PasswordHelper` en `Rickoin.Helpers` (sin BCrypt, sin ASP.NET Identity) |
| TEC-02-04 | Implementar middleware de autorización por estado de cuenta |

### Criterios de aceptación del sprint

- [ ] Un visitante puede completar el registro y recibir el OTP en su correo
- [ ] El código OTP expira en 15 minutos; el reenvío invalida el anterior
- [ ] Al confirmar el OTP, la cuenta queda en estado `Observador`
- [ ] El usuario Observador puede ver el catálogo de rifas (vacío en este sprint) pero no puede ejecutar acciones protegidas
- [ ] El backend retorna HTTP 403 para cualquier acción protegida desde una cuenta Observador
- [ ] El usuario puede subir un PDF (máx 5MB); el sistema lo envía al correo del administrador con los datos del usuario y botones [Aprobar] / [Rechazar]

---

## SPRINT 03 — Login, Recuperación de Contraseña y Panel Admin

**Ciclo Shape Up:** Ciclo 1 — Identidad y Acceso (semanas 5-6)  
**Objetivo del sprint:** El sistema de autenticación está completo. Los usuarios pueden iniciar sesión, recuperar contraseña y el administrador puede aprobar o rechazar cuentas desde el panel o desde el correo.

### Historias de usuario

| ID | Historia | Referencia HU |
|---|---|---|
| SP03-01 | Inicio de sesión con email y contraseña | USR-C1-007 |
| SP03-02 | Bloqueo temporal por intentos fallidos | USR-C1-008 |
| SP03-03 | Recuperación de contraseña por correo | USR-C1-009 |
| SP03-04 | Ver perfil propio con estado de cuenta y documento | USR-C1-010 |
| SP03-05 | Panel admin — lista de usuarios pendientes de aprobación | USR-C1-011 |
| SP03-06 | Aprobar cuenta de usuario desde panel o desde correo | USR-C1-012 |
| SP03-07 | Rechazar cuenta con motivo obligatorio | USR-C1-013 |
| SP03-08 | Reenvío de documento PDF tras rechazo | USR-C1-014 |
| SP03-09 | Login de administrador y acceso al panel | USR-C1-015 |

### Tareas técnicas de soporte

| ID | Descripción |
|---|---|
| TEC-03-01 | Implementar registro de cambios de estado de cuenta (aprobación / rechazo) en la tabla `AuditLogs` — sin tabla `AccountStatusHistory` separada |
| TEC-03-02 | Implementar tokens de recuperación de contraseña (un solo uso, expiración configurable) |
| TEC-03-03 | Implementar registro de eventos en `AuditLog` para todas las acciones del sprint |
| TEC-03-04 | Configurar autenticación por **Cookie Authentication** de ASP.NET Core con claims de rol (Usuario / Administrador) — sin ASP.NET Identity |
| TEC-03-05 | Implementar botones de acción en correo de notificación al admin (deep links al panel) |

### Criterios de aceptación del sprint

- [ ] El login funciona para Usuario y Administrador; el estado de la cuenta determina la redirección
- [ ] Tras 5 intentos fallidos, la cuenta queda bloqueada por 30 minutos
- [ ] El flujo de recuperación de contraseña funciona de extremo a extremo con token de un solo uso
- [ ] El admin ve la lista de usuarios pendientes con badge en el header del panel
- [ ] La aprobación y el rechazo funcionan desde el panel; el usuario recibe correo con el nuevo estado
- [ ] Al rechazar, el campo de motivo es obligatorio; el motivo aparece en el correo al usuario y en su perfil

### Definición de Done — Ciclo 1 completo

- [ ] Todos los flujos de identidad funcionan en el ambiente de Dev
- [ ] Deploy exitoso en Azure Dev con todas las migraciones aplicadas
- [ ] Los correos de OTP, aprobación y rechazo se envían correctamente
- [ ] Sin vulnerabilidades OWASP en flujos de autenticación (revisión manual de código)

---

## SPRINT 04 — Step-Up Authentication y Monedero — Saldo y Movimientos

**Ciclo Shape Up:** Ciclo 2 — Monedero Rickoin (semanas 9-10)  
**Objetivo del sprint:** El usuario activo puede acceder a la zona financiera tras verificar su identidad (Step-Up). Puede ver su saldo de Rickoin y Fichas y el historial de movimientos de ambas monedas.

### Historias de usuario

| ID | Historia | Referencia HU |
|---|---|---|
| SP04-01 | Step-Up Authentication (contraseña o OTP) para zona financiera | USR-C2-001 |
| SP04-02 | Ver saldo de Rickoin y Fichas en header y monedero | USR-C2-002 |
| SP04-03 | Ver historial de movimientos de Rickoin | USR-C2-003 |
| SP04-04 | Ver historial de movimientos de Fichas | USR-C2-004 |

### Tareas técnicas de soporte

| ID | Descripción |
|---|---|
| TEC-04-01 | Migración EF Core: tablas `Wallets`, `Transacciones` — un registro en `Wallets` por tipo de moneda (`TipoWallet`: Rickoin / Fichas) |
| TEC-04-02 | Implementar sesión financiera con timeout de 20 minutos por inactividad |
| TEC-04-03 | Implementar middleware de validación de sesión financiera activa |
| TEC-04-04 | Seed de datos de prueba: usuarios activos con saldo inicial para desarrollo |

### Criterios de aceptación del sprint

- [ ] Un usuario activo sin sesión financiera es redirigido al paso de Step-Up al intentar acceder al monedero
- [ ] La sesión financiera expira tras 20 minutos de inactividad; cada acción reinicia el contador
- [ ] El saldo de Rickoin y Fichas se muestra correctamente en el header y en el monedero
- [ ] El historial muestra fecha, tipo, monto y estado para cada movimiento
- [ ] Rickoin y Fichas tienen historiales separados (pestañas independientes)

---

## SPRINT 05 — Compra de Rickoin e Integración con Pasarela de Pago

**Ciclo Shape Up:** Ciclo 2 — Monedero Rickoin (semanas 11-12)  
**Objetivo del sprint:** El usuario activo puede comprar Rickoin usando la pasarela de pago integrada. Si la pasarela no está disponible, existe un flujo de solicitud manual como alternativa.

### Historias de usuario

| ID | Historia | Referencia HU |
|---|---|---|
| SP05-01 | Comprar Rickoin con pasarela de pago (Wompi / PayU) | USR-C2-005 |

### Tareas técnicas de soporte

| ID | Descripción |
|---|---|
| TEC-05-01 | Integrar pasarela de pago (Wompi o PayU) — flujo de checkout y webhook de confirmación |
| TEC-05-02 | Implementar acreditación automática de Rickoin al confirmar el pago |
| TEC-05-03 | Registrar en `Transactions`: monto Rickoin, monto COP, tasa de conversión vigente al momento de la transacción |
| TEC-05-04 | Implementar flujo alternativo de solicitud manual (si pasarela no está activada) |
| TEC-05-05 | Envío de correo de confirmación de compra con detalle de tasa aplicada |
| TEC-05-06 | Manejo seguro de callbacks de pasarela — validar firma/token del webhook |

### Criterios de aceptación del sprint

- [ ] El usuario puede comprar Rickoin indicando la cantidad; se calcula el total en COP según la tasa vigente
- [ ] Al confirmar el pago en la pasarela, el saldo se acredita automáticamente
- [ ] Si el pago falla o se cancela, el saldo no se modifica
- [ ] La tasa de conversión aplicada queda registrada en la transacción (no recalculable)
- [ ] Se envía correo de confirmación al usuario con el detalle de la compra

---

## SPRINT 06 — Retiros, Gestión Admin y Asignación de Fichas

**Ciclo Shape Up:** Ciclo 2 — Monedero Rickoin (semanas 13-14)  
**Objetivo del sprint:** El usuario puede solicitar y cancelar retiros de Rickoin. El administrador gestiona los retiros desde el panel. El admin puede asignar Fichas manualmente a usuarios.

### Historias de usuario

| ID | Historia | Referencia HU |
|---|---|---|
| SP06-01 | Solicitar retiro de Rickoin con datos bancarios | USR-C2-006 |
| SP06-02 | Cancelar retiro dentro de la ventana de 5 días | USR-C2-007 |
| SP06-03 | Ver estado e historial de retiros propios | USR-C2-008 |
| SP06-04 | Panel admin — lista de retiros pendientes | USR-C2-009 |
| SP06-05 | Aprobar retiro desde el panel admin | USR-C2-010 |
| SP06-06 | Rechazar retiro con motivo obligatorio | USR-C2-011 |
| SP06-07 | Marcar retiro como fallido y restaurar saldo | USR-C2-012 |
| SP06-08 | Asignar Fichas manualmente a uno o varios usuarios | USR-C2-013 |

### Tareas técnicas de soporte

| ID | Descripción |
|---|---|
| TEC-06-01 | Migración EF Core: tabla `Retiros` con todos los estados (`EstadoRetiro`: Pendiente, Aprobado, Rechazado, Fallido, Cancelado) y registro en `AuditLogs` |
| TEC-06-02 | Implementar job en background para asignación masiva de Fichas por lotes |
| TEC-06-03 | Validar que los datos bancarios no se persistan entre solicitudes de retiro |
| TEC-06-04 | Correos automáticos: retiro solicitado, aprobado, rechazado, fallido, cancelado |

### Criterios de aceptación del sprint

- [ ] El usuario puede solicitar retiro; los datos bancarios no se guardan en la BD
- [ ] La ventana de cancelación de 5 días funciona correctamente
- [ ] El admin puede aprobar, rechazar o marcar como fallido; en todos los casos el usuario recibe correo con el nuevo estado
- [ ] La asignación masiva de Fichas se procesa en background; el admin ve el estado del proceso
- [ ] Cada usuario que recibe Fichas recibe correo con el monto y el motivo

### Definición de Done — Ciclo 2 completo

- [ ] Todos los flujos financieros funcionan en Dev con datos reales de prueba
- [ ] La integración con la pasarela de pago está probada en ambiente sandbox
- [ ] Sin inconsistencias de saldo detectadas en pruebas de integración
- [ ] Deploy exitoso en Azure Dev

---

## SPRINT 07 — Creación de Rifas y Catálogo Público

**Ciclo Shape Up:** Ciclo 3 — Rifas y Marketplace (semanas 17-18)  
**Objetivo del sprint:** El administrador puede crear, editar y publicar rifas. Los usuarios pueden ver el catálogo de rifas activas con su información y progreso.

### Historias de usuario

| ID | Historia | Referencia HU |
|---|---|---|
| SP07-01 | Crear rifa con todos sus parámetros de configuración | USR-C3-001 |
| SP07-02 | Publicar rifa desde estado Borrador | USR-C3-002 |
| SP07-03 | Cerrar rifa anticipadamente desde el panel | USR-C3-003 |
| SP07-04 | Ver catálogo de rifas (usuario activo, observador y visitante) | USR-C3-004 |
| SP07-05 | Ver detalle completo de una rifa con progreso y probabilidad | USR-C3-005 |

### Tareas técnicas de soporte

| ID | Descripción |
|---|---|
| TEC-07-01 | Migración EF Core: tablas `Rifas`, `Boletas` con todos sus estados (`EstadoRifa`: Borrador, Activa, Cerrada, PendienteResultado, GanadorEncontrado, PremioReclamado, Finalizada, SinGanador, Cancelada) |
| TEC-07-02 | Implementar lógica de generación automática de registros en `Boletas` al publicar una rifa (una fila por cada número de boleta disponible) |
| TEC-07-03 | Campo `ImagenUrl` en la entidad `Rifa` — el admin ingresa la URL de la imagen (Google Drive u otro servicio externo); el sistema la renderiza con `<img src="@Model.ImagenUrl" />` sin almacenamiento local ni Azure Blob Storage |
| TEC-07-03 | Validación server-side: punto de equilibrio <= total de boletas |
| TEC-07-04 | Implementar ciclo de vida de estados de rifa: Borrador → Activa → Cerrada → Finalizada / Cancelada |

### Criterios de aceptación del sprint

- [ ] El admin puede crear una rifa en Borrador y publicarla; al publicar aparece en el catálogo
- [ ] El catálogo muestra: nombre, imagen (si se proporcionó URL), precio, progreso visual (boletas vendidas / total), fecha de cierre y fecha del sorteo
- [ ] Si la URL de imagen no es accesible o no se proporcionó, se muestra un placeholder visual sin errores de carga
- [ ] El catálogo es visible para visitantes, observadores y usuarios activos
- [ ] El detalle de la rifa muestra el punto de equilibrio y la probabilidad actualizada al cambiar la cantidad de boletas
- [ ] La validación punto_equilibrio <= total_boletas opera en frontend y backend

---

## SPRINT 08 — Compra de Boletas y Control de Concurrencia

**Ciclo Shape Up:** Ciclo 3 — Rifas y Marketplace (semanas 19-20)  
**Objetivo del sprint:** El usuario activo puede comprar boletas con Rickoin, Fichas o combinación de ambos. El sistema garantiza mediante transacciones atómicas que no se vende la misma boleta dos veces.

### Historias de usuario

| ID | Historia | Referencia HU |
|---|---|---|
| SP08-01 | Comprar boletas con Rickoin | USR-C3-006 |
| SP08-02 | Comprar boletas con Fichas | USR-C3-007 |
| SP08-03 | Comprar boletas con pago mixto (Rickoin + Fichas) | USR-C3-008 |
| SP08-04 | Control de concurrencia — transacción atómica con bloqueo pesimista | USR-C3-009 |

### Tareas técnicas de soporte

| ID | Descripción |
|---|---|
| TEC-08-01 | Implementar `SELECT ... WITH (UPDLOCK)` dentro de transacción para asignación de boletas |
| TEC-08-02 | Validar máximo de boletas por usuario por rifa (configurable) en backend antes de la transacción |
| TEC-08-03 | La compra mixta (Rickoin + Fichas) descuenta ambas monedas en una sola transacción atómica |
| TEC-08-04 | Envío de correo de confirmación con número(s) de boleta asignados |
| TEC-08-05 | Pruebas de carga básicas para simular compras simultáneas de la última boleta |

### Criterios de aceptación del sprint

- [ ] La compra con Rickoin, Fichas o mixto funciona correctamente con pantalla de confirmación previa
- [ ] El número de boleta es asignado automáticamente por el sistema
- [ ] Si dos usuarios intentan comprar la última boleta simultáneamente, solo uno lo logra; el otro recibe el mensaje de error sin perder saldo
- [ ] La compra mixta descuenta ambas monedas en la misma transacción; si falla, ninguna se descuenta
- [ ] Las pruebas de concurrencia no producen inconsistencias de saldo ni boletas duplicadas

---

## SPRINT 09 — Historial de Boletas, Validaciones y Ajustes de Rifas

**Ciclo Shape Up:** Ciclo 3 — Rifas y Marketplace (semanas 21-22)  
**Objetivo del sprint:** El usuario puede ver su historial completo de boletas. Se cierran los ajustes pendientes del marketplace: devoluciones por rifa cancelada, estados correctos y modo observador en el catálogo.

### Historias de usuario

| ID | Historia | Referencia HU |
|---|---|---|
| SP09-01 | Ver historial de boletas por usuario agrupado por estado de rifa | USR-C3-010 |

### Tareas técnicas de soporte

| ID | Descripción |
|---|---|
| TEC-09-01 | Implementar lógica de devolución automática de Rickoin cuando se cancela una rifa (las Fichas no se devuelven) |
| TEC-09-02 | Verificar y ajustar el flujo del Modo Observador en todas las páginas del catálogo (botones deshabilitados, mensajes correctos) |
| TEC-09-03 | Pruebas de integración completas del ciclo de compra — desde selección hasta confirmación y correo |
| TEC-09-04 | Revisión de seguridad: validar que no sea posible comprar boletas mediante manipulación directa de requests |
| TEC-09-05 | Correo automático a participantes cuando una rifa se cancela por falta de equilibrio (con monto devuelto) |

### Criterios de aceptación del sprint

- [ ] El historial de boletas agrupa correctamente entre rifas activas y finalizadas
- [ ] Las rifas canceladas por falta de equilibrio devuelven Rickoin automáticamente a cada participante
- [ ] Los correos de devolución se envían con el monto exacto devuelto
- [ ] El Modo Observador bloquea correctamente la compra en todas las vistas del catálogo

### Definición de Done — Ciclo 3 completo

- [ ] Un usuario activo puede comprar boletas de extremo a extremo en Dev
- [ ] Las pruebas de concurrencia pasan sin inconsistencias
- [ ] Deploy exitoso en Azure Dev con todas las migraciones
- [ ] El Modo Observador funciona correctamente en todo el catálogo

---

## SPRINT 10 — Motor de Sorteos: Configuración y Cierre Automático

**Ciclo Shape Up:** Ciclo 4 — Motor de Sorteos y Premios (semanas 25-26)  
**Objetivo del sprint:** El administrador puede configurar la lotería y la regla de sorteo al crear una rifa. El job automático cierra las ventas 3 horas antes del sorteo oficial.

### Historias de usuario

| ID | Historia | Referencia HU |
|---|---|---|
| SP10-01 | Configurar lotería y regla de sorteo al crear una rifa | USR-C4-001 |
| SP10-02 | Gestionar catálogo de loterías desde el panel admin | USR-C4-002 |
| SP10-03 | Job de cierre automático de ventas 3 horas antes del sorteo | USR-C4-003 |

### Tareas técnicas de soporte

| ID | Descripción |
|---|---|
| TEC-10-01 | Migración EF Core: tabla `Loterias` — sin tabla `RaffleDrawConfig` (la regla de dígitos, la lotería asignada y la `ReglaFallback` son campos de la entidad `Rifas`) |
| TEC-10-02 | Implementar job programado (Hangfire o IHostedService) que corre cada 15 minutos |
| TEC-10-03 | Almacenar y procesar todas las fechas/horas en zona horaria Colombia (America/Bogota, UTC-5) |
| TEC-10-04 | Validar que la regla de fallback sea obligatoria y no editable una vez activada la rifa |

### Criterios de aceptación del sprint

- [ ] Al crear una rifa, la configuración de lotería y regla de sorteo son obligatorias
- [ ] La hora de cierre de ventas se calcula automáticamente como `hora_sorteo - 3h` en hora Colombia y no es editable
- [ ] El job se ejecuta cada 15 minutos y cambia el estado de las rifas que cumplen la condición
- [ ] Una rifa en estado "Cerrada" no permite la compra de boletas (validación backend)
- [ ] La regla de fallback ("sin ganador" / "siguiente disponible") queda bloqueada al activar la rifa

---

## SPRINT 11 — Registro de Resultados, Validación de Ganador y Fallback

**Ciclo Shape Up:** Ciclo 4 — Motor de Sorteos y Premios (semanas 27-28)  
**Objetivo del sprint:** El administrador registra el resultado oficial de la lotería. El sistema valida automáticamente si la boleta ganadora fue vendida y aplica la regla de fallback si no lo fue. Las devoluciones automáticas se ejecutan cuando corresponde.

### Historias de usuario

| ID | Historia | Referencia HU |
|---|---|---|
| SP11-01 | Registrar resultado oficial del sorteo con audit trail | USR-C4-004 |
| SP11-02 | Validación automática del ganador y aplicación del fallback | USR-C4-005 |
| SP11-03 | Devolución automática de Rickoin cuando la rifa no tiene ganador | USR-C4-006 |

### Tareas técnicas de soporte

| ID | Descripción |
|---|---|
| TEC-11-01 | Migración EF Core: tabla `ResultadosSorteo` — inmutable una vez creada (sin UPDATE, solo INSERT); `IResultadoSorteoRepository` no expone método `Actualizar` |
| TEC-11-02 | Implementar cálculo automático del número ganador según la regla configurada (últimos N dígitos) |
| TEC-11-03 | Registrar audit trail inmutable: admin, timestamp, IP de origen al registrar el resultado |
| TEC-11-04 | Implementar devolución por lotes: transacción atómica individual por participante |
| TEC-11-05 | Solo se devuelven Rickoin — las Fichas usadas en boletas no se devuelven |

### Criterios de aceptación del sprint

- [ ] El admin puede ingresar el resultado oficial; el número ganador se calcula automáticamente
- [ ] El registro del resultado es inmutable: no existe UI para editarlo después
- [ ] El audit trail registra: admin, timestamp y IP exactos
- [ ] Si la boleta ganadora fue vendida: el estado de la rifa cambia a "Ganador encontrado" automáticamente
- [ ] Si no fue vendida y la regla es "sin ganador": las devoluciones de Rickoin se ejecutan automáticamente
- [ ] Si la regla es "siguiente disponible": se identifica la boleta más cercana y se registra la nota pública explicativa

---

## SPRINT 12 — Notificación al Ganador, Selección de Premio y Vista Pública

**Ciclo Shape Up:** Ciclo 4 — Motor de Sorteos y Premios (semanas 29-30)  
**Objetivo del sprint:** El ganador recibe el correo con el token único, puede confirmar y elegir la modalidad de su premio. El resultado del sorteo es visible públicamente sin datos personales del ganador.

### Historias de usuario

| ID | Historia | Referencia HU |
|---|---|---|
| SP12-01 | Notificación al ganador con enlace de token único | USR-C4-007 |
| SP12-02 | Selección de modalidad de premio por el ganador | USR-C4-008 |
| SP12-03 | Gestión de entrega del premio desde el panel admin | USR-C4-009 |
| SP12-04 | Vista pública del resultado del sorteo sin datos personales | USR-C4-010 |
| SP12-05 | Reenvío de correo de premio al ganador con nuevo token | USR-C4-011 |

### Tareas técnicas de soporte

| ID | Descripción |
|---|---|
| TEC-12-01 | Generar token único con entropía suficiente; de un solo uso con expiración de 5 días |
| TEC-12-02 | Implementar pantalla de selección de premio accesible solo via token válido |
| TEC-12-03 | Lógica de premio por defecto si el ganador no elige en 5 días (configurable por el admin) |
| TEC-12-04 | Correo automático a todos los participantes: resultado del sorteo (sin revelar datos del ganador) |

### Criterios de aceptación del sprint

- [ ] El ganador recibe correo con los datos completos del sorteo y el enlace de token
- [ ] El token es de un solo uso; al hacer clic se invalida y se muestra la pantalla de selección de premio
- [ ] Si el token expiró, el ganador ve un mensaje claro; el admin puede reenviar desde el panel
- [ ] La vista pública muestra: lotería, resultado oficial, número ganador, estado del premio — sin nombre ni datos del ganador
- [ ] Si se aplicó la regla de fallback, se muestra la nota pública explicativa

### Definición de Done — Ciclo 4 completo

- [ ] El flujo completo de sorteo funciona de extremo a extremo en Dev
- [ ] Los tokens son seguros y de un solo uso (probado con pruebas automatizadas)
- [ ] Las devoluciones automáticas no producen inconsistencias de saldo
- [ ] Deploy exitoso en Azure Dev

---

## SPRINT 13 — Notificaciones por Correo (SendGrid) y Configuración Global

**Ciclo Shape Up:** Ciclo 5 — Operaciones y Estabilidad (semanas 33-34)  
**Objetivo del sprint:** Todos los eventos del sistema disparan correos reales a través de SendGrid. El administrador puede gestionar los parámetros globales de la plataforma desde el panel de configuración.

### Historias de usuario

| ID | Historia | Referencia HU |
|---|---|---|
| SP13-01 | Envío de correos automáticos en todos los 18 eventos definidos del sistema | USR-C5-001 |
| SP13-02 | Gestionar configuración global del sistema desde el panel admin | USR-C5-005 |

### Tareas técnicas de soporte

| ID | Descripción |
|---|---|
| TEC-13-01 | Integrar SendGrid como proveedor de correo en producción (reemplazar mock/console de Dev) |
| TEC-13-02 | Configurar DKIM y SPF en el dominio del proyecto (coordinar con administración del DNS) |
| TEC-13-03 | Implementar plantillas de correo HTML para cada uno de los 18 eventos |
| TEC-13-04 | Registrar fallos de envío de correo en el log de eventos |
| TEC-13-05 | Verificar la tabla `ConfiguracionSistema` — la migración fue generada en Sprint 01; este sprint implementa la UI de gestión y el servicio `IConfiguracionSistemaRepository` |
| TEC-13-06 | Validar que los cambios de tasa de conversión no afecten transacciones históricas |

### Criterios de aceptación del sprint

- [ ] Los 18 eventos del sistema envían correo real en el ambiente de Staging / Pre-producción
- [ ] Los correos no caen en spam (DKIM y SPF configurados y verificados)
- [ ] El admin puede modificar cada parámetro global individualmente con confirmación
- [ ] El log registra cada cambio de configuración: admin, timestamp, valor anterior, valor nuevo

---

## SPRINT 14 — Dashboard Admin, Reportes, Logs y Documentos Legales

**Ciclo Shape Up:** Ciclo 5 — Operaciones y Estabilidad (semanas 35-36)  
**Objetivo del sprint:** El administrador tiene visibilidad operativa completa con dashboard, reportes exportables y logs de auditoría. Los documentos legales están publicados en el footer de la plataforma.

### Historias de usuario

| ID | Historia | Referencia HU |
|---|---|---|
| SP14-01 | Dashboard administrativo con métricas operativas de hoy y del mes | USR-C5-002 |
| SP14-02 | Generar y descargar reportes exportables en CSV y Excel | USR-C5-003 |
| SP14-03 | Ver logs de eventos del sistema con filtros | USR-C5-004 |
| SP14-04 | Ver documentos legales desde el footer de la plataforma | USR-C5-006 |

### Tareas técnicas de soporte

| ID | Descripción |
|---|---|
| TEC-14-01 | Implementar exportación CSV con BOM UTF-8 y separador punto y coma para compatibilidad con Excel en español |
| TEC-14-02 | Crear vistas Razor estáticas para los 5 documentos legales (Términos, Privacidad, Juego Responsable, Pagos, Aviso Legal) |
| TEC-14-03 | Implementar paginación y filtros en la vista de logs |
| TEC-14-04 | Verificar que los logs sean de solo lectura desde la UI |

### Criterios de aceptación del sprint

- [ ] El dashboard muestra métricas correctas para "Hoy" y "Este mes"
- [ ] Las rifas sin equilibrio se destacan visualmente en el dashboard
- [ ] Los reportes CSV se abren correctamente en Excel en español (separador ; y encoding correcto)
- [ ] Los logs muestran todos los eventos registrados y son filtrables por usuario, tipo y fecha
- [ ] Los 5 documentos legales son accesibles desde el footer en todas las páginas

### Definición de Done — Ciclo 5 completo (plataforma feature-complete)

- [ ] La plataforma está feature-complete según todos los criterios del Shape Up
- [ ] Los correos reales funcionan en Staging a través de SendGrid
- [ ] Los documentos legales están publicados
- [ ] Deploy exitoso en Azure Staging
- [ ] Pruebas de humo (smoke tests) pasan en Staging

---

## SPRINT 15 — Control de Cambios

**Objetivo del sprint:** Gestionar, priorizar y aplicar todos los cambios identificados durante el desarrollo de los ciclos anteriores que no alteran la arquitectura base. Incluye correcciones de UX, ajustes en reglas de negocio menores y mejoras de experiencia de usuario detectadas en pruebas internas.

### Alcance

| Categoría | Descripción |
|---|---|
| **Correcciones de UX** | Ajustes en flujos donde los usuarios de prueba tuvieron fricciones o confusiones no previstas |
| **Ajustes de mensajería** | Refinamiento de textos de error, mensajes de confirmación y correos automáticos |
| **Correcciones de validaciones** | Reglas de negocio que se comportaron diferente a lo especificado en pruebas reales |
| **Ajustes de responsive** | Correcciones de diseño detectadas en dispositivos móviles durante las pruebas |
| **Correcciones de rendimiento leve** | Queries lentas identificadas en pruebas con volumen de datos real |
| **Backlog de bugs conocidos** | Lista priorizada de bugs documentados durante el desarrollo de sprints anteriores |

### Proceso de gestión de cambios

1. **Registro:** Todo cambio detectado en los sprints anteriores se documenta en el backlog con: descripción, sprint de origen, impacto estimado (alto/medio/bajo), categoría
2. **Priorización:** El Product Owner prioriza los cambios por impacto en la experiencia del usuario y la integridad del negocio
3. **Estimación:** El equipo estima en puntos de esfuerzo; solo entran al sprint los cambios que caben en 2 semanas
4. **Implementación:** Cada cambio requiere su propio Pull Request con descripción y prueba de que el problema fue resuelto
5. **Validación:** El Product Owner valida cada cambio antes de marcar el ticket como cerrado

### Criterios de aceptación del sprint

- [ ] El backlog de cambios está completamente documentado y priorizado antes del inicio del sprint
- [ ] Todos los cambios implementados tienen prueba de regresión que confirma la corrección
- [ ] No se introducen cambios arquitectónicos ni nuevas funcionalidades en este sprint
- [ ] Al finalizar, la plataforma en Staging pasa el ciclo completo de pruebas de humo sin errores

---

## SPRINT 16 — Deuda Técnica

**Objetivo del sprint:** Identificar y resolver la deuda técnica acumulada durante el desarrollo. Incluye refactorizaciones, mejoras de mantenibilidad, cobertura de pruebas y optimizaciones que no pudieron hacerse en los ciclos de funcionalidad por restricciones de tiempo.

### Categorías de deuda técnica a abordar

| Categoría | Ejemplos típicos |
|---|---|
| **Pruebas unitarias** | Cobertura de la capa Application (casos de uso, validadores, servicios) |
| **Pruebas de integración** | Flujos críticos: compra de boletas, retiros, sorteos |
| **Refactorización** | Controladores con lógica de negocio inline, código duplicado, métodos largos |
| **Seguridad** | Revisión completa OWASP Top 10 sobre toda la aplicación; corrección de hallazgos |
| **Rendimiento** | Índices faltantes en la BD, N+1 queries en EF Core, paginación deficiente |
| **Documentación técnica** | README actualizado, comentarios XML en interfaces públicas, diagrama de arquitectura |
| **Dependencias** | Actualización de paquetes NuGet a versiones estables más recientes |
| **Configuración** | Revisión de variables de entorno, secretos y configuración entre ambientes |

### Proceso

1. **Auditoría previa:** En la última semana del Sprint 15 el equipo hace una auditoría de deuda técnica y genera el listado priorizado
2. **Priorización:** Se priorizan los ítems con mayor impacto en seguridad y mantenibilidad futura
3. **No se agregan features:** Este sprint es exclusivamente de calidad técnica y no de nuevas funcionalidades

### Criterios de aceptación del sprint

- [ ] Cobertura de pruebas automatizadas ≥ 70% en la capa Application
- [ ] Los flujos críticos (compra de boletas, retiros, sorteos, devoluciones) tienen pruebas de integración
- [ ] La revisión OWASP no revela vulnerabilidades de severidad alta o crítica sin resolver
- [ ] Todas las queries N+1 identificadas en EF Core están corregidas
- [ ] El README del proyecto está actualizado con instrucciones de instalación, configuración y ejecución local

---

## SPRINT 17 — Despliegue Final y Puesta en Marcha

**Objetivo del sprint:** Desplegar la aplicación en el ambiente de producción. Configurar el dominio, los correos corporativos y todas las integraciones externas. Validar que la plataforma está 100% operativa y lista para recibir usuarios reales.

### Tareas de despliegue e infraestructura

| ID | Tarea | Responsable |
|---|---|---|
| OPS-01 | Aprovisionar ambiente de producción en Azure: App Service, SQL Database (tier producción), Key Vault | DevOps / Dev |
| OPS-02 | Ejecutar todas las migraciones de EF Core en la base de datos de producción | Dev |
| OPS-03 | Configurar Azure Application Insights para monitoreo de errores y rendimiento en producción | DevOps |
| OPS-04 | Configurar alertas en Azure Monitor: errores 500, tiempo de respuesta > 5s, disponibilidad < 99.5% | DevOps |

### Dominio y DNS

| ID | Tarea | Responsable |
|---|---|---|
| DOM-01 | Comprar y registrar el dominio de la plataforma (rickoin.co o equivalente) | Product Owner |
| DOM-02 | Configurar DNS del dominio apuntando al App Service de Azure | DevOps |
| DOM-03 | Configurar certificado SSL/TLS (Let's Encrypt o Azure Managed Certificate) | DevOps |
| DOM-04 | Verificar que HTTPS funciona correctamente y HTTP redirige a HTTPS | Dev / QA |

### Correos corporativos e integración de correo

| ID | Tarea | Responsable |
|---|---|---|
| COR-01 | Crear cuentas de correo corporativo en el dominio (ej: `admin@rickoin.co`, `noreply@rickoin.co`, `soporte@rickoin.co`) | Product Owner / DevOps |
| COR-02 | Configurar registros DKIM, SPF y DMARC en el DNS del dominio para el dominio de envío de correos | DevOps |
| COR-03 | Configurar SendGrid con el dominio verificado — activar la cuenta comercial de producción | Dev / Product Owner |
| COR-04 | Actualizar el remitente de todos los correos del sistema al dominio corporativo (`noreply@rickoin.co`) | Dev |
| COR-05 | Probar el envío de cada uno de los 18 tipos de correo del sistema en producción y verificar llegada en bandeja de entrada (no spam) | QA |
| COR-06 | Configurar la bandeja `admin@rickoin.co` como destino del correo de aprobación de usuarios con el PDF adjunto | Dev |

### Integraciones externas — validación en producción

| ID | Tarea | Responsable |
|---|---|---|
| INT-01 | Activar la cuenta comercial de la pasarela de pago (Wompi / PayU) en modo producción | Product Owner |
| INT-02 | Configurar las credenciales de producción de la pasarela en Azure Key Vault | Dev |
| INT-03 | Realizar una transacción de prueba real (compra de Rickoin) en producción y validar el flujo completo | QA / Product Owner |
| INT-04 | Configurar el webhook de confirmación de pago con la URL de producción en el portal de la pasarela | Dev |

### Validación final y go-live

| ID | Tarea | Responsable |
|---|---|---|
| VAL-01 | Ejecutar el ciclo completo de smoke tests en producción: registro → OTP → aprobación → compra Rickoin → compra boleta → sorteo simulado | QA |
| VAL-02 | Verificar que los logs de producción están llegando a Application Insights | DevOps |
| VAL-03 | Verificar que el backup automático de la base de datos de producción está configurado en Azure | DevOps |
| VAL-04 | Revisión de seguridad final: headers HTTP, HTTPS, cookies seguras, CSRF protection activo | Dev |
| VAL-05 | Verificar documentos legales publicados y accesibles desde el footer en producción | QA |
| VAL-06 | Comunicación interna de go-live: confirmar con el Product Owner que la plataforma está lista para usuarios reales | Product Owner |

### Criterios de aceptación del sprint (Go-live)

- [ ] La plataforma está accesible en el dominio de producción con HTTPS activo
- [ ] El certificado SSL es válido y no muestra advertencias en ningún navegador
- [ ] Los correos corporativos están creados y funcionales
- [ ] Los 18 tipos de correo del sistema llegan a la bandeja de entrada (no spam) desde el dominio corporativo
- [ ] La pasarela de pago está activa en modo producción y procesa transacciones reales
- [ ] El webhook de la pasarela apunta a la URL de producción
- [ ] El monitoreo en Azure Application Insights está activo y recibiendo datos
- [ ] Los backups automáticos de la base de datos están configurados
- [ ] El flujo completo de smoke tests pasa sin errores en producción
- [ ] El Product Owner da el visto bueno formal de go-live

---

## APÉNDICE — Calendario Consolidado

```
Sem 1-2   →  Sprint 01: Fundación y estructura base
Sem 3-4   →  Sprint 02: Registro, OTP y Modo Observador
Sem 5-6   →  Sprint 03: Login, recuperación y panel admin
Sem 7-8   →  Cool-down 1 (sin sprint formal)
Sem 9-10  →  Sprint 04: Step-Up Auth y monedero
Sem 11-12 →  Sprint 05: Compra de Rickoin y pasarela de pago
Sem 13-14 →  Sprint 06: Retiros, gestión admin y Fichas
Sem 15-16 →  Cool-down 2 (sin sprint formal)
Sem 17-18 →  Sprint 07: Creación de rifas y catálogo
Sem 19-20 →  Sprint 08: Compra de boletas y concurrencia
Sem 21-22 →  Sprint 09: Historial, devoluciones y ajustes
Sem 23-24 →  Cool-down 3 (sin sprint formal)
Sem 25-26 →  Sprint 10: Motor de sorteos y cierre automático
Sem 27-28 →  Sprint 11: Registro de resultados y validación del ganador
Sem 29-30 →  Sprint 12: Notificación, premio y vista pública
Sem 31-32 →  Cool-down 4 (sin sprint formal)
Sem 33-34 →  Sprint 13: SendGrid y configuración global
Sem 35-36 →  Sprint 14: Dashboard, reportes, logs y docs legales
Sem 37-38 →  Sprint 15: Control de Cambios
Sem 39-40 →  Sprint 16: Deuda Técnica
Sem 41-42 →  Sprint 17: Despliegue Final y Puesta en Marcha
```

**Duración total estimada:** 42 semanas (~10.5 meses) incluyendo cool-downs

---

## APÉNDICE — Definición de Done Global

Aplica a todos los sprints salvo indicación específica:

- [ ] Código revisado y aprobado mediante Pull Request (mínimo 1 revisor)
- [ ] Las pruebas automatizadas existentes siguen pasando (sin regresiones)
- [ ] El deploy al ambiente correspondiente es exitoso y estable
- [ ] Los nuevos eventos quedan registrados en el sistema de logs (`AuditLog`)
- [ ] Los correos relacionados al sprint se envían correctamente (en mock durante Dev, en real desde Staging)
- [ ] No hay secretos ni credenciales en el código fuente

---

*RICKOIN Plan de Sprints v1.0 — Mayo 2026 — 17 sprints · 42 semanas · Go-live incluido*
