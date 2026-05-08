# RICKOIN — Arquitectura de Base de Datos

> **Motor:** SQL Server (Azure SQL Database)  
> **ORM:** Entity Framework Core (.NET 8) — Code First  
> **Schema:** `dbo` (schema único)  
> **Migraciones:** almacenadas en `Rickoin.Infrastructure/Migrations/`  
> **DbContext:** `RickoinsDbContext` en `Rickoin.Models/Entities/RickoinsEntities/`  
> **Fecha:** Mayo 2026

---

## ÍNDICE

1. [Resumen de tablas](#1-resumen-de-tablas)
2. [Diagrama de relaciones (ERD textual)](#2-diagrama-de-relaciones-erd-textual)
3. [Tablas — definición completa](#3-tablas--definición-completa)
   - [Usuarios](#31-usuarios)
   - [Wallets](#32-wallets)
   - [Transacciones](#33-transacciones)
   - [Retiros](#34-retiros)
   - [Loterias](#35-loterias)
   - [Rifas](#36-rifas)
   - [Boletas](#37-boletas)
   - [ResultadosSorteo](#38-resultadossorteo)
   - [Premios](#39-premios)
   - [ConfiguracionSistema](#310-configuracionsistema)
   - [AuditLogs](#311-auditlogs)
4. [Valores de enums persistidos como NVARCHAR](#4-valores-de-enums-persistidos-como-nvarchar)
5. [Índices por tabla](#5-índices-por-tabla)
6. [Reglas de integridad referencial](#6-reglas-de-integridad-referencial)
7. [Tablas inmutables — solo INSERT](#7-tablas-inmutables--solo-insert)
8. [Convenciones de nomenclatura SQL](#8-convenciones-de-nomenclatura-sql)
9. [Seed data inicial](#9-seed-data-inicial)
10. [Script DDL — migración inicial](#10-script-ddl--migración-inicial)

---

## 1. Resumen de tablas

| # | Tabla | Filas estimadas (12 meses) | Crece con | Inmutable |
|---|---|---|---|---|
| 1 | `Usuarios` | ~5.000 | Registros | No |
| 2 | `Wallets` | ~10.000 | Usuarios × 2 (Rickoin + Fichas) | No |
| 3 | `Transacciones` | ~500.000 | Cada operación financiera | **Sí** |
| 4 | `Retiros` | ~10.000 | Solicitudes de retiro | No |
| 5 | `Loterias` | ~20 | Altas manuales | No |
| 6 | `Rifas` | ~500 | Rifas creadas | No |
| 7 | `Boletas` | ~200.000 | Boletas por rifa | No |
| 8 | `ResultadosSorteo` | ~500 | 1 por rifa finalizada | **Sí** |
| 9 | `Premios` | ~500 | 1 por ganador | No |
| 10 | `ConfiguracionSistema` | ~20 | Parámetros globales | No |
| 11 | `AuditLogs` | ~2.000.000 | Todos los eventos del sistema | **Sí** |

**Total tablas: 11**

---

## 2. Diagrama de relaciones (ERD textual)

```
Usuarios ──────────────┬──── Wallets (1:2, un usuario tiene 2 wallets)
    │                  │
    │                  └──── Transacciones (1:N)
    │
    ├──── Retiros (1:N)
    │
    ├──── Boletas (1:N — boletas asignadas al usuario)
    │
    └──── AuditLogs (1:N — eventos del usuario)


Loterias ──── Rifas (1:N — una lotería se usa en muchas rifas)


Rifas ─────────────────┬──── Boletas (1:N — N boletas por rifa)
    │                  │
    │                  └──── ResultadosSorteo (1:1 — un resultado por rifa)
    │
    └──── Premios (1:1 — un premio por rifa, se crea al encontrar ganador)


Boletas ───────────────┬──── ResultadosSorteo (0:1 — boleta ganadora opcional)
                       └──── Premios (0:1 — la boleta del ganador)


ConfiguracionSistema   →  tabla independiente (clave/valor)
AuditLogs              →  tabla de auditoría independiente
```

### Cardinalidades clave

| Relación | Tipo | Nota |
|---|---|---|
| `Usuarios` → `Wallets` | 1:2 (exactamente) | Siempre un registro Rickoin y uno Fichas |
| `Usuarios` → `Transacciones` | 1:N | Historial inmutable completo |
| `Usuarios` → `Retiros` | 1:N | Una persona puede tener varios retiros en distintos estados |
| `Loterias` → `Rifas` | 1:N | Una lotería se puede usar en varias rifas |
| `Rifas` → `Boletas` | 1:N | Al publicar una rifa se generan N filas en `Boletas` |
| `Rifas` → `ResultadosSorteo` | 1:0..1 | Existe solo tras registrar el resultado |
| `Rifas` → `Premios` | 1:0..1 | Existe solo si se encontró ganador |
| `Boletas` → `ResultadosSorteo` | 0..1:0..1 | La boleta ganadora referencia el resultado (y puede ser NULL) |

---

## 3. Tablas — definición completa

### 3.1 Usuarios

**Descripción:** Personas registradas en la plataforma. Incluye campos de autenticación, estado de cuenta, OTP embebido (sin tabla separada) y control de bloqueo.

| Columna | Tipo SQL | Nullable | PK/FK/UK | Descripción |
|---|---|---|---|---|
| `Id` | `UNIQUEIDENTIFIER` | NOT NULL | **PK** | Identificador único — `NEWSEQUENTIALID()` |
| `NombreCompleto` | `NVARCHAR(200)` | NOT NULL | — | Nombre completo del usuario |
| `Email` | `NVARCHAR(256)` | NOT NULL | **UK** | Correo electrónico — único en el sistema |
| `PasswordHash` | `VARBINARY(64)` | NOT NULL | — | Hash HMACSHA512 (64 bytes) |
| `PasswordSalt` | `VARBINARY(128)` | NOT NULL | — | Salt HMACSHA512 (128 bytes) |
| `Estado` | `NVARCHAR(20)` | NOT NULL | — | `EstadoUsuario`: Visitante \| PendienteOtp \| Observador \| Activo \| Bloqueado |
| `Rol` | `NVARCHAR(20)` | NOT NULL | — | `Usuario` \| `Administrador` — DEFAULT `'Usuario'` |
| `CodigoOtp` | `NVARCHAR(6)` | NULL | — | Código OTP activo (registro o step-up) |
| `OtpExpiracion` | `DATETIME2` | NULL | — | Expiración del OTP activo |
| `TokenRecuperacion` | `NVARCHAR(100)` | NULL | — | Token de un solo uso para recuperar contraseña |
| `TokenRecuperacionExp` | `DATETIME2` | NULL | — | Expiración del token de recuperación |
| `TokenRecuperacionUsado` | `BIT` | NOT NULL | — | DEFAULT `0` — marca el token como ya usado |
| `DocumentoPdfEnviadoEn` | `DATETIME2` | NULL | — | Cuando se envió el PDF al admin por primera vez |
| `IntentosFallidosLogin` | `INT` | NOT NULL | — | DEFAULT `0` — contador de intentos fallidos consecutivos |
| `BloqueadoHasta` | `DATETIME2` | NULL | — | Timestamp hasta el que la cuenta está bloqueada |
| `CreadoEn` | `DATETIME2` | NOT NULL | — | DEFAULT `SYSUTCDATETIME()` |
| `ActualizadoEn` | `DATETIME2` | NOT NULL | — | DEFAULT `SYSUTCDATETIME()` — actualizado en cada cambio |

**Restricciones:**
- `UK_Usuarios_Email` → `Email` único
- `CK_Usuarios_Estado` → `Estado IN ('Visitante','PendienteOtp','Observador','Activo','Bloqueado')`
- `CK_Usuarios_Rol` → `Rol IN ('Usuario','Administrador')`
- `IntentosFallidosLogin >= 0`

---

### 3.2 Wallets

**Descripción:** Saldo de cada tipo de moneda por usuario. Un usuario tiene exactamente **dos registros**: uno `Rickoin` y uno `Fichas`. La restricción de exactamente dos registros se garantiza a nivel de aplicación (`MonederoService`) y mediante un índice único compuesto.

| Columna | Tipo SQL | Nullable | PK/FK/UK | Descripción |
|---|---|---|---|---|
| `Id` | `UNIQUEIDENTIFIER` | NOT NULL | **PK** | Identificador único |
| `UsuarioId` | `UNIQUEIDENTIFIER` | NOT NULL | **FK** → `Usuarios.Id` | Propietario del wallet |
| `Tipo` | `NVARCHAR(20)` | NOT NULL | — | `TipoWallet`: `Rickoin` \| `Fichas` |
| `Saldo` | `DECIMAL(18,4)` | NOT NULL | — | DEFAULT `0.0000` — nunca negativo |
| `ActualizadoEn` | `DATETIME2` | NOT NULL | — | DEFAULT `SYSUTCDATETIME()` |

**Restricciones:**
- `UK_Wallets_UsuarioId_Tipo` → `(UsuarioId, Tipo)` único — garantiza máx. 1 wallet por tipo por usuario
- `CK_Wallets_Saldo` → `Saldo >= 0`
- `CK_Wallets_Tipo` → `Tipo IN ('Rickoin','Fichas')`
- FK con `ON DELETE RESTRICT`

---

### 3.3 Transacciones

**Descripción:** Historial **inmutable** de todos los movimientos de saldo. Solo se insertan filas — nunca se actualizan ni eliminan. Cada operación financiera (compra, retiro, boleta, devolución) genera una o más filas.

| Columna | Tipo SQL | Nullable | PK/FK/UK | Descripción |
|---|---|---|---|---|
| `Id` | `UNIQUEIDENTIFIER` | NOT NULL | **PK** | Identificador único |
| `UsuarioId` | `UNIQUEIDENTIFIER` | NOT NULL | **FK** → `Usuarios.Id` | Usuario al que pertenece el movimiento |
| `TipoWallet` | `NVARCHAR(20)` | NOT NULL | — | `TipoWallet`: `Rickoin` \| `Fichas` |
| `Tipo` | `NVARCHAR(30)` | NOT NULL | — | `TipoTransaccion`: Compra \| Retiro \| Boleta \| Devolucion \| AsignacionFichas |
| `Monto` | `DECIMAL(18,4)` | NOT NULL | — | Monto de la operación — siempre positivo |
| `Direccion` | `NVARCHAR(10)` | NOT NULL | — | `'credito'` o `'debito'` |
| `ReferenciaId` | `UNIQUEIDENTIFIER` | NULL | — | ID de la entidad origen (Retiro, Rifa, Boleta, etc.) |
| `TasaConversion` | `DECIMAL(18,4)` | NULL | — | Tasa COP→Rickoin vigente al momento de la operación (inmutable) |
| `Descripcion` | `NVARCHAR(500)` | NULL | — | Texto descriptivo legible del movimiento |
| `CreadoEn` | `DATETIME2` | NOT NULL | — | DEFAULT `SYSUTCDATETIME()` — timestamp inmutable |

**Restricciones:**
- `CK_Transacciones_Monto` → `Monto > 0`
- `CK_Transacciones_Direccion` → `Direccion IN ('credito','debito')`
- FK `UsuarioId` con `ON DELETE RESTRICT`
- **Sin UPDATE, sin DELETE** — inmutabilidad garantizada por diseño del repositorio

---

### 3.4 Retiros

**Descripción:** Solicitudes de retiro de Rickoin a dinero real. Ciclo de vida: `Pendiente → Aprobado | Rechazado | Fallido | Cancelado`. Los datos bancarios **no se persisten** en la base de datos — se envían solo por correo al admin.

| Columna | Tipo SQL | Nullable | PK/FK/UK | Descripción |
|---|---|---|---|---|
| `Id` | `UNIQUEIDENTIFIER` | NOT NULL | **PK** | Identificador único |
| `UsuarioId` | `UNIQUEIDENTIFIER` | NOT NULL | **FK** → `Usuarios.Id` | Usuario que solicita el retiro |
| `MontoRickoin` | `DECIMAL(18,4)` | NOT NULL | — | Monto solicitado en Rickoin |
| `MontoCop` | `DECIMAL(18,2)` | NOT NULL | — | Equivalente en COP calculado con la tasa vigente al momento |
| `TasaAplicada` | `DECIMAL(18,4)` | NOT NULL | — | Tasa Rickoin→COP vigente al momento del retiro (inmutable) |
| `Estado` | `NVARCHAR(20)` | NOT NULL | — | `EstadoRetiro`: Pendiente \| Aprobado \| Rechazado \| Fallido \| Cancelado |
| `MotivoRechazo` | `NVARCHAR(1000)` | NULL | — | Obligatorio si `Estado = 'Rechazado'` |
| `SolicitudEn` | `DATETIME2` | NOT NULL | — | DEFAULT `SYSUTCDATETIME()` — timestamp de la solicitud |
| `GestionadoEn` | `DATETIME2` | NULL | — | Cuando el admin tomó acción |
| `GestionadoPorAdminId` | `UNIQUEIDENTIFIER` | NULL | **FK** → `Usuarios.Id` | Admin que gestionó el retiro |

**Restricciones:**
- `CK_Retiros_MontoRickoin` → `MontoRickoin > 0`
- `CK_Retiros_Estado` → `Estado IN ('Pendiente','Aprobado','Rechazado','Fallido','Cancelado')`
- FK `UsuarioId` y `GestionadoPorAdminId` con `ON DELETE RESTRICT`

---

### 3.5 Loterias

**Descripción:** Catálogo de loterías colombianas autorizadas que el sistema puede usar como base para los sorteos. Gestionado por el administrador.

| Columna | Tipo SQL | Nullable | PK/FK/UK | Descripción |
|---|---|---|---|---|
| `Id` | `UNIQUEIDENTIFIER` | NOT NULL | **PK** | Identificador único |
| `Nombre` | `NVARCHAR(200)` | NOT NULL | **UK** | Nombre oficial de la lotería (ej: "Lotería de Bogotá") |
| `DiaSorteo` | `NVARCHAR(20)` | NOT NULL | — | Día habitual de sorteo: `'Lunes'`, `'Jueves'`, `'Sabado'`, etc. |
| `Activa` | `BIT` | NOT NULL | — | DEFAULT `1` — si está disponible para asignar a nuevas rifas |
| `CreadoEn` | `DATETIME2` | NOT NULL | — | DEFAULT `SYSUTCDATETIME()` |

---

### 3.6 Rifas

**Descripción:** Rifas creadas por el administrador. Contiene todos los parámetros de configuración del sorteo (sin tabla separada `RaffleDrawConfig` — todo está en esta tabla). Las imágenes se referencian por URL externa, no se almacenan.

| Columna | Tipo SQL | Nullable | PK/FK/UK | Descripción |
|---|---|---|---|---|
| `Id` | `UNIQUEIDENTIFIER` | NOT NULL | **PK** | Identificador único |
| `Titulo` | `NVARCHAR(300)` | NOT NULL | — | Nombre del artículo en rifa |
| `Descripcion` | `NVARCHAR(2000)` | NULL | — | Descripción detallada del artículo |
| `ImagenUrl` | `NVARCHAR(2000)` | NULL | — | URL externa de la imagen (Google Drive, CDN, etc.) — opcional |
| `ValorEstimadoCop` | `DECIMAL(18,2)` | NOT NULL | — | Valor comercial del artículo en COP |
| `PrecioBoleta` | `DECIMAL(18,4)` | NOT NULL | — | Precio de cada boleta en Rickoin |
| `TotalBoletas` | `INT` | NOT NULL | — | Total de boletas de la rifa |
| `PuntoEquilibrio` | `INT` | NOT NULL | — | Mínimo de boletas vendidas para que el sorteo sea válido |
| `MaxBoletasPorUsuario` | `INT` | NOT NULL | — | DEFAULT del config global — máx boletas por persona en esta rifa |
| `Estado` | `NVARCHAR(30)` | NOT NULL | — | `EstadoRifa`: Borrador \| Activa \| Cerrada \| PendienteResultado \| GanadorEncontrado \| PremioReclamado \| Finalizada \| SinGanador \| Cancelada |
| `LoteriaId` | `UNIQUEIDENTIFIER` | NOT NULL | **FK** → `Loterias.Id` | Lotería colombiana asociada |
| `ReglaDigitos` | `NVARCHAR(20)` | NOT NULL | — | Regla de extracción: `'3_ultimos'` \| `'4_ultimos'` \| `'2_ultimos'` |
| `ReglaFallback` | `NVARCHAR(30)` | NOT NULL | — | `ReglaFallback`: `SinGanador` \| `SiguienteDisponible` |
| `FechaHoraSorteo` | `DATETIME2` | NOT NULL | — | Fecha y hora del sorteo oficial (hora Colombia UTC-5) |
| `CierreVentasEn` | `DATETIME2` | NOT NULL | — | Calculado: `FechaHoraSorteo - 3 horas` — no editable |
| `CreadoPorAdminId` | `UNIQUEIDENTIFIER` | NOT NULL | **FK** → `Usuarios.Id` | Admin que creó la rifa |
| `CreadoEn` | `DATETIME2` | NOT NULL | — | DEFAULT `SYSUTCDATETIME()` |
| `ActualizadoEn` | `DATETIME2` | NOT NULL | — | DEFAULT `SYSUTCDATETIME()` |

**Restricciones:**
- `CK_Rifas_Equilibrio` → `PuntoEquilibrio <= TotalBoletas`
- `CK_Rifas_PrecioBoleta` → `PrecioBoleta > 0`
- `CK_Rifas_TotalBoletas` → `TotalBoletas > 0`
- `CK_Rifas_Estado` → `Estado IN ('Borrador','Activa','Cerrada','PendienteResultado','GanadorEncontrado','PremioReclamado','Finalizada','SinGanador','Cancelada')`
- `CK_Rifas_CierreVentas` → `CierreVentasEn < FechaHoraSorteo`
- FK `LoteriaId` y `CreadoPorAdminId` con `ON DELETE RESTRICT`

---

### 3.7 Boletas

**Descripción:** Al **publicar** una rifa, el sistema genera automáticamente N filas en esta tabla (una por cada número de boleta disponible), todas en estado `Disponible`. Al comprarse, `UsuarioId` se asigna y el estado cambia a `Vendida`.

| Columna | Tipo SQL | Nullable | PK/FK/UK | Descripción |
|---|---|---|---|---|
| `Id` | `UNIQUEIDENTIFIER` | NOT NULL | **PK** | Identificador único |
| `RifaId` | `UNIQUEIDENTIFIER` | NOT NULL | **FK** → `Rifas.Id` | Rifa a la que pertenece la boleta |
| `NumeroBoleta` | `INT` | NOT NULL | — | Número secuencial de la boleta dentro de la rifa (1 a N) |
| `UsuarioId` | `UNIQUEIDENTIFIER` | NULL | **FK** → `Usuarios.Id` | NULL mientras la boleta está disponible; se asigna al comprar |
| `Estado` | `NVARCHAR(20)` | NOT NULL | — | `Disponible` \| `Vendida` \| `Devuelta` |
| `TipoWalletUsado` | `NVARCHAR(20)` | NULL | — | `Rickoin` \| `Fichas` \| `Mixto` — registrado al comprar |
| `CompradaEn` | `DATETIME2` | NULL | — | Timestamp de la compra |

**Restricciones:**
- `UK_Boletas_RifaId_NumeroBoleta` → `(RifaId, NumeroBoleta)` único
- `CK_Boletas_Estado` → `Estado IN ('Disponible','Vendida','Devuelta')`
- `CK_Boletas_Consistencia` → si `Estado = 'Vendida'` entonces `UsuarioId IS NOT NULL`
- FK `RifaId` y `UsuarioId` con `ON DELETE RESTRICT`

> **Bloqueo pesimista:** La asignación de boletas usa `SELECT TOP N ... WITH (UPDLOCK, ROWLOCK)` dentro de una transacción explícita para prevenir doble asignación en alta concurrencia.

---

### 3.8 ResultadosSorteo

**Descripción:** Resultado oficial del sorteo registrado por el administrador. Tabla **inmutable** — solo INSERT. Contiene el audit trail completo del acto de registro.

| Columna | Tipo SQL | Nullable | PK/FK/UK | Descripción |
|---|---|---|---|---|
| `Id` | `UNIQUEIDENTIFIER` | NOT NULL | **PK** | Identificador único |
| `RifaId` | `UNIQUEIDENTIFIER` | NOT NULL | **FK** → `Rifas.Id` | Rifa a la que corresponde el resultado |
| `ResultadoOficial` | `NVARCHAR(20)` | NOT NULL | — | Número completo publicado por la lotería (ej: `"4521"`) |
| `NumeroGanadorCalculado` | `NVARCHAR(10)` | NOT NULL | — | Número ganador extraído según `ReglaDigitos` (ej: `"521"`) |
| `BoletaGanadoraId` | `UNIQUEIDENTIFIER` | NULL | **FK** → `Boletas.Id` | Boleta con ese número — NULL si no fue vendida |
| `UsuarioGanadorId` | `UNIQUEIDENTIFIER` | NULL | **FK** → `Usuarios.Id` | Usuario ganador — NULL si no hay ganador |
| `FallbackAplicado` | `BIT` | NOT NULL | — | DEFAULT `0` — indica si se aplicó la regla de fallback |
| `NotaFallback` | `NVARCHAR(1000)` | NULL | — | Explicación pública si se aplicó fallback |
| `RegistradoPorAdminId` | `UNIQUEIDENTIFIER` | NOT NULL | **FK** → `Usuarios.Id` | Admin que registró el resultado |
| `RegistradoEn` | `DATETIME2` | NOT NULL | — | DEFAULT `SYSUTCDATETIME()` — timestamp exacto inmutable |
| `IpAdmin` | `NVARCHAR(50)` | NOT NULL | — | Dirección IP del administrador en el momento del registro |

**Restricciones:**
- `UK_ResultadosSorteo_RifaId` → `RifaId` único — una rifa solo puede tener un resultado
- FK todas con `ON DELETE RESTRICT`
- **Sin UPDATE, sin DELETE** — inmutabilidad garantizada por diseño del repositorio

---

### 3.9 Premios

**Descripción:** Selección de modalidad de premio por el ganador. Se crea una fila cuando el estado de la rifa cambia a `GanadorEncontrado`. Incluye el token de un solo uso para que el ganador reclame su premio.

| Columna | Tipo SQL | Nullable | PK/FK/UK | Descripción |
|---|---|---|---|---|
| `Id` | `UNIQUEIDENTIFIER` | NOT NULL | **PK** | Identificador único |
| `RifaId` | `UNIQUEIDENTIFIER` | NOT NULL | **FK** → `Rifas.Id` | Rifa ganada |
| `UsuarioGanadorId` | `UNIQUEIDENTIFIER` | NOT NULL | **FK** → `Usuarios.Id` | Usuario ganador |
| `BoletaId` | `UNIQUEIDENTIFIER` | NOT NULL | **FK** → `Boletas.Id` | Boleta ganadora |
| `TokenReclamacion` | `NVARCHAR(100)` | NOT NULL | **UK** | Token de un solo uso enviado al ganador por correo |
| `TokenExpiracion` | `DATETIME2` | NOT NULL | — | Expiración del token — DEFAULT `CreadoEn + 5 días` |
| `TokenUsado` | `BIT` | NOT NULL | — | DEFAULT `0` — se marca `1` al hacer clic en el enlace |
| `Modalidad` | `NVARCHAR(20)` | NULL | — | `ModalidadPremio`: `Articulo` \| `Rickoin` — NULL hasta que el ganador elija |
| `PorcentajePenalizacion` | `DECIMAL(5,2)` | NULL | — | % de penalización si elige Rickoin (ej: `10.00`) |
| `Estado` | `NVARCHAR(30)` | NOT NULL | — | `PendienteSeleccion` \| `SeleccionRealizada` \| `EnEntrega` \| `Entregado` \| `Expirado` |
| `SeleccionadoEn` | `DATETIME2` | NULL | — | Cuando el ganador eligió la modalidad |
| `EntregadoEn` | `DATETIME2` | NULL | — | Cuando el admin marcó como entregado |
| `EntregadoPorAdminId` | `UNIQUEIDENTIFIER` | NULL | **FK** → `Usuarios.Id` | Admin que confirmó la entrega |
| `CreadoEn` | `DATETIME2` | NOT NULL | — | DEFAULT `SYSUTCDATETIME()` |

**Restricciones:**
- `UK_Premios_RifaId` → `RifaId` único — una rifa solo tiene un registro de premio
- `UK_Premios_TokenReclamacion` → token único en el sistema
- `CK_Premios_Estado` → `Estado IN ('PendienteSeleccion','SeleccionRealizada','EnEntrega','Entregado','Expirado')`
- FK todas con `ON DELETE RESTRICT`

---

### 3.10 ConfiguracionSistema

**Descripción:** Parámetros globales de la plataforma en formato clave/valor. Permite modificar umbrales y comportamientos sin redeploy. Cada clave tiene su tipo declarado para la UI del panel admin.

| Columna | Tipo SQL | Nullable | PK/FK/UK | Descripción |
|---|---|---|---|---|
| `Id` | `INT IDENTITY(1,1)` | NOT NULL | **PK** | Clave numérica autoincremental |
| `Clave` | `NVARCHAR(100)` | NOT NULL | **UK** | Nombre del parámetro — ej: `'TasaConversion'` |
| `Valor` | `NVARCHAR(500)` | NOT NULL | — | Valor como string — parseado en la aplicación |
| `TipoDato` | `NVARCHAR(20)` | NOT NULL | — | `'decimal'` \| `'int'` \| `'bool'` \| `'string'` — para la UI |
| `Descripcion` | `NVARCHAR(500)` | NOT NULL | — | Texto descriptivo para el panel admin |
| `ActualizadoEn` | `DATETIME2` | NOT NULL | — | DEFAULT `SYSUTCDATETIME()` |
| `ActualizadoPorAdminId` | `UNIQUEIDENTIFIER` | NULL | **FK** → `Usuarios.Id` | Admin que realizó el último cambio |

**Parámetros iniciales (seed data):**

| Clave | Valor default | Tipo | Descripción |
|---|---|---|---|
| `TasaConversion` | `1000` | `decimal` | COP por 1 Rickoin |
| `OtpExpiracionMinutos` | `15` | `int` | Minutos de validez del OTP |
| `SesionFinancieraMinutos` | `20` | `int` | Minutos de inactividad antes de expirar la sesión financiera |
| `MaxIntentosFallidosLogin` | `5` | `int` | Intentos fallidos antes del bloqueo |
| `BloqueoLoginMinutos` | `30` | `int` | Duración del bloqueo de cuenta |
| `MaxBoletasPorUsuario` | `10` | `int` | Máximo de boletas por usuario por rifa (valor global por defecto) |
| `PlazoRetiroDias` | `5` | `int` | Días hábiles para cancelar un retiro |
| `PlazoReclamoPremiosDias` | `5` | `int` | Días para que el ganador seleccione su premio |
| `PenalizacionPremioRickoin` | `10` | `decimal` | % de penalización si el ganador elige Rickoin |
| `HorasCierreAnteSorteo` | `3` | `int` | Horas antes del sorteo en que se cierra la venta de boletas |
| `EmailAdmin` | `admin@rickoin.co` | `string` | Destino de los correos de aprobación de usuarios |
| `NombrePlataforma` | `Rickoin` | `string` | Nombre de la plataforma en correos y UI |

---

### 3.11 AuditLogs

**Descripción:** Registro **inmutable** de todos los eventos relevantes del sistema. Solo INSERT. Es la fuente de verdad para trazabilidad, reportes y diagnóstico. Cubre eventos de usuarios, operaciones financieras, rifas, sorteos y configuración.

| Columna | Tipo SQL | Nullable | PK/FK/UK | Descripción |
|---|---|---|---|---|
| `Id` | `BIGINT IDENTITY(1,1)` | NOT NULL | **PK** | Auto-incremental para ordenamiento eficiente |
| `UsuarioId` | `UNIQUEIDENTIFIER` | NULL | — | Usuario que originó el evento (NULL para eventos del sistema) |
| `Accion` | `NVARCHAR(100)` | NOT NULL | — | Código del evento — ver tabla de acciones abajo |
| `EntidadTipo` | `NVARCHAR(50)` | NULL | — | Tipo de entidad afectada: `'Usuario'`, `'Rifa'`, `'Retiro'`, etc. |
| `EntidadId` | `NVARCHAR(100)` | NULL | — | ID de la entidad afectada (string para soportar cualquier tipo de clave) |
| `Detalle` | `NVARCHAR(MAX)` | NULL | — | JSON con los datos específicos del evento |
| `IpOrigen` | `NVARCHAR(50)` | NULL | — | IP del cliente que originó el evento |
| `CreadoEn` | `DATETIME2` | NOT NULL | — | DEFAULT `SYSUTCDATETIME()` — timestamp exacto |

**Acciones registradas:**

| Accion | Contexto |
|---|---|
| `USUARIO_REGISTRADO` | Nuevo registro |
| `OTP_CONFIRMADO` | OTP validado exitosamente |
| `OTP_FALLIDO` | OTP incorrecto |
| `LOGIN_EXITOSO` | Inicio de sesión |
| `LOGIN_FALLIDO` | Credenciales incorrectas |
| `CUENTA_BLOQUEADA` | Bloqueo por intentos |
| `CUENTA_APROBADA` | Admin aprobó la cuenta |
| `CUENTA_RECHAZADA` | Admin rechazó la cuenta |
| `DOCUMENTO_ENVIADO` | PDF enviado al admin |
| `PASSWORD_RECUPERADO` | Contraseña restablecida |
| `STEPUP_EXITOSO` | Step-Up autenticado |
| `COMPRA_RICKOIN` | Rickoin acreditados |
| `RETIRO_SOLICITADO` | Solicitud de retiro creada |
| `RETIRO_APROBADO` | Admin aprobó retiro |
| `RETIRO_RECHAZADO` | Admin rechazó retiro |
| `RETIRO_FALLIDO` | Retiro fallido — saldo restaurado |
| `RETIRO_CANCELADO` | Usuario canceló retiro |
| `FICHAS_ASIGNADAS` | Admin asignó Fichas |
| `RIFA_CREADA` | Nueva rifa en Borrador |
| `RIFA_PUBLICADA` | Rifa pasó a Activa |
| `RIFA_CERRADA` | Cierre manual o automático |
| `RIFA_CANCELADA` | Rifa cancelada — inicia devoluciones |
| `BOLETA_COMPRADA` | Compra de boletas exitosa |
| `DEVOLUCION_BOLETA` | Rickoin devueltos al participante |
| `RESULTADO_REGISTRADO` | Admin ingresó resultado de sorteo |
| `GANADOR_NOTIFICADO` | Correo de premio enviado al ganador |
| `PREMIO_SELECCIONADO` | Ganador eligió modalidad |
| `PREMIO_ENTREGADO` | Admin confirmó entrega |
| `CONFIG_ACTUALIZADA` | Parámetro de sistema modificado |

**Restricciones:**
- **Sin UPDATE, sin DELETE** — inmutabilidad garantizada por diseño
- Sin FK a otras tablas — el log no debe fallar si la entidad referenciada no existe
- `BIGINT` como PK para soportar millones de filas con ordenamiento cronológico eficiente

---

## 4. Valores de enums persistidos como NVARCHAR

Todos los enums se persisten como `NVARCHAR` legible en la base de datos (no como enteros). Esto facilita la auditoría directa en SQL y la legibilidad de los datos en producción.

| Enum C# | Columna(s) | Valores |
|---|---|---|
| `EstadoUsuario` | `Usuarios.Estado` | `Visitante`, `PendienteOtp`, `Observador`, `Activo`, `Bloqueado` |
| `TipoWallet` | `Wallets.Tipo`, `Transacciones.TipoWallet`, `Boletas.TipoWalletUsado` | `Rickoin`, `Fichas` |
| `TipoTransaccion` | `Transacciones.Tipo` | `Compra`, `Retiro`, `Boleta`, `Devolucion`, `AsignacionFichas` |
| `EstadoRifa` | `Rifas.Estado` | `Borrador`, `Activa`, `Cerrada`, `PendienteResultado`, `GanadorEncontrado`, `PremioReclamado`, `Finalizada`, `SinGanador`, `Cancelada` |
| `EstadoRetiro` | `Retiros.Estado` | `Pendiente`, `Aprobado`, `Rechazado`, `Fallido`, `Cancelado` |
| `ReglaFallback` | `Rifas.ReglaFallback` | `SinGanador`, `SiguienteDisponible` |
| `ModalidadPremio` | `Premios.Modalidad` | `Articulo`, `Rickoin` |

---

## 5. Índices por tabla

| Tabla | Índice | Columnas | Tipo | Justificación |
|---|---|---|---|---|
| `Usuarios` | `IX_Usuarios_Email` | `Email` | Único | Login y verificación de duplicados |
| `Usuarios` | `IX_Usuarios_Estado` | `Estado` | No único | Filtro de pendientes en panel admin |
| `Wallets` | `UK_Wallets_UsuarioId_Tipo` | `(UsuarioId, Tipo)` | Único | Garantiza 1 wallet por tipo por usuario |
| `Transacciones` | `IX_Transacciones_UsuarioId` | `UsuarioId` | No único | Historial por usuario |
| `Transacciones` | `IX_Transacciones_CreadoEn` | `CreadoEn` | No único | Ordenamiento cronológico |
| `Transacciones` | `IX_Transacciones_UsuarioId_TipoWallet` | `(UsuarioId, TipoWallet)` | No único | Historial filtrado por moneda |
| `Retiros` | `IX_Retiros_UsuarioId` | `UsuarioId` | No único | Historial de retiros por usuario |
| `Retiros` | `IX_Retiros_Estado` | `Estado` | No único | Lista de pendientes en panel admin |
| `Rifas` | `IX_Rifas_Estado` | `Estado` | No único | Catálogo de rifas activas |
| `Rifas` | `IX_Rifas_CierreVentasEn` | `CierreVentasEn` | No único | Job de cierre automático (corre cada 15 min) |
| `Boletas` | `UK_Boletas_RifaId_NumeroBoleta` | `(RifaId, NumeroBoleta)` | Único | Garantiza números únicos por rifa |
| `Boletas` | `IX_Boletas_RifaId_Estado` | `(RifaId, Estado)` | No único | Boletas disponibles para compra / UPDLOCK |
| `Boletas` | `IX_Boletas_UsuarioId` | `UsuarioId` | No único | Boletas por usuario |
| `ResultadosSorteo` | `UK_ResultadosSorteo_RifaId` | `RifaId` | Único | Una rifa = un resultado |
| `Premios` | `UK_Premios_RifaId` | `RifaId` | Único | Una rifa = un premio |
| `Premios` | `UK_Premios_TokenReclamacion` | `TokenReclamacion` | Único | Token único en el sistema |
| `ConfiguracionSistema` | `UK_ConfiguracionSistema_Clave` | `Clave` | Único | Acceso por clave |
| `AuditLogs` | `IX_AuditLogs_UsuarioId` | `UsuarioId` | No único | Logs por usuario |
| `AuditLogs` | `IX_AuditLogs_Accion` | `Accion` | No único | Filtro por tipo de evento |
| `AuditLogs` | `IX_AuditLogs_CreadoEn` | `CreadoEn` | No único | Ordenamiento cronológico |
| `AuditLogs` | `IX_AuditLogs_EntidadTipo_EntidadId` | `(EntidadTipo, EntidadId)` | No único | Logs de una entidad específica |

---

## 6. Reglas de integridad referencial

**Regla global:** todas las FK usan `ON DELETE RESTRICT` — nunca cascadas. La integridad referencial se protege; si una entidad referenciada se elimina por error, la operación falla explícitamente.

```
Usuarios ←── Wallets.UsuarioId                    RESTRICT
Usuarios ←── Transacciones.UsuarioId              RESTRICT
Usuarios ←── Retiros.UsuarioId                    RESTRICT
Usuarios ←── Retiros.GestionadoPorAdminId         RESTRICT
Usuarios ←── Boletas.UsuarioId                    RESTRICT
Usuarios ←── ResultadosSorteo.UsuarioGanadorId    RESTRICT
Usuarios ←── ResultadosSorteo.RegistradoPorAdminId RESTRICT
Usuarios ←── Premios.UsuarioGanadorId             RESTRICT
Usuarios ←── Premios.EntregadoPorAdminId          RESTRICT
Usuarios ←── Rifas.CreadoPorAdminId               RESTRICT
Usuarios ←── ConfiguracionSistema.ActualizadoPorAdminId RESTRICT

Loterias ←── Rifas.LoteriaId                      RESTRICT

Rifas ←── Boletas.RifaId                          RESTRICT
Rifas ←── ResultadosSorteo.RifaId                 RESTRICT
Rifas ←── Premios.RifaId                          RESTRICT

Boletas ←── ResultadosSorteo.BoletaGanadoraId     RESTRICT
Boletas ←── Premios.BoletaId                      RESTRICT
```

> `AuditLogs` **no tiene FK** hacia ninguna tabla — el registro de auditoría nunca debe fallar por una FK inválida.

---

## 7. Tablas inmutables — solo INSERT

Tres tablas del sistema son de **solo escritura**: una vez insertado un registro, no puede ser modificado ni eliminado. Esta inmutabilidad se garantiza a dos niveles:

1. **Repositorio:** las interfaces en `Rickoin.Domain` no exponen métodos `Actualizar()` ni `Eliminar()` para estas tablas.
2. **Base de datos:** se pueden aplicar permisos `DENY UPDATE, DELETE ON Transacciones TO AppUser` en producción.

| Tabla | Razón |
|---|---|
| `Transacciones` | Historial financiero — cualquier modificación sería una alteración fraudulenta |
| `ResultadosSorteo` | Resultado del sorteo — inmutabilidad es la garantía de transparencia ante los participantes |
| `AuditLogs` | Registro de auditoría — modificar los logs destruye la cadena de trazabilidad |

---

## 8. Convenciones de nomenclatura SQL

| Elemento | Convención | Ejemplo |
|---|---|---|
| Tablas | PascalCase, plural | `Usuarios`, `ResultadosSorteo` |
| Columnas | PascalCase | `PasswordHash`, `CierreVentasEn` |
| Claves primarias | `Id` | `Id UNIQUEIDENTIFIER` |
| Claves foráneas | `{Entidad}Id` | `UsuarioId`, `RifaId` |
| Índices únicos | `UK_{Tabla}_{Campo(s)}` | `UK_Wallets_UsuarioId_Tipo` |
| Índices no únicos | `IX_{Tabla}_{Campo(s)}` | `IX_Transacciones_CreadoEn` |
| Check constraints | `CK_{Tabla}_{Campo}` | `CK_Rifas_Equilibrio` |
| Timestamps de creación | `CreadoEn` | `DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()` |
| Timestamps de actualización | `ActualizadoEn` | `DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()` |
| Enums | `NVARCHAR` con `CHECK CONSTRAINT` | `Estado NVARCHAR(20) CHECK (Estado IN (...))` |
| Montos financieros | `DECIMAL(18,4)` | `Saldo DECIMAL(18,4)` |
| Montos en COP | `DECIMAL(18,2)` | `MontoCop DECIMAL(18,2)` |
| Identificadores de entidad | `UNIQUEIDENTIFIER` | `Id UNIQUEIDENTIFIER DEFAULT NEWSEQUENTIALID()` |

---

## 9. Seed data inicial

La migración inicial incluye los siguientes datos de base:

### Administrador del sistema

```sql
INSERT INTO Usuarios (Id, NombreCompleto, Email, PasswordHash, PasswordSalt, Estado, Rol, CreadoEn, ActualizadoEn)
VALUES (NEWID(), 'Administrador Rickoin', 'admin@rickoin.co',
        /* Hash generado con PasswordHelper.CrearHash("contraseña-inicial") */,
        /* Salt correspondiente */,
        'Activo', 'Administrador', SYSUTCDATETIME(), SYSUTCDATETIME());
-- ⚠ La contraseña inicial debe cambiarse en el primer acceso
```

### Configuración del sistema

```sql
INSERT INTO ConfiguracionSistema (Clave, Valor, TipoDato, Descripcion, ActualizadoEn) VALUES
('TasaConversion',           '1000',          'decimal', 'COP por 1 Rickoin',                          SYSUTCDATETIME()),
('OtpExpiracionMinutos',     '15',            'int',     'Minutos de validez del OTP',                 SYSUTCDATETIME()),
('SesionFinancieraMinutos',  '20',            'int',     'Timeout de sesión financiera por inactividad',SYSUTCDATETIME()),
('MaxIntentosFallidosLogin', '5',             'int',     'Intentos fallidos antes del bloqueo',        SYSUTCDATETIME()),
('BloqueoLoginMinutos',      '30',            'int',     'Minutos de bloqueo de cuenta',               SYSUTCDATETIME()),
('MaxBoletasPorUsuario',     '10',            'int',     'Máximo de boletas por usuario por rifa',     SYSUTCDATETIME()),
('PlazoRetiroDias',          '5',             'int',     'Días para cancelar un retiro',               SYSUTCDATETIME()),
('PlazoReclamoPremiosDias',  '5',             'int',     'Días para reclamar el premio',               SYSUTCDATETIME()),
('PenalizacionPremioRickoin','10',            'decimal', '% penalización si ganador elige Rickoin',    SYSUTCDATETIME()),
('HorasCierreAnteSorteo',   '3',             'int',     'Horas antes del sorteo que se cierran ventas',SYSUTCDATETIME()),
('EmailAdmin',              'admin@rickoin.co','string', 'Destino de correos de aprobación',           SYSUTCDATETIME()),
('NombrePlataforma',        'Rickoin',        'string',  'Nombre de la plataforma',                   SYSUTCDATETIME());
```

### Loterías colombianas iniciales

```sql
INSERT INTO Loterias (Id, Nombre, DiaSorteo, Activa, CreadoEn) VALUES
(NEWID(), 'Lotería de Bogotá',          'Jueves',  1, SYSUTCDATETIME()),
(NEWID(), 'Lotería Cruz Roja',          'Martes',  1, SYSUTCDATETIME()),
(NEWID(), 'Lotería Baloto',             'Miercoles',1,SYSUTCDATETIME()),
(NEWID(), 'Lotería del Meta',           'Viernes', 1, SYSUTCDATETIME()),
(NEWID(), 'Lotería de Cundinamarca',    'Lunes',   1, SYSUTCDATETIME()),
(NEWID(), 'Lotería del Huila',          'Sabado',  1, SYSUTCDATETIME()),
(NEWID(), 'Lotería de Boyacá',          'Sabado',  1, SYSUTCDATETIME()),
(NEWID(), 'Chance (resultado diario)',  'Diario',  1, SYSUTCDATETIME());
```

---

## 10. Script DDL — migración inicial

> Este script es de **referencia**. En el proyecto, las tablas se crean exclusivamente mediante las migraciones de EF Core (`dotnet ef migrations add InitialCreate`). No ejecutar manualmente en ambientes gestionados por EF Core.

```sql
-- =============================================
-- RICKOIN — Migración Inicial
-- Motor: SQL Server (Azure SQL)
-- =============================================

CREATE TABLE Usuarios (
    Id                      UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    NombreCompleto          NVARCHAR(200)       NOT NULL,
    Email                   NVARCHAR(256)       NOT NULL,
    PasswordHash            VARBINARY(64)       NOT NULL,
    PasswordSalt            VARBINARY(128)      NOT NULL,
    Estado                  NVARCHAR(20)        NOT NULL DEFAULT 'Visitante',
    Rol                     NVARCHAR(20)        NOT NULL DEFAULT 'Usuario',
    CodigoOtp               NVARCHAR(6)         NULL,
    OtpExpiracion           DATETIME2           NULL,
    TokenRecuperacion       NVARCHAR(100)       NULL,
    TokenRecuperacionExp    DATETIME2           NULL,
    TokenRecuperacionUsado  BIT                 NOT NULL DEFAULT 0,
    DocumentoPdfEnviadoEn   DATETIME2           NULL,
    IntentosFallidosLogin   INT                 NOT NULL DEFAULT 0,
    BloqueadoHasta          DATETIME2           NULL,
    CreadoEn                DATETIME2           NOT NULL DEFAULT SYSUTCDATETIME(),
    ActualizadoEn           DATETIME2           NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Usuarios PRIMARY KEY (Id),
    CONSTRAINT UK_Usuarios_Email UNIQUE (Email),
    CONSTRAINT CK_Usuarios_Estado CHECK (Estado IN ('Visitante','PendienteOtp','Observador','Activo','Bloqueado')),
    CONSTRAINT CK_Usuarios_Rol    CHECK (Rol IN ('Usuario','Administrador'))
);

CREATE TABLE Wallets (
    Id              UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    UsuarioId       UNIQUEIDENTIFIER    NOT NULL,
    Tipo            NVARCHAR(20)        NOT NULL,
    Saldo           DECIMAL(18,4)       NOT NULL DEFAULT 0.0000,
    ActualizadoEn   DATETIME2           NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Wallets PRIMARY KEY (Id),
    CONSTRAINT UK_Wallets_UsuarioId_Tipo UNIQUE (UsuarioId, Tipo),
    CONSTRAINT CK_Wallets_Saldo CHECK (Saldo >= 0),
    CONSTRAINT CK_Wallets_Tipo  CHECK (Tipo IN ('Rickoin','Fichas')),
    CONSTRAINT FK_Wallets_Usuarios FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id) ON DELETE NO ACTION
);

CREATE TABLE Transacciones (
    Id              UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    UsuarioId       UNIQUEIDENTIFIER    NOT NULL,
    TipoWallet      NVARCHAR(20)        NOT NULL,
    Tipo            NVARCHAR(30)        NOT NULL,
    Monto           DECIMAL(18,4)       NOT NULL,
    Direccion       NVARCHAR(10)        NOT NULL,
    ReferenciaId    UNIQUEIDENTIFIER    NULL,
    TasaConversion  DECIMAL(18,4)       NULL,
    Descripcion     NVARCHAR(500)       NULL,
    CreadoEn        DATETIME2           NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Transacciones PRIMARY KEY (Id),
    CONSTRAINT CK_Transacciones_Monto     CHECK (Monto > 0),
    CONSTRAINT CK_Transacciones_Direccion CHECK (Direccion IN ('credito','debito')),
    CONSTRAINT FK_Transacciones_Usuarios FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id) ON DELETE NO ACTION
);

CREATE TABLE Retiros (
    Id                      UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    UsuarioId               UNIQUEIDENTIFIER    NOT NULL,
    MontoRickoin            DECIMAL(18,4)       NOT NULL,
    MontoCop                DECIMAL(18,2)       NOT NULL,
    TasaAplicada            DECIMAL(18,4)       NOT NULL,
    Estado                  NVARCHAR(20)        NOT NULL DEFAULT 'Pendiente',
    MotivoRechazo           NVARCHAR(1000)      NULL,
    SolicitudEn             DATETIME2           NOT NULL DEFAULT SYSUTCDATETIME(),
    GestionadoEn            DATETIME2           NULL,
    GestionadoPorAdminId    UNIQUEIDENTIFIER    NULL,
    CONSTRAINT PK_Retiros PRIMARY KEY (Id),
    CONSTRAINT CK_Retiros_MontoRickoin CHECK (MontoRickoin > 0),
    CONSTRAINT CK_Retiros_Estado CHECK (Estado IN ('Pendiente','Aprobado','Rechazado','Fallido','Cancelado')),
    CONSTRAINT FK_Retiros_Usuarios     FOREIGN KEY (UsuarioId)            REFERENCES Usuarios(Id) ON DELETE NO ACTION,
    CONSTRAINT FK_Retiros_AdminGestion FOREIGN KEY (GestionadoPorAdminId) REFERENCES Usuarios(Id) ON DELETE NO ACTION
);

CREATE TABLE Loterias (
    Id          UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    Nombre      NVARCHAR(200)       NOT NULL,
    DiaSorteo   NVARCHAR(20)        NOT NULL,
    Activa      BIT                 NOT NULL DEFAULT 1,
    CreadoEn    DATETIME2           NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Loterias PRIMARY KEY (Id),
    CONSTRAINT UK_Loterias_Nombre UNIQUE (Nombre)
);

CREATE TABLE Rifas (
    Id                  UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    Titulo              NVARCHAR(300)       NOT NULL,
    Descripcion         NVARCHAR(2000)      NULL,
    ImagenUrl           NVARCHAR(2000)      NULL,
    ValorEstimadoCop    DECIMAL(18,2)       NOT NULL,
    PrecioBoleta        DECIMAL(18,4)       NOT NULL,
    TotalBoletas        INT                 NOT NULL,
    PuntoEquilibrio     INT                 NOT NULL,
    MaxBoletasPorUsuario INT                NOT NULL DEFAULT 10,
    Estado              NVARCHAR(30)        NOT NULL DEFAULT 'Borrador',
    LoteriaId           UNIQUEIDENTIFIER    NOT NULL,
    ReglaDigitos        NVARCHAR(20)        NOT NULL,
    ReglaFallback       NVARCHAR(30)        NOT NULL,
    FechaHoraSorteo     DATETIME2           NOT NULL,
    CierreVentasEn      DATETIME2           NOT NULL,
    CreadoPorAdminId    UNIQUEIDENTIFIER    NOT NULL,
    CreadoEn            DATETIME2           NOT NULL DEFAULT SYSUTCDATETIME(),
    ActualizadoEn       DATETIME2           NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Rifas PRIMARY KEY (Id),
    CONSTRAINT CK_Rifas_Equilibrio    CHECK (PuntoEquilibrio <= TotalBoletas),
    CONSTRAINT CK_Rifas_PrecioBoleta  CHECK (PrecioBoleta > 0),
    CONSTRAINT CK_Rifas_TotalBoletas  CHECK (TotalBoletas > 0),
    CONSTRAINT CK_Rifas_CierreVentas  CHECK (CierreVentasEn < FechaHoraSorteo),
    CONSTRAINT CK_Rifas_Estado CHECK (Estado IN ('Borrador','Activa','Cerrada','PendienteResultado',
                                                  'GanadorEncontrado','PremioReclamado','Finalizada',
                                                  'SinGanador','Cancelada')),
    CONSTRAINT FK_Rifas_Loterias    FOREIGN KEY (LoteriaId)         REFERENCES Loterias(Id) ON DELETE NO ACTION,
    CONSTRAINT FK_Rifas_AdminCreador FOREIGN KEY (CreadoPorAdminId) REFERENCES Usuarios(Id) ON DELETE NO ACTION
);

CREATE TABLE Boletas (
    Id              UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    RifaId          UNIQUEIDENTIFIER    NOT NULL,
    NumeroBoleta    INT                 NOT NULL,
    UsuarioId       UNIQUEIDENTIFIER    NULL,
    Estado          NVARCHAR(20)        NOT NULL DEFAULT 'Disponible',
    TipoWalletUsado NVARCHAR(20)        NULL,
    CompradaEn      DATETIME2           NULL,
    CONSTRAINT PK_Boletas PRIMARY KEY (Id),
    CONSTRAINT UK_Boletas_RifaId_NumeroBoleta UNIQUE (RifaId, NumeroBoleta),
    CONSTRAINT CK_Boletas_Estado CHECK (Estado IN ('Disponible','Vendida','Devuelta')),
    CONSTRAINT FK_Boletas_Rifas    FOREIGN KEY (RifaId)    REFERENCES Rifas(Id)    ON DELETE NO ACTION,
    CONSTRAINT FK_Boletas_Usuarios FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id) ON DELETE NO ACTION
);

CREATE TABLE ResultadosSorteo (
    Id                      UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    RifaId                  UNIQUEIDENTIFIER    NOT NULL,
    ResultadoOficial        NVARCHAR(20)        NOT NULL,
    NumeroGanadorCalculado  NVARCHAR(10)        NOT NULL,
    BoletaGanadoraId        UNIQUEIDENTIFIER    NULL,
    UsuarioGanadorId        UNIQUEIDENTIFIER    NULL,
    FallbackAplicado        BIT                 NOT NULL DEFAULT 0,
    NotaFallback            NVARCHAR(1000)      NULL,
    RegistradoPorAdminId    UNIQUEIDENTIFIER    NOT NULL,
    RegistradoEn            DATETIME2           NOT NULL DEFAULT SYSUTCDATETIME(),
    IpAdmin                 NVARCHAR(50)        NOT NULL,
    CONSTRAINT PK_ResultadosSorteo PRIMARY KEY (Id),
    CONSTRAINT UK_ResultadosSorteo_RifaId UNIQUE (RifaId),
    CONSTRAINT FK_ResultadosSorteo_Rifas         FOREIGN KEY (RifaId)               REFERENCES Rifas(Id)    ON DELETE NO ACTION,
    CONSTRAINT FK_ResultadosSorteo_Boleta        FOREIGN KEY (BoletaGanadoraId)     REFERENCES Boletas(Id)  ON DELETE NO ACTION,
    CONSTRAINT FK_ResultadosSorteo_Ganador       FOREIGN KEY (UsuarioGanadorId)     REFERENCES Usuarios(Id) ON DELETE NO ACTION,
    CONSTRAINT FK_ResultadosSorteo_Admin         FOREIGN KEY (RegistradoPorAdminId) REFERENCES Usuarios(Id) ON DELETE NO ACTION
);

CREATE TABLE Premios (
    Id                      UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    RifaId                  UNIQUEIDENTIFIER    NOT NULL,
    UsuarioGanadorId        UNIQUEIDENTIFIER    NOT NULL,
    BoletaId                UNIQUEIDENTIFIER    NOT NULL,
    TokenReclamacion        NVARCHAR(100)       NOT NULL,
    TokenExpiracion         DATETIME2           NOT NULL,
    TokenUsado              BIT                 NOT NULL DEFAULT 0,
    Modalidad               NVARCHAR(20)        NULL,
    PorcentajePenalizacion  DECIMAL(5,2)        NULL,
    Estado                  NVARCHAR(30)        NOT NULL DEFAULT 'PendienteSeleccion',
    SeleccionadoEn          DATETIME2           NULL,
    EntregadoEn             DATETIME2           NULL,
    EntregadoPorAdminId     UNIQUEIDENTIFIER    NULL,
    CreadoEn                DATETIME2           NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Premios PRIMARY KEY (Id),
    CONSTRAINT UK_Premios_RifaId           UNIQUE (RifaId),
    CONSTRAINT UK_Premios_TokenReclamacion UNIQUE (TokenReclamacion),
    CONSTRAINT CK_Premios_Estado CHECK (Estado IN ('PendienteSeleccion','SeleccionRealizada','EnEntrega','Entregado','Expirado')),
    CONSTRAINT FK_Premios_Rifas    FOREIGN KEY (RifaId)             REFERENCES Rifas(Id)    ON DELETE NO ACTION,
    CONSTRAINT FK_Premios_Ganador  FOREIGN KEY (UsuarioGanadorId)   REFERENCES Usuarios(Id) ON DELETE NO ACTION,
    CONSTRAINT FK_Premios_Boleta   FOREIGN KEY (BoletaId)           REFERENCES Boletas(Id)  ON DELETE NO ACTION,
    CONSTRAINT FK_Premios_Admin    FOREIGN KEY (EntregadoPorAdminId) REFERENCES Usuarios(Id) ON DELETE NO ACTION
);

CREATE TABLE ConfiguracionSistema (
    Id                      INT IDENTITY(1,1)   NOT NULL,
    Clave                   NVARCHAR(100)       NOT NULL,
    Valor                   NVARCHAR(500)       NOT NULL,
    TipoDato                NVARCHAR(20)        NOT NULL,
    Descripcion             NVARCHAR(500)       NOT NULL,
    ActualizadoEn           DATETIME2           NOT NULL DEFAULT SYSUTCDATETIME(),
    ActualizadoPorAdminId   UNIQUEIDENTIFIER    NULL,
    CONSTRAINT PK_ConfiguracionSistema PRIMARY KEY (Id),
    CONSTRAINT UK_ConfiguracionSistema_Clave UNIQUE (Clave),
    CONSTRAINT FK_ConfiguracionSistema_Admin FOREIGN KEY (ActualizadoPorAdminId) REFERENCES Usuarios(Id) ON DELETE NO ACTION
);

CREATE TABLE AuditLogs (
    Id          BIGINT IDENTITY(1,1)    NOT NULL,
    UsuarioId   UNIQUEIDENTIFIER        NULL,
    Accion      NVARCHAR(100)           NOT NULL,
    EntidadTipo NVARCHAR(50)            NULL,
    EntidadId   NVARCHAR(100)           NULL,
    Detalle     NVARCHAR(MAX)           NULL,
    IpOrigen    NVARCHAR(50)            NULL,
    CreadoEn    DATETIME2               NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_AuditLogs PRIMARY KEY (Id)
    -- Sin FK intencionalmente — el log no debe depender de otras tablas
);

-- =============================================
-- ÍNDICES
-- =============================================
CREATE INDEX IX_Usuarios_Estado                    ON Usuarios        (Estado);
CREATE INDEX IX_Transacciones_UsuarioId            ON Transacciones   (UsuarioId);
CREATE INDEX IX_Transacciones_CreadoEn             ON Transacciones   (CreadoEn);
CREATE INDEX IX_Transacciones_UsuarioId_TipoWallet ON Transacciones   (UsuarioId, TipoWallet);
CREATE INDEX IX_Retiros_UsuarioId                  ON Retiros         (UsuarioId);
CREATE INDEX IX_Retiros_Estado                     ON Retiros         (Estado);
CREATE INDEX IX_Rifas_Estado                       ON Rifas           (Estado);
CREATE INDEX IX_Rifas_CierreVentasEn               ON Rifas           (CierreVentasEn);
CREATE INDEX IX_Boletas_RifaId_Estado              ON Boletas         (RifaId, Estado);
CREATE INDEX IX_Boletas_UsuarioId                  ON Boletas         (UsuarioId);
CREATE INDEX IX_AuditLogs_UsuarioId                ON AuditLogs       (UsuarioId);
CREATE INDEX IX_AuditLogs_Accion                   ON AuditLogs       (Accion);
CREATE INDEX IX_AuditLogs_CreadoEn                 ON AuditLogs       (CreadoEn);
CREATE INDEX IX_AuditLogs_EntidadTipo_EntidadId    ON AuditLogs       (EntidadTipo, EntidadId);
```

---

*RICKOIN Arquitectura de Base de Datos v1.0 — Mayo 2026 — 11 tablas · SQL Server / Azure SQL*
