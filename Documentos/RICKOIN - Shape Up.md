# RICKOIN — Shape Up

**Producto:** Rickoin — Plataforma de rifas digitales con moneda virtual  
**Método:** Shape Up (Basecamp / Ryan Singer)  
**Versión:** 1.1 — Mayo 2026  
**Ciclos planificados:** 5 × 6 semanas + 2 semanas de cool-down entre ciclos

> **v1.1:** Se incorporan dos nuevas reglas de negocio: (1) sistema de **Fichas** como segunda moneda no retirable asignada por la plataforma como premio o bonificación; (2) estado **Modo Observador** — el usuario recién registrado no puede interactuar con la plataforma hasta que el administrador apruebe su cuenta.

---

## ÍNDICE

- [Contexto del Producto](#contexto-del-producto)
- [Cómo funciona Shape Up en Rickoin](#cómo-funciona-shape-up-en-rickoin)
- [Betting Table — Orden de apuestas](#betting-table--orden-de-apuestas)
- [No-Gos Globales](#no-gos-globales)
- [Ciclo 1 — Pitch: Identidad y Acceso](#ciclo-1--pitch-identidad-y-acceso)
- [Ciclo 2 — Pitch: Monedero Rickoin](#ciclo-2--pitch-monedero-rickoin)
- [Ciclo 3 — Pitch: Rifas y Marketplace](#ciclo-3--pitch-rifas-y-marketplace)
- [Ciclo 4 — Pitch: Motor de Sorteos y Premios](#ciclo-4--pitch-motor-de-sorteos-y-premios)
- [Ciclo 5 — Pitch: Operaciones y Estabilidad](#ciclo-5--pitch-operaciones-y-estabilidad)
- [Preparación Futura: Coljuegos](#preparación-futura-coljuegos)

---

## Contexto del Producto

### Qué es Rickoin

Una persona quiere participar en una rifa de un artículo que le interesa. Hoy no existe una plataforma digital que le permita hacerlo con confianza: no sabe si el sorteo fue justo, no ve cuántas boletas quedan disponibles, y si la rifa no llega al mínimo necesario no sabe si le devuelven el dinero.

**Rickoin** resuelve eso. Es una plataforma web donde los usuarios compran boletas de rifas digitales usando monedas virtuales internas, participan con transparencia total sobre el estado de cada rifa, y reciben devolución automática si la rifa no se completa. El sorteo lo hace el sistema automáticamente al cierre.

La plataforma tiene dos monedas internas con propósitos distintos: **Rickoin** (se compra con dinero real, se puede retirar) y **Fichas** (las asigna el sistema como bonificación o premio, solo se usan dentro de la plataforma, no se pueden retirar).

### Actores

| Actor | Qué hace |
|---|---|
| **Usuario (Observador)** | Se registra y confirma su correo. Ve la plataforma en modo lectura hasta que el admin apruebe su cuenta. No puede comprar, interactuar ni acceder a la zona financiera. |
| **Usuario (Activo)** | Cuenta aprobada por el admin. Puede comprar Rickoin, usar Fichas, comprar boletas, ganar premios, solicitar retiros. |
| **Administrador** | Crea y gestiona rifas, aprueba registros de usuarios, asigna Fichas, gestiona retiros, configura el sistema. |
| **Sistema** | Evalúa equilibrio, ejecuta sorteos, devuelve saldo, envía correos, acredita Fichas automáticamente. |

### Regla de oro: el punto de equilibrio

Cada rifa tiene un mínimo de boletas vendidas para ser válida. Si no se alcanza al cierre → devolución automática. Si se alcanza → sorteo automático. Esta regla protege a los participantes y viabiliza el negocio.

### Sistema de Monedas: Rickoin y Fichas

> Se propone el nombre **Fichas** en lugar de Gemas. Justificación: "ficha" es el término natural en español para tokens de juego (fichas de casino, fichas de rifa). Es intuitivo, evoca el mundo de rifas y sorteos, y contrasta claramente con Rickoin. Si se prefiere mantener Gemas, el cambio es trivial en toda la base de código.

| | **Rickoin** | **Fichas** |
|---|---|---|
| **Cómo se obtiene** | El usuario la compra con dinero real (COP) | El sistema la asigna como bonificación o premio |
| **Usos** | Comprar boletas de rifas | Comprar boletas de rifas |
| **Retiro** | ✅ Se puede retirar como COP | ❌ No se puede retirar ni convertir |
| **Transferencia entre usuarios** | ❌ No permitida | ❌ No permitida |
| **Quién asigna** | El usuario mismo (compra) | El administrador o el sistema automáticamente |
| **Tasa** | 1 Rickoin = 1.000 COP (parametrizable) | No aplica — no tiene equivalente en dinero real |
| **Visible en** | Zona pública + zona financiera | Zona pública (no requiere step-up para ver el saldo) |

**Cuándo se asignan Fichas:**
- El administrador las asigna manualmente como bonificación o compensación
- El sistema puede asignarlas automáticamente como premio de consolación en rifas (futuro — decisión del admin al crear la rifa)
- No se devuelven Fichas cuando una rifa se cancela por falta de equilibrio — solo se devuelven Rickoin

### Decisión de arquitectura ya tomada

La plataforma es **una sola aplicación** con tres estados de acceso según el estado del usuario:

```
MODO OBSERVADOR                    ZONA PÚBLICA                ZONA FINANCIERA
(cuenta pendiente aprobación)      (cuenta activa)             (step-up activo)
─────────────────────────          ───────────────────         ─────────────────────────
Ver rifas (solo lectura)           Ver rifas                   Comprar Rickoin
Ver catálogo (sin comprar)         Comprar boletas             Solicitar retiro
Ver perfil propio                  Ver historial               Ver movimientos detallados
Subir doc. de identidad            Ver saldo Rickoin
                                   Ver saldo Fichas
Banner: "Cuenta en revisión"       Usar Fichas (compra boletas)
```

El usuario pasa de **Modo Observador → Zona Pública** cuando el administrador aprueba su cuenta.

Para entrar a la **Zona Financiera** el usuario aprobado debe pasar por una verificación adicional (contraseña o código OTP por correo). Esto se llama **Step-Up Authentication**.

---

## Cómo funciona Shape Up en Rickoin

### Ciclos y cool-down

```
Sem 1-6   →  Ciclo 1: Identidad y Acceso        (6 semanas)
Sem 7-8   →  Cool-down 1                         (2 semanas)
Sem 9-14  →  Ciclo 2: Monedero Rickoin           (6 semanas)
Sem 15-16 →  Cool-down 2                         (2 semanas)
Sem 17-22 →  Ciclo 3: Rifas y Marketplace        (6 semanas)
Sem 23-24 →  Cool-down 3                         (2 semanas)
Sem 25-30 →  Ciclo 4: Motor de Sorteos y Premios (6 semanas)
Sem 31-32 →  Cool-down 4                         (2 semanas)
Sem 33-38 →  Ciclo 5: Operaciones y Estabilidad  (6 semanas)
Sem 39-40 →  Cool-down 5 + go-live               (2 semanas)
```

### Apetito (tiempo fijo, scope variable)

El tiempo de cada ciclo es **no negociable**. Si al final del ciclo algo no está listo, se corta scope — no se extiende el ciclo. La pregunta no es "¿cuánto tiempo necesitamos?" sino "¿qué podemos hacer en 6 semanas que sea valioso y completo?"

### Circuit breaker

Si un ciclo termina y el proyecto central no está deployable, **no se extiende automáticamente**. Se evalúa en el betting table si vale la pena apostar otro ciclo. Esto previene que los proyectos se estiren indefinidamente.

### Equipo por ciclo

Un equipo por ciclo: **1 diseñador + 2 programadores**. El equipo tiene autonomía total sobre cómo lograr el resultado — el pitch describe qué y por qué, no cómo implementar en detalle.

---

## Betting Table — Orden de apuestas

> El betting table es la reunión donde se decide qué entra al siguiente ciclo. No hay backlog. Si un pitch no entra, se descarta y se puede reformular en el futuro.

### Por qué este orden

| Ciclo | Razón para apostar primero |
|---|---|
| **1 — Identidad y Acceso** | Nada más puede existir sin usuarios. Es el cimiento. |
| **2 — Monedero Rickoin** | Sin dinero en el sistema, las rifas no tienen sentido. La moneda va antes que las rifas. |
| **3 — Rifas y Marketplace** | Con dinero disponible, el producto central cobra vida. |
| **4 — Motor de Sorteos** | Sin sorteos, las rifas son incompletas. El mecanismo de lotería oficial y el cierre automático son el núcleo de confianza del producto. |
| **5 — Operaciones** | Notificaciones, reportes y monitoreo son el cierre que hace el producto producción-ready. |

---

## No-Gos Globales

Estos elementos están **explícitamente fuera del alcance** de todos los ciclos actuales. No se discuten, no se estiman, no se incluyen sin una decisión deliberada del betting table.

| No-Go | Justificación |
|---|---|
| App móvil nativa | Navegador responsive es suficiente para esta fase |
| API pública / REST expuesta | Monolito MVC es suficiente y más rápido de entregar |
| Transferencias Rickoin entre usuarios | Aumenta complejidad regulatoria y de seguridad |
| Transferencias de Fichas entre usuarios | Las Fichas son asignadas por la plataforma, no por usuarios |
| Retiro de Fichas | Las Fichas son exclusivas de la plataforma — sin equivalente en COP |
| Conversión de Fichas a Rickoin | Son monedas separadas sin puente de conversión |
| Certificación Coljuegos | Fuera de alcance — ver sección final |
| WYSIWYG en descripción de rifas | Textarea con markdown básico es suficiente |
| Chat en tiempo real | Notificaciones por correo cubren la necesidad de comunicación |
| Programa de referidos o afiliados | Fuera del modelo de negocio inicial |
| Múltiples monedas o tipos de cambio dinámico | La tasa se configura manualmente en el panel |
| Integración con redes sociales | Registro solo con email |
| Auto-aprobación de usuarios | Toda cuenta requiere aprobación manual del admin antes de activarse |

---

## Ciclo 1 — Pitch: Identidad y Acceso

**Apetito:** Big Batch — 6 semanas  
**Equipo:** 1 diseñador + 2 programadores  
**Resultado esperado:** Un usuario puede registrarse, confirmar su cuenta y quedar en **Modo Observador** (solo lectura) hasta que el administrador apruebe su registro. Una vez aprobado, el usuario accede a la plataforma con todas las funciones. El administrador puede revisar, aprobar y rechazar cuentas pendientes desde el panel. La plataforma está deployada en Azure.

---

### Problema

Antes de que cualquier otra cosa exista en Rickoin, necesitamos saber quién es el usuario. Sin identidad no hay saldo, sin saldo no hay boletas, sin boletas no hay rifa.

El problema concreto: si lanzamos la plataforma mañana y alguien llega, no puede hacer nada porque no existe ningún sistema de registro ni acceso. Tampoco tenemos forma de distinguir entre un usuario normal y el administrador.

Pero hay un segundo problema que va más allá de la identidad técnica: **no todos los que se registran deben poder interactuar de inmediato**. La plataforma maneja dinero real. Un registro confirmado por OTP prueba que el correo existe, pero no que el usuario es quien dice ser. El administrador necesita revisar el documento de identidad antes de que el usuario pueda comprar boletas o cargar dinero.

El caso de uso que motiva este ciclo: **Martina quiere registrarse en Rickoin.** Llena el formulario, recibe un correo con un código, confirma su cuenta y entra a la plataforma. Ve el catálogo de rifas. Ve los precios. Pero **no puede comprar nada** — hay un banner claro: “Tu cuenta está en revisión. El administrador la aprobará en breve.” Mientras tanto, Martina sube su documento de identidad.

El administrador recibe una notificación, revisa el documento, y aprueba la cuenta. Solo entonces Martina puede comprar Rickoin y participar en rifas.

Un tercer caso: **El administrador** accede con sus credenciales y puede ver el panel de control. Sin esto, nadie puede crear rifas ni aprobar usuarios.

---

### Apetito

6 semanas es exactamente lo que necesitamos para que el sistema de identidad sea sólido, seguro y deployado. No queremos construir un sistema de autenticación que sea apresurado — las vulnerabilidades de seguridad en el acceso son las más costosas de corregir después.

**Lo que cabe en 6 semanas:**
- Registro + confirmación OTP por email
- Login con email y contraseña
- Recuperación de contraseña
- Bloqueo por intentos fallidos
- Roles: Usuario y Administrador
- **Modo Observador:** usuario registrado/confirmado pero no aprobado — acceso de solo lectura
- Perfil básico con carga de documento de identidad (disponible en modo observador)
- **Flujo de aprobación:** el admin revisa el documento y aprueba o rechaza la cuenta
- Notificación al usuario cuando su cuenta es aprobada o rechazada
- Despliegue en Azure (App Service + SQL Database + Key Vault)

**Lo que NO cabe (y no hace falta ahora):**
- Autenticación de dos factores permanente (eso lo hace el step-up en el ciclo 2)
- OAuth / login con Google o redes sociales
- Gestión avanzada de permisos por roles

---

### Solución

#### Breadboard: Flujo de registro

```
[ Página de inicio ]
  → "Crear cuenta"
  → "Iniciar sesión"
         |
         ↓ (→ Crear cuenta)
[ Registro ]
  Nombre completo
  Correo electrónico
  Contraseña
  Confirmar contraseña
  → [Registrarse]
         |
         ↓ (sistema envía OTP al correo)
[ Confirmar cuenta ]
  "Te enviamos un código a tu correo"
  Campo: Código de 6 dígitos
  → [Verificar]
  → "Reenviar código"
  (Código expira en 15 min)
         |
         ↓ (código válido)
[ Bienvenida — Modo Observador ]
  "Tu correo ha sido verificado."
  "Tu cuenta está en revisión. Te avisaremos por correo cuando sea aprobada."
  "Mientras tanto, puedes subir tu documento de identidad para agilizar el proceso."
  → [Subir documento ahora]
  → [Explorar rifas (solo lectura)]
```

#### Breadboard: Modo Observador — lo que ve el usuario pendiente

```
[ Dashboard — Modo Observador ]

  ┌───────────────────────────────────────────────────┐
  │  ⚠  Tu cuenta está en revisión                       │
  │  El administrador aprobará tu acceso a la brevedad  │
  │  → [Subir / ver mi documento de identidad]           │
  └───────────────────────────────────────────────────┘
  
  Catálogo de rifas (solo lectura)
  ┌─────────────────────────────┐
  │ 📱 iPhone 15 Pro            │
  │ Boleta: 50 Rickoin          │
  │ ████████░░░░  65% vendido   │
  │ Cierra: 15 jun 2026         │
  │ 🔒 Ver rifa (solo lectura)   │  ← botón deshabilitado o muestra banner
  └─────────────────────────────┘
  
  ✔ Puede ver: rifas, precios, progreso, reglas
  ✘ No puede: comprar boletas, acceder al monedero, recargar
  ✘ Botones de acción muestran: "Activa tu cuenta para participar"
```

> **Regla de implementación:** el modo observador no se logra ocultando botones — se logra por estado del usuario en el backend. Cualquier intento de llamar a una acción protegida (compra, step-up, retiro) devuelve un error 403 con mensaje claro, independientemente de lo que muestre la UI.

#### Breadboard: Perfil y verificación de identidad

```
[ Mi Perfil ]
  Nombre: ████████
  Correo: ████████
  Estado de cuenta: ⚠ En revisión  (o: ✔ Activa  /  ✘ Rechazada)
  
  Sección: Documento de identidad
  → [Subir documento PDF]   ← disponible en modo observador y en estado rechazado
  Solo se acepta PDF — máx 5 MB
  Estado del documento: Sin subir / Pendiente de revisión / Verificado / Rechazado
  
  (estado rechazado → muestra motivo del administrador)
  (estado observador → banner: "Tu cuenta está en revisión — aún no puedes comprar")
```

> **Nota:** La carga del documento de identidad está disponible en modo observador y en estado rechazado. Es la única acción de escritura que tiene el usuario mientras espera aprobación. Al subir el PDF, el sistema lo envía automáticamente al correo del sistema con los datos del usuario y los botones [Aprobar usuario] / [Rechazar usuario]. El archivo no se almacena en ningún servidor.

#### Breadboard: Login y recuperación

```
[ Iniciar sesión ]
  Correo electrónico
  Contraseña
  → [Entrar]
  → "Olvidé mi contraseña"
  (tras N intentos fallidos → "Cuenta bloqueada temporalmente")
         |
         ↓ (credenciales correctas)
  
  ¿Cuenta aprobada?
  NO (Observador) → [ Dashboard — Modo Observador ]
                     Banner: "Tu cuenta está en revisión"
                     Acceso de solo lectura
  SÍ (Activa)    → [ Dashboard — Zona Pública ]
                     Saldo: 0 Rickoin | 0 Fichas
                     → Ver Rifas
                     → Mi Monedero

[ Olvidé mi contraseña ]
  Correo electrónico
  → [Enviar instrucciones]
         |
         ↓
[ Correo enviado ]
  "Si el correo existe, recibirás las instrucciones"
  (Link en el correo → formulario para nueva contraseña)
```

#### Breadboard: Panel administrativo — acceso

```
[ Login Admin ]
  Credenciales de administrador
  → [Entrar al panel]
         |
         ↓
[ Panel Admin ]
  ⚠ Usuarios pendientes: 3   ← badge visible desde el inicio
  → Usuarios pendientes
  → Rifas
  → Usuarios
  → Retiros pendientes
  → Asignar Fichas
  → Configuración
  → Reportes

[ Admin → Usuarios pendientes ]
  Filtro: [Pendiente de aprobación ▾]
  
  ┌───────────────────────────────────────────────────┐
  │ Martina G.  martina@email.com  Reg: hace 2h             │
  │ Documento: ✔ PDF enviado al correo del sistema                         │
  │ [Aprobar cuenta]   [Rechazar cuenta]                    │
  └───────────────────────────────────────────────────┘
  ┌───────────────────────────────────────────────────┐
  │ Carlos M.   carlos@email.com   Reg: hace 1d             │
  │ Documento: ⚠ Sin documento                                  │
  │ [Aprobar sin doc]  [Rechazar cuenta]                    │
  └───────────────────────────────────────────────────┘
  
  --- Flujo de aprobacion via correo ---
  Cuando el usuario sube su PDF:
  → El sistema envia al admin un correo con:
     - Nombre, correo, fecha de registro del usuario
     - PDF adjunto
     - Boton [Aprobar usuario]
     - Boton [Rechazar usuario]
  
  Al aprobar → el usuario recibe correo:
    "El estado de tu cuenta ha cambiado a: Activa"
  
  Al rechazar → el admin escribe motivo obligatorio → el usuario recibe correo:
    "El estado de tu cuenta ha cambiado a: Rechazada"
    "Motivo: [mensaje del administrador]"
    "Sube nuevamente tu documento para continuar el proceso"
```

#### Estructura de navegación global

```
HEADER (Modo Observador — cuenta pendiente)
┌──────────────────────────────────────────────────┐
│ RICKOIN    Rifas (solo lectura)    ⚠ En revisión   │
└──────────────────────────────────────────────────┘

HEADER (Cuenta activa)
┌──────────────────────────────────────────────────┐
│ RICKOIN    Rifas    Mi Monedero    [45R | 10F ▾]  │
└──────────────────────────────────────────────────┘
              ↑            ↑              ↑
         Ciclo 3       Ciclo 2       Menú usuario:
                                    Rickoin: 45 | Fichas: 10
                                    - Mi perfil
                                    - Historial
                                    - Cerrar sesión
```

---

### Rabbit Holes

**1. El OTP de confirmación de cuenta puede expirar mientras el usuario verifica**

Si el usuario tarda más de 15 minutos en revisar el correo, el código expira. La solución es simple: el botón "Reenviar código" genera un nuevo OTP y invalida el anterior. El flujo de reenvío debe ser parte del diseño desde el inicio, no un parche posterior.

**2. El bloqueo por intentos fallidos puede bloquear al administrador**

Si el admin olvida su contraseña y se bloquea, debe existir un mecanismo de desbloqueo. Para esta fase: el desbloqueo se hace directamente en la base de datos o mediante el correo de recuperación. No necesitamos una UI especial para esto ahora.

**3. La carga del documento de identidad debe ser simple y sin almacenamiento propio**

Solo necesitamos recibir un PDF (máx 5MB) y enviarlo al correo del sistema como adjunto, junto con los datos del usuario y dos botones de acción: **[Aprobar usuario]** y **[Rechazar usuario]**. El correo es el único repositorio del documento — no se requiere Blob Storage ni ninguna unidad de almacenamiento. No hay OCR, no hay validación automática, no hay integraciones con registraduría ni bases de datos externas. Solo se acepta PDF; JPG y PNG quedan fuera del alcance. La aprobación o el rechazo pueden ejecutarse directamente desde el correo o desde el panel.

**4. Roles y permisos**

Para esta fase solo hay dos roles: Usuario y Administrador. No hay roles intermedios (moderador, revisor, etc.). El sistema de autorización debe ser simple: si `IsAdmin == true` → acceso al panel. No se construye un sistema de permisos granular.

**5. El flujo de aprobación no debe depender de que el admin esté activo**

Si el admin no revisa los pendientes durante 3 días, los usuarios en modo observador siguen esperando. No se construye un auto-aprobado por tiempo. La solución es que el panel muestre claramente cuánto tiempo lleva cada usuario esperando aprobación, y el dashboard del admin muestre el badge de pendientes desde el primer login. Alertas automáticas por email al admin quedan para el ciclo 5.

**6. El rechazo de cuenta debe ser reversible**

Si el admin rechaza una cuenta por error o porque el documento no era legible, el usuario debe poder volver a subir el documento. El estado "Rechazado" no es terminal — el usuario puede corregir y el admin vuelve a revisar. Esto debe estar en el flujo desde el inicio.

---

### No-Gos

- Login con Google, Facebook o cualquier OAuth provider
- Verificación de identidad automática o integración con terceros
- Roles adicionales más allá de Usuario y Administrador
- Auto-aprobación de cuentas por tiempo transcurrido
- Perfil público visible por otros usuarios
- Historial de dispositivos conectados
- Autenticación biométrica
- Acceso a la zona financiera en modo observador (bloqueo absoluto en backend)

---

## Ciclo 2 — Pitch: Monedero Rickoin

**Apetito:** Big Batch — 6 semanas  
**Equipo:** 1 diseñador + 2 programadores  
**Resultado esperado:** El usuario aprobado puede comprar Rickoin con dinero real, ver su saldo de Rickoin y Fichas, ver movimientos, solicitar retiros, y cancelar retiros pendientes. Todo el flujo financiero está protegido por Step-Up Authentication. El sistema de Fichas existe como saldo visible y usable en compras de boletas (no retirable). El admin puede asignar Fichas manualmente desde el panel.

**Prerequisito:** Ciclo 1 deployado (usuarios con identidad, aprobación y roles funcionando).

---

### Problema

Martina ya tiene cuenta aprobada en Rickoin. Ve las rifas disponibles. Quiere participar en una rifa de un iPhone por 50 Rickoin. Su saldo es $0.

No tiene forma de cargar dinero a la plataforma. No existe todavía el concepto de "comprar Rickoin". El sistema de identidad está listo pero no hay moneda que usar.

El segundo problema: el administrador quiere premiar a los primeros 100 usuarios registrados con 10 Fichas cada uno como bienvenida. No existe ninguna pantalla en el panel para asignar Fichas manualmente. Y el usuario no tiene dónde ver cuántas Fichas tiene.

El tercer problema: cuando Martina gane saldo (o quiera recuperar su dinero), no hay forma de retirar ese dinero de vuelta a su cuenta bancaria.

El cuarto problema, que es el más delicado: las operaciones financieras son de alto riesgo. Si alguien le roba la sesión a Martina en un café, no queremos que esa persona pueda vaciar su saldo o hacer un retiro. Por eso la zona financiera necesita una verificación adicional — el Step-Up.

---

### Apetito

6 semanas para construir el módulo financiero completo, incluyendo el Step-Up Authentication, la integración con pasarela de pago, y la gestión de retiros.

**Lo que cabe en 6 semanas:**
- Step-Up Authentication (contraseña o OTP)
- Vista de saldo Rickoin y saldo Fichas con historial separado
- Compra de Rickoin con integración a pasarela de pago
- Solicitud de retiro con confirmación explícita (solo Rickoin — las Fichas no se retiran)
- Cancelación de retiro (primeros 5 días)
- Panel de administración de retiros (aprobar / rechazar)
- **Panel admin: asignar Fichas manualmente a un usuario o grupo de usuarios**

**Advertencia sobre la pasarela de pago:** La integración de pagos tiene complejidad propia. Si en la semana 3 la integración muestra ser más compleja de lo esperado, se recorta scope: el retiro puede ser aprobación manual total (sin automatización), y la compra de Rickoin puede ser mediante un formulario simple de solicitud en lugar de un checkout en tiempo real. Lo fundamental es que el flujo lógico exista; el checkout automático puede completarse en el cool-down.

---

### Solución

#### Breadboard: Step-Up Authentication — punto de entrada

```
[ Dashboard — Zona Pública ]
  Saldo: 45 Rickoin (visible siempre)
  → Mi Monedero   ← el usuario hace clic aquí
         |
         ↓ (¿sesión financiera activa? NO)
[ Verificación de identidad ]
  "Para acceder a tu monedero, confirma quién eres:"
  
  ○  Ingresa tu contraseña:  [__________]
  ○  Enviar código a mi correo  [Enviar código →]
  
  → [Continuar]
  (link → "¿Por qué necesito verificarme?")
         |
         ↓ (verificación exitosa)
[ Mi Monedero — Zona Financiera ]
  (sesión financiera activa — caduca en 20 min sin actividad)
```

#### Breadboard: Monedero — vista principal

```
[ Mi Monedero ]
  ┌─────────────────────────────────┐
  │  Saldo disponible               │
  │  ████  245 Rickoin              │
  │  = $245.000 COP                 │
  └─────────────────────────────────┘
  
  [+ Comprar Rickoin]   [↓ Solicitar retiro]
  
  ─── Movimientos recientes ────────
  + 100 Rickoin   Compra Rickoin    25 abr
  - 50 Rickoin    Boleta Rifa #12   23 abr
  + 200 Rickoin   Devolución Rifa   20 abr
  - 50 Rickoin    Boleta Rifa #10   18 abr
  
  → [Ver historial completo]
```

#### Breadboard: Comprar Rickoin

```
[ Comprar Rickoin ]
  Tasa vigente: 1 Rickoin = $1.000 COP
  
  Cantidad de Rickoin:  [____] Rickoin
  Total a pagar:        $0 COP
  
  Método de pago:
  → [Tarjeta de crédito / débito]
  → [PSE]
  
  → [Proceder al pago]
         |
         ↓ (redirige a pasarela de pago → retorna con resultado)
[ Compra confirmada ]
  "✓ Compraste 100 Rickoin"
  "Nuevo saldo: 245 Rickoin"
  → [Volver al monedero]
  (correo de confirmación enviado automáticamente)
```

#### Breadboard: Solicitar retiro

```
[ Solicitar retiro ]
  Saldo disponible: 245 Rickoin = $245.000 COP
  
  Monto a retirar:   [____] Rickoin
  Recibirás:         $0 COP
  
  Cuenta bancaria:
  Banco:        [__________]
  Tipo:         ○ Ahorros  ○ Corriente
  Número:       [__________]
  Titular:      [__________]
  
  Tiempo de procesamiento: 6 a 10 días hábiles
  Puedes cancelar durante los primeros 5 días.
  
  → [Solicitar retiro]
         |
         ↓ (confirmación explícita)
[ ¿Confirmas el retiro? ]
  "Vas a retirar 100 Rickoin → $100.000 COP"
  "Cuenta: Bancolombia Ahorros ****1234"
  
  [Cancelar]   [Sí, confirmar retiro]
         |
         ↓
[ Retiro registrado ]
  "✓ Retiro en proceso"
  "Puedes cancelarlo antes del [fecha]"
  → [Volver al monedero]
```

#### Breadboard: Historial de movimientos

```
[ Historial completo ]
  Pestanas: [Rickoin ▾]  [Fichas ▾]
  Filtros: [Todo ▾]  [Este mes ▾]
  
  ─── Rickoin ──────────────────────────────────
  25 abr  + 100 Rickoin  Compra Rickoin         CONFIRMADO
  23 abr  -  50 Rickoin  Boleta Rifa "iPhone"   CONFIRMADO
  20 abr  + 200 Rickoin  Devolución Rifa #8     AUTOMÁTICO
  15 abr  - 100 Rickoin  Retiro $100.000 COP    PROCESADO
  
  ─── Fichas ───────────────────────────────────
   1 may  +  10 Fichas   Bono bienvenida        ADMIN
  18 may  -  20 Fichas   Boleta Rifa "TV QLED"  CONFIRMADO
  
  (paginación por tipo de moneda)
```

#### Breadboard: Panel admin — asignar Fichas

```
[ Admin → Asignar Fichas ]
  
  Destino:
  ○  Un usuario específico
     Buscar: [________________________________]
  ○  Todos los usuarios activos
  ○  Usuarios registrados entre [fecha] y [fecha]
  
  Cantidad de Fichas: [___]
  Motivo (visible para el usuario): [_________________________]
  
  Vista previa:
  "Se asignarán 10 Fichas a 147 usuarios"
  "Motivo: Bono de bienvenida — Mayo 2026"
  
  → [Asignar Fichas]
         |
         ↓ (confirmación)
  "✔ Fichas asignadas correctamente"
  "Cada usuario recibirá una notificación por correo"
```

#### Breadboard: Panel admin — gestión de retiros

```
[ Admin → Retiros pendientes ]
  
  Filtro: [Pendiente ▾]
  
  ┌──────────────────────────────────────────────────┐
  │ Martina G.   100 Rickoin   Banc. ****1234  3 días│
  │ [Ver detalle]  [Aprobar]  [Rechazar]              │
  └──────────────────────────────────────────────────┘
  ┌──────────────────────────────────────────────────┐
  │ Carlos M.    200 Rickoin   Davivienda ****5678 1d │
  │ [Ver detalle]  [Aprobar]  [Rechazar]              │
  └──────────────────────────────────────────────────┘
```

---

### Rabbit Holes

**1. La pasarela de pago puede tener un proceso de activación lento**

Algunas pasarelas (Wompi, PayU, MercadoPago) requieren proceso de activación comercial que puede tomar días o semanas. Este trámite debe iniciarse **antes de empezar el ciclo** — no durante. Si al empezar el ciclo aún no está lista, el flujo de compra de Rickoin se implementa como "solicitud manual" (el admin carga el saldo manualmente después de verificar el pago por transferencia). La UI soporta ambos modos.

**2. El Step-Up debe tener un timeout bien definido**

Si el timeout de sesión financiera no está claramente implementado, los usuarios quedarán en un estado ambiguo ("¿tengo que verificarme de nuevo?"). La regla es simple: 20 minutos de **inactividad** dentro de la zona financiera. Cada acción en la zona reinicia el contador. Al expirar, la próxima acción financiera pide verificación de nuevo — no cierra la sesión general.

**3. Las cuentas bancarias para retiro son datos sensibles**

Los datos bancarios del usuario (número de cuenta, banco) no deben guardarse permanentemente en la primera versión. El usuario los ingresa en cada solicitud de retiro. Guardar datos bancarios requiere más cuidado de seguridad y cifrado que no cabe en este ciclo.

**4. El retiro puede fallar del lado del banco**

Si el administrador aprueba un retiro pero la transferencia bancaria falla (cuenta incorrecta, banco caído), el administrador debe poder revertir el estado y notificar al usuario. El panel admin debe tener un estado "Fallido" además de "Aprobado" / "Rechazado". Esto no es un rabbit hole — es parte de la solución y debe estar en el diseño desde el inicio.

**5. La asignación masiva de Fichas puede ser lenta con muchos usuarios**

Si el admin asigna Fichas a todos los usuarios activos y son 10.000, el proceso no puede bloquear la UI. La asignación masiva se encola como un job en background que procesa los registros en lotes. El admin ve el estado ("Procesando..." / "Completado"). Esto debe estar diseñado desde el inicio — no se hace en una sola query sin paginación.

---

### No-Gos

- Automatización del procesamiento bancario (ACH, transferencias automáticas)
- Guardar datos bancarios del usuario entre sesiones
- Múltiples monedas o tasas dinámicas
- Criptomonedas o métodos de pago no convencionales
- Compras fraccionadas o cuotas
- Comisiones variables por monto de retiro
- Wallet externo (no es un servicio de pagos regulado)
- Retiro de Fichas (ni parcial ni total — las Fichas son solo para uso interno)
- Conversión de Fichas a Rickoin
- Compra de Fichas por el usuario (solo las asigna el admin o el sistema)

---

## Ciclo 3 — Pitch: Rifas y Marketplace

**Apetito:** Big Batch — 6 semanas  
**Equipo:** 1 diseñador + 2 programadores  
**Resultado esperado:** El administrador puede crear y publicar rifas. Los usuarios pueden ver el catálogo, seleccionar boletas y comprarlas con su saldo Rickoin. El sistema controla la concurrencia para que no se venda la misma boleta dos veces.

**Prerequisito:** Ciclos 1 y 2 deployados (usuarios con saldo disponible).

---

### Problema

Martina tiene 245 Rickoin en su cuenta. Entra a la plataforma y quiere participar en una rifa. El problema: no existen rifas todavía, y aunque existieran, no hay interfaz para comprar boletas.

El administrador quiere crear una rifa de un televisor Samsung 55". Tiene que definir el precio de la boleta, cuántas boletas hay disponibles, el punto de equilibrio, y la fecha de cierre. Actualmente no existe ningún panel para hacer eso.

El problema más delicado: si dos usuarios intentan comprar la última boleta disponible al mismo tiempo, uno de los dos quedará defraudado — se le descontará el Rickoin pero no recibirá la boleta porque ya la tomó otro. Esto erosiona la confianza en la plataforma.

---

### Apetito

6 semanas para el marketplace completo de rifas: creación por el admin, catálogo público, detalle de rifa y compra de boletas con control de concurrencia.

**Lo que cabe en 6 semanas:**
- CRUD de rifas en el panel admin (estados: Borrador → Activa → Completada / Cancelada)
- Catálogo de rifas para el usuario
- Detalle de rifa con progreso del punto de equilibrio
- Selección y compra de boletas
- Control de concurrencia (transacción atómica)
- Historial de boletas por usuario
- Restricción: usuario activo (cuenta aprobada por admin) para comprar; usuario observador ve catálogo en modo lectura

---

### Solución

#### Breadboard: Catálogo de rifas (vista usuario)

```
[ Rifas disponibles ]
  Filtros: [Todas ▾]  [Más baratas ▾]
  
  ┌─────────────────────────────┐
  │ 📱 iPhone 15 Pro            │
  │ Boleta: 50 Rickoin          │
  │ ████████░░░░  65% vendido   │
  │ 78 / 120 boletas            │
  │ Cierra: 15 jun 2026         │
  │ → [Ver rifa]                │
  └─────────────────────────────┘
  
  ┌─────────────────────────────┐
  │ 📺 Samsung 55" QLED         │
  │ Boleta: 30 Rickoin          │
  │ ████░░░░░░░░  35% vendido   │
  │ 35 / 100 boletas            │
  │ Cierra: 30 jun 2026         │
  │ → [Ver rifa]                │
  └─────────────────────────────┘
  
  (Rifas finalizadas → sección colapsada al final)

--- Modo Observador: mismo catálogo, botones de compra deshabilitados ---
  │ 🔒 Activa tu cuenta para participar    │   (en lugar de → [Ver rifa] con compra)
  Usuario observador puede navegar y ver rifas, pero no puede comprar boletas.
  El botón en detalle de rifa muestra: "Activa tu cuenta para participar →"
```

#### Breadboard: Detalle de rifa

```
[ Rifa: iPhone 15 Pro ]
  
  Artículo: iPhone 15 Pro 256GB Titanio
  Valor del artículo: ~$5.000.000 COP
  
  Precio por boleta:  50 Rickoin = $50.000 COP
  Boletas disponibles: 42 de 120
  
  Punto de equilibrio: 80 boletas mínimas
  Estado actual: ✓ Punto de equilibrio alcanzado (78/80)
  
  Progreso: ████████████░░░░  78/120
  
  Fecha de cierre: 15 jun 2026 (12 días restantes)
  
  Tu probabilidad si compras 1 boleta: 1 en 79 = 1.27%
  
  ─── Comprar boletas ──────────────────
  ¿Cuántas boletas? [1 ▾]  (máx 10 por usuario por rifa)
  
  Pagar con:
  ○  Rickoin   (saldo: 245 R)   Total: 50 Rickoin
  ○  Fichas    (saldo: 10 F)    Total: 50 Fichas
  ○  Mixto     Fichas: [___] + Rickoin: [___]  = 50 total
  
  Tu saldo después: 195 Rickoin | 10 Fichas
  
  → [Comprar boleta(s)]
  
  Mis boletas en esta rifa: Ninguna aún
```

#### Breadboard: Confirmación de compra de boletas

```
[ Confirmar compra ]
  Rifa: iPhone 15 Pro
  Boletas: 1
  
  Pago: 50 Rickoin  (o 50 Fichas, o combinado)
  Saldo después: 195 Rickoin | 10 Fichas
  
  [Cancelar]   [Confirmar compra]
         |
         ↓ (transacción atómica: descuenta moneda(s) elegida(s) + asigna boleta)
[ Compra exitosa ]
  "✓ Compraste 1 boleta para la rifa iPhone 15 Pro"
  "Tu boleta: #083"
  "Saldo actual: 195 Rickoin | 10 Fichas"
  → [Ver mis boletas]
  → [Explorar más rifas]
  (correo de confirmación enviado)

--- (en caso de error de concurrencia) ---
[ Boleta no disponible ]
  "Lo sentimos, esa boleta ya fue comprada por otra persona."
  "Tu saldo no fue afectado."
  → [Ver otras boletas disponibles]
```

#### Breadboard: Historial de boletas del usuario

```
[ Mis boletas ]
  
  RIFAS ACTIVAS
  ┌────────────────────────────────────────┐
  │ iPhone 15 Pro    Boleta #083           │
  │ Cierra: 15 jun   Estado: Activa        │
  │ → [Ver rifa]                           │
  └────────────────────────────────────────┘
  
  RIFAS FINALIZADAS
  ┌────────────────────────────────────────┐
  │ AirPods Pro      Boleta #017           │
  │ Finalizada: 1 may   Resultado: No gané │
  └────────────────────────────────────────┘
  ┌────────────────────────────────────────┐
  │ PlayStation 5    Boleta #003           │
  │ Cancelada: 20 abr   Devuelto: 30 Rick  │
  └────────────────────────────────────────┘
```

#### Breadboard: Crear rifa — panel admin

```
[ Admin → Nueva rifa ]
  
  Artículo: [____________________________]
  Descripción: [textarea]
  URL imagen: [________________________________]  (ej: enlace de Google Drive, CDN o imagen pública)
  Valor del artículo (COP): [__________]
  
  Precio por boleta (Rickoin): [___]
  Total de boletas: [___]
  Punto de equilibrio (mínimo): [___]
  
  Fecha de inicio: [dd/mm/aaaa]
  Fecha de cierre: [dd/mm/aaaa]
  
  Estado inicial: ○ Borrador  ○ Activa
  
  → [Guardar borrador]   → [Publicar rifa]
```

#### Breadboard: Gestión de rifas — panel admin

```
[ Admin → Rifas ]
  
  [+ Nueva rifa]
  
  Filtro: [Todas ▾]
  
  iPhone 15 Pro     Activa    78/120    15 jun  [Ver] [Editar] [Cerrar]
  Samsung 55" QLED  Activa    35/100    30 jun  [Ver] [Editar] [Cerrar]
  AirPods Pro       Complet.  95/95     1 may   [Ver]
  PlayStation 5     Cancelada 25/80     20 abr  [Ver]
  
  (Cerrar = cierra antes de la fecha límite → evalúa equilibrio inmediatamente)
```

---

### Rabbit Holes

**1. Concurrencia en la compra de la última boleta**

Este es el riesgo técnico más alto del ciclo. La solución es una **transacción de base de datos con bloqueo pesimista** (`SELECT ... WITH (UPDLOCK)` en SQL Server + transacción). El flujo:

1. `BEGIN TRANSACTION`
2. `SELECT boletas disponibles WHERE rifaId = X` con lock
3. Si hay disponibles: descuenta saldo del usuario + asigna boleta
4. `COMMIT`

Si dos requests llegan al mismo tiempo, el segundo espera a que el primero haga commit y luego ve que ya no hay boletas. No hay magia aquí — es transacción bien implementada. El rabbit hole sería intentar usar locks distribuidos, Redis, o queue systems. No hacemos nada de eso. Transacción SQL estándar es suficiente.

**2. El punto de equilibrio puede no ser intuitivo para el admin**

Si el admin crea una rifa con 100 boletas y punto de equilibrio de 150, eso es un error lógico (el mínimo no puede superar el máximo). El sistema debe validar esto en el formulario con un mensaje claro. No requiere un sistema de validación complejo — una regla: `punto_equilibrio <= total_boletas`.

**3. El máximo de boletas por usuario por rifa**

Si no limitamos cuántas boletas puede comprar un usuario, alguien podría comprar todas y arruinar la experiencia. La regla: máximo 10 boletas por usuario por rifa (parametrizable por rifa al crearla). La validación va en el backend antes de la transacción.

**4. La compra mixta Rickoin + Fichas requiere una sola transacción**

Si el usuario elige pagar 30 Fichas + 20 Rickoin por una boleta de 50, el sistema debe descontar ambas monedas en una sola transacción atómica. Si falla a mitad, ninguna se descuenta. Esto es un detalle de implementación crítico: no son dos transacciones separadas. El rabbit hole sería tratar cada descuento por separado y quedar en un estado parcial.

**5. Imágenes de los artículos**

No construimos ni integramos ningún servicio de almacenamiento de imágenes. El admin ingresa una **URL externa** que apunta a la imagen del artículo (Google Drive, CDN público u otro). El sistema la renderiza directamente con `<img src>`. No hay subida de archivos, no hay Azure Blob Storage, no hay validación de formato ni tamaño. Si la URL no es accesible, la vista muestra un placeholder. Esta decisión elimina completamente la complejidad y el costo de almacenamiento de imágenes.

---

### No-Gos

- Rifas con múltiples premios
- Sorteo parcial (p.ej. 3 ganadores)
- Boletas numeradas con elección libre de número (el número lo asigna el sistema)
- Rifas privadas o por invitación
- Descuentos o promociones en boletas
- Categorías o tags en el catálogo de rifas
- Carga masiva de boletas desde CSV
- Vista de quién más está participando en una rifa

---

## Ciclo 4 — Pitch: Motor de Sorteos y Premios

**Apetito:** Big Batch — 6 semanas  
**Equipo:** 1 diseñador + 2 programadores  
**Resultado esperado:** Cada rifa queda vinculada a un sorteo oficial de una lotería colombiana autorizada (Lotería de Medellín, Astro Sol, Baloto u otras). El número ganador se determina directamente del resultado oficial publicado por esa entidad, eliminando cualquier algoritmo interno. Las ventas se cierran automáticamente antes del sorteo, el ganador es identificado y notificado de forma automática, y todo el proceso queda auditado.

**Prerequisito:** Ciclos 1, 2 y 3 deployados.

---

### Problema

Las rifas pueden crearse y venderse (ciclo 3), pero no tienen fin. Cuando llega la fecha de sorteo, alguien tiene que hacer todo a mano: consultar el resultado de la lotería, determinar qué boleta coincide, identificar al ganador, notificarlo. Eso es lento, propenso a errores y, sobre todo, no genera confianza.

El problema central no es solo la automatización — es la transparencia. Si el sistema genera un número aleatorio interno para elegir al ganador, los usuarios no tienen forma de verificar que fue justo. Un usuario legítimamente puede preguntarse: "¿Cómo sé que no lo eligieron a dedo?"

La solución: el número ganador de cada rifa se deriva directamente del resultado oficial de una lotería pública colombiana autorizada (Lotería de Medellín, Astro Sol, Baloto u otras). Esas entidades transmiten en vivo, publican resultados oficiales y tienen credibilidad ante el público. La plataforma no genera el número — lo toma de una fuente externa verificable.

El segundo problema: el cierre de ventas debe ser automático y previo al sorteo. Si las ventas siguen abiertas cuando el sorteo ocurre, alguien que ya conoce el resultado podría comprar la boleta ganadora. El sistema debe cerrar las ventas automáticamente 3 horas antes del sorteo oficial (parametrizable).

---

### Apetito

6 semanas para el motor completo: configuración de lotería en rifas, cierre automático de ventas, registro del resultado oficial (manual en v1.0 con audit trail), validación automática del ganador, notificación con confirmación de recepción, y gestión de premios.

**Lo que cabe en 6 semanas:**
- Catálogo de loterías configurables en panel admin
- Configuración de lotería + regla de dígitos al crear una rifa
- Job de cierre automático de ventas (3h antes del sorteo)
- Formulario de ingreso manual del resultado oficial + audit trail
- Validación automática: ¿fue vendida la boleta ganadora?
- Reglas configurables si la boleta ganadora no fue vendida
- Notificación al ganador con botón de confirmación (token único)
- UI del ganador para elegir modalidad de premio
- Panel admin: detalle del ganador, gestión de entrega
- Vista pública de resultado (sin datos personales del ganador)
- Estados de rifa completos: Borrador → Activa → En venta → Cerrada → Pendiente de resultado → Ganador encontrado → Premio reclamado → Finalizada / Sin ganador

---

### Solución

#### Breadboard: Crear rifa — sección de configuración del sorteo

```
[ Admin → Nueva rifa ]
  ...datos básicos del artículo, precio, boletas, fechas...
  
  ─── Configuración del sorteo ─────────────────────────
  
  Lotería base: [Lotería de Medellín ▾]
    (Opciones: Lotería de Medellín | Astro Sol | Baloto | ...)
  
  Regla de extracción del número ganador:
    ○  Últimos 3 dígitos   (ej: resultado 54873 → ganador 873)
    ○  Últimos 4 dígitos   (ej: resultado 54873 → ganador 4873)
    ○  Últimos 5 dígitos   (ej: resultado 54873 → ganador 54873)
  
  Fecha del sorteo oficial: [dd/mm/aaaa]
  Hora del sorteo oficial:  [HH:MM]  (hora Colombia / UTC-5)
  
  Cierre automático de ventas: 3 horas antes
    → Ventas se cerrarán el [dd/mm/aaaa] a las [HH:MM]
    (calculado automáticamente — no editable)
  
  Si la boleta ganadora no fue vendida:
    ○  Declarar rifa sin ganador
    ○  Usar siguiente número disponible vendido
    (esta regla queda registrada en la rifa y no puede cambiarse después de activar)
  
  → [Guardar y activar rifa]
```

#### Breadboard: Job de cierre automático de ventas

```
[ Job programado — se ejecuta cada 15 minutos ]
  ¿Hay rifas con estado = "En venta"
   Y  (hora_sorteo − 3h) <= ahora?
  
  SÍ → Para cada rifa afectada:
       → Estado rifa = "Cerrada"
       → Bloquear compra de boletas (validación en backend)
       → Bloquear reservas y modificaciones de participantes
       → Registrar: timestamp de cierre, motivo = "cierre automático pre-sorteo"
       → No se notifica a usuarios en este momento
       (los usuarios simplemente no podrán comprar)
```

> El backend valida el estado en cada intento de compra. No es posible comprar boletas de una rifa en estado "Cerrada" — la validación es server-side, no solo visual.

#### Breadboard: Registro del resultado oficial

```
[ Admin → Rifas → iPhone 15 Pro → Registrar resultado ]
  
  Estado actual: Cerrada — Pendiente de resultado
  Sorteo: Lotería de Medellín  |  Fecha: 15 jun 2026  |  Hora: 8:00 PM
  Regla: Últimos 4 dígitos
  
  ─── Ingresar resultado oficial ──────────────────────
  
  Resultado oficial publicado: [__________]
    (número completo tal como fue publicado por la lotería)
  
  Número ganador calculado: [____]
    (calculado automáticamente según la regla configurada)
  
  Evidencia (opcional):
    [URL del resultado oficial] o [Subir captura]
  
  ─── Audit trail (inmutable) ─────────────────────────
  Registrado por: admin@rickoin.co
  Fecha/hora de registro: [timestamp automático]
  IP de origen: [registrado automáticamente]
  
  → [Registrar resultado y buscar ganador]
         |
         ↓ (sistema ejecuta validación automática)
  
  "✓ Resultado registrado. Buscando boleta ganadora..."
```

> **Nota v1.0:** El ingreso es manual. El admin consulta el resultado oficial en el sitio de la lotería y lo ingresa aquí. La integración automática con fuentes oficiales es un No-Go en esta versión — se diseñará en una fase posterior cuando se confirme disponibilidad de API pública.

#### Breadboard: Validación automática del ganador

```
[ Sistema — post-registro de resultado ]
  
  Número ganador: 4873
  
  ¿Existe boleta con número 4873 en estado "vendida"?
  
  SÍ →  → Registrar ganador: usuario + boleta + timestamp
        → Estado rifa = "Ganador encontrado"
        → Enviar email al ganador (flujo abajo)
        → Notificar a todos los participantes: "La rifa tiene ganador"
  
  NO →  → ¿Regla configurada = "Sin ganador"?
              SÍ → Estado rifa = "Sin ganador"
                   → Notificar a participantes
                   → Devolver Rickoin/Fichas a cada participante (transacción atómica)
             
              NO (regla = "Siguiente número disponible") →
                   → Buscar boleta vendida más cercana al número ganador
                   → Registrar ganador con nota: "Boleta original no vendida — aplicada regla de siguiente disponible"
                   → Continúa el flujo normal de ganador
```

> La regla de fallback se muestra en el resultado público de la rifa para transparencia total. "La boleta #4873 no fue vendida. Por la regla configurada, el ganador es el portador de la boleta #4875."

#### Breadboard: Notificación al ganador — flujo completo

```
[ Email al ganador ]
  Asunto: "¡Ganaste la rifa iPhone 15 Pro en Rickoin!"
  
  Cuerpo:
  "¡Felicitaciones, Martina! 🎉"
  "Eres la ganadora de la rifa: iPhone 15 Pro"
  
  Datos del sorteo:
  ─────────────────────────────────────
  Lotería:        Lotería de Medellín
  Resultado oficial: 54873
  Número ganador:    4873 (últimos 4 dígitos)
  Tu boleta:         #4873
  Fecha del sorteo:  15 jun 2026 — 8:00 PM
  ─────────────────────────────────────
  
  Premio: iPhone 15 Pro 256GB Titanio
  Plazo para reclamar: 5 días (hasta 20 jun 2026)
  
  → [Confirmar recepción y elegir premio]
       (enlace con token único de 1 sola vez — expira en 5 días)
  
  Si no confirmas en 5 días, el admin asignará la modalidad por defecto.

[ Plataforma — cuando el usuario hace clic en el enlace ]
  → El sistema valida el token (único, de 1 uso, con expiración)
  → Registra fecha/hora de confirmación
  → Muestra la pantalla de selección de premio
  → Notifica al administrador: "El ganador confirmó recepción"
```

#### Breadboard: Selección de premio por el ganador

```
[ Mi Premio — pantalla del ganador ]
  "🎉 ¡Ganaste: iPhone 15 Pro!"
  
  Sorteo: Lotería de Medellín  —  15 jun 2026
  Número ganador: 4873  |  Tu boleta: #4873
  
  ¿Cómo quieres recibir tu premio?
  
  ○  El artículo físico
     (te contactaremos para coordinar la entrega)
  
  ○  Equivalente en Rickoin
     Recibirías: 95 Rickoin (penalización del 10%)
     = $95.000 COP en saldo disponible para usar o retirar
  
  → [Confirmar selección]
  
  (Si no elige en 5 días → el admin asigna la opción por defecto configurada en el sistema)
```

#### Breadboard: Panel admin — detalle del ganador

```
[ Admin → Rifas → iPhone 15 Pro → Ganador ]
  
  INFORMACIÓN DEL GANADOR (solo visible para admin)
  ────────────────────────────────────────────────
  Nombre:        Martina García
  Documento:     CC 1.234.567.890
  Email:         martina@email.com
  Teléfono:      +57 300 000 0000
  Boleta:        #4873
  Confirmó:      16 jun 2026  10:34 AM
  Opción elegida: Artículo físico
  Estado premio: Pendiente de entrega
  
  [Marcar como entregado]
  [Asignar Fichas de consolación a no ganadores]
  
  RESULTADO DEL SORTEO (visible para todos)
  ────────────────────────────────────────────────
  Lotería:        Lotería de Medellín
  Resultado oficial: 54873
  Número ganador:    4873
  Fecha del sorteo:  15 jun 2026
  Estado:            Ganador encontrado
```

#### Breadboard: Vista pública del resultado (otros participantes)

```
[ Rifa: iPhone 15 Pro — resultado ]
  
  Estado: Ganador encontrado ✓
  Fecha del sorteo: 15 jun 2026 — 8:00 PM
  
  Lotería: Lotería de Medellín
  Resultado oficial: 54873
  Número ganador:    4873 (últimos 4 dígitos)
  
  Premio: Entregado ✓
  
  (Los datos personales del ganador no son visibles para otros participantes)
```

#### Breadboard: Estados de la rifa — ciclo de vida completo

```
BORRADOR
  ↓  (admin activa la rifa)
ACTIVA — EN VENTA
  ↓  (job automático: hora_sorteo − 3h)
CERRADA — PENDIENTE DE RESULTADO
  ↓  (admin registra resultado oficial)
¿Boleta vendida?
  SÍ → GANADOR ENCONTRADO
         ↓  (ganador confirma y elige modalidad)
       PREMIO RECLAMADO
         ↓  (admin marca como entregado)
       FINALIZADA
  
  NO (regla = sin ganador) → SIN GANADOR
         ↓  (Rickoin/Fichas devueltos automáticamente)
       FINALIZADA
  
  NO (regla = siguiente disponible) → flujo normal → GANADOR ENCONTRADO → ...
```

---

### Rabbit Holes

**1. Integración automática con fuentes oficiales — No es para v1.0**

Obtener automáticamente el resultado de la lotería requiere una API pública estable o scraping de los sitios web de cada lotería. En v1.0, el ingreso es manual con audit trail completo. El rabbit hole sería intentar implementar el scraping ahora: los sitios cambian, los resultados tardan en publicarse, y una consulta fallida puede bloquear el flujo. No se diseña ni prototipa la integración automática en este ciclo.

**2. La regla de fallback debe estar configurada antes del sorteo**

Si la boleta ganadora no fue vendida y la regla no está configurada, el sistema no puede proceder. La regla (sin ganador / siguiente disponible) se define obligatoriamente al crear la rifa y no puede modificarse después de que la rifa queda activa. Si se intenta registrar el resultado sin regla configurada, el sistema bloquea el flujo con un error claro al admin.

**3. Todos los horarios en hora Colombia (UTC-5)**

El campo "hora del sorteo" se almacena y muestra siempre en hora Colombia (America/Bogota, UTC-5). El job de cierre automático calcula `hora_sorteo − 3h` en UTC-5. No hay soporte multitimezone en v1.0. El rabbit hole sería dejar la hora sin timezone explícito y que el servidor esté en otra zona — el cierre se ejecutaría en el momento equivocado.

**4. El token de confirmación de recepción debe ser de un solo uso**

El enlace en el email del ganador contiene un token único generado en el momento del envío. El token es de un solo uso (se invalida al primer clic válido) y tiene expiración (5 días). Si el token expiró, el usuario ve un mensaje claro y el admin puede reenviar el email manualmente. El token no debe reutilizarse ni adivinarse — se genera con `Guid.NewGuid()` o equivalente seguro.

**5. El resultado del sorteo es inmutable una vez registrado**

Una vez que el admin registra el número ganador y el sistema identifica al ganador, ese registro no puede editarse. El admin no puede "corregir" el resultado. Si hay un error en el ingreso, debe documentarse vía audit trail y escalar al operador. El rabbit hole sería agregar un botón "editar resultado" — eso destruiría la confianza que es el objetivo principal del ciclo.

---

### No-Gos

- Integración automática con fuentes oficiales de resultados de loterías (v1.0 es manual)
- Scraping de resultados de loterías
- Rifas sin lotería configurada (obligatorio al crear la rifa)
- Múltiples ganadores por rifa
- Livestream del sorteo dentro de la plataforma
- RNG interno como mecanismo de selección del ganador
- Edición o cancelación del resultado una vez registrado
- Rifas vinculadas a loterías internacionales
- Auditoría externa certificada (Coljuegos — fuera de alcance en esta versión)

---

## Ciclo 5 — Pitch: Operaciones y Estabilidad

**Apetito:** Big Batch — 6 semanas  
**Equipo:** 1 diseñador + 2 programadores  
**Resultado esperado:** La plataforma está lista para producción. Las notificaciones por correo funcionan en todos los eventos definidos. Los administradores tienen reportes y logs. El sistema tiene monitoreo básico en Azure y los documentos legales están publicados.

**Prerequisito:** Ciclos 1–4 completos y deployados.

---

### Problema

Todos los flujos de negocio existen, pero la plataforma "está incompleta" para producción real. Hay tres problemas concretos:

**1. Notificaciones:** Hay correos que se envían en los ciclos anteriores (confirmación de compra, devolución, etc.) pero no existe un sistema de correo real integrado — se enviaron como mocks o console logs durante el desarrollo. Para producción, cada evento necesita un correo real enviado a través de SendGrid.

**2. Visibilidad para el admin:** El administrador no tiene una vista consolidada de qué está pasando en la plataforma — cuántos usuarios hay, cuánto se ha vendido, qué retiros están pendientes de hace más de una semana. Sin eso, gestionar la plataforma es operar a ciegas.

**3. Documentos legales:** La Ley 1581 (protección de datos) y el Estatuto del Consumidor exigen documentos publicados antes de operar. Sin Términos y Condiciones y Política de Privacidad publicados, la plataforma no puede salir a producción.

---

### Apetito

6 semanas para completar las tres áreas. El scope puede variar — si los reportes toman más de lo esperado, se cortan funcionalidades de reportes no críticas. Lo que no se puede cortar: las notificaciones por correo (afectan todos los flujos) y los documentos legales (son bloqueantes legales).

---

### Solución

#### Breadboard: Sistema de noti          DESTINATARIO        MOMENTO
───────────────────────────────────────────────────────────────────────
Registro                                  Usuario             Inmediato
Código OTP (registro)                     Usuario             Inmediato
Código OTP (step-up)                      Usuario             Inmediato
Registro pendiente de aprobación          Admin               Inmediato
Cuenta aprobada                           Usuario             Inmediato
Cuenta rechazada                          Usuario             Con motivo
Compra de Rickoin                         Usuario             Inmediato
Fichas asignadas                          Usuario             Inmediato
Compra de boleta                          Usuario             Inmediato
Retiro solicitado                         Usuario             Inmediato
Retiro aprobado                           Usuario             Inmediato
Retiro rechazado                          Usuario             Con motivo
Ganador del sorteo                        Ganador             Inmediato post-sorteo
Participante no ganó                      Participantes       Inmediato post-sorteo
Devolución (sin equilibrio)               Participantes       Inmediato post-devolución
Recuperación de contraseña                Ganador             Inmediato post-sorteo
Participante no ganó            Participantes       Inmediato post-sorteo
Devolución (sin equilibrio)     Participantes       Inmediato post-devolución
Recuperación de contraseña      Usuario             Inmediato
```

> ⚠  USUARIOS PENDIENTES DE APROBACIÓN: 5   → [Revisar ahora]
  
  HOY                           ESTE MES
  ──────────────────────────────────────────
  Usuarios nuevos:  12          Usuarios nuevos:  145
  Boletas vendidas: 34          Boletas vendidas: 1.240
  Rickoin comprado: 580 R       Rickoin comprado: 18.450 R
  Fichas asignadas: 0           Fichas asignadas: 320 F
[ Admin → Dashboard ]
  
  HOY                           ESTE MES
  ──────────────────────────────────────────
  Usuarios nuevos:  12          Usuarios nuevos:  145
  Boletas vendidas: 34          Boletas vendidas: 1.240
  Rickoin comprado: 580 R       Rickoin comprado: 18.450 R
  Retiros pendt.:   3           Retiros procesados: 28
  
  RIFAS ACTIVAS (3)
  iPhone 15 Pro    78/120   Cierra en 12 días
  Samsung QLED     35/100   Cierra en 25 días
  Nintendo Switch  12/60    Cierra en 8 días   ⚠ Sin equilibrio
  
  RETIROS PENDIENTES (3)   → [Ver todos]
  Martina G.    100 Rick   Hace 3 días
  Carlos M.     200 Rick   Hace 1 día
```

#### Breadboard: Reportes exportables

```
[ Admin → Reportes ]
  
  Selecciona reporte:
  ○ Ventas de Rickoin por período
  ○ Boletas vendidas por rifa
  ○ Retiros procesados
  ○ Usuarios registrados
  
  Período: [Mes ▾]  Desde: [___]  Hasta: [___]
  Formato: ○ CSV  ○ Excel
  
  → [Generar reporte]
```

#### Breadboard: Logs de eventos — panel admin

```
[ Admin → Logs ]
  
  Filtros: [Todos ▾]   Usuario: [___]   Fecha: [___]
  
  2026-06-15 14:23  martina@email.com   Compra boleta  Rifa #12   OK
  2026-06-15 14:20  martina@email.com   Step-up auth   Acceso     OK
  2026-06-15 11:05  carlos@email.com    Retiro solicit $100.000   OK
  2026-06-14 09:12  SISTEMA             Sorteo         Rifa #8    OK
  2026-06-14 09:12  SISTEMA             Devolución     Rifa #7    OK
  
  (paginado — sin borrado de logs)
```

#### Breadboard: Configuración global — panel admin
FICHAS
  Vencimiento de Fichas: ○ No vencen (por defecto)  ○ Vencen en [___] días
  [Guardar]
  
  
```
[ Admin → Configuración ]
  
  MONEDA
  Tasa de conversión: 1 Rickoin = [1000] COP  [Guardar]
  
  RIFAS
  Máx boletas por usuario por rifa: [10]  [Guardar]
  Premio por defecto si ganador no elige: ○ Artículo  ○ Rickoin
  Penalización premio en Rickoin (%): [10]  [Guardar]
  
  SEGURIDAD
  Intentos fallidos antes de bloqueo: [5]  [Guardar]
  Tiempo bloqueo (minutos): [30]  [Guardar]
  Expiración OTP (minutos): [15]  [Guardar]
  Timeout sesión financiera (minutos): [20]  [Guardar]
  
  RETIROS
  Tiempo de procesamiento (días hábiles): [6] a [10]  [Guardar]
  Ventana de cancelación (días): [5]  [Guardar]
```

#### Breadboard: Documentos legales — pie de página

```
FOOTER (visible en todas las páginas)
┌──────────────────────────────────────────────────────────┐
│ RICKOIN © 2026  |  [Términos y Condiciones]              │
│                 |  [Política de Privacidad]              │
│                 |  [Juego Responsable]                   │
│                 |  [Política de Pagos]                   │
│                 |  [Aviso Legal]                         │
└──────────────────────────────────────────────────────────┘
```

> Los documentos son páginas estáticas con texto redactado por el operador. En esta fase no son administrables por CMS — son vistas Razor con el contenido. Si el operador quiere actualizar un texto, se hace un despliegue. Una versión futura puede hacerlos editables desde el panel.

---

### Rabbit Holes


**4. Las Fichas no vencen en la v1.0 — no diseñar lógica de vencimiento**

El rabbit hole sería agregar fecha de expiración a las Fichas: cron job que las expire, notificaciones de "tus Fichas vencen pronto", lógica de FIFO en el consumo. En la v1.0 las Fichas no vencen. El campo en Configuración global permite activarlo después, pero el job de expiración no se construye en este ciclo. No-Go: vencimiento automático de Fichas en esta versión.
**1. SendGrid puede requerir configuración de dominio de correo (DKIM/SPF)**

Si el dominio del remitente no está autenticado, los correos caen en spam. La configuración de DKIM y SPF para el dominio debe hacerse antes de empezar el ciclo, coordinando con quien administre el DNS del dominio de Rickoin. No es complejo pero requiere tiempo de propagación de DNS (24-48h).

**2. Los reportes CSV pueden tener problemas de encoding para Excel en español**

Los reportes CSV que se abren en Excel necesitan BOM UTF
- Vencimiento automático de Fichas (el campo existe en configuración pero el job no se construye en v1.0)-8 y punto y coma como separador (no coma) para que funcionen correctamente en Excel en español. Este detalle específico se conoce de antemano y se implementa correctamente desde el inicio.

**3. La configuración global tiene estado — los cambios afectan rifas en curso**

Si el admin cambia la tasa de conversión de 1.000 a 1.200 COP mientras hay rifas activas, ¿qué pasa con las boletas ya vendidas? La tasa de conversión para boletas ya compradas no cambia — se usa la tasa vigente al momento de la compra. El historial de movimientos debe registrar el valor de conversión en el momento de cada transacción, no calcular retroactivamente.

---

### No-Gos

- Panel de CMS para gestionar documentos legales
- Estadísticas avanzadas o BI (solo reportes simples)
- Alertas automáticas por email al admin (monitoreo manual en Azure por ahora)
- A/B testing de correos
- Personalización de plantillas de correo por el admin
- Retención de logs superior a 90 días (en esta versión)

---

## Preparación Futura: Coljuegos

> Esta sección documenta lo que está **fuera del alcance actual** pero la arquitectura está diseñada para soportarlo sin rediseño cuando sea necesario.

### Por qué Coljuegos no aplica ahora

Operar bajo concesión de Coljuegos requiere: (a) empresa constituida con objeto social de juegos de suerte y azar, (b) contrato de concesión firmado, (c) certificación por laboratorio especializado (GLI u homologado). Este proceso es costoso, toma meses, y no es necesario para la operación inicial de la plataforma.

### Qué elementos de la arquitectura actual ya cubren los requisitos de Coljuegos

| Requisito Coljuegos | Estado en la arquitectura Rickoin |
|---|---|
| Trazabilidad completa de transacciones | ✅ Logs de eventos desde Ciclo 1 |
| Sorteo con resultado oficial trazable | ✅ Vinculado a lotería autorizada + audit trail — Ciclo 4 |
| Devoluciones automáticas verificables | ✅ Transacción atómica por participante — Ciclo 4 |
| Validación de identidad (KYC básico) | ✅ Documento de identidad — Ciclo 1 |
| Control de concurrencia en ventas | ✅ Transacción atómica — Ciclo 3 |
| Mayoría de edad | ✅ Validación en registro — Ciclo 1 |

### Qué habría que agregar en un ciclo futuro de Coljuegos

| Elemento | Descripción |
|---|---|
| Integración API con operadores de lotería | Automatizar la obtención del resultado oficial directamente desde la fuente (v1.0 es ingreso manual) |
| Reportes para entes de control | Exportación en formatos específicos requeridos por GLI / Coljuegos |
| API de supervisión | Integración con sistemas de monitoreo en tiempo real de Coljuegos |
| Auditoría externa | Contratar GLI u homologado para certificar la plataforma |
| Constitución legal | Empresa con objeto social correcto + contrato de concesión |

---

*RICKOIN Shape Up v1.0 — Cinco ciclos de 6 semanas. Tiempo fijo. Scope variable. Ship it.*
