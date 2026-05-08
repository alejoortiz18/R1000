# RICKOIN — Historias de Usuario

**Proyecto:** Rickoin — Plataforma de rifas digitales con moneda virtual  
**Versión:** 1.0 — Mayo 2026  
**Método:** Shape Up (5 Ciclos × 6 semanas)  
**Formato:** Como [actor], quiero [acción], para [beneficio] + Criterios de aceptación

---

## ÍNDICE

- [Glosario de Actores](#glosario-de-actores)
- [Ciclo 1 — Identidad y Acceso](#ciclo-1--identidad-y-acceso)
- [Ciclo 2 — Monedero Rickoin](#ciclo-2--monedero-rickoin)
- [Ciclo 3 — Rifas y Marketplace](#ciclo-3--rifas-y-marketplace)
- [Ciclo 4 — Motor de Sorteos y Premios](#ciclo-4--motor-de-sorteos-y-premios)
- [Ciclo 5 — Operaciones y Estabilidad](#ciclo-5--operaciones-y-estabilidad)

---

## Glosario de Actores

| Actor | Descripción |
|---|---|
| **Visitante** | Persona no registrada que accede a la plataforma |
| **Usuario (Observador)** | Cuenta registrada y con correo confirmado, pendiente de aprobación por el administrador. Solo lectura |
| **Usuario (Activo)** | Cuenta aprobada por el administrador. Acceso completo a la zona pública y financiera |
| **Administrador** | Acceso total al panel de administración: gestión de usuarios, rifas, retiros, configuración |
| **Sistema** | Procesos automáticos: jobs programados, validaciones, envío de correos, sorteos |
| **Ganador** | Usuario Activo que ha sido identificado como ganador de una rifa |

### Convenciones de ID

Cada historia tiene un identificador con la forma `USR-C[n]-[nnn]` donde `[n]` es el número de ciclo y `[nnn]` es el número secuencial dentro del ciclo.

---

## Ciclo 1 — Identidad y Acceso

> **Resultado del ciclo:** Un usuario puede registrarse, confirmar su cuenta, quedar en Modo Observador y esperar aprobación del administrador. El administrador puede revisar, aprobar y rechazar cuentas. La plataforma está desplegada en Azure.

---

### USR-C1-001 — Registro de nueva cuenta

**Como** visitante,  
**quiero** registrarme en la plataforma proporcionando mi nombre completo, correo electrónico y contraseña,  
**para** crear una cuenta en Rickoin e iniciar el proceso de verificación.

**Criterios de aceptación:**

- [ ] El formulario requiere: nombre completo, correo electrónico, contraseña y confirmación de contraseña
- [ ] El correo debe tener formato válido y no estar registrado previamente
- [ ] La contraseña debe cumplir la política mínima de seguridad (longitud y complejidad)
- [ ] Las contraseñas ingresadas deben coincidir
- [ ] Al enviar el formulario, el sistema crea la cuenta en estado `Pendiente de confirmación`
- [ ] El sistema envía automáticamente un correo con un código OTP de 6 dígitos al correo ingresado
- [ ] El usuario es redirigido a la pantalla de confirmación de código OTP
- [ ] Si el correo ya está registrado, se muestra un mensaje de error sin revelar si la cuenta está activa o no (mensaje neutro por seguridad)

---

### USR-C1-002 — Confirmación de cuenta por código OTP

**Como** visitante con registro pendiente de confirmación,  
**quiero** ingresar el código OTP que recibí en mi correo,  
**para** verificar que el correo me pertenece y activar el estado Modo Observador en mi cuenta.

**Criterios de aceptación:**

- [ ] El campo acepta exactamente 6 dígitos numéricos
- [ ] El código expira en 15 minutos desde su generación (parametrizable)
- [ ] Si el código es válido y no expiró: la cuenta cambia a estado `Observador` y el usuario es redirigido al dashboard en Modo Observador
- [ ] Si el código es inválido: se muestra un mensaje de error, el campo se limpia
- [ ] Si el código expiró: se muestra un mensaje claro con la opción de reenviar un nuevo código
- [ ] El usuario ve un botón visible "Reenviar código" en todo momento durante este flujo
- [ ] El sistema registra el evento de confirmación exitosa (usuario, timestamp)

---

### USR-C1-003 — Reenvío de código OTP de confirmación

**Como** visitante con registro pendiente de confirmación,  
**quiero** solicitar que se me envíe un nuevo código OTP,  
**para** continuar si el código anterior expiró o no llegó a mi correo.

**Criterios de aceptación:**

- [ ] Al solicitar el reenvío, el sistema genera un nuevo código OTP de 6 dígitos
- [ ] El nuevo código invalida inmediatamente el código anterior (solo el más reciente es válido)
- [ ] El nuevo código tiene un nuevo tiempo de expiración de 15 minutos desde su generación
- [ ] El sistema envía el nuevo código al correo registrado
- [ ] Se muestra confirmación de que el código fue enviado
- [ ] Se aplica un límite de intentos de reenvío para prevenir abuso (máximo configurable)

---

### USR-C1-004 — Explorar la plataforma en Modo Observador

**Como** Usuario (Observador),  
**quiero** poder navegar y ver el catálogo de rifas, precios y reglas,  
**para** explorar la plataforma mientras espero que mi cuenta sea aprobada.

**Criterios de aceptación:**

- [ ] El usuario puede ver el catálogo de rifas con nombre, imagen (URL externa si fue configurada), precio de boleta, progreso de boletas vendidas y fecha de cierre
- [ ] El usuario puede ver el detalle de cada rifa activa (artículo, reglas, punto de equilibrio, progreso)
- [ ] El usuario puede ver su perfil propio y el estado de su cuenta
- [ ] El usuario puede subir o actualizar su documento de identidad (única acción de escritura disponible en modo observador)
- [ ] En el header y en el dashboard se muestra de forma permanente un banner: *"Tu cuenta está en revisión. El administrador la aprobará en breve."*
- [ ] Los botones de compra de boletas muestran el texto *"Activa tu cuenta para participar"* y no ejecutan ninguna acción

---

### USR-C1-005 — Bloqueo de acciones restringidas para Usuario Observador

**Como** Sistema,  
**quiero** bloquear en el backend cualquier intento de acción protegida por parte de un Usuario Observador,  
**para** garantizar que el modo observador sea una restricción real y no solo visual.

**Criterios de aceptación:**

- [ ] Cualquier solicitud al servidor de una acción protegida (compra de boletas, acceso a monedero, step-up, retiro) desde una cuenta en estado Observador devuelve `HTTP 403`
- [ ] El mensaje de error es claro: *"Tu cuenta aún no ha sido aprobada. No puedes realizar esta acción."*
- [ ] El bloqueo opera independientemente de lo que muestre la interfaz (no es suficiente con ocultar botones)
- [ ] La restricción aplica a todas las acciones protegidas sin excepción

---

### USR-C1-006 — Subir documento de identidad

**Como** Usuario (Observador),  
**quiero** subir mi documento de identidad en formato PDF desde mi perfil,  
**para** agilizar el proceso de aprobación de mi cuenta por parte del administrador.

**Criterios de aceptación:**

- [ ] La funcionalidad está disponible en el perfil del usuario en estado Observador (y también para usuarios en estado Rechazado)
- [ ] Se acepta **únicamente formato PDF** con un tamaño máximo de 5 MB
- [ ] Si se intenta subir un archivo en otro formato, se muestra un error: *"Solo se aceptan archivos en formato PDF."*
- [ ] Al subir el documento, el sistema lo envía automáticamente como adjunto al **correo del sistema** (bandeja del administrador) junto con los datos del usuario: nombre completo, correo, fecha de registro y estado de cuenta
- [ ] El correo enviado al administrador incluye dos botones de acción: **[Aprobar usuario]** y **[Rechazar usuario]**
- [ ] El archivo PDF **no se almacena en ningún servidor**; el correo es el único repositorio del documento
- [ ] Al subir el documento, el estado del mismo cambia a `Pendiente de revisión`
- [ ] Si ya existe un envío previo (estado Rechazado), el nuevo PDF genera un nuevo correo al administrador con los mismos botones
- [ ] En el perfil se muestra el estado del documento: `No subido` / `Pendiente de revisión` / `Verificado` / `Rechazado`
- [ ] El formato y el tamaño se validan en el cliente antes de enviar el archivo

---

### USR-C1-007 — Inicio de sesión

**Como** usuario registrado (Observador o Activo),  
**quiero** iniciar sesión con mi correo electrónico y contraseña,  
**para** acceder a la plataforma según el estado de mi cuenta.

**Criterios de aceptación:**

- [ ] El formulario requiere correo electrónico y contraseña
- [ ] Si las credenciales son correctas y la cuenta está en estado `Observador`: se redirige al dashboard en Modo Observador con el banner de revisión visible
- [ ] Si las credenciales son correctas y la cuenta está `Activa`: se redirige al dashboard de la Zona Pública
- [ ] Si las credenciales son incorrectas: se muestra un mensaje de error genérico (sin indicar si el correo existe o no)
- [ ] Si la cuenta está bloqueada: se muestra el mensaje de bloqueo y el tiempo restante
- [ ] Si la cuenta está en estado `Pendiente de confirmación de correo`: se redirige al flujo de confirmación OTP
- [ ] Si la cuenta está `Rechazada`: se muestra un mensaje con el motivo del rechazo y la opción de actualizar el documento

---

### USR-C1-008 — Bloqueo temporal por intentos fallidos de inicio de sesión

**Como** Sistema,  
**quiero** bloquear temporalmente una cuenta después de un número configurable de intentos fallidos de inicio de sesión,  
**para** prevenir ataques de fuerza bruta sobre las contraseñas de los usuarios.

**Criterios de aceptación:**

- [ ] El sistema cuenta los intentos fallidos consecutivos por correo electrónico
- [ ] Al alcanzar el límite configurable (por defecto: 5 intentos), la cuenta queda bloqueada temporalmente
- [ ] El tiempo de bloqueo es configurable (por defecto: 30 minutos)
- [ ] El usuario ve un mensaje claro indicando que su cuenta está bloqueada y cuándo puede intentar de nuevo
- [ ] Un inicio de sesión exitoso resetea el contador de intentos fallidos
- [ ] El bloqueo se registra en el log de eventos del sistema

---

### USR-C1-009 — Recuperación de contraseña

**Como** usuario registrado,  
**quiero** solicitar un enlace de recuperación de contraseña a mi correo,  
**para** recuperar el acceso a mi cuenta si olvidé mi contraseña.

**Criterios de aceptación:**

- [ ] El usuario ingresa su correo en un formulario de recuperación
- [ ] El sistema responde con el mismo mensaje sin importar si el correo existe o no: *"Si el correo está registrado, recibirás las instrucciones."* (seguridad: evita enumeración de usuarios)
- [ ] Si el correo existe: el sistema envía un correo con un enlace de recuperación que contiene un token único
- [ ] El token es de un solo uso y tiene expiración (configurable, por defecto 15 minutos)
- [ ] Al hacer clic en el enlace: se muestra un formulario para ingresar y confirmar la nueva contraseña
- [ ] Al guardar la nueva contraseña: el token queda invalidado y se redirige al login con mensaje de éxito
- [ ] Si el token ya fue usado o expiró: se muestra un mensaje claro con la opción de solicitar un nuevo enlace

---

### USR-C1-010 — Ver perfil propio

**Como** usuario registrado (Observador o Activo),  
**quiero** ver mi información de perfil y el estado actual de mi cuenta,  
**para** saber en qué punto estoy en el proceso de registro y aprobación.

**Criterios de aceptación:**

- [ ] El perfil muestra: nombre completo, correo electrónico, estado de la cuenta y estado del documento de identidad
- [ ] El estado de la cuenta refleja el estado actual: `En revisión`, `Activa`, `Rechazada`
- [ ] El estado del documento refleja: `No subido`, `Pendiente de revisión`, `Verificado`
- [ ] Si la cuenta fue rechazada, se muestra el motivo del rechazo
- [ ] El usuario puede subir o actualizar su documento de identidad desde esta pantalla

---

### USR-C1-011 — Ver usuarios pendientes de aprobación (Administrador)

**Como** Administrador,  
**quiero** ver la lista de usuarios pendientes de aprobación en el panel y recibir el PDF del documento por correo,  
**para** revisar cada caso y tomar una decisión de aprobación o rechazo.

**Criterios de aceptación:**

- [ ] En el panel de administración se muestra un badge con el número de usuarios pendientes desde el primer login del día
- [ ] La lista muestra: nombre, correo, fecha de registro, tiempo transcurrido desde el registro y estado del documento
- [ ] Se puede filtrar por estado: `Pendiente de aprobación`, `Aprobado`, `Rechazado`
- [ ] Cuando el usuario sube su PDF, el administrador recibe un **correo automático** con: nombre completo, correo, fecha de registro, estado de cuenta y el PDF adjunto
- [ ] El correo incluye dos botones de acción directa: **[Aprobar usuario]** y **[Rechazar usuario]**
- [ ] Si el usuario no ha subido documento, en la lista del panel se indica claramente: *"Sin documento — pendiente"*
- [ ] La lista está ordenada por tiempo de espera (más antiguo primero)

---

### USR-C1-012 — Aprobar cuenta de usuario (Administrador)

**Como** Administrador,  
**quiero** aprobar la cuenta de un usuario pendiente,  
**para** habilitarlo a usar todas las funcionalidades de la plataforma.

**Criterios de aceptación:**

- [ ] El Administrador puede aprobar una cuenta desde el **botón [Aprobar usuario]** del correo recibido, o desde la vista de usuarios pendientes en el panel
- [ ] La aprobación es posible incluso si el usuario no subió un documento de identidad (se registra la decisión)
- [ ] Al aprobar, el estado de la cuenta cambia inmediatamente de `Observador` a `Activo`
- [ ] El sistema envía automáticamente un correo al usuario con el mensaje: *"El estado de tu cuenta ha cambiado a: **Activa**. Ya puedes acceder a todas las funciones de la plataforma."*
- [ ] La acción queda registrada en el log de eventos: administrador, timestamp, usuario afectado
- [ ] El usuario, al recargar o volver a iniciar sesión, accede directamente a la Zona Pública sin el banner de revisión

---

### USR-C1-013 — Rechazar cuenta de usuario (Administrador)

**Como** Administrador,  
**quiero** rechazar la cuenta de un usuario pendiente indicando el motivo del rechazo,  
**para** informarle qué debe corregir y mantener el control de calidad de los usuarios de la plataforma.

**Criterios de aceptación:**

- [ ] El Administrador puede rechazar una cuenta desde el **botón [Rechazar usuario]** del correo recibido, o desde la vista de usuarios pendientes en el panel
- [ ] Al hacer clic en [Rechazar usuario], el sistema solicita al administrador ingresar un **mensaje de motivo** (campo de texto obligatorio) antes de confirmar el rechazo
- [ ] El estado de la cuenta cambia a `Rechazada`
- [ ] El sistema envía automáticamente un correo al usuario con: el nuevo estado de la cuenta y el mensaje del administrador. Ejemplo: *"El estado de tu cuenta ha cambiado a: **Rechazada**. Motivo: [mensaje del administrador]. Por favor, sube nuevamente tu documento corregido para que podamos revisar tu solicitud."*
- [ ] El estado `Rechazada` no es terminal: el usuario puede volver a subir su documento PDF y el estado cambia a `Pendiente de revisión`
- [ ] La acción queda registrada en el log de eventos: administrador, timestamp, motivo, usuario afectado

---

### USR-C1-014 — Re-enviar cuenta a revisión tras rechazo

**Como** Usuario (con cuenta Rechazada),  
**quiero** subir un nuevo PDF de mi documento de identidad para que mi cuenta sea revisada nuevamente,  
**para** corregir el motivo del rechazo y poder ser aprobado.

**Criterios de aceptación:**

- [ ] Un usuario con cuenta `Rechazada` puede subir un nuevo PDF de su documento desde su perfil
- [ ] Se acepta **únicamente formato PDF** (misma restricción que el primer envío)
- [ ] Al subir el nuevo PDF, el sistema lo envía al **correo del sistema** (bandeja del administrador) con los datos del usuario y los botones **[Aprobar usuario]** y **[Rechazar usuario]**
- [ ] El correo al administrador indica que se trata de un **reenvío tras rechazo** para que el administrador tenga contexto
- [ ] Al subir el documento, el estado de la cuenta vuelve automáticamente a `Pendiente de aprobación`
- [ ] El badge de usuarios pendientes en el panel del administrador se actualiza

---

### USR-C1-015 — Inicio de sesión como Administrador

**Como** Administrador,  
**quiero** iniciar sesión con mis credenciales para acceder al panel de administración,  
**para** gestionar usuarios, rifas, retiros y la configuración general de la plataforma.

**Criterios de aceptación:**

- [ ] El login del administrador usa el mismo formulario de inicio de sesión que los usuarios regulares
- [ ] Al autenticarse con una cuenta de rol `Administrador`, se redirige al panel de administración
- [ ] El panel muestra desde la primera pantalla el badge de usuarios pendientes de aprobación
- [ ] El administrador no puede acceder a las funcionalidades de usuario regular (compra de boletas, monedero) desde su sesión de admin
- [ ] El bloqueo por intentos fallidos aplica también a la cuenta de administrador

---

### Restricciones no funcionales — Ciclo 1

- Las contraseñas se almacenan con hash y salt seguro (nunca en texto plano)
- Los tokens de OTP y recuperación se generan con entropía suficiente (no predecibles)
- Los documentos de identidad **no se almacenan en ningún servidor ni unidad de almacenamiento**; el PDF se envía como adjunto al correo del sistema y el correo es el único repositorio del archivo
- Solo se acepta formato PDF para el documento de identidad; JPG, PNG y otros formatos son rechazados
- El modo observador se implementa como validación en el backend; no es suficiente con modificar la UI
- Todos los endpoints de acciones protegidas validan el estado de la cuenta antes de procesar la solicitud
- La plataforma se despliega en Azure App Service + SQL Database + Key Vault para secretos

---

## Ciclo 2 — Monedero Rickoin

> **Resultado del ciclo:** El usuario aprobado puede comprar Rickoin con dinero real, ver su saldo de Rickoin y Fichas, ver el historial de movimientos, solicitar y cancelar retiros. Todo el flujo financiero está protegido por Step-Up Authentication. El administrador puede gestionar retiros y asignar Fichas manualmente.

---

### USR-C2-001 — Step-Up Authentication para acceder a la zona financiera

**Como** Usuario (Activo),  
**quiero** verificar mi identidad antes de acceder a mi monedero o realizar operaciones financieras,  
**para** proteger mis fondos incluso si alguien más tiene acceso a mi sesión activa.

**Criterios de aceptación:**

- [ ] Al intentar acceder a la zona financiera sin sesión financiera activa, se presenta una pantalla de verificación de identidad
- [ ] El usuario puede elegir verificarse con: (a) su contraseña actual, o (b) un código OTP enviado a su correo
- [ ] Si la verificación es exitosa, se activa una sesión financiera con duración de 20 minutos de inactividad
- [ ] Cada acción realizada dentro de la zona financiera reinicia el contador de inactividad de 20 minutos
- [ ] Al expirar la sesión financiera, la próxima acción financiera solicita verificación nuevamente sin cerrar la sesión general del usuario
- [ ] Si la verificación falla (contraseña incorrecta o código incorrecto), se muestra un error y se puede volver a intentar
- [ ] El código OTP para step-up expira en 15 minutos (parametrizable)
- [ ] El inicio y cierre de la sesión financiera se registran en el log de eventos

---

### USR-C2-002 — Ver saldo de Rickoin y Fichas

**Como** Usuario (Activo),  
**quiero** ver mi saldo actual de Rickoin y Fichas en mi monedero,  
**para** saber cuánto tengo disponible antes de participar en una rifa.

**Criterios de aceptación:**

- [ ] El saldo de Rickoin es visible en el header global para el usuario activo (zona pública, sin step-up)
- [ ] El saldo de Fichas es visible en el header global para el usuario activo (zona pública, sin step-up)
- [ ] En el monedero (zona financiera) se muestra el equivalente en COP del saldo Rickoin según la tasa vigente
- [ ] Las Fichas no tienen equivalente en COP y no se muestra conversión para ellas
- [ ] El saldo mostrado refleja el estado en tiempo real (actualizado después de cada transacción)

---

### USR-C2-003 — Ver historial de movimientos de Rickoin

**Como** Usuario (Activo) con sesión financiera activa,  
**quiero** ver el historial completo de mis movimientos de Rickoin con fecha, tipo, monto y estado,  
**para** hacer seguimiento de mis transacciones y verificar cualquier operación.

**Criterios de aceptación:**

- [ ] El historial está disponible solo dentro de la zona financiera (requiere step-up activo)
- [ ] Cada entrada muestra: fecha y hora, tipo de movimiento (compra Rickoin, compra boleta, devolución, retiro), monto, estado
- [ ] Para las compras de Rickoin se registra el valor de conversión COP vigente en el momento de la transacción (no se recalcula retroactivamente)
- [ ] El historial es paginado y filtrable por período
- [ ] El historial de Rickoin y el de Fichas se muestran en pestañas o secciones separadas

---

### USR-C2-004 — Ver historial de movimientos de Fichas

**Como** Usuario (Activo),  
**quiero** ver el historial de mis movimientos de Fichas,  
**para** saber cuándo y por qué recibí Fichas o las usé en una rifa.

**Criterios de aceptación:**

- [ ] El historial de Fichas es accesible desde el monedero
- [ ] Cada entrada muestra: fecha y hora, tipo de movimiento (asignación por admin, uso en compra de boleta), monto, motivo
- [ ] El motivo de las asignaciones por parte del administrador es visible para el usuario
- [ ] El historial es paginado y filtrable por período
- [ ] Las Fichas no tienen campo de equivalente en COP en el historial

---

### USR-C2-005 — Comprar Rickoin con pasarela de pago

**Como** Usuario (Activo) con sesión financiera activa,  
**quiero** comprar Rickoin ingresando la cantidad deseada y pagando con mi tarjeta o PSE,  
**para** tener saldo disponible para participar en rifas.

**Criterios de aceptación:**

- [ ] El formulario muestra la tasa de conversión vigente: `1 Rickoin = [tasa] COP`
- [ ] Al ingresar la cantidad de Rickoin, se calcula automáticamente el total en COP
- [ ] El usuario puede seleccionar el método de pago: tarjeta de crédito/débito o PSE
- [ ] Al confirmar, el sistema redirige a la pasarela de pago integrada
- [ ] Si el pago es exitoso: la pasarela retorna a la plataforma, el saldo se acredita inmediatamente y se envía correo de confirmación con la tasa aplicada
- [ ] Si el pago falla o es cancelado: el saldo no se modifica y se muestra un mensaje claro
- [ ] La transacción queda registrada en el historial con fecha, monto en Rickoin, monto en COP y tasa aplicada

---

### USR-C2-006 — Solicitar retiro de Rickoin

**Como** Usuario (Activo) con sesión financiera activa,  
**quiero** solicitar el retiro de parte o total de mis Rickoin a una cuenta bancaria colombiana,  
**para** convertirlos en dinero real (COP).

**Criterios de aceptación:**

- [ ] El formulario muestra el saldo disponible y el equivalente en COP
- [ ] El usuario ingresa: monto a retirar en Rickoin, banco, tipo de cuenta (ahorros/corriente), número de cuenta, nombre del titular
- [ ] Los datos bancarios se ingresan en cada solicitud y **no se guardan** entre sesiones por seguridad
- [ ] Se muestra el equivalente en COP a recibir y el tiempo estimado de procesamiento (6 a 10 días hábiles)
- [ ] Se muestra una pantalla de confirmación explícita antes de registrar el retiro
- [ ] Al confirmar: el saldo de Rickoin se descuenta inmediatamente, se crea el retiro en estado `Pendiente` y se envía correo de confirmación
- [ ] El correo y la vista del retiro muestran claramente la fecha límite de cancelación (5 días desde la solicitud)
- [ ] No se permite solicitar un monto mayor al saldo disponible

---

### USR-C2-007 — Cancelar retiro pendiente

**Como** Usuario (Activo),  
**quiero** cancelar un retiro que solicité recientemente,  
**para** recuperar mi saldo de Rickoin si cambié de opinión.

**Criterios de aceptación:**

- [ ] La opción de cancelar está disponible en el detalle del retiro mientras el estado sea `Pendiente` y no hayan pasado más de 5 días desde la solicitud
- [ ] Al cancelar, el saldo de Rickoin se restaura inmediatamente
- [ ] El estado del retiro cambia a `Cancelado`
- [ ] Se envía correo de confirmación de la cancelación al usuario
- [ ] Una vez pasados los 5 días o si el estado ya no es `Pendiente`, el botón de cancelar no está disponible

---

### USR-C2-008 — Ver estado de mis retiros

**Como** Usuario (Activo),  
**quiero** ver el estado actual y el historial de mis solicitudes de retiro,  
**para** saber en qué etapa está cada una y si puedo cancelarlas.

**Criterios de aceptación:**

- [ ] Cada retiro muestra: fecha de solicitud, monto en Rickoin, monto equivalente en COP, banco, estado y fecha límite de cancelación (si aplica)
- [ ] Los estados posibles son: `Pendiente`, `Aprobado`, `Procesado`, `Fallido`, `Cancelado`, `Rechazado`
- [ ] Si el estado es `Rechazado` o `Fallido`, se muestra el motivo

---

### USR-C2-009 — Ver lista de retiros pendientes (Administrador)

**Como** Administrador,  
**quiero** ver la lista de retiros pendientes con la información necesaria para procesarlos,  
**para** gestionar los pagos a los usuarios de forma ordenada.

**Criterios de aceptación:**

- [ ] La lista muestra: nombre del usuario, monto en Rickoin, banco (enmascarado: últimos 4 dígitos), días transcurridos desde la solicitud
- [ ] Se puede filtrar por estado: `Pendiente`, `Aprobado`, `Procesado`, `Fallido`, `Cancelado`, `Rechazado`
- [ ] Se puede expandir el detalle de cada retiro para ver los datos completos de la cuenta bancaria
- [ ] La lista está ordenada por tiempo de espera (más antiguo primero)

---

### USR-C2-010 — Aprobar retiro (Administrador)

**Como** Administrador,  
**quiero** aprobar un retiro pendiente de un usuario,  
**para** indicar que se procederá con la transferencia bancaria.

**Criterios de aceptación:**

- [ ] Al aprobar, el estado del retiro cambia a `Aprobado`
- [ ] Se envía correo automático al usuario notificando la aprobación
- [ ] La acción queda registrada en el log: administrador, timestamp, retiro aprobado
- [ ] Un retiro aprobado puede posteriormente marcarse como `Procesado` o `Fallido`

---

### USR-C2-011 — Rechazar retiro (Administrador)

**Como** Administrador,  
**quiero** rechazar un retiro pendiente indicando el motivo,  
**para** informar al usuario por qué no se procesará su solicitud.

**Criterios de aceptación:**

- [ ] El campo de motivo es obligatorio al rechazar
- [ ] El estado del retiro cambia a `Rechazado`
- [ ] El saldo de Rickoin se restaura automáticamente en la cuenta del usuario
- [ ] Se envía correo al usuario con el motivo del rechazo y el saldo restaurado
- [ ] La acción queda registrada en el log

---

### USR-C2-012 — Marcar retiro como fallido (Administrador)

**Como** Administrador,  
**quiero** marcar un retiro ya aprobado como fallido cuando la transferencia bancaria no se pudo ejecutar,  
**para** revertir el estado y notificar al usuario para que corrija sus datos bancarios.

**Criterios de aceptación:**

- [ ] El estado `Fallido` está disponible solo cuando el retiro está en estado `Aprobado`
- [ ] Al marcarlo como fallido, el saldo de Rickoin se restaura automáticamente en la cuenta del usuario
- [ ] Se envía correo al usuario indicando que la transferencia falló y que puede solicitar un nuevo retiro con datos corregidos
- [ ] La acción y el motivo quedan registrados en el log

---

### USR-C2-013 — Asignar Fichas manualmente (Administrador)

**Como** Administrador,  
**quiero** asignar Fichas a uno o más usuarios con un motivo visible para ellos,  
**para** premiarlos, compensarlos o darles una bonificación de bienvenida.

**Criterios de aceptación:**

- [ ] El administrador puede elegir el destinatario entre: usuario específico (búsqueda por nombre o correo), todos los usuarios activos, usuarios registrados en un rango de fechas
- [ ] El campo `Motivo` es obligatorio y será visible para el usuario en su historial de Fichas
- [ ] Se muestra una vista previa antes de confirmar: cantidad de Fichas, destinatarios estimados y motivo
- [ ] Al confirmar, la asignación masiva se procesa en background (job asíncrono por lotes) sin bloquear la UI del administrador
- [ ] El panel muestra el estado del proceso: `Procesando...` / `Completado` con el número de usuarios afectados
- [ ] Cada usuario que recibe Fichas recibe un correo automático con el monto y el motivo
- [ ] La asignación queda registrada en el historial de Fichas de cada usuario con el motivo indicado

---

### Restricciones no funcionales — Ciclo 2

- Los datos bancarios del usuario (número de cuenta, banco) no se persisten entre sesiones; se ingresan en cada solicitud de retiro
- La tasa de conversión aplicada a cada transacción se registra en el momento de la operación; no se recalcula retroactivamente
- Las Fichas no son retirables ni convertibles a Rickoin bajo ninguna circunstancia
- La sesión financiera (step-up) tiene timeout de inactividad de 20 minutos (parametrizable); no cierra la sesión general
- La asignación masiva de Fichas utiliza procesamiento en background para evitar timeouts con grandes volúmenes de usuarios
- La pasarela de pago debe estar activada y configurada antes del inicio del ciclo (proceso de activación comercial puede tomar días)

---

## Ciclo 3 — Rifas y Marketplace

> **Resultado del ciclo:** El administrador puede crear y publicar rifas. Los usuarios activos pueden ver el catálogo, ver el detalle de cada rifa y comprar boletas con Rickoin, Fichas o una combinación de ambos. El sistema garantiza que no se venda la misma boleta dos veces mediante control de concurrencia transaccional.

---

### USR-C3-001 — Crear rifa (Administrador)

**Como** Administrador,  
**quiero** crear una nueva rifa con todos sus parámetros de configuración,  
**para** publicarla en la plataforma y que los usuarios puedan participar.

**Criterios de aceptación:**

- [ ] El formulario requiere: nombre del artículo, descripción, URL de imagen (campo opcional), valor estimado del artículo en COP, precio por boleta en Rickoin, total de boletas disponibles, punto de equilibrio (mínimo de boletas), fecha de inicio y fecha de cierre
- [ ] El punto de equilibrio no puede ser mayor al total de boletas (validación: `punto_equilibrio <= total_boletas`)
- [ ] Se puede configurar el máximo de boletas que un mismo usuario puede comprar en esta rifa (por defecto: valor de configuración global)
- [ ] La URL de imagen es opcional; si se proporciona, el sistema la renderiza directamente con `<img src>` sin almacenamiento local — se acepta cualquier URL pública (Google Drive, CDN, etc.)
- [ ] Si la URL de imagen no se proporciona o no es accesible, se muestra un placeholder visual sin mensajes de error
- [ ] El estado inicial puede ser `Borrador` o `Activa`
- [ ] Una rifa en `Borrador` no es visible para los usuarios
- [ ] Al guardar, el sistema valida todos los campos y muestra errores en línea

---

### USR-C3-002 — Publicar rifa en borrador (Administrador)

**Como** Administrador,  
**quiero** publicar una rifa que está en estado Borrador,  
**para** hacerla visible en el catálogo y que los usuarios puedan ver y comprar boletas.

**Criterios de aceptación:**

- [ ] Una rifa en `Borrador` puede ser editada y publicada desde el panel de administración
- [ ] Al publicar, el estado cambia a `Activa` y la rifa aparece en el catálogo público
- [ ] Una rifa en estado `Activa` no puede volver a estado `Borrador`
- [ ] Solo los campos no críticos (descripción, URL de imagen) pueden editarse una vez que la rifa está activa

---

### USR-C3-003 — Cerrar rifa anticipadamente (Administrador)

**Como** Administrador,  
**quiero** cerrar manualmente una rifa activa antes de su fecha límite,  
**para** evaluar el punto de equilibrio y proceder con el sorteo o la devolución de inmediato.

**Criterios de aceptación:**

- [ ] El administrador puede cerrar manualmente cualquier rifa en estado `Activa`
- [ ] Al cerrar, el sistema aplica las mismas reglas que el cierre automático: evalúa el punto de equilibrio en ese momento
- [ ] Si no se alcanzó el punto de equilibrio: la rifa queda en estado `Cancelada` y el proceso de devolución se inicia automáticamente
- [ ] Si se alcanzó el punto de equilibrio: la rifa queda en estado `Cerrada — Pendiente de resultado` y espera el registro del resultado del sorteo
- [ ] La acción queda registrada en el log con el motivo `"cierre manual por administrador"`

---

### USR-C3-004 — Ver catálogo de rifas

**Como** usuario (Activo u Observador) o visitante no registrado,  
**quiero** ver el listado de rifas disponibles con su información principal,  
**para** explorar las rifas activas y decidir en cuáles participar.

**Criterios de aceptación:**

- [ ] El catálogo muestra las rifas en estado `Activa` con: nombre, imagen (renderizada desde la URL si fue proporcionada), precio de boleta en Rickoin, progreso de boletas vendidas (barra visual + número), fecha de cierre
- [ ] Las rifas finalizadas o canceladas se muestran en una sección colapsada al final del catálogo
- [ ] El catálogo es visible para cualquier usuario, incluyendo Observadores y visitantes no registrados
- [ ] Los usuarios Observadores ven el catálogo completo pero los botones de compra muestran `"Activa tu cuenta para participar"` y no ejecutan acción
- [ ] Se pueden aplicar filtros básicos (precio, estado)

---

### USR-C3-005 — Ver detalle de una rifa

**Como** Usuario (Activo),  
**quiero** ver el detalle completo de una rifa incluyendo su progreso, reglas y mi probabilidad de ganar,  
**para** tomar una decisión informada antes de comprar boletas.

**Criterios de aceptación:**

- [ ] La vista de detalle muestra: nombre del artículo, imagen (renderizada desde URL si existe), descripción, valor estimado del artículo en COP, precio de boleta en Rickoin y COP, total de boletas, boletas vendidas, boletas disponibles, punto de equilibrio y estado (alcanzado o no), barra de progreso visual, fecha de cierre con días restantes
- [ ] Se calcula y muestra la probabilidad del usuario si compra N boletas (actualizada al cambiar la cantidad seleccionada)
- [ ] Si el usuario ya compró boletas en esta rifa, se muestran sus boletas y sus números
- [ ] Los botones de compra están habilitados solo para usuarios Activos

---

### USR-C3-006 — Comprar boletas con Rickoin

**Como** Usuario (Activo),  
**quiero** comprar una o más boletas de una rifa usando mi saldo de Rickoin,  
**para** participar en el sorteo.

**Criterios de aceptación:**

- [ ] El usuario puede seleccionar la cantidad de boletas a comprar (de 1 hasta el máximo configurado para esa rifa)
- [ ] Se muestra el total en Rickoin y el saldo resultante antes de confirmar
- [ ] Se presenta una pantalla de confirmación explícita antes de procesar la compra
- [ ] La compra se procesa con una transacción atómica en base de datos: descuenta el saldo y asigna las boletas
- [ ] El número de boleta es asignado automáticamente por el sistema (no elegido por el usuario)
- [ ] Al completar la compra: el saldo se actualiza, las boletas aparecen en "Mis boletas" y se envía correo de confirmación con los números de boleta
- [ ] Si no hay saldo suficiente, se muestra un error antes de la confirmación

---

### USR-C3-007 — Comprar boletas con Fichas

**Como** Usuario (Activo),  
**quiero** comprar boletas de una rifa usando mis Fichas,  
**para** participar sin necesidad de usar mis Rickoin.

**Criterios de aceptación:**

- [ ] Las Fichas son una opción de pago válida para la compra de boletas
- [ ] El flujo y las validaciones son idénticos a la compra con Rickoin
- [ ] Se muestra el saldo de Fichas resultante en la pantalla de confirmación
- [ ] La transacción descuenta las Fichas del saldo del usuario de forma atómica junto con la asignación de la boleta

---

### USR-C3-008 — Comprar boletas con pago mixto (Rickoin + Fichas)

**Como** Usuario (Activo),  
**quiero** pagar una boleta combinando parte de mis Rickoin y parte de mis Fichas,  
**para** aprovechar ambos saldos cuando ninguno es suficiente por sí solo o cuando prefiero conservar uno de ellos.

**Criterios de aceptación:**

- [ ] El usuario puede ingresar cuántas Fichas y cuántos Rickoin desea usar para el pago
- [ ] El sistema valida que la suma de Fichas + Rickoin sea exactamente igual al precio de la boleta × cantidad de boletas
- [ ] Se muestra el desglose de ambas monedas y los saldos resultantes en la confirmación
- [ ] La transacción descuenta **ambas monedas en una sola transacción atómica**: si falla cualquier parte, ninguna moneda se descuenta

---

### USR-C3-009 — Manejo de concurrencia en compra de boleta

**Como** Sistema,  
**quiero** garantizar que dos usuarios no puedan comprar la misma boleta simultáneamente,  
**para** proteger la integridad del proceso y la confianza de los participantes.

**Criterios de aceptación:**

- [ ] La asignación de boletas se realiza dentro de una transacción de base de datos con bloqueo pesimista (`SELECT ... WITH (UPDLOCK)`)
- [ ] Si dos solicitudes simultáneas llegan, solo una es exitosa; la segunda recibe un error de disponibilidad
- [ ] El usuario que no pudo comprar ve el mensaje: *"Lo sentimos, esa boleta ya fue comprada por otra persona. Tu saldo no fue afectado."*
- [ ] Se proporciona un enlace para ver otras boletas disponibles en la misma rifa
- [ ] En ningún caso se descuenta el saldo de un usuario que no recibe su boleta

---

### USR-C3-010 — Ver historial de boletas del usuario

**Como** Usuario (Activo),  
**quiero** ver todas las boletas que he comprado organizadas por estado de la rifa,  
**para** hacer seguimiento de mis participaciones pasadas y activas.

**Criterios de aceptación:**

- [ ] La sección "Mis boletas" agrupa las participaciones en: `Rifas activas` y `Rifas finalizadas`
- [ ] Cada entrada muestra: nombre de la rifa, número de boleta, fecha de compra, estado de la rifa
- [ ] Para rifas finalizadas se muestra: el resultado (ganó / no ganó), o `"Saldo devuelto: N Rickoin"` si la rifa fue cancelada por falta de equilibrio
- [ ] Las boletas se ordenan con las rifas activas más recientes primero

---

### Restricciones no funcionales — Ciclo 3

- El control de concurrencia se implementa con transacciones SQL con bloqueo pesimista; no se usa Redis, colas ni locks distribuidos
- El número de boleta es asignado automáticamente por el sistema; los usuarios no eligen su número
- Las imágenes de las rifas se gestionan mediante **URL externa** (campo `ImagenUrl` opcional en la entidad `Rifa`) — no hay almacenamiento de archivos, no hay Azure Blob Storage; el admin ingresa la URL de la imagen al crear la rifa (Google Drive u otro servicio público)
- La compra mixta (Rickoin + Fichas) se procesa en una única transacción atómica; no son dos transacciones separadas
- El máximo de boletas por usuario por rifa es configurable al crear la rifa y en la configuración global como valor por defecto

---

## Ciclo 4 — Motor de Sorteos y Premios

> **Resultado del ciclo:** Cada rifa queda vinculada a un sorteo oficial de una lotería colombiana autorizada. El cierre de ventas es automático. El administrador registra el resultado oficial con audit trail completo. El sistema identifica al ganador, lo notifica con un token único y gestiona la entrega del premio.

---

### USR-C4-001 — Configurar lotería y regla de sorteo al crear una rifa (Administrador)

**Como** Administrador,  
**quiero** vincular una rifa a una lotería oficial colombiana y definir la regla de extracción del número ganador,  
**para** que el resultado del sorteo sea trazable a una fuente pública y verificable.

**Criterios de aceptación:**

- [ ] Al crear una rifa, es obligatorio seleccionar una lotería del catálogo y configurar la regla del sorteo
- [ ] La regla de extracción puede ser: últimos 3 dígitos, últimos 4 dígitos o últimos 5 dígitos del resultado oficial
- [ ] Se ingresa la fecha y hora del sorteo oficial (almacenada y mostrada siempre en hora Colombia, America/Bogota, UTC-5)
- [ ] El sistema calcula automáticamente la hora de cierre de ventas: `hora_sorteo - 3 horas`; este campo no es editable
- [ ] La regla de fallback si la boleta ganadora no fue vendida es obligatoria: `Sin ganador` o `Siguiente número disponible`
- [ ] La regla de fallback queda registrada en la rifa y **no puede modificarse** después de que la rifa se active
- [ ] Una rifa no puede publicarse sin estos campos completos

---

### USR-C4-002 — Gestionar catálogo de loterías (Administrador)

**Como** Administrador,  
**quiero** mantener actualizado el catálogo de loterías disponibles para vincular a las rifas,  
**para** asegurarme de que solo se usan fuentes oficiales autorizadas.

**Criterios de aceptación:**

- [ ] El administrador puede crear, editar y desactivar loterías en el catálogo
- [ ] Cada lotería incluye: nombre, descripción, frecuencia del sorteo
- [ ] Las rifas ya activas o finalizadas que usaron una lotería editada no se ven afectadas
- [ ] Las loterías desactivadas no aparecen disponibles al crear nuevas rifas pero mantienen el historial de rifas anteriores que las usaron

---

### USR-C4-003 — Cierre automático de ventas antes del sorteo (Sistema)

**Como** Sistema,  
**quiero** cerrar automáticamente la compra de boletas 3 horas antes del sorteo oficial,  
**para** que ningún usuario pueda comprar una boleta después de que el resultado sea predecible.

**Criterios de aceptación:**

- [ ] Un job programado se ejecuta cada 15 minutos
- [ ] El job evalúa todas las rifas en estado `Activa` o `En venta` donde `(hora_sorteo - 3h) <= ahora` (en hora Colombia)
- [ ] Para cada rifa afectada: el estado cambia a `Cerrada — Pendiente de resultado`
- [ ] Desde ese momento, cualquier intento de compra de boletas en esa rifa es rechazado en el backend con un mensaje claro
- [ ] El sistema registra: timestamp del cierre, motivo `"cierre automático pre-sorteo"`
- [ ] No se envían notificaciones a los usuarios en este momento (el cierre es silencioso)

---

### USR-C4-004 — Registrar resultado oficial del sorteo (Administrador)

**Como** Administrador,  
**quiero** ingresar el número oficial publicado por la lotería correspondiente,  
**para** que el sistema calcule el número ganador y busque la boleta correspondiente.

**Criterios de aceptación:**

- [ ] El formulario está disponible solo para rifas en estado `Cerrada — Pendiente de resultado`
- [ ] El administrador ingresa el número completo tal como fue publicado por la lotería
- [ ] El sistema calcula automáticamente el número ganador aplicando la regla configurada (p. ej.: últimos 4 dígitos de `54873` → `4873`)
- [ ] El número ganador calculado se muestra para confirmación antes de registrar
- [ ] Existe un campo opcional para agregar evidencia: URL del resultado oficial o captura de pantalla
- [ ] Se registra un audit trail inmutable: administrador que lo ingresó, fecha y hora exacta, IP de origen
- [ ] **El resultado no puede editarse una vez registrado**: no existe botón de edición posterior
- [ ] Al confirmar, el sistema ejecuta automáticamente la validación del ganador (USR-C4-005)

---

### USR-C4-005 — Validación automática del ganador (Sistema)

**Como** Sistema,  
**quiero** determinar automáticamente si la boleta ganadora fue vendida y aplicar la regla de fallback si no lo fue,  
**para** identificar al ganador o declarar la rifa sin ganador sin intervención manual.

**Criterios de aceptación:**

- [ ] El sistema busca si existe una boleta vendida con el número ganador calculado
- [ ] **Si la boleta fue vendida:**
  - Estado de la rifa cambia a `Ganador encontrado`
  - Se registra: usuario ganador, número de boleta, timestamp
  - Se envía correo al ganador (ver USR-C4-007)
  - Se envía correo a todos los participantes: *"La rifa tiene ganador"* (sin revelar datos personales)
- [ ] **Si la boleta NO fue vendida y la regla es `Sin ganador`:**
  - Estado de la rifa cambia a `Sin ganador`
  - Se inicia el proceso de devolución de Rickoin a cada participante (ver USR-C4-006)
  - Se notifica a todos los participantes
- [ ] **Si la boleta NO fue vendida y la regla es `Siguiente disponible`:**
  - El sistema busca la boleta vendida con el número más cercano al ganador
  - Se registra una nota pública: *"La boleta [N] no fue vendida. Por la regla configurada, el ganador es el portador de la boleta [M]."*
  - Continúa el flujo normal de ganador

---

### USR-C4-006 — Devolución automática de Rickoin cuando la rifa no tiene ganador (Sistema)

**Como** Sistema,  
**quiero** devolver automáticamente los Rickoin a cada participante cuando una rifa termina sin ganador,  
**para** garantizar que ningún usuario pierde su dinero en rifas que no se completan.

**Criterios de aceptación:**

- [ ] La devolución se ejecuta por cada participante en una transacción atómica individual (si falla una, las demás no se ven afectadas)
- [ ] Solo se devuelven **Rickoin**: las Fichas usadas en la compra de boletas **no se devuelven**
- [ ] El monto devuelto corresponde exactamente al precio en Rickoin pagado por cada boleta
- [ ] Se registra cada devolución en el historial de movimientos del usuario con tipo `"Devolución — rifa cancelada"`
- [ ] Se envía correo a cada participante con el monto de Rickoin devuelto y el motivo

---

### USR-C4-007 — Notificación al ganador con enlace de token único (Sistema)

**Como** Sistema,  
**quiero** enviar al ganador un correo con los detalles del sorteo y un enlace de token único para confirmar la recepción,  
**para** que pueda reclamar su premio de forma segura y trazable.

**Criterios de aceptación:**

- [ ] El correo incluye: nombre del ganador, nombre de la rifa, lotería usada, resultado oficial publicado, número ganador calculado, número de boleta del ganador, descripción del premio, plazo para reclamar (5 días)
- [ ] El correo incluye un enlace con un token único generado de forma segura (`Guid.NewGuid()` o equivalente)
- [ ] El token es de **un solo uso**: se invalida al primer clic válido
- [ ] El token tiene expiración de 5 días desde el momento del envío
- [ ] Al hacer clic en el enlace válido: el sistema valida el token, registra la fecha y hora de confirmación del ganador, muestra la pantalla de selección de modalidad de premio, y notifica al administrador
- [ ] Si el token expiró: se muestra un mensaje claro y el administrador puede reenviar el correo con un nuevo token (ver USR-C4-011)

---

### USR-C4-008 — Seleccionar modalidad de premio (Ganador)

**Como** Ganador de una rifa,  
**quiero** elegir entre recibir el artículo físico o su equivalente en Rickoin,  
**para** decidir cómo prefiero recibir mi premio.

**Criterios de aceptación:**

- [ ] La pantalla está disponible solo tras validar el token único del correo
- [ ] Las opciones disponibles son: (a) el artículo físico (el administrador coordinará la entrega), o (b) el equivalente en Rickoin con la penalización del 10% (parametrizable)
- [ ] Se muestra el monto exacto en Rickoin que recibiría si elige la opción monetaria
- [ ] El usuario debe confirmar explícitamente su elección
- [ ] Si el ganador no elige dentro de los 5 días: el sistema asigna la opción por defecto configurada en el panel de administración (ver USR-C5-005)
- [ ] Una vez confirmada la elección, no puede modificarse

---

### USR-C4-009 — Gestionar entrega del premio (Administrador)

**Como** Administrador,  
**quiero** ver la información completa del ganador de una rifa y gestionar la entrega de su premio,  
**para** coordinar el cierre de la rifa de forma correcta.

**Criterios de aceptación:**

- [ ] En el detalle de la rifa el administrador ve (solo visible para admin): nombre completo del ganador, documento de identidad, correo, teléfono, boleta ganadora, fecha de confirmación, modalidad de premio elegida, estado del premio
- [ ] Los estados del premio son: `Pendiente`, `En proceso de entrega`, `Entregado`
- [ ] El administrador puede marcar el premio como `Entregado` una vez coordinada la entrega
- [ ] El administrador tiene la opción de asignar Fichas de consolación a los participantes no ganadores desde esta misma pantalla

---

### USR-C4-010 — Ver resultado público del sorteo

**Como** cualquier usuario o visitante,  
**quiero** ver los datos del sorteo de una rifa finalizada,  
**para** verificar de forma independiente que el proceso fue justo y transparente.

**Criterios de aceptación:**

- [ ] La vista pública del resultado muestra: nombre de la rifa, lotería utilizada, resultado oficial publicado, número ganador calculado y la regla de extracción aplicada, fecha y hora del sorteo, estado final (`Ganador encontrado` / `Sin ganador`)
- [ ] Si se aplicó la regla de fallback `Siguiente disponible`, se muestra la nota explicativa pública
- [ ] El estado de entrega del premio se muestra como `Entregado ✓` cuando corresponde
- [ ] **Los datos personales del ganador no son visibles para otros usuarios ni para visitantes no registrados**

---

### USR-C4-011 — Reenviar correo de premio al ganador (Administrador)

**Como** Administrador,  
**quiero** reenviar el correo de notificación de premio al ganador con un nuevo token,  
**para** garantizar que el ganador pueda reclamar su premio si el token anterior expiró.

**Criterios de aceptación:**

- [ ] La opción de reenvío está disponible desde la vista de detalle de la rifa cuando el estado del premio es `Pendiente`
- [ ] Al reenviar, el sistema genera un nuevo token único con nueva expiración de 5 días
- [ ] El token anterior queda inmediatamente invalidado
- [ ] Se envía el correo con el mismo contenido original más el nuevo enlace
- [ ] La acción queda registrada en el log: administrador, timestamp, rifa afectada

---

### Restricciones no funcionales — Ciclo 4

- Todos los horarios se almacenan y procesan en hora Colombia (America/Bogota, UTC-5); no hay soporte multitimezone en v1.0
- El ingreso del resultado oficial es manual en v1.0 (el administrador consulta el sitio de la lotería y lo ingresa); no hay integración automática ni scraping
- El resultado del sorteo es inmutable una vez registrado; no existe un botón de edición posterior
- El token de confirmación del ganador se genera con entropía suficiente (no predecible); es de un solo uso con expiración de 5 días
- Las Fichas usadas para comprar boletas **no se devuelven** cuando una rifa se cancela; solo se devuelven Rickoin
- El job de cierre automático se ejecuta cada 15 minutos; puede haber hasta 15 minutos de margen en el cierre exacto

---

## Ciclo 5 — Operaciones y Estabilidad

> **Resultado del ciclo:** La plataforma está lista para producción. Las notificaciones por correo funcionan en todos los eventos definidos. Los administradores tienen reportes, logs y un dashboard operativo. El sistema tiene configuración global parametrizable y los documentos legales están publicados.

---

### USR-C5-001 — Envío de correos automáticos en todos los eventos del sistema (Sistema)

**Como** Sistema,  
**quiero** enviar correos automáticos a través de SendGrid en cada evento relevante,  
**para** mantener a usuarios y administradores informados en tiempo real sin intervención manual.

**Criterios de aceptación:**

- [ ] Los siguientes eventos disparan correos automáticos al destinatario correspondiente:

| Evento | Destinatario | Momento |
|---|---|---|
| Registro de cuenta | Usuario | Inmediato |
| Código OTP de confirmación de cuenta | Usuario | Inmediato |
| Código OTP de step-up (zona financiera) | Usuario | Inmediato |
| Nuevo usuario pendiente de aprobación | Administrador | Inmediato |
| Cuenta aprobada | Usuario | Inmediato |
| Cuenta rechazada (con motivo) | Usuario | Inmediato |
| Compra de Rickoin confirmada | Usuario | Inmediato |
| Fichas asignadas (con motivo) | Usuario | Inmediato |
| Compra de boleta confirmada | Usuario | Inmediato |
| Retiro solicitado | Usuario | Inmediato |
| Retiro aprobado | Usuario | Inmediato |
| Retiro rechazado (con motivo) | Usuario | Inmediato |
| Retiro fallido | Usuario | Inmediato |
| Ganador del sorteo (con token de reclamación) | Ganador | Post-sorteo |
| Participante no ganó | Participantes no ganadores | Post-sorteo |
| Devolución de Rickoin (rifa sin equilibrio) | Participantes | Post-devolución |
| Recuperación de contraseña | Usuario | Inmediato |
| Nuevo documento subido tras rechazo | Administrador | Inmediato |

- [ ] Cada correo tiene un asunto claro y un cuerpo con la información relevante del evento
- [ ] Los correos se envían en tiempo real, no en lotes diferidos
- [ ] El dominio remitente tiene configuración DKIM y SPF correcta (configurada antes del inicio del ciclo)
- [ ] Los fallos de envío quedan registrados en el log de eventos

---

### USR-C5-002 — Dashboard administrativo con métricas operativas

**Como** Administrador,  
**quiero** ver un resumen de las métricas más importantes en la página de inicio del panel,  
**para** tener visibilidad operativa inmediata sin necesidad de generar reportes.

**Criterios de aceptación:**

- [ ] El dashboard muestra métricas para `Hoy` y `Este mes`:
  - Usuarios nuevos registrados
  - Boletas vendidas
  - Rickoin comprado (en Rickoin y COP equivalente)
  - Fichas asignadas
  - Retiros pendientes (con enlace directo a la lista)
- [ ] Se muestra un listado de las rifas activas con su progreso y días restantes
- [ ] Las rifas activas sin equilibrio (boletas vendidas < punto de equilibrio) se resaltan con una advertencia visual
- [ ] El badge de usuarios pendientes de aprobación es visible desde el header del panel con un enlace directo

---

### USR-C5-003 — Generar reportes exportables (Administrador)

**Como** Administrador,  
**quiero** generar y descargar reportes en formato CSV o Excel,  
**para** análisis operativo, fiscal y de auditoría.

**Criterios de aceptación:**

- [ ] Los tipos de reporte disponibles son: ventas de Rickoin por período, boletas vendidas por rifa, retiros procesados, usuarios registrados
- [ ] Se puede filtrar por período (fecha desde / fecha hasta)
- [ ] Los formatos de exportación son: CSV y Excel
- [ ] Los archivos CSV se generan con BOM UTF-8 y punto y coma (`;`) como separador, para compatibilidad con Excel en español
- [ ] La descarga se inicia de forma inmediata al solicitar el reporte

---

### USR-C5-004 — Ver logs de eventos del sistema (Administrador)

**Como** Administrador,  
**quiero** ver un registro completo y filtrable de todas las acciones del sistema,  
**para** auditar operaciones, rastrear anomalías y responder a requerimientos regulatorios.

**Criterios de aceptación:**

- [ ] Cada entrada en el log incluye: usuario o sistema que ejecutó la acción, fecha y hora exacta, tipo de acción, resultado (éxito / error)
- [ ] Los logs son filtrables por: usuario, tipo de evento y rango de fechas
- [ ] Los logs son de solo lectura: no existe funcionalidad de borrado ni edición
- [ ] Se registran en el log todos los eventos relevantes: accesos, compras, retiros, sorteos, asignaciones de Fichas, cambios de configuración, acciones administrativas
- [ ] Los logs se retienen durante 90 días (parametrizable)
- [ ] La lista es paginada

---

### USR-C5-005 — Gestionar configuración global del sistema (Administrador)

**Como** Administrador,  
**quiero** poder ajustar los parámetros globales de la plataforma desde el panel,  
**para** adaptar el comportamiento del sistema sin necesidad de un despliegue de código.

**Criterios de aceptación:**

- [ ] Los parámetros configurables incluyen:

| Parámetro | Valor por defecto |
|---|---|
| Tasa de conversión (COP por Rickoin) | 1.000 |
| Máximo de boletas por usuario por rifa | 10 |
| Premio por defecto si el ganador no elige | Artículo físico |
| Penalización por premio en Rickoin (%) | 10% |
| Intentos fallidos antes de bloqueo de cuenta | 5 |
| Tiempo de bloqueo por intentos fallidos (minutos) | 30 |
| Expiración de código OTP (minutos) | 15 |
| Timeout de sesión financiera (step-up, minutos) | 20 |
| Tiempo de procesamiento de retiros (días hábiles) | 6 a 10 |
| Ventana de cancelación de retiros (días) | 5 |

- [ ] Cada parámetro tiene un botón `Guardar` independiente
- [ ] Los cambios en la tasa de conversión **no son retroactivos**: solo aplican a nuevas transacciones; las transacciones históricas conservan la tasa que tenían al momento de ejecutarse
- [ ] Cada cambio de configuración queda registrado en el log de eventos: administrador, timestamp, parámetro modificado, valor anterior, valor nuevo

---

### USR-C5-006 — Ver documentos legales desde el footer

**Como** cualquier usuario o visitante no registrado,  
**quiero** acceder a los documentos legales de la plataforma desde el footer,  
**para** conocer los términos, condiciones, políticas de privacidad y demás documentos obligatorios antes de registrarme o usar la plataforma.

**Criterios de aceptación:**

- [ ] El footer es visible en todas las páginas de la plataforma, incluyendo las páginas de login y registro
- [ ] El footer contiene enlaces a: Términos y Condiciones, Política de Privacidad, Política de Juego Responsable, Política de Pagos y Retiros, Aviso Legal
- [ ] Cada enlace abre una página estática con el contenido del documento correspondiente
- [ ] Los documentos cumplen con los requisitos mínimos establecidos en la Ley 1581 de 2012 (protección de datos) y el Estatuto del Consumidor
- [ ] Los documentos indican claramente que el uso de la plataforma está restringido a mayores de 18 años

---

### Restricciones no funcionales — Ciclo 5

- El dominio de correo remitente debe tener registros DKIM y SPF configurados antes del inicio del ciclo para evitar que los correos lleguen a spam (la propagación de DNS toma 24-48 horas)
- Los cambios en la tasa de conversión no afectan transacciones históricas; cada transacción almacena el valor de conversión vigente en su momento
- Los documentos legales son páginas estáticas (vistas Razor con contenido); no son editables desde el panel de administración en v1.0
- Las Fichas no tienen fecha de expiración en v1.0; el campo de configuración existe pero el job de expiración no se construye en este ciclo
- Los logs tienen retención de 90 días en v1.0; no se construye en este ciclo archivado de largo plazo

---

## Resumen de Historias de Usuario

| Ciclo | Historias | Actores principales |
|---|---|---|
| **Ciclo 1 — Identidad y Acceso** | USR-C1-001 a USR-C1-015 (15 historias) | Visitante, Usuario (Observador), Administrador, Sistema |
| **Ciclo 2 — Monedero Rickoin** | USR-C2-001 a USR-C2-013 (13 historias) | Usuario (Activo), Administrador, Sistema |
| **Ciclo 3 — Rifas y Marketplace** | USR-C3-001 a USR-C3-010 (10 historias) | Usuario (Activo/Observador), Administrador, Sistema |
| **Ciclo 4 — Motor de Sorteos y Premios** | USR-C4-001 a USR-C4-011 (11 historias) | Administrador, Ganador, Sistema |
| **Ciclo 5 — Operaciones y Estabilidad** | USR-C5-001 a USR-C5-006 (6 historias) | Administrador, Sistema, Visitante |
| **Total** | **55 historias de usuario** | |

---

*RICKOIN Historias de Usuario v1.0 — Mayo 2026*
