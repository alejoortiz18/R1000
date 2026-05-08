# RICKOIN — Documento Consolidado de Requisitos y Arquitectura

**Versión:** 3.0  
**Fecha:** Mayo 2026  
**Autor:** Product Owner / Arquitectura de Software  
**Estado:** Activo — Alcance de producción inicial definido

---

## NOTA DE VERSIÓN

Esta versión **elimina Coljuegos como requisito activo**. La plataforma se desarrolla conforme a la necesidad real del negocio. El cumplimiento regulatorio ante Coljuegos queda documentado en una sección de hoja de ruta futura, y la arquitectura se diseña de forma que pueda incorporarse en fases posteriores sin rediseño.

---

## ÍNDICE

1. [Visión del Producto](#1-visión-del-producto)
2. [Decisión Arquitectónica: Aplicación Única](#2-decisión-arquitectónica-aplicación-única)
3. [Actores del Sistema](#3-actores-del-sistema)
4. [Módulos del Sistema](#4-módulos-del-sistema)
5. [Autenticación y Seguridad por Capas](#5-autenticación-y-seguridad-por-capas)
6. [Reglas de Negocio](#6-reglas-de-negocio)
7. [Modelo de Negocio](#7-modelo-de-negocio)
8. [Requisitos Funcionales](#8-requisitos-funcionales)
9. [Requisitos No Funcionales](#9-requisitos-no-funcionales)
10. [Marco Legal Mínimo Viable](#10-marco-legal-mínimo-viable)
11. [Infraestructura Azure](#11-infraestructura-azure)
12. [Roadmap de Desarrollo](#12-roadmap-de-desarrollo)
13. [Riesgos](#13-riesgos)
14. [Preparación Futura para Coljuegos](#14-preparación-futura-para-coljuegos)

---

## 1. Visión del Producto

**Rickoin** es una **plataforma web unificada** que permite a los usuarios participar en rifas digitales mediante el uso de una moneda virtual interna, garantizando:

- Experiencia de usuario fluida y coherente en una sola plataforma
- Transparencia en todos los procesos
- Seguridad en transacciones
- Trazabilidad financiera completa
- Arquitectura preparada para escalar y certificarse regulatoriamente en el futuro

### Objetivo de esta fase

Desarrollar una **única plataforma digital operativa** que:

- Centralice la venta de boletas de rifas
- Gestione la moneda virtual interna (Rickoin) de forma integrada
- Automatice sorteos y distribución de premios
- Proteja las operaciones financieras con verificación de identidad adicional
- Ofrezca auditoría interna básica y trazabilidad de transacciones

> La plataforma **no busca certificación ante Coljuegos en esta fase**. Se construye sobre buenas prácticas de seguridad, trazabilidad y arquitectura limpia que faciliten esa certificación cuando sea requerida.

---

## 2. Decisión Arquitectónica: Aplicación Única

### 2.1 Propuesta original del cliente

El cliente planteó inicialmente **dos aplicaciones independientes**:

| App 1 | App 2 |
|---|---|
| Gestión de rifas | Gestión de monedas, compras, retiros |

### 2.2 Por qué NO se implementan como dos aplicaciones separadas

#### Experiencia de usuario degradada
- El usuario tendría que autenticarse en **dos sistemas distintos**
- No habría contexto compartido: saldo, rifas e historial estarían fragmentados
- La navegación sería incoherente — el usuario no sabría dónde hacer qué

#### Complejidad operativa sin beneficio
- Dos procesos de despliegue independientes
- Lógica de negocio duplicada (validaciones, reglas, notificaciones)
- Doble esfuerzo en correcciones y actualizaciones

#### Mayor costo de infraestructura
- Dos App Services en Azure
- Dos bases de datos SQL Server
- Dos certificados SSL y dominios

### 2.3 Solución: Módulo Financiero Integrado con Step-Up Authentication

La **Zona Financiera** (monedero, compras de Rickoin, retiros) se integra como un **módulo protegido dentro de la misma aplicación**, con una verificación de identidad adicional al momento de acceder.

Este patrón se llama **Step-Up Authentication** — estándar en apps fintech: el usuario ya está autenticado, pero para acceder a funciones financieras sensibles el sistema solicita una verificación adicional.

```
┌─────────────────────────────────────────────────────┐
│                  RICKOIN PLATFORM                   │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │         ZONA PÚBLICA (sesión activa)         │    │
│  │  - Ver rifas disponibles                    │    │
│  │  - Ver historial de boletas                 │    │
│  │  - Ver saldo de Rickoin                     │    │
│  │  - Comprar boletas (saldo disponible)       │    │
│  └─────────────────────────────────────────────┘    │
│                         ↓                           │
│            [ VERIFICACIÓN DE IDENTIDAD ]            │
│         contraseña / código OTP por email           │
│                         ↓                           │
│  ┌─────────────────────────────────────────────┐    │
│  │         ZONA FINANCIERA (protegida)          │    │
│  │  - Comprar Rickoin (depósito de dinero real) │    │
│  │  - Solicitar retiro                         │    │
│  │  - Ver movimientos financieros detallados   │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### 2.4 Beneficios consolidados

| Aspecto | Dos apps | Una app unificada |
|---|---|---|
| Experiencia de usuario | Fragmentada | Cohesiva y fluida |
| Autenticación | Duplicada | Única con step-up para zona financiera |
| Base de datos | 2 instancias | 1 instancia |
| App Service Azure | 2 instancias | 1 instancia |
| Trazabilidad | Difícil de unificar | Nativa y completa |
| Mantenimiento | 2× esfuerzo | 1× esfuerzo |
| Costo mensual estimado | ~$70–90 USD | ~$45–60 USD |

---

## 3. Actores del Sistema

### Usuario (ciudadano registrado)

- Se registra con correo y contraseña
- Accede a la plataforma con email + contraseña
- Puede ver rifas y comprar boletas con su saldo Rickoin
- Para operaciones financieras (recargar, retirar) → verificación adicional requerida
- Recibe notificaciones por correo en cada acción relevante

### Administrador

- Accede con credenciales de administrador
- Crea y gestiona rifas (parámetros, estados, cierre)
- Configura parámetros globales del sistema
- Accede a reportes internos y logs
- Gestiona solicitudes de retiro pendientes

### Sistema (motor automático)

- Calcula y valida el punto de equilibrio de cada rifa
- Ejecuta sorteos de forma automática
- Envía notificaciones por correo
- Procesa devoluciones automáticas cuando no se alcanza el punto de equilibrio
- Registra logs internos de cada evento

---

## 4. Módulos del Sistema

### 4.1 Módulo de Autenticación e Identidad

**Acceso:** Sin sesión previa

- Registro con correo y contraseña
- Confirmación de cuenta por código OTP en email (expira en 15 min — parametrizable)
- Carga de documento de identidad (para validar mayoría de edad y perfil completo)
- Login con email + contraseña
- Recuperación de contraseña por correo
- Bloqueo tras múltiples intentos fallidos

### 4.2 Módulo de Rifas (Zona Pública — sesión activa)

**Acceso:** Sesión iniciada

- Catálogo de rifas activas con información completa
- Detalle de rifa: artículo, precio de boleta, boletas disponibles, punto de equilibrio, fecha de cierre
- Compra de boletas con saldo Rickoin disponible
- Historial de boletas compradas por el usuario
- Estado en tiempo real de rifas (activa, completada, cancelada)
- Probabilidad de ganar visible para el usuario

### 4.3 Módulo Financiero — Monedero Rickoin (Zona Protegida)

**Acceso:** Sesión activa + verificación adicional (step-up)

Pantalla de verificación al ingresar a la zona:

```
"Para acceder a tu monedero, confirma tu identidad:"
  ○  Ingresa tu contraseña
  ○  Enviar código a mi correo   [Enviar código]
```

Sesión financiera activa durante **20 minutos de inactividad** (parametrizable) sin necesidad de verificar nuevamente.

**Funcionalidades:**

- Ver saldo actual de Rickoin
- Comprar Rickoin (dinero real → Rickoin según tasa vigente)
- Ver historial detallado de movimientos (entradas, salidas, compras, devoluciones)
- Solicitar retiro de saldo en dinero real
- Cancelar retiro pendiente (disponible durante los primeros 5 días)
- Ver estado de retiros en curso

### 4.4 Módulo de Premios

**Acceso:** Sesión activa

- Notificación al ganador del sorteo
- Selección de modalidad de premio:
  - **Opción A:** Recibir el artículo físico
  - **Opción B:** Recibir equivalente en Rickoin con penalización del 10% (parametrizable)
- Seguimiento del estado del premio asignado

### 4.5 Panel Administrativo

**Acceso:** Rol Administrador

- CRUD de rifas: crear, editar, publicar, cerrar, cancelar
- Configuración global del sistema:
  - Tasa de conversión Rickoin / COP (default: 1 Rickoin = 1.000 COP)
  - Porcentaje de penalización en premios en dinero (default: 10%)
  - Tiempo de expiración de OTP (default: 15 min)
  - Tiempo de procesamiento de retiros (default: 6–10 días hábiles)
  - Timeout de sesión financiera (default: 20 min)
- Gestión de retiros pendientes (aprobar / rechazar)
- Reportes internos: ventas, premios, devoluciones, usuarios activos
- Logs de eventos del sistema (internos)
- Gestión de usuarios: consulta, bloqueo

### 4.6 Módulo de Notificaciones

**Acceso:** Sistema automático (motor de fondo)

| Evento | Destinatario |
|---|---|
| Registro exitoso | Usuario |
| Código de confirmación de cuenta | Usuario |
| Código OTP de step-up | Usuario |
| Compra de Rickoin confirmada | Usuario |
| Compra de boleta confirmada | Usuario |
| Rifa ganada | Usuario ganador |
| Modalidad de premio seleccionada | Usuario ganador |
| Retiro solicitado | Usuario |
| Retiro aprobado / rechazado | Usuario |
| Devolución por rifa sin equilibrio | Todos los participantes de la rifa |

---

## 5. Autenticación y Seguridad por Capas

### Capa 1 — Acceso a la plataforma (login estándar)

```
Email + Contraseña  →  Sesión activa
```

- Contraseña almacenada con **hash + salt seguro**
- Bloqueo automático tras N intentos fallidos (N configurable por administrador)
- Expiración de sesión por inactividad

### Capa 2 — Confirmación de cuenta (registro)

```
Código OTP de 6 dígitos por email  →  Cuenta activada
```

- Un solo uso
- Expira en 15 minutos (parametrizable)

### Capa 3 — Step-Up Authentication (acceso a Zona Financiera)

```
Sesión activa  +  [Contraseña ó OTP por email]  →  Zona Financiera habilitada
```

- El usuario elige el método de verificación
- OTP expira en 15 minutos
- Sesión financiera: 20 minutos de inactividad (parametrizable)
- Aplica para: acceder al monedero, comprar Rickoin, solicitar retiro

### Capa 4 — Confirmación explícita en retiros

```
Zona Financiera activa  +  Confirmación de retiro  →  Retiro registrado
```

- Aunque la sesión financiera esté activa, cada retiro requiere confirmación explícita del usuario
- Protección ante errores accidentales o uso indebido de sesión abierta

### Diagrama de flujo de autenticación

```
[ Usuario llega a la plataforma ]
          ↓
  ¿Tiene sesión activa?
  NO → Login (email + contraseña) → Sesión activa
  SÍ ↓
          ↓
  ¿Accede a Zona Financiera?
  NO → Usa rifas, historial, boletas con normalidad
  SÍ ↓
          ↓
  [ Verificación Step-Up ]
  Contraseña ó OTP por correo
          ↓
  Sesión financiera activa (20 min inactividad)
          ↓
  ¿Quiere hacer un RETIRO?
  NO → Navega monedero libremente
  SÍ ↓
          ↓
  [ Confirmación explícita ]
  "¿Confirmas el retiro de $X COP?" → [Confirmar]
          ↓
  Retiro registrado → Notificación por correo
```

---

## 6. Reglas de Negocio

### 6.1 Rifas

Cada rifa debe tener definido:

| Campo | Descripción |
|---|---|
| Artículo | Descripción y valor del premio |
| Precio por boleta | En Rickoin |
| Máximo de boletas | Límite total de la rifa |
| Punto de equilibrio | Mínimo de boletas para que la rifa sea válida |
| Fecha de inicio | Apertura de venta de boletas |
| Fecha de cierre | Límite para compra |
| Estado | Borrador / Activa / Completada / Cancelada |

### 6.2 Punto de equilibrio

- Si al cierre **NO** se alcanza el punto de equilibrio → devolución automática de Rickoin a todos los participantes + notificación por correo
- Si **SÍ** se alcanza → sorteo válido ejecutado automáticamente por el sistema

### 6.3 Sorteo

- Ejecución automática al cierre de la rifa (si se cumplió el punto de equilibrio)
- El resultado queda registrado: ganador, fecha, datos del sorteo
- Notificación inmediata al ganador y a todos los participantes

### 6.4 Premios

El ganador selecciona dentro de un plazo definido:

| Opción | Detalle |
|---|---|
| Artículo físico | La plataforma coordina la entrega al ganador |
| Rickoin | Equivalente en moneda interna con penalización del 10% (parametrizable) |

Si el ganador no selecciona en el plazo definido, el administrador asigna la modalidad por defecto.

### 6.5 Moneda Rickoin

| Propiedad | Valor |
|---|---|
| Tasa de conversión | 1 Rickoin = 1.000 COP (parametrizable) |
| Naturaleza | Moneda virtual interna — no es dinero real |
| Transferencia entre usuarios | **No permitida** |
| Retiro directo de Rickoin | **No permitido** — se retira el equivalente en dinero real |
| Uso | Exclusivo dentro de la plataforma |

### 6.6 Retiros

| Propiedad | Valor |
|---|---|
| Tiempo de procesamiento | 6 a 10 días hábiles |
| Ventana de cancelación | 5 días desde la solicitud |
| Verificación requerida | Step-up activo + confirmación explícita |
| Aprobación | El administrador aprueba o rechaza manualmente |

### 6.7 Concurrencia en boletas

- El sistema **previene la doble compra** de la misma boleta mediante transacciones atómicas en base de datos
- Si dos usuarios intentan comprar la última boleta simultáneamente, solo uno lo logra — el otro recibe un error claro y su saldo no se descuenta

---

## 7. Modelo de Negocio

### Fuentes de ingreso

| Fuente | Descripción |
|---|---|
| Margen en rifas | Diferencia entre lo recaudado en boletas y el costo del artículo |
| Comisión de plataforma | Porcentaje sobre cada rifa completada (parametrizable) |
| Penalización en premios en dinero | 10% cuando el ganador elige Rickoin en lugar del artículo (parametrizable) |

### Flujo de dinero

```
Usuario deposita COP
        ↓
Compra Rickoin (conversión automática)
        ↓
Usa Rickoin para comprar boletas
        ↓
Rifa se cierra (3h antes del sorteo oficial)
        ↓
Admin registra resultado oficial de la lotería
        ↓
Sistema identifica boleta ganadora
        ↓
Ganador elige: Artículo  ó  Rickoin (-10%)
        ↓
Si elige Rickoin → puede solicitar retiro en COP
```

---

## 8. Requisitos Funcionales

### RF-01 — Registro de usuario
- El usuario se registra con nombre, correo y contraseña
- El sistema envía un código OTP de confirmación por email
- El código expira en 15 minutos
- El usuario debe completar su perfil con documento de identidad para poder comprar boletas

### RF-02 — Autenticación
- Login con email + contraseña
- Bloqueo temporal tras N intentos fallidos (N parametrizable)
- Recuperación de contraseña por código enviado al correo
- Expiración de sesión por inactividad

### RF-03 — Catálogo de rifas
- Listado de rifas activas con información completa
- Detalle de cada rifa: artículo, precio, boletas disponibles, progreso del punto de equilibrio, fecha de cierre
- Historial de rifas finalizadas visible para el usuario

### RF-04 — Compra de boletas
- El usuario selecciona boletas disponibles de una rifa activa
- El sistema valida saldo suficiente en Rickoin antes de proceder
- La operación es atómica: descuenta saldo y asigna boleta en una sola transacción
- Notificación de confirmación por correo

### RF-05 — Acceso a Zona Financiera (Step-Up)
- Al acceder al monedero, el sistema solicita verificación adicional
- El usuario elige entre: ingresar su contraseña ó recibir OTP por correo
- OTP de un solo uso, expira en 15 minutos
- Sesión financiera activa por 20 minutos de inactividad (parametrizable)

### RF-06 — Compra de Rickoin
- Accesible únicamente desde la Zona Financiera verificada
- Integración con pasarela de pago
- Conversión automática COP → Rickoin según tasa vigente
- Registro del movimiento en historial financiero
- Notificación de confirmación por correo

### RF-07 — Solicitud de retiro
- Accesible únicamente desde la Zona Financiera verificada
- Requiere confirmación explícita del usuario antes de registrarse
- El sistema registra la solicitud con estado "Pendiente"
- El administrador aprueba o rechaza
- El usuario puede cancelar durante los primeros 5 días
- Notificación en cada cambio de estado

### RF-08 — Ejecución de sorteos basados en lotería oficial
- Cada rifa se configura con una lotería colombiana autorizada (Lotería de Medellín, Astro Sol, Baloto u otras) y una regla de extracción de dígitos (últimos 3, 4 o 5 dígitos del resultado oficial)
- La fecha y hora del sorteo oficial se configura al crear la rifa
- El sistema cierra automáticamente la venta de boletas 3 horas antes del sorteo oficial (parametrizable)
- Si no se alcanza el punto de equilibrio al cierre: devolución automática de Rickoin/Fichas + notificación a todos los participantes
- El administrador ingresa manualmente el resultado oficial publicado por la lotería (v1.0); el sistema calcula el número ganador según la regla configurada
- Todo ingreso de resultado queda auditado: usuario admin, timestamp, IP, evidencia opcional (URL o captura)
- El sistema valida automáticamente si la boleta ganadora fue vendida e identifica al propietario
- Si la boleta ganadora no fue vendida: se aplica la regla configurada en la rifa (sin ganador / siguiente disponible)
- El resultado es inmutable una vez registrado — no puede editarse

### RF-09 — Gestión de premios y notificación al ganador
- El ganador recibe email automático con los datos del sorteo (lotería, resultado oficial, número ganador, su boleta) y enlace de confirmación con token único de un solo uso (expira en 5 días)
- El ganador confirma recepción mediante el token y selecciona la modalidad de premio
- Los datos personales del ganador son visibles únicamente para el administrador; otros usuarios ven solo el número ganador, estado de la rifa y fecha del sorteo
- El sistema registra la selección y notifica al administrador para coordinar la entrega

### RF-10 — Panel administrativo
- CRUD completo de rifas
- Configuración de parámetros globales del sistema
- Gestión de retiros pendientes (aprobar / rechazar)
- Reportes internos exportables
- Consulta de logs y actividad del sistema
- Gestión de usuarios (consulta, bloqueo)

### RF-11 — Notificaciones por correo
- Sistema de envío de correos para todos los eventos definidos en la sección 4.6

---

## 9. Requisitos No Funcionales

### NFR-01 — Seguridad

| Requisito | Detalle |
|---|---|
| Contraseñas | Hash + salt (bcrypt o Argon2) — nunca en texto plano |
| Sesiones | Token seguro con expiración por inactividad |
| Step-Up Authentication | Requerido para toda operación financiera |
| Confirmación en retiros | Doble confirmación explícita en operaciones de alto riesgo |
| Validación de perfil | Documento de identidad requerido para operaciones |
| Datos en tránsito | HTTPS obligatorio en toda la plataforma |
| Datos en reposo | Información sensible cifrada en la base de datos |
| Bloqueo por intentos | Bloqueo temporal tras N intentos fallidos (N configurable) |

### NFR-02 — Integridad financiera

| Requisito | Detalle |
|---|---|
| Atomicidad | Toda operación financiera es todo-o-nada |
| Saldo negativo | Prohibido — validación previa obligatoria a cualquier descuento |
| Concurrencia | Transacciones en base de datos para evitar condiciones de carrera en boletas |
| Trazabilidad | Cada movimiento registrado con: usuario, fecha, monto, motivo, estado |

### NFR-03 — Trazabilidad interna (base para auditoría futura)

Todos los eventos importantes del sistema se registran con la siguiente estructura:

```
[ timestamp | usuarioId | acción | entidad | resultado | detalle ]
```

Esto cubre las necesidades de operación actual y sienta la base para una auditoría regulatoria futura sin necesidad de rediseño.

### NFR-04 — Rendimiento

| Operación | Tiempo máximo |
|---|---|
| Carga de páginas normales | < 2 segundos |
| Operaciones financieras | < 5 segundos |
| Sorteos automáticos | < 10 segundos (proceso interno) |

### NFR-05 — Disponibilidad

- Uptime mínimo objetivo: **99.5%**
- Rollback automático de transacciones incompletas ante fallos

### NFR-06 — Escalabilidad

- Arquitectura preparada para escalar horizontalmente en Azure
- Índices en campos críticos de la base de datos: `UserId`, `RifaId`, `Estado`, `FechaCreacion`
- Sin dependencias de estado en memoria (preparado para múltiples instancias)

### NFR-07 — Usabilidad

- Interfaz responsive (desktop y móvil vía navegador)
- Saldo de Rickoin visible en el encabezado en todo momento
- Zona Financiera visualmente diferenciada dentro de la misma navegación
- Feedback inmediato en operaciones: indicadores de carga, mensajes de éxito y error claros

### NFR-08 — Mantenibilidad

- Clean Architecture en capas (Domain / Application / Infrastructure / Presentation)
- Sin lógica de negocio en controladores ni en vistas
- Código modular: un cambio en una capa no debe romper las demás
- Parámetros de negocio configurables desde el panel administrativo (sin necesidad de redespliegue)

---

## 10. Marco Legal Mínimo Viable

Para operar la plataforma en su fase inicial, se requieren los siguientes documentos legales publicados en la plataforma:

| Documento | Propósito | Estado |
|---|---|---|
| Términos y Condiciones | Reglas de uso, rifas, premios, devoluciones | Por redactar |
| Política de Privacidad | Tratamiento de datos bajo Ley 1581 de 2012 | Por redactar |
| Política de Juego Responsable | Solo mayores de 18 años | Por redactar |
| Política de Pagos y Retiros | Tiempos, condiciones, causales de rechazo | Por redactar |
| Aviso Legal | Datos del operador: nombre, NIT, contacto | **Bloqueante** |

### Datos del operador pendientes de definir (bloqueantes para publicación)

- [ ] Nombre legal de la empresa operadora
- [ ] NIT
- [ ] Correo oficial de contacto
- [ ] Domicilio legal en Colombia

### Leyes colombianas de cumplimiento inmediato

| Norma | Aplicación |
|---|---|
| Ley 1581 de 2012 (Habeas Data) | Protección de datos personales — **aplica desde ya** |
| Ley 1480 de 2011 (Estatuto del consumidor) | Relación con usuarios, condiciones de uso — **aplica desde ya** |

> Las obligaciones fiscales ante DIAN y la regulación de Coljuegos se abordan en la hoja de ruta futura (sección 14).

---

## 11. Infraestructura Azure

### Arquitectura de despliegue

```
                    ┌─────────────────────┐
                    │   Azure App Service  │
                    │   (Plan B1 / B2)     │
                    │                     │
                    │   Rickoin Platform  │
                    │   (.NET Core MVC)   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Azure SQL Database  │
                    │  (Basic o Standard)  │
                    │   Base de datos      │
                    │   única unificada    │
                    └─────────────────────┘
                    ┌─────────────────────┐
                    │  Azure Key Vault    │
                    │  (secretos y claves)│
                    └─────────────────────┘
                    ┌─────────────────────┐
                    │  SMTP / SendGrid    │
                    │  (notificaciones    │
                    │   por correo)       │
                    └─────────────────────┘
```

### Estimado de costos mensuales (ambiente inicial)

| Recurso | Costo estimado |
|---|---|
| Azure App Service Plan B1 | ~$13–18 USD/mes |
| Azure SQL Database (Basic S0) | ~$5–15 USD/mes |
| Azure Key Vault | ~$1–3 USD/mes |
| SendGrid (tier gratuito inicial) | $0 hasta 100 correos/día |
| Dominio + SSL | ~$1–2 USD/mes |
| **Total estimado** | **~$20–40 USD/mes** |

### Restricciones técnicas de esta fase

| Restricción | Detalle |
|---|---|
| Framework | .NET Core MVC en capas (sin API REST expuesta) |
| Base de datos | SQL Server (Azure SQL Database) |
| Despliegue | Azure App Service |
| Arquitectura | Clean Architecture por capas |
| APIs externas | Ninguna en esta fase (excepto pasarela de pago y SMTP) |
| App móvil | No incluida en esta fase |
| Transferencias entre usuarios | No permitidas |

---

## 12. Roadmap de Desarrollo

### Fase 1 — Fundación: Autenticación e Identidad
- [ ] Registro de usuario con confirmación por email
- [ ] Login, gestión de sesión y expiración
- [ ] Validación de perfil con documento de identidad
- [ ] Roles: Usuario y Administrador
- [ ] Recuperación de contraseña

### Fase 2 — Módulo Financiero: Monedero Rickoin
- [ ] Step-Up Authentication (contraseña o OTP)
- [ ] Vista de saldo y movimientos
- [ ] Compra de Rickoin (integración con pasarela de pago)
- [ ] Solicitud, cancelación y gestión de retiros
- [ ] Historial financiero completo

### Fase 3 — Módulo de Rifas
- [ ] Catálogo de rifas con detalle y progreso
- [ ] Compra de boletas con control de concurrencia
- [ ] Panel administrativo de rifas (CRUD + estados)
- [ ] Historial de boletas por usuario

### Fase 4 — Motor de Sorteos y Premios
- [ ] Catálogo de loterías configurables en panel admin
- [ ] Configuración de lotería + regla de dígitos al crear rifa
- [ ] Job de cierre automático de ventas 3 horas antes del sorteo
- [ ] Registro manual del resultado oficial con audit trail completo
- [ ] Validación automática de boleta ganadora (vendida / no vendida)
- [ ] Reglas de fallback si la boleta ganadora no fue vendida (sin ganador / siguiente disponible)
- [ ] Notificación al ganador con token único de confirmación de recepción
- [ ] Devoluciones automáticas cuando no hay equilibrio
- [ ] Gestión de premios: selección de modalidad por el ganador
- [ ] Vista pública del resultado (sin datos personales del ganador)
- [ ] Estados de rifa completos: Borrador, Activa, En venta, Cerrada, Pendiente de resultado, Ganador encontrado, Premio reclamado, Finalizada, Sin ganador

### Fase 5 — Operación y Estabilidad
- [ ] Sistema de notificaciones por correo completo
- [ ] Reportes internos exportables para el administrador
- [ ] Logs de eventos internos
- [ ] Monitoreo básico y alertas en Azure
- [ ] Pruebas de carga y rendimiento
- [ ] Publicación de documentos legales

---

## 13. Riesgos

### Riesgos técnicos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Condición de carrera en compra de boletas | Alto | Transacciones atómicas en BD |
| Inconsistencia de saldo | Alto | Atomicidad, validación previa, sin saldo negativo |
| Fallo en devolución automática | Alto | Tests de integración, monitoreo de estados de rifa |
| Error en ingreso manual del resultado de lotería | Alto | Audit trail completo + resultado inmutable post-registro; el admin debe verificar la fuente oficial antes de ingresar |
| Job de cierre no se ejecuta antes del sorteo | Alto | Alertas de monitoreo sobre el job; cierre también validado en backend en cada intento de compra |
| Pérdida de sesión durante compra | Medio | Manejo transaccional con rollback automático |

### Riesgos operativos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Retiros aprobados sin fondos reales | Alto | Validación de saldo real antes de aprobar retiro |
| Abuso del sistema por usuarios | Medio | Validación de perfil, bloqueo por comportamiento anómalo |
| Rifas sin demanda suficiente | Medio | Punto de equilibrio como protección automática |

### Riesgos legales (fase actual)

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Datos del operador incompletos | Bloqueante para publicación | Definir nombre legal y NIT antes del lanzamiento |
| Incumplimiento de Ley 1581 | Alto | Implementar Política de Privacidad desde Fase 1 |
| Menores de edad en la plataforma | Medio | Validación de documento de identidad en el perfil |

---

## 14. Preparación Futura para Coljuegos

> Esta sección documenta lo que **no es requisito ahora** pero que la arquitectura actual debe soportar sin rediseño cuando se active.

### Qué es Coljuegos

Coljuegos es el organismo regulador de juegos de suerte y azar en Colombia. Para operar legalmente rifas digitales de forma comercial a gran escala, se requiere:

1. Constituir una empresa con objeto social de juegos de suerte y azar
2. Firmar un contrato de concesión con Coljuegos
3. Certificar la plataforma a través de laboratorios especializados (ej. GLI — Gaming Laboratories International)

### Por qué la arquitectura actual ya lo contempla

La plataforma se construye desde el inicio con los siguientes elementos que Coljuegos exigiría:

| Elemento requerido por Coljuegos | Estado en la arquitectura actual |
|---|---|
| Trazabilidad completa de transacciones | ✅ Incluida como NFR desde Fase 1 |
| Logs de eventos del sistema | ✅ Incluidos en Fase 5, estructura desde Fase 1 |
| Atomicidad y consistencia financiera | ✅ NFR-02 crítico |
| Validación de identidad (KYC) | ✅ Documento de identidad en Fase 1 |
| Sorteo con resultado registrado y auditado | ✅ Resultado oficial de lotería + audit trail — Fase 4 |
| Control de concurrencia en boletas | ✅ NFR-02, RF-04 |
| Mayoría de edad | ✅ Validación en registro |
| Devoluciones automáticas verificables | ✅ RF-08 |

### Qué se deberá agregar cuando aplique Coljuegos

| Elemento | Descripción |
|---|---|
| Aleatoriedad certificable | La plataforma ya usa resultados oficiales de loterías autorizadas. Para Coljuegos podría requerirse adicionalmente integrar una API certificada con los operadores de lotería, o certificar el proceso de validación de número ganador con un auditor externo |
| Reportes para entes de control | Exportación de datos en formatos específicos requeridos por certificadores |
| API de monitoreo | En algunos casos Coljuegos exige integración con sus sistemas de supervisión en tiempo real |
| Auditoría externa | Contratar laboratorio certificador (GLI u homologado) antes de solicitar la concesión |
| Constitución legal | La empresa operadora debe tener el objeto social adecuado y el contrato de concesión firmado |

> **Conclusión:** La arquitectura limpia, la trazabilidad financiera y los logs incluidos desde esta fase son exactamente lo que haría el proceso de certificación futura más rápido y menos costoso. No se necesita construir dos veces.

---

*Documento consolidado Rickoin v3.0 — Alcance de producción inicial sin Coljuegos. Arquitectura preparada para certificación futura.*
