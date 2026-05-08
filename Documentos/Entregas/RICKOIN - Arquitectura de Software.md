# RICKOIN — Arquitectura de Software

> **Stack:** ASP.NET Core MVC (.NET 8) · Entity Framework Core · SQL Server · Azure App Service · SendGrid  
> **Patrón:** Arquitectura en capas (7 proyectos) · Sin API REST · Cookie Authentication  
> **Metodología:** Shape Up — 5 ciclos definidos  
> **Fecha:** Mayo 2026

---

## ÍNDICE

1. [Estructura de la Solución](#1-estructura-de-la-solución)
2. [Flujo de Dependencias entre Capas](#2-flujo-de-dependencias-entre-capas)
3. [Capa Constants](#3-capa-constants)
4. [Capa Models](#4-capa-models)
5. [Capa Domain](#5-capa-domain)
6. [Capa Helpers](#6-capa-helpers)
7. [Capa Infrastructure](#7-capa-infrastructure)
8. [Capa Application](#8-capa-application)
9. [Capa Web (Presentación)](#9-capa-web-presentación)
10. [Flujo de una Solicitud HTTP](#10-flujo-de-una-solicitud-http)
11. [Seguridad por Capas](#11-seguridad-por-capas)
12. [Transacciones y Consistencia de Datos](#12-transacciones-y-consistencia-de-datos)
13. [Infraestructura en Azure](#13-infraestructura-en-azure)
14. [Convenciones de Código](#14-convenciones-de-código)

---

## 1. Estructura de la Solución

```
Rickoin.sln
│
├── Rickoin.Web/                          ← Presentación (MVC, Views, ViewModels)
│   ├── Controllers/
│   │   ├── AuthController.cs             → Registro, Login, OTP, Recuperar contraseña
│   │   ├── DashboardController.cs        → Página principal del usuario
│   │   ├── RifasController.cs            → Catálogo, detalle, compra de boletas
│   │   ├── MonederoController.cs         → Saldo, movimientos, compra Rickoin, retiros
│   │   ├── PremiosController.cs          → Confirmación de recepción y selección de premio
│   │   ├── AdminController.cs            → Panel de administración completo
│   │   └── LegalController.cs            → Documentos legales (términos, privacidad, etc.)
│   ├── Views/
│   │   ├── Shared/
│   │   │   ├── _Layout.cshtml            → Layout principal con navbar y saldo en header
│   │   │   ├── _LayoutAdmin.cshtml       → Layout del panel administrativo
│   │   │   ├── _LayoutObserver.cshtml    → Layout modo observador (banner "cuenta en revisión")
│   │   │   └── _ValidationScripts.cshtml
│   │   ├── Auth/
│   │   │   ├── Registro.cshtml
│   │   │   ├── Login.cshtml
│   │   │   ├── ConfirmarOtp.cshtml
│   │   │   ├── RecuperarPassword.cshtml
│   │   │   └── SubirDocumento.cshtml
│   │   ├── Dashboard/
│   │   │   └── Index.cshtml
│   │   ├── Rifas/
│   │   │   ├── Index.cshtml              → Catálogo con progreso y probabilidad
│   │   │   ├── Detalle.cshtml
│   │   │   └── ComprarBoletas.cshtml
│   │   ├── Monedero/
│   │   │   ├── Index.cshtml              → Saldo + historial de movimientos
│   │   │   ├── Verificar.cshtml          → Step-Up Authentication
│   │   │   ├── ComprarRickoin.cshtml
│   │   │   └── SolicitarRetiro.cshtml
│   │   ├── Premios/
│   │   │   └── SeleccionarPremio.cshtml
│   │   ├── Admin/
│   │   │   ├── Dashboard.cshtml
│   │   │   ├── Usuarios/
│   │   │   ├── Rifas/
│   │   │   ├── Sorteos/
│   │   │   ├── Retiros/
│   │   │   ├── Fichas/
│   │   │   ├── Reportes/
│   │   │   ├── Logs/
│   │   │   └── Configuracion/
│   │   └── Legal/
│   │       ├── Terminos.cshtml
│   │       ├── Privacidad.cshtml
│   │       ├── JuegoResponsable.cshtml
│   │       ├── Pagos.cshtml
│   │       └── AvisoLegal.cshtml
│   ├── ViewModels/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Rifas/
│   │   ├── Monedero/
│   │   ├── Admin/
│   │   └── Premios/
│   ├── AutoMapper/
│   │   └── RickoinsAutoMapper.cs         → Perfil único de mapeo (Entidades ↔ DTOs ↔ ViewModels)
│   ├── DependencyContainer/
│   │   └── DependencyContainer.cs        → Centraliza el registro de todas las dependencias
│   ├── Filters/
│   │   ├── RequireActiveAccountFilter.cs → [RequireActiveAccount] — bloquea Observadores
│   │   ├── RequireFinancialSession.cs    → [RequireFinancialSession] — bloquea sin Step-Up
│   │   └── AdminOnlyFilter.cs            → [AdminOnly] — solo rol Administrador
│   ├── Middlewares/
│   │   ├── ExceptionHandlingMiddleware.cs
│   │   └── FinancialSessionMiddleware.cs → Valida y renueva sesión financiera (20 min)
│   └── wwwroot/
│       ├── css/
│       ├── js/
│       └── lib/
│
├── Rickoin.Application/                  ← Lógica de negocio (services e interfaces)
│   ├── Services/
│   │   ├── UsuarioService.cs             → Registro, login, OTP, aprobación/rechazo
│   │   ├── MonederoService.cs            → Saldo, compra Rickoin, retiros, Fichas
│   │   ├── RifaService.cs                → CRUD rifas, compra boletas, devoluciones
│   │   ├── SorteoService.cs              → Registro resultado, validación ganador, fallback
│   │   ├── PremioService.cs              → Notificación, selección de modalidad, entrega
│   │   └── AdminService.cs              → Dashboard, reportes, configuración global
│   ├── Interfaces/
│   │   ├── IUsuarioService.cs
│   │   ├── IMonederoService.cs
│   │   ├── IRifaService.cs
│   │   ├── ISorteoService.cs
│   │   ├── IPremioService.cs
│   │   └── IAdminService.cs
│   └── AccessDependency/
│       └── ApplicationAccessDependency.cs
│
├── Rickoin.Models/                       ← Capa central de modelos (entidades, DTOs, enums, resultados)
│   ├── DTOs/
│   │   ├── Usuario/
│   │   │   ├── UsuarioDto.cs
│   │   │   ├── RegistrarUsuarioDto.cs
│   │   │   ├── LoginDto.cs
│   │   │   └── UsuarioSesionDto.cs
│   │   ├── Monedero/
│   │   │   ├── WalletDto.cs
│   │   │   ├── TransaccionDto.cs
│   │   │   ├── ComprarRickoinDto.cs
│   │   │   └── SolicitarRetiroDto.cs
│   │   ├── Rifa/
│   │   │   ├── RifaDto.cs
│   │   │   ├── RifaListaDto.cs
│   │   │   ├── CrearRifaDto.cs
│   │   │   └── BoletaDto.cs
│   │   ├── Sorteo/
│   │   │   ├── ResultadoSorteoDto.cs
│   │   │   └── RegistrarResultadoDto.cs
│   │   └── Admin/
│   │       ├── DashboardAdminDto.cs
│   │       └── ConfiguracionSistemaDto.cs
│   ├── Entities/
│   │   └── RickoinsEntities/             ← Carpeta nombrada: {NombreProyecto}Entities
│   │       ├── RickoinsDbContext.cs       ← DbContext principal de EF Core
│   │       ├── Configurations/           ← IEntityTypeConfiguration<T> por entidad
│   │       │   ├── UsuarioConfiguration.cs
│   │       │   ├── WalletConfiguration.cs
│   │       │   ├── TransaccionConfiguration.cs
│   │       │   ├── RetiroConfiguration.cs
│   │       │   ├── RifaConfiguration.cs
│   │       │   ├── BoletaConfiguration.cs
│   │       │   ├── LoteriaConfiguration.cs
│   │       │   ├── ResultadoSorteoConfiguration.cs
│   │       │   ├── PremioConfiguration.cs
│   │       │   ├── ConfiguracionSistemaConfiguration.cs
│   │       │   └── AuditLogConfiguration.cs
│   │       ├── Usuario.cs
│   │       ├── Wallet.cs
│   │       ├── Transaccion.cs
│   │       ├── Retiro.cs
│   │       ├── Rifa.cs
│   │       ├── Boleta.cs
│   │       ├── Loteria.cs
│   │       ├── ResultadoSorteo.cs
│   │       ├── Premio.cs
│   │       ├── ConfiguracionSistema.cs
│   │       └── AuditLog.cs
│   ├── Models/
│   │   ├── ResultadoOperacion.cs         ← Contrato de retorno entre Services y Controllers
│   │   └── PaginacionModel.cs
│   └── Enums/
│       ├── EstadoUsuario.cs              ← Visitante, PendienteOtp, Observador, Activo, Bloqueado
│       ├── TipoWallet.cs                 ← Rickoin, Fichas
│       ├── TipoTransaccion.cs            ← Compra, Retiro, Boleta, Devolucion, AsignacionFichas
│       ├── EstadoRifa.cs                 ← Borrador, Activa, Cerrada, PendienteResultado, Finalizada...
│       ├── EstadoRetiro.cs               ← Pendiente, Aprobado, Rechazado, Fallido, Cancelado
│       ├── ModalidadPremio.cs            ← Articulo, Rickoin
│       └── ReglaFallback.cs              ← SinGanador, SiguienteDisponible
│
├── Rickoin.Domain/                       ← Contratos de repositorios (solo interfaces)
│   └── Interfaces/
│       ├── IUsuarioRepository.cs
│       ├── IWalletRepository.cs
│       ├── ITransaccionRepository.cs
│       ├── IRetiroRepository.cs
│       ├── IRifaRepository.cs
│       ├── IBoletaRepository.cs
│       ├── ILoteriaRepository.cs
│       ├── IResultadoSorteoRepository.cs
│       ├── IPremioRepository.cs
│       ├── IConfiguracionSistemaRepository.cs
│       └── IAuditLogRepository.cs
│
├── Rickoin.Infrastructure/               ← Repositorios y migraciones EF Core
│   ├── Repositories/
│   │   ├── UsuarioRepository.cs
│   │   ├── WalletRepository.cs
│   │   ├── TransaccionRepository.cs
│   │   ├── RetiroRepository.cs
│   │   ├── RifaRepository.cs
│   │   ├── BoletaRepository.cs
│   │   ├── LoteriaRepository.cs
│   │   ├── ResultadoSorteoRepository.cs
│   │   ├── PremioRepository.cs
│   │   ├── ConfiguracionSistemaRepository.cs
│   │   └── AuditLogRepository.cs
│   ├── BackgroundJobs/
│   │   └── RifaCierreVentasJob.cs        → IHostedService — corre cada 15 min
│   ├── Migrations/                       ← Generadas por EF Core (DbContext vive en Models)
│   └── AccessDependency/
│       └── InfrastructureAccessDependency.cs
│
├── Rickoin.Helpers/                      ← Utilidades transversales
│   ├── Email/
│   │   ├── IEmailHelper.cs
│   │   ├── EmailHelper.cs                → Implementación con SendGrid SDK
│   │   └── Templates/                   ← 18 plantillas HTML de correo
│   │       ├── otp-registro.html
│   │       ├── otp-stepup.html
│   │       ├── cuenta-aprobada.html
│   │       ├── cuenta-rechazada.html
│   │       ├── documento-revision-admin.html
│   │       ├── recuperar-password.html
│   │       ├── compra-rickoin.html
│   │       ├── compra-boleta.html
│   │       ├── retiro-solicitado.html
│   │       ├── retiro-aprobado.html
│   │       ├── retiro-rechazado.html
│   │       ├── retiro-fallido.html
│   │       ├── retiro-cancelado.html
│   │       ├── rifa-cancelada.html
│   │       ├── resultado-sorteo.html
│   │       ├── ganador-notificacion.html
│   │       ├── asignacion-fichas.html
│   │       └── reenvio-otp.html
│   ├── Security/
│   │   ├── PasswordHelper.cs             → BCrypt — hash y verificación de contraseñas
│   │   ├── IOtpHelper.cs
│   │   └── OtpHelper.cs                  → Generación y validación de códigos OTP
│   ├── Tokens/
│   │   ├── ITokenHelper.cs
│   │   └── TokenHelper.cs                → Tokens de un solo uso (recuperación, premio)
│   └── AccessDependency/
│       └── HelperAccessDependency.cs
│
└── Rickoin.Constants/                    ← Mensajes y constantes globales sin dependencias
    ├── Messages/
    │   ├── UsuarioConstant.cs
    │   ├── MonederoConstant.cs
    │   ├── RifaConstant.cs
    │   ├── SorteoConstant.cs
    │   ├── RetiroConstant.cs
    │   └── EmailConstant.cs
    └── Configuracion/
        └── PaginacionConstant.cs
```

---

## 2. Flujo de Dependencias entre Capas

```
Web  ──────────→  Application  ──────────→  Domain
 ↓                    ↓                       ↓
 ↓                 Helpers                Infrastructure
 ↓                    ↓                       ↓
 └────────────────────────────────────────────┘
            ↓                     ↓
          Models  ←──────────  Constants
```

**Reglas de referencia entre proyectos:**

| Proyecto | Referencia a | Nunca referencia |
|---|---|---|
| `Constants` | — (ninguno) | Todo |
| `Models` | `Constants` (opcional) | `Domain`, `Application`, `Infrastructure`, `Web` |
| `Helpers` | `Models`, `Constants` | `Domain`, `Application`, `Infrastructure`, `Web` |
| `Domain` | `Models` | `Application`, `Infrastructure`, `Web`, `Helpers` |
| `Infrastructure` | `Domain`, `Models` | `Application`, `Web`, `Helpers` |
| `Application` | `Domain`, `Models`, `Helpers`, `Constants` | `Infrastructure`, `Web` |
| `Web` | `Application`, `Models`, `Constants`, `Helpers` (vía interfaces) | `Infrastructure`, `Domain` directamente |

> **Regla de oro:** `Application` nunca referencia `Infrastructure` directamente — solo accede a los repositorios a través de las interfaces definidas en `Domain`. Si `Domain` o `Application` necesitaran referenciar `Infrastructure` o `Web`, eso es una **violación arquitectónica** que se corrige con una interfaz en `Domain` o `Helpers`.

---

## 3. Capa Constants

**Proyecto:** `Rickoin.Constants`  
**Responsabilidad:** Centralizar todos los mensajes de texto, códigos de error y constantes globales. No depende de ningún otro proyecto. Sus clases son estáticas con campos `const string`.

```csharp
// Constants/Messages/UsuarioConstant.cs
public static class UsuarioConstant
{
    public const string CorreoDuplicado         = "Ya existe una cuenta registrada con este correo electrónico.";
    public const string OtpInvalido             = "El código ingresado es incorrecto o ha expirado.";
    public const string OtpReenviado            = "Se envió un nuevo código a tu correo electrónico.";
    public const string CuentaPendiente         = "Tu cuenta está pendiente de aprobación. Te notificaremos por correo.";
    public const string CuentaAprobada          = "El estado de tu cuenta ha cambiado a: Activa.";
    public const string CuentaRechazada         = "El estado de tu cuenta ha cambiado a: Rechazada.";
    public const string CredencialesInvalidas   = "Correo o contraseña incorrectos.";
    public const string CuentaBloqueada         = "Tu cuenta ha sido bloqueada temporalmente. Intenta de nuevo más tarde.";
    public const string DocumentoRequerido      = "Debes subir tu documento de identidad en formato PDF (máx. 5 MB).";
    public const string DocumentoEnviado        = "Tu documento fue enviado para revisión. El administrador te notificará.";
    public const string MotivoRechazoObligatorio = "El motivo de rechazo es obligatorio.";
    public const string UsuarioNoEncontrado     = "El usuario no fue encontrado.";
    public const string TokenInvalido           = "El enlace es inválido o ha expirado.";
}

// Constants/Messages/MonederoConstant.cs
public static class MonederoConstant
{
    public const string SaldoInsuficiente           = "Saldo insuficiente para realizar esta operación.";
    public const string SaldoNegativoProhibido      = "La operación no puede resultar en saldo negativo.";
    public const string FichasNoRetirables          = "Las Fichas no pueden retirarse ni convertirse a dinero real.";
    public const string FichasNoTransferibles       = "Las Fichas no pueden transferirse entre usuarios.";
    public const string CompraExitosa               = "Tus Rickoin fueron acreditados exitosamente.";
    public const string RetiroSolicitado            = "Tu solicitud de retiro fue registrada. Procesaremos en 6 a 10 días hábiles.";
    public const string RetiroCancelado             = "Tu retiro fue cancelado exitosamente.";
    public const string RetiroFueraDePlazo          = "El plazo de 5 días para cancelar este retiro ya venció.";
    public const string MotivoRechazoRetiroOblig    = "El motivo de rechazo del retiro es obligatorio.";
}

// Constants/Messages/RifaConstant.cs
public static class RifaConstant
{
    public const string RifaNoActiva                = "Esta rifa no está disponible para compra de boletas.";
    public const string BoletasAgotadas             = "No hay boletas disponibles en la cantidad solicitada.";
    public const string CompraExitosa               = "Tus boletas fueron asignadas exitosamente.";
    public const string PuntoEquilibrioInvalido     = "El punto de equilibrio no puede superar el total de boletas.";
    public const string RifaPublicada               = "La rifa fue publicada y ya es visible en el catálogo.";
    public const string RifaCancelada               = "La rifa fue cancelada. Se realizarán las devoluciones correspondientes.";
}

// Constants/Messages/SorteoConstant.cs
public static class SorteoConstant
{
    public const string ResultadoRegistrado         = "El resultado del sorteo fue registrado exitosamente.";
    public const string ResultadoInmutable          = "El resultado de un sorteo no puede modificarse una vez registrado.";
    public const string BoletaGanadoraNoVendida     = "La boleta ganadora no fue vendida. Se aplica la regla de fallback configurada.";
    public const string GanadorNotificado           = "Se notificó al ganador por correo con su enlace de reclamación.";
    public const string TokenPremioInvalido         = "El enlace de reclamación de premio es inválido o ha expirado.";
    public const string PremioSeleccionado          = "Tu selección de premio fue registrada. El equipo se pondrá en contacto.";
}

// Constants/Messages/RetiroConstant.cs
public static class RetiroConstant
{
    public const string AprobadoExitoso             = "El retiro fue aprobado exitosamente.";
    public const string RechazadoExitoso            = "El retiro fue rechazado y el saldo fue restaurado al usuario.";
    public const string FallidoSaldoRestaurado      = "El retiro fue marcado como fallido. El saldo fue devuelto al usuario.";
}

// Constants/Messages/EmailConstant.cs
public static class EmailConstant
{
    public const string AsuntoOtpRegistro           = "Confirma tu cuenta en Rickoin";
    public const string AsuntoOtpStepUp             = "Código de verificación — Zona Financiera Rickoin";
    public const string AsuntoRecuperarPassword     = "Recuperación de contraseña — Rickoin";
    public const string AsuntoDocumentoRevision     = "Nuevo usuario pendiente de aprobación — Rickoin";
    public const string AsuntoCuentaAprobada        = "Tu cuenta Rickoin fue aprobada";
    public const string AsuntoCuentaRechazada       = "Actualización sobre tu cuenta Rickoin";
    public const string AsuntoCompraRickoin         = "Compra de Rickoin confirmada";
    public const string AsuntoCompraBoleta          = "Tus boletas fueron asignadas";
    public const string AsuntoGanador               = "¡Felicitaciones! Ganaste en Rickoin";
    public const string AsuntoResultadoSorteo       = "Resultado del sorteo — Rickoin";
    public const string AsuntoAsignacionFichas      = "Recibiste Fichas en Rickoin";
}

// Constants/Configuracion/PaginacionConstant.cs
public static class PaginacionConstant
{
    public const int TamanioDefecto        = 10;
    public static readonly int[] Opciones  = [10, 25, 50, 100];
}
```

---

## 4. Capa Models

**Proyecto:** `Rickoin.Models`  
**Responsabilidad:** Es la **capa central de modelos** — la única fuente de verdad para entidades, DTOs, enums y modelos de resultado. Es referenciada por todas las demás capas.

### 4.1 Entidades (11 tablas del schema `Rickoins`)

Las entidades viven en `Models/Entities/RickoinsEntities/`. El `DbContext` y las configuraciones `IEntityTypeConfiguration<T>` viven en la misma carpeta.

| Entidad | Tabla BD | Descripción |
|---|---|---|
| `Usuario` | `Usuarios` | Persona registrada — estados: Visitante, PendienteOtp, Observador, Activo, Bloqueado |
| `Wallet` | `Wallets` | Saldo de Rickoin o Fichas por usuario (un registro por tipo de moneda) |
| `Transaccion` | `Transacciones` | Historial inmutable de movimientos de saldo |
| `Retiro` | `Retiros` | Solicitudes de retiro de Rickoin a dinero real |
| `Rifa` | `Rifas` | Rifas con todos sus parámetros de configuración |
| `Boleta` | `Boletas` | Boletas vendidas en una rifa — asignadas a un usuario |
| `Loteria` | `Loterias` | Catálogo de loterías colombianas configurables |
| `ResultadoSorteo` | `ResultadosSorteo` | Resultado oficial registrado por el admin — **inmutable** |
| `Premio` | `Premios` | Selección de modalidad del ganador y estado de entrega |
| `ConfiguracionSistema` | `ConfiguracionSistema` | Parámetros globales (tasa, timeouts, plazos) |
| `AuditLog` | `AuditLogs` | Registro de eventos del sistema para trazabilidad |

### 4.2 RickoinsDbContext

```csharp
// Models/Entities/RickoinsEntities/RickoinsDbContext.cs
public class RickoinsDbContext : DbContext
{
    public RickoinsDbContext(DbContextOptions<RickoinsDbContext> options) : base(options) { }

    public DbSet<Usuario>               Usuarios              => Set<Usuario>();
    public DbSet<Wallet>                Wallets               => Set<Wallet>();
    public DbSet<Transaccion>           Transacciones         => Set<Transaccion>();
    public DbSet<Retiro>                Retiros               => Set<Retiro>();
    public DbSet<Rifa>                  Rifas                 => Set<Rifa>();
    public DbSet<Boleta>                Boletas               => Set<Boleta>();
    public DbSet<Loteria>               Loterias              => Set<Loteria>();
    public DbSet<ResultadoSorteo>       ResultadosSorteo      => Set<ResultadoSorteo>();
    public DbSet<Premio>                Premios               => Set<Premio>();
    public DbSet<ConfiguracionSistema>  ConfiguracionSistema  => Set<ConfiguracionSistema>();
    public DbSet<AuditLog>              AuditLogs             => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
        => modelBuilder.ApplyConfigurationsFromAssembly(typeof(RickoinsDbContext).Assembly);
}
```

### 4.3 Entidades principales — campos y reglas

#### `Usuario`

| Campo | Tipo | Descripción |
|---|---|---|
| `Id` | `Guid` | Identificador único |
| `Email` | `string` | Correo — único en el sistema |
| `PasswordHash` | `byte[]` | Hash HMACSHA512 de la contraseña |
| `PasswordSalt` | `byte[]` | Salt del hash |
| `Estado` | `EstadoUsuario` | Estado actual de la cuenta |
| `NombreCompleto` | `string` | Nombre completo del usuario |
| `DocumentoPdfEnviadoEn` | `DateTime?` | Cuándo se envió el PDF al correo del admin |
| `IntentosFallidosLogin` | `int` | Contador de intentos fallidos consecutivos |
| `BloqueadoHasta` | `DateTime?` | Expira el bloqueo de la cuenta |
| `CreadoEn` | `DateTime` | Fecha de registro |

#### `Wallet`

| Campo | Tipo | Descripción |
|---|---|---|
| `Id` | `Guid` | Identificador único |
| `UsuarioId` | `Guid` | FK al usuario propietario |
| `Tipo` | `TipoWallet` | Rickoin o Fichas |
| `Saldo` | `decimal` | Saldo actual — nunca negativo |

> Un usuario tiene exactamente **dos registros** en `Wallets`: uno para Rickoin y uno para Fichas.  
> Las Fichas no pueden retirarse ni transferirse — esta restricción se valida en `MonederoService`, no en la base de datos.

#### `Rifa`

| Campo | Tipo | Descripción |
|---|---|---|
| `Id` | `Guid` | Identificador único |
| `Titulo` | `string` | Nombre del artículo en rifa |
| `ImagenUrl` | `string?` | URL externa de la imagen del artículo (Google Drive, CDN u otro) — opcional, solo lectura en la vista |
| `PrecioBoleta` | `decimal` | Precio en Rickoin |
| `TotalBoletas` | `int` | Total de boletas de la rifa |
| `PuntoEquilibrio` | `int` | Mínimo de boletas para que la rifa sea válida (`<= TotalBoletas`) |
| `Estado` | `EstadoRifa` | Estado actual del ciclo de vida |
| `Loteriaid` | `Guid` | FK a la lotería configurada |
| `ReglaDígitos` | `string` | Regla de extracción: `"3_ultimos"`, `"4_ultimos"`, etc. |
| `FechaHoraSorteoOficial` | `DateTime` | Fecha/hora del sorteo oficial (hora Colombia, UTC-5) |
| `CierreVentasEn` | `DateTime` | Calculado: `FechaHoraSorteoOficial - 3 horas` |
| `ReglaFallback` | `ReglaFallback` | Qué hacer si la boleta ganadora no fue vendida |

#### `Transaccion`

> **Inmutable** — solo `INSERT`. Nunca se modifica ni elimina.

| Campo | Tipo | Descripción |
|---|---|---|
| `Id` | `Guid` | Identificador único |
| `UsuarioId` | `Guid` | FK al usuario |
| `TipoWallet` | `TipoWallet` | Sobre qué billetera opera |
| `Tipo` | `TipoTransaccion` | Tipo de movimiento |
| `Monto` | `decimal` | Monto — siempre positivo |
| `Direccion` | `string` | `"credito"` o `"debito"` |
| `ReferenciaId` | `Guid?` | FK opcional a la entidad origen |
| `TasaConversion` | `decimal?` | Tasa COP→Rickoin vigente al momento |
| `CreadoEn` | `DateTime` | Timestamp inmutable |

#### `ResultadoSorteo`

> **Inmutable** — solo `INSERT`. Nunca se modifica. Audit trail completo.

| Campo | Tipo | Descripción |
|---|---|---|
| `Id` | `Guid` | Identificador único |
| `RifaId` | `Guid` | FK a la rifa |
| `ResultadoOficial` | `string` | Número publicado por la lotería |
| `NumeroGanadorCalculado` | `string` | Calculado según la regla de dígitos |
| `BoletaGanadoraId` | `Guid?` | FK a la boleta ganadora (null si no vendida) |
| `UsuarioGanadorId` | `Guid?` | FK al usuario ganador |
| `RegistradoPorAdminId` | `Guid` | Admin que ingresó el resultado |
| `RegistradoEn` | `DateTime` | Timestamp exacto |
| `IpAdmin` | `string` | IP del administrador — auditoría |

### 4.4 Modelo de resultado

`ResultadoOperacion<T>` es el contrato de retorno entre services y controllers:

```csharp
// Models/Models/ResultadoOperacion.cs
public class ResultadoOperacion
{
    public bool   Exito   { get; init; }
    public string Mensaje { get; init; } = string.Empty;

    public static ResultadoOperacion Ok(string mensaje = "")
        => new() { Exito = true, Mensaje = mensaje };
    public static ResultadoOperacion Fail(string mensaje)
        => new() { Exito = false, Mensaje = mensaje };
}

public class ResultadoOperacion<T> : ResultadoOperacion
{
    public T? Datos { get; init; }

    public static ResultadoOperacion<T> Ok(T datos, string mensaje = "")
        => new() { Exito = true, Datos = datos, Mensaje = mensaje };
}
```

### 4.5 Enums del dominio

```csharp
// Models/Enums/EstadoUsuario.cs
public enum EstadoUsuario { Visitante, PendienteOtp, Observador, Activo, Bloqueado }

// Models/Enums/TipoWallet.cs
public enum TipoWallet { Rickoin, Fichas }

// Models/Enums/TipoTransaccion.cs
public enum TipoTransaccion { Compra, Retiro, Boleta, Devolucion, AsignacionFichas }

// Models/Enums/EstadoRifa.cs
public enum EstadoRifa
{
    Borrador, Activa, Cerrada, PendienteResultado,
    GanadorEncontrado, PremioReclamado, Finalizada,
    SinGanador, Cancelada
}

// Models/Enums/EstadoRetiro.cs
public enum EstadoRetiro { Pendiente, Aprobado, Rechazado, Fallido, Cancelado }

// Models/Enums/ModalidadPremio.cs
public enum ModalidadPremio { Articulo, Rickoin }

// Models/Enums/ReglaFallback.cs
public enum ReglaFallback { SinGanador, SiguienteDisponible }
```

### 4.6 Configuraciones EF Core — reglas generales

Cada entidad tiene su clase `IEntityTypeConfiguration<T>` en `Models/Entities/RickoinsEntities/Configurations/`:

- Usar `.HasConversion<string>()` en todas las propiedades de tipo enum → se persisten como `NVARCHAR` legible en la BD.
- Usar `.OnDelete(DeleteBehavior.Restrict)` en todas las FK (sin cascadas).
- Usar `.AsNoTracking()` en **todas** las queries de solo lectura.
- Siempre pasar `CancellationToken` a los métodos `async`.
- Usar `.Select(...)` en listados (projections); usar `.Include()` solo para el detalle completo.
- Campos `decimal` financieros: `.HasColumnType("decimal(18,4)")`.

```csharp
// Models/Entities/RickoinsEntities/Configurations/TransaccionConfiguration.cs
public class TransaccionConfiguration : IEntityTypeConfiguration<Transaccion>
{
    public void Configure(EntityTypeBuilder<Transaccion> builder)
    {
        builder.ToTable("Transacciones");
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Monto).HasColumnType("decimal(18,4)").IsRequired();
        builder.Property(t => t.TasaConversion).HasColumnType("decimal(18,4)");
        builder.Property(t => t.TipoWallet).HasConversion<string>().HasMaxLength(20).IsRequired();
        builder.Property(t => t.Tipo).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(t => t.Direccion).HasMaxLength(10).IsRequired();

        // Índices para consultas frecuentes
        builder.HasIndex(t => t.UsuarioId);
        builder.HasIndex(t => t.CreadoEn);
        builder.HasIndex(t => new { t.UsuarioId, t.TipoWallet });

        builder.HasOne<Usuario>()
            .WithMany()
            .HasForeignKey(t => t.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
```

---

## 5. Capa Domain

**Proyecto:** `Rickoin.Domain`  
**Responsabilidad:** Contiene **únicamente interfaces de repositorios**. Las entidades, enums y DTOs viven en `Rickoin.Models`. Esta capa referencia `Rickoin.Models` para usar los tipos de entidad en las firmas de sus interfaces.

```csharp
// Domain/Interfaces/IUsuarioRepository.cs
public interface IUsuarioRepository
{
    Task<Usuario?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default);
    Task<Usuario?> ObtenerPorEmailAsync(string email, CancellationToken ct = default);
    Task<bool> ExisteEmailAsync(string email, CancellationToken ct = default);
    void Agregar(Usuario usuario);
    void Actualizar(Usuario usuario);
    Task<int> GuardarCambiosAsync(CancellationToken ct = default);
}

// Domain/Interfaces/IWalletRepository.cs
public interface IWalletRepository
{
    Task<Wallet?> ObtenerPorUsuarioYTipoAsync(Guid usuarioId, TipoWallet tipo, CancellationToken ct = default);
    Task<bool> TieneSaldoSuficienteAsync(Guid usuarioId, TipoWallet tipo, decimal monto, CancellationToken ct = default);
    void Actualizar(Wallet wallet);
    Task<int> GuardarCambiosAsync(CancellationToken ct = default);
}

// Domain/Interfaces/IRifaRepository.cs
public interface IRifaRepository
{
    Task<Rifa?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Rifa>> ObtenerActivasAsync(CancellationToken ct = default);
    Task<IReadOnlyList<Rifa>> ObtenerPorCierreVentasPendienteAsync(DateTime ahora, CancellationToken ct = default);
    void Agregar(Rifa rifa);
    void Actualizar(Rifa rifa);
    Task<int> GuardarCambiosAsync(CancellationToken ct = default);
}

// Domain/Interfaces/IBoletaRepository.cs
public interface IBoletaRepository
{
    // Bloqueo pesimista (UPDLOCK, ROWLOCK) dentro de transacción
    Task<IReadOnlyList<Boleta>> ObtenerDisponiblesConBloqueoAsync(Guid rifaId, int cantidad, CancellationToken ct = default);
    Task<IReadOnlyList<Boleta>> ObtenerPorUsuarioAsync(Guid usuarioId, CancellationToken ct = default);
    void ActualizarRango(IEnumerable<Boleta> boletas);
    Task<int> GuardarCambiosAsync(CancellationToken ct = default);
}

// Domain/Interfaces/IResultadoSorteoRepository.cs
// Solo permite INSERT — sin Update
public interface IResultadoSorteoRepository
{
    Task<ResultadoSorteo?> ObtenerPorRifaAsync(Guid rifaId, CancellationToken ct = default);
    void Agregar(ResultadoSorteo resultado);
    Task<int> GuardarCambiosAsync(CancellationToken ct = default);
}

// Domain/Interfaces/IConfiguracionSistemaRepository.cs
public interface IConfiguracionSistemaRepository
{
    Task<string?> ObtenerValorAsync(string clave, CancellationToken ct = default);
    Task<T> ObtenerValorAsync<T>(string clave, T valorDefecto, CancellationToken ct = default);
    void Actualizar(ConfiguracionSistema config);
    Task<int> GuardarCambiosAsync(CancellationToken ct = default);
}

// Domain/Interfaces/IAuditLogRepository.cs
public interface IAuditLogRepository
{
    void Agregar(AuditLog log);
    Task<IReadOnlyList<AuditLog>> ObtenerFiltradoAsync(Guid? usuarioId, string? accion, DateTime? desde, DateTime? hasta, CancellationToken ct = default);
    Task<int> GuardarCambiosAsync(CancellationToken ct = default);
}
```

---

## 6. Capa Helpers

**Proyecto:** `Rickoin.Helpers`  
**Responsabilidad:** Implementar utilidades transversales: envío de correos, seguridad de contraseñas, generación de OTP y tokens. Es referenciada por `Application`. No contiene lógica de negocio.

### 6.1 EmailHelper (SendGrid)

```csharp
// Helpers/Email/IEmailHelper.cs
public interface IEmailHelper
{
    Task EnviarOtpRegistroAsync(string destinatario, string codigo, CancellationToken ct = default);
    Task EnviarOtpStepUpAsync(string destinatario, string codigo, CancellationToken ct = default);
    Task EnviarDocumentoRevisionAdminAsync(string destinatarioAdmin, byte[] pdfBytes, string nombreUsuario, string emailUsuario, Guid usuarioId, CancellationToken ct = default);
    Task EnviarCuentaAprobadaAsync(string destinatario, CancellationToken ct = default);
    Task EnviarCuentaRechazadaAsync(string destinatario, string motivo, CancellationToken ct = default);
    Task EnviarRecuperarPasswordAsync(string destinatario, string enlaceToken, CancellationToken ct = default);
    Task EnviarCompraRickoinAsync(string destinatario, decimal monto, decimal tasaAplicada, CancellationToken ct = default);
    Task EnviarCompraBoletaAsync(string destinatario, string tituloRifa, IEnumerable<int> numerosBoletas, CancellationToken ct = default);
    Task EnviarRetiroSolicitadoAsync(string destinatario, decimal monto, CancellationToken ct = default);
    Task EnviarRetiroAprobadoAsync(string destinatario, decimal monto, CancellationToken ct = default);
    Task EnviarRetiroRechazadoAsync(string destinatario, decimal monto, string motivo, CancellationToken ct = default);
    Task EnviarRetiroFallidoAsync(string destinatario, decimal monto, CancellationToken ct = default);
    Task EnviarRetiroCanceladoAsync(string destinatario, decimal monto, CancellationToken ct = default);
    Task EnviarRifaCanceladaAsync(string destinatario, string tituloRifa, decimal montoDevuelto, CancellationToken ct = default);
    Task EnviarResultadoSorteoAsync(string destinatario, string tituloRifa, string numeroGanador, CancellationToken ct = default);
    Task EnviarGanadorNotificacionAsync(string destinatario, string tituloRifa, string enlaceToken, CancellationToken ct = default);
    Task EnviarAsignacionFichasAsync(string destinatario, decimal monto, string motivo, CancellationToken ct = default);
    Task EnviarReenvioOtpAsync(string destinatario, string codigo, CancellationToken ct = default);
}
```

> `EmailHelper.cs` implementa `IEmailHelper` usando el SDK de SendGrid. Carga la plantilla HTML correspondiente desde `Templates/`, inyecta los valores dinámicos y llama a `SendGrid`. La API Key se inyecta desde `IConfiguration` (que la lee de Azure Key Vault).

### 6.2 PasswordHelper (HMACSHA512)

```csharp
// Helpers/Security/PasswordHelper.cs
// Clase estática — sin inyección de dependencias
public static class PasswordHelper
{
    /// Genera PasswordHash (64 bytes) y PasswordSalt (128 bytes) con HMACSHA512.
    public static (byte[] Hash, byte[] Salt) CrearHash(string password)
    {
        using var hmac = new HMACSHA512();
        return (hmac.ComputeHash(Encoding.UTF8.GetBytes(password)), hmac.Key);
    }

    /// Verifica en tiempo constante para prevenir timing attacks.
    public static bool VerificarPassword(string password, byte[] hashGuardado, byte[] saltGuardado)
    {
        using var hmac = new HMACSHA512(saltGuardado);
        var hashComparar = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        return CryptographicOperations.FixedTimeEquals(hashComparar, hashGuardado);
    }
}
```

### 6.3 OtpHelper

```csharp
// Helpers/Security/IOtpHelper.cs
public interface IOtpHelper
{
    string Generar();                              // Genera código OTP de 6 dígitos
    bool Validar(string codigoIngresado, string codigoAlmacenado, DateTime expiracion);
}
```

### 6.4 TokenHelper (tokens de un solo uso)

```csharp
// Helpers/Tokens/ITokenHelper.cs
public interface ITokenHelper
{
    string Generar(int longitud = 32);             // Token Base36 seguro — para recuperación de password y reclamación de premio
    bool EsValido(string token, DateTime expiracion, bool yaUsado);
}
```

---

## 7. Capa Infrastructure

**Proyecto:** `Rickoin.Infrastructure`  
**Responsabilidad:** Implementar los contratos de repositorios definidos en `Domain`. Contiene el job de cierre automático de ventas. **No** contiene `RickoinsDbContext` ni configuraciones de entidades — esos viven en `Rickoin.Models`.

### 7.1 Repositorios — patrón general

```csharp
// Infrastructure/Repositories/RifaRepository.cs
public class RifaRepository : IRifaRepository
{
    private readonly RickoinsDbContext _context;
    public RifaRepository(RickoinsDbContext context) => _context = context;

    public async Task<Rifa?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default)
        => await _context.Rifas
            .Include(r => r.Loteria)
            .FirstOrDefaultAsync(r => r.Id == id, ct);

    public async Task<IReadOnlyList<Rifa>> ObtenerActivasAsync(CancellationToken ct = default)
        => await _context.Rifas
            .Where(r => r.Estado == EstadoRifa.Activa)
            .Select(r => new Rifa
            {
                Id = r.Id, Titulo = r.Titulo, PrecioBoleta = r.PrecioBoleta,
                TotalBoletas = r.TotalBoletas, CierreVentasEn = r.CierreVentasEn
            })
            .AsNoTracking()
            .ToListAsync(ct);

    public void Agregar(Rifa rifa) => _context.Rifas.Add(rifa);
    public void Actualizar(Rifa rifa) => _context.Rifas.Update(rifa);
    public Task<int> GuardarCambiosAsync(CancellationToken ct = default)
        => _context.SaveChangesAsync(ct);
}
```

### 7.2 BoletaRepository — bloqueo pesimista

```csharp
// Infrastructure/Repositories/BoletaRepository.cs
public async Task<IReadOnlyList<Boleta>> ObtenerDisponiblesConBloqueoAsync(
    Guid rifaId, int cantidad, CancellationToken ct = default)
{
    // Bloqueo pesimista a nivel de fila — previene doble asignación en alta concurrencia
    return await _context.Boletas
        .FromSqlRaw(@"
            SELECT TOP ({0}) * FROM Boletas
            WHERE RifaId = {1} AND Estado = 'Disponible'
            WITH (UPDLOCK, ROWLOCK)
            ORDER BY NumeroBoleta ASC",
            cantidad, rifaId)
        .ToListAsync(ct);
}
```

### 7.3 Job de cierre automático de ventas

```csharp
// Infrastructure/BackgroundJobs/RifaCierreVentasJob.cs
// Se ejecuta cada 15 minutos
// Busca rifas con Estado = Activa y CierreVentasEn <= DateTime.UtcNow (hora Colombia)
// Por cada rifa encontrada:
//   → Cambia Estado a "Cerrada"
//   → Registra en AuditLog
//   → Si boletas vendidas < PuntoEquilibrio: programa devoluciones automáticas
```

### 7.4 InfrastructureAccessDependency

```csharp
// Infrastructure/AccessDependency/InfrastructureAccessDependency.cs
// AppDbContext vive en Rickoin.Models; las Migrations se almacenan en este proyecto
public static class InfrastructureAccessDependency
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<RickoinsDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("Default"),
                sql => sql.MigrationsAssembly("Rickoin.Infrastructure")));

        services.AddScoped<IUsuarioRepository,              UsuarioRepository>();
        services.AddScoped<IWalletRepository,               WalletRepository>();
        services.AddScoped<ITransaccionRepository,          TransaccionRepository>();
        services.AddScoped<IRetiroRepository,               RetiroRepository>();
        services.AddScoped<IRifaRepository,                 RifaRepository>();
        services.AddScoped<IBoletaRepository,               BoletaRepository>();
        services.AddScoped<ILoteriaRepository,              LoteriasRepository>();
        services.AddScoped<IResultadoSorteoRepository,      ResultadoSorteoRepository>();
        services.AddScoped<IPremioRepository,               PremioRepository>();
        services.AddScoped<IConfiguracionSistemaRepository, ConfiguracionSistemaRepository>();
        services.AddScoped<IAuditLogRepository,             AuditLogRepository>();

        services.AddHostedService<RifaCierreVentasJob>();

        return services;
    }
}
```

---

## 8. Capa Application

**Proyecto:** `Rickoin.Application`  
**Responsabilidad:** Contiene toda la **lógica de negocio** del sistema organizada en servicios. Sabe QUÉ debe pasar (las reglas, las validaciones, la orquestación) pero delega el CÓMO a los repositorios (`Domain`) y utilidades (`Helpers`).

Esta capa **no referencia** `Rickoin.Infrastructure` directamente — solo accede a los repositorios a través de las interfaces de `Domain`.

### 8.1 Responsabilidades por servicio

#### `UsuarioService` — Ciclo 1

| Operación | Lógica de negocio |
|---|---|
| `RegistrarAsync` | Unicidad de email · Hash de contraseña · Crear wallets (Rickoin + Fichas) · Generar y enviar OTP |
| `ConfirmarOtpAsync` | Verificar código + expiración · Cambiar estado a `Observador` |
| `ReenviarOtpAsync` | Invalidar OTP anterior · Generar nuevo OTP · Enviar correo |
| `LoginAsync` | Verificar contraseña · Contador de intentos fallidos · Bloqueo por N intentos · Retornar `UsuarioSesionDto` |
| `SolicitarRecuperacionAsync` | Generar token de un solo uso · Persistir con expiración 1 hora · Enviar correo |
| `RestablecerPasswordAsync` | Validar token (no usado, no expirado) · Cambiar hash · Marcar token como usado |
| `SubirDocumentoAsync` | Recibir PDF (máx 5MB) · Enviar al correo admin con datos del usuario + botones aprobar/rechazar · Registrar timestamp en `Usuario.DocumentoPdfEnviadoEn` · **No persiste el PDF** |
| `AprobarUsuarioAsync` | Cambiar `EstadoUsuario` a `Activo` · Registrar en `AuditLog` · Enviar correo al usuario |
| `RechazarUsuarioAsync` | Motivo obligatorio · Cambiar estado a `Rechazado` · Registrar en `AuditLog` · Enviar correo con motivo |

#### `MonederoService` — Ciclo 2

| Operación | Lógica de negocio |
|---|---|
| `ObtenerSaldoAsync` | Retorna saldo Rickoin + Fichas del usuario |
| `ObtenerHistorialAsync` | Movimientos paginados, filtrables por tipo y fecha |
| `ComprarRickoinAsync` | Verificar sesión financiera activa · Calcular monto COP según tasa vigente · Registrar transacción (tasa inmutable al momento) · Acreditar Rickoin · Enviar correo |
| `SolicitarRetiroAsync` | Verificar sesión financiera · Saldo suficiente · Descontar saldo · Registrar retiro en `Pendiente` · Enviar correo |
| `CancelarRetiroAsync` | Verificar que estén dentro de los 5 días · Restaurar saldo · Cambiar estado a `Cancelado` · Enviar correo |
| `AsignarFichasAsync` | Solo admin · Acreditar Fichas · Registrar transacción · Enviar correo al usuario |
| `AprobarRetiroAsync` | Solo admin · Cambiar estado a `Aprobado` · Enviar correo |
| `RechazarRetiroAsync` | Solo admin · Motivo obligatorio · Restaurar saldo · Enviar correo |
| `MarcarRetiroFallidoAsync` | Solo admin · Restaurar saldo · Cambiar estado a `Fallido` · Enviar correo |

#### `RifaService` — Ciclo 3

| Operación | Lógica de negocio |
|---|---|
| `CrearAsync` | `PuntoEquilibrio <= TotalBoletas` · `CierreVentasEn = FechaHoraSorteoOficial - 3h` · Estado inicial `Borrador` |
| `PublicarAsync` | Solo desde `Borrador` → `Activa` · Generar los registros de boletas en `Boletas` |
| `CerrarAsync` | Solo admin · Desde `Activa` → `Cerrada` |
| `ObtenerCatalogoAsync` | Rifas `Activas` con progreso y probabilidad calculada |
| `ComprarBoletasAsync` | Verificar cuenta `Activa` · Verificar rifa `Activa` · Verificar saldo suficiente · Asignar boletas con bloqueo pesimista (atómico) · Descontar saldo · Registrar transacciones · Enviar correo |
| `ProcesarDevolucionesAsync` | Llamado por el job al cancelar una rifa · Devolver Rickoin a cada participante (no Fichas) · Enviar correo a cada participante |

**Atomicidad en compra de boletas:** Saldo, asignación de boletas y transacciones se ejecutan dentro de la misma transacción `SaveChanges`. Si cualquier paso falla, se hace rollback completo.

#### `SorteoService` — Ciclo 4

| Operación | Lógica de negocio |
|---|---|
| `RegistrarResultadoAsync` | Solo admin · Resultado inmutable · Calcular número ganador según regla de dígitos · Registrar `ResultadoSorteo` con IP y timestamp · Identificar boleta ganadora automáticamente |
| `ValidarGanadorAsync` | Si boleta vendida → cambiar estado rifa a `GanadorEncontrado` · Notificar ganador con token único |
| `ProcesarFallbackAsync` | Si boleta no vendida y regla `SinGanador` → devoluciones automáticas · Si `SiguienteDisponible` → identificar boleta más cercana |
| `ReenviarNotificacionGanadorAsync` | Admin puede regenerar token y reenviar correo |

#### `PremioService` — Ciclo 4

| Operación | Lógica de negocio |
|---|---|
| `SeleccionarModalidadAsync` | Token válido (un solo uso, 5 días) · Registrar selección en `Premio` · Cambiar rifa a `PremioReclamado` · Notificar admin |
| `MarcarEntregadoAsync` | Solo admin · Cambiar estado a `Finalizada` |

#### `AdminService` — Ciclo 5

| Operación | Lógica de negocio |
|---|---|
| `ObtenerDashboardAsync` | Métricas: usuarios activos, rifas activas, retiros pendientes, recaudación del mes |
| `ObtenerLogsAsync` | Logs paginados con filtros por usuario, acción y fecha |
| `ExportarReporteAsync` | CSV con BOM UTF-8 para compatibilidad Excel en español (separador `;`) |
| `ObtenerConfiguracionAsync` | Lee todos los parámetros de `ConfiguracionSistema` |
| `ActualizarConfiguracionAsync` | Guarda el nuevo valor · Registra en `AuditLog` el valor anterior y el nuevo |

### 8.2 Patrón de retorno desde Services

Los services devuelven `ResultadoOperacion<T>` (definido en `Models/Models/`). El mensaje siempre proviene de una clase `Constant`:

```csharp
// Application/Services/RifaService.cs — fragmento
public async Task<ResultadoOperacion> ComprarBoletasAsync(
    Guid usuarioId, Guid rifaId, int cantidad, TipoWallet tipoWallet, CancellationToken ct = default)
{
    var rifa = await _rifaRepository.ObtenerPorIdAsync(rifaId, ct);
    if (rifa is null || rifa.Estado != EstadoRifa.Activa)
        return ResultadoOperacion.Fail(RifaConstant.RifaNoActiva);

    var tieneSaldo = await _walletRepository.TieneSaldoSuficienteAsync(
        usuarioId, tipoWallet, rifa.PrecioBoleta * cantidad, ct);
    if (!tieneSaldo)
        return ResultadoOperacion.Fail(MonederoConstant.SaldoInsuficiente);

    var boletas = await _boletaRepository.ObtenerDisponiblesConBloqueoAsync(rifaId, cantidad, ct);
    if (boletas.Count < cantidad)
        return ResultadoOperacion.Fail(RifaConstant.BoletasAgotadas);

    // ... asignar boletas, descontar saldo, registrar transacción, enviar correo ...
    await _boletaRepository.GuardarCambiosAsync(ct);

    return ResultadoOperacion.Ok(RifaConstant.CompraExitosa);
}
```

### 8.3 ApplicationAccessDependency

```csharp
// Application/AccessDependency/ApplicationAccessDependency.cs
public static class ApplicationAccessDependency
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IUsuarioService,  UsuarioService>();
        services.AddScoped<IMonederoService, MonederoService>();
        services.AddScoped<IRifaService,     RifaService>();
        services.AddScoped<ISorteoService,   SorteoService>();
        services.AddScoped<IPremioService,   PremioService>();
        services.AddScoped<IAdminService,    AdminService>();
        return services;
    }
}
```

---

## 9. Capa Web (Presentación)

**Proyecto:** `Rickoin.Web`  
**Responsabilidad:** Recibir solicitudes HTTP, traducirlas en llamadas a los services de `Application`, y presentar el resultado mediante vistas Razor. No contiene lógica de negocio.

### 9.1 Controllers — responsabilidades

**Regla:** Los controllers son **delgados**. Solo validan `ModelState`, llaman al service y redirigen o devuelven la vista. Nunca contienen lógica de negocio.

```csharp
// Web/Controllers/MonederoController.cs
[Authorize]
[RequireActiveAccount]
public class MonederoController : Controller
{
    [HttpGet]
    [RequireFinancialSession]
    public async Task<IActionResult> Index()
    { /* obtiene saldo + historial, retorna vista */ }

    [HttpGet]
    public IActionResult Verificar()
    { /* muestra pantalla de step-up */ }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> VerificarPassword(VerificarPasswordViewModel vm)
    { /* valida contraseña, activa sesión financiera */ }

    [HttpPost]
    [ValidateAntiForgeryToken]
    [RequireFinancialSession]
    public async Task<IActionResult> ComprarRickoin(ComprarRickoinViewModel vm)
    {
        if (!ModelState.IsValid) return View(vm);
        var resultado = await _monederoService.ComprarRickoinAsync(...);
        if (!resultado.Exito)
        {
            ModelState.AddModelError(string.Empty, resultado.Mensaje);
            return View(vm);
        }
        return RedirectToAction(nameof(Index));
    }
}
```

**Tabla de controllers por módulo:**

| Controller | Acciones principales | Roles / Estado requerido |
|---|---|---|
| `AuthController` | `Registro`, `Login`, `Logout`, `ConfirmarOtp`, `ReenviarOtp`, `RecuperarPassword`, `RestablecerPassword`, `SubirDocumento` | Sin autenticación (login/registro) / Observador (subir doc) |
| `DashboardController` | `Index` | Usuario Activo |
| `RifasController` | `Index`, `Detalle`, `ComprarBoletas` | Catálogo: todos / Comprar: Usuario Activo |
| `MonederoController` | `Index`, `Verificar`, `VerificarPassword`, `EnviarOtpStepUp`, `ComprarRickoin`, `SolicitarRetiro`, `CancelarRetiro` | Activo + sesión financiera |
| `PremiosController` | `SeleccionarPremio` | Token válido (sin autenticación requerida) |
| `AdminController` | `Dashboard`, `Usuarios`, `AprobarUsuario`, `RechazarUsuario`, `Rifas`, `CrearRifa`, `Sorteos`, `RegistrarResultado`, `Retiros`, `Fichas`, `Reportes`, `Logs`, `Configuracion` | Solo Administrador |
| `LegalController` | `Terminos`, `Privacidad`, `JuegoResponsable`, `Pagos`, `AvisoLegal` | Público (sin autenticación) |

### 9.2 ViewModels clave

Los ViewModels son los únicos objetos que circulan entre controllers y vistas. **Nunca se pasan entidades de dominio directamente a las vistas.**

```csharp
// Web/ViewModels/Rifas/ComprarBoletasViewModel.cs
public class ComprarBoletasViewModel
{
    public Guid   RifaId    { get; set; }
    public string TituloRifa { get; set; } = string.Empty;
    public decimal PrecioBoleta { get; set; }

    [Required(ErrorMessage = "La cantidad de boletas es obligatoria.")]
    [Range(1, 100, ErrorMessage = "Puedes comprar entre 1 y 100 boletas.")]
    public int Cantidad { get; set; }

    [Required(ErrorMessage = "Debes seleccionar el tipo de moneda.")]
    public TipoWallet TipoWallet { get; set; }

    // Solo lectura — para mostrar el resumen
    public decimal SaldoRickoin  { get; set; }
    public decimal SaldoFichas   { get; set; }
    public decimal TotalACobrar  => PrecioBoleta * Cantidad;
}
```

### 9.3 Filtros de autorización

```csharp
// [RequireActiveAccount] — bloquea usuarios Observador
// Si el usuario está en estado Observador → HTTP 403 + redirige al dashboard
// con el banner "Tu cuenta está en revisión. Te notificaremos por correo."

// [RequireFinancialSession] — barrera del Step-Up
// Si no existe sesión financiera activa o expiró (> 20 min inactividad)
// → redirige a /monedero/verificar

// [AdminOnly] — solo rol Administrador
// Cualquier otro usuario recibe HTTP 403
```

### 9.4 FinancialSessionMiddleware

El middleware inspecciona cada request a rutas bajo `/monedero/`:

```
[FinancialSessionMiddleware]
    → Lee FinancialSessionActive y FinancialSessionLastActivity de la sesión del servidor
    → Si no activa → redirige a /monedero/verificar
    → Si activa pero LastActivity + 20min < ahora → expirada → redirige a /monedero/verificar
    → Si activa y dentro del timeout → actualiza LastActivity → continúa
```

### 9.5 DependencyContainer

```csharp
// Web/DependencyContainer/DependencyContainer.cs
// Centraliza el registro de todas las dependencias del sistema
public static class DependencyContainer
{
    public static IServiceCollection RegisterDependencies(
        this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddInfrastructure(configuration)    // Rickoin.Infrastructure
            .AddApplication()                    // Rickoin.Application
            .AddHelpers(configuration);          // Rickoin.Helpers

        services.AddAutoMapper(typeof(RickoinsAutoMapper));
        services.AddScoped<RequireActiveAccountFilter>();
        services.AddScoped<RequireFinancialSessionFilter>();
        services.AddScoped<AdminOnlyFilter>();

        return services;
    }
}
```

---

## 10. Flujo de una Solicitud HTTP

Ejemplo completo: usuario activo compra boletas con Rickoin.

```
[1] NAVEGADOR
    POST /rifas/comprar-boletas
    Body: { rifaId, cantidad: 2, tipoWallet: "Rickoin" }
         │
         ▼
[2] MIDDLEWARE PIPELINE (Rickoin.Web)
    → ExceptionHandlingMiddleware (envuelve en try/catch global)
    → Autenticación (verifica cookie de sesión ASP.NET Core)
         │
         ▼
[3] FILTER: RequireActiveAccountFilter
    → Lee EstadoUsuario de los claims
    → Si Observador: HTTP 403 + redirección
         │
         ▼
[4] RifasController.ComprarBoletas (POST)
    → Valida ModelState
    → Construye ComprarBoletasDto { UsuarioId, RifaId, Cantidad, TipoWallet }
    → await _rifaService.ComprarBoletasAsync(dto)
         │
         ▼
[5] RifaService.ComprarBoletasAsync (Rickoin.Application)
    → Verificar rifa activa (IRifaRepository)
    → Verificar saldo suficiente (IWalletRepository)
    → Obtener boletas disponibles CON BLOQUEO PESIMISTA (IBoletaRepository)
    → Asignar boletas al usuario
    → Descontar saldo del wallet
    → Registrar transacción en historial (ITransaccionRepository)
    → Registrar evento en AuditLog (IAuditLogRepository)
    → Enviar correo de confirmación (IEmailHelper)
    → GuardarCambiosAsync() — un solo SaveChanges atómico
    → Retornar ResultadoOperacion.Ok(RifaConstant.CompraExitosa)
         │
         ▼
[6] REPOSITORIOS E INFRAESTRUCTURA (Rickoin.Infrastructure)
    → EF Core ejecuta las queries SQL dentro de la transacción
    → EmailHelper envía el correo vía SendGrid SDK
         │
         ▼
[7] RifasController — respuesta
    → Si Exito: RedirectToAction("MisBoletas") con TempData de confirmación
    → Si !Exito: View(vm) con ModelState.AddModelError(resultado.Mensaje)
         │
         ▼
[8] VISTA RAZOR
    → Muestra confirmación o mensaje de error al usuario
```

---

## 11. Seguridad por Capas

### 11.1 Autenticación y sesión

- **Mecanismo:** ASP.NET Core Cookie Authentication (`httpOnly` + `Secure` + `SameSite=Strict`)
- **Contraseñas:** HMACSHA512 con salt de 128 bytes (clase `PasswordHelper`)
- **Bloqueo:** Tras N intentos fallidos (N leído de `ConfiguracionSistema`), cuenta bloqueada por tiempo configurable

### 11.2 Step-Up Authentication (Zona Financiera)

```
Usuario autenticado intenta acceder a /monedero/**
    → FinancialSessionMiddleware verifica sesión financiera
    → Si no activa: redirige a /monedero/verificar
    → En verificar: usuario elige [Contraseña] o [Enviar OTP a mi correo]
    → Al validar exitosamente: activar FinancialSessionActive = true en sesión del servidor
    → Sesión financiera dura 20 minutos de inactividad (configurable en SystemConfig)
```

### 11.3 Protección CSRF

- `[ValidateAntiForgeryToken]` en **todos** los formularios `POST`
- Token incluido automáticamente en layouts mediante `@Html.AntiForgeryToken()`

### 11.4 Prevención OWASP Top 10

| Vulnerabilidad | Mitigación |
|---|---|
| **Inyección SQL** | EF Core con queries parametrizadas. Nunca concatenación de strings en SQL. |
| **XSS** | Razor escapa automáticamente. Sin uso de `@Html.Raw()` con datos del usuario. |
| **CSRF** | `[ValidateAntiForgeryToken]` en todos los formularios de mutación. |
| **Broken Authentication** | Bloqueo por intentos + expiración de sesión + Step-Up financiero. |
| **Sensitive Data Exposure** | HTTPS obligatorio · Secretos en Azure Key Vault · Sin datos sensibles en logs. |
| **Broken Access Control** | Filters de autorización + validación en cada service. |
| **Security Misconfiguration** | Headers HTTP seguros (HSTS, X-Frame-Options, CSP) en middleware. |

---

## 12. Transacciones y Consistencia de Datos

### 12.1 Patrón de transacción por repositorio

Cada repositorio expone `GuardarCambiosAsync()` propio. Los services que necesitan atomicidad entre múltiples repositorios usan `RickoinsDbContext` inyectado directamente (o vía un contexto compartido por inyección de dependencias con `Scoped`) y llaman **un solo** `SaveChangesAsync()` al final:

```csharp
// Todas las modificaciones se acumulan en memoria dentro del mismo DbContext (Scoped)
// Una sola llamada a SaveChangesAsync() los persiste todos en una transacción de BD
boleta.AsignarAUsuario(usuarioId);
wallet.Saldo -= rifa.PrecioBoleta * cantidad;
var transaccion = new Transaccion { ... };
_context.Transacciones.Add(transaccion);
_context.AuditLogs.Add(new AuditLog { ... });
await _context.SaveChangesAsync(ct);   // ← un solo commit atómico
```

### 12.2 Bloqueo pesimista en boletas

`UPDLOCK` + `ROWLOCK` en `BoletaRepository.ObtenerDisponiblesConBloqueoAsync` garantiza que en alta concurrencia solo una transacción asigna el mismo lote de boletas. La segunda transacción espera o falla limpiamente sin corrupción de saldo.

### 12.3 Inmutabilidad de registros financieros

- `Transacciones` y `ResultadosSorteo`: los repositorios solo exponen `Agregar()`, nunca `Actualizar()`.
- `IResultadoSorteoRepository` no tiene método `Actualizar` — es imposible modificar un resultado de sorteo desde la aplicación.

---

## 13. Infraestructura en Azure

### 13.1 Componentes

```
                    INTERNET (HTTPS/443)
                           │
              ┌────────────▼────────────┐
              │     Azure App Service   │
              │     Plan B1 / B2        │
              │   Rickoin.Web (.NET 8)  │
              │   + BackgroundJobs      │
              └────────────┬────────────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
┌──────────▼──────────┐       ┌────────────▼────────────┐
│  Azure SQL Database  │       │    Azure Key Vault       │
│  (Standard S1)       │       │  - ConnectionString      │
│  Base única          │       │  - SendGrid API Key      │
│  Backups automáticos │       │  - Payment Gateway Creds │
└─────────────────────┘       └─────────────────────────┘

┌─────────────────────┐       ┌─────────────────────────┐
│      SendGrid        │       │   Pasarela de Pago      │
│  18 tipos de correo  │       │   (Wompi / PayU)        │
│  DKIM + SPF config.  │       │   Compra Rickoin        │
└─────────────────────┘       └─────────────────────────┘

┌─────────────────────┐
│  Azure App Insights  │
│  Errores + métricas  │
│  Alertas producción  │
└─────────────────────┘
```

### 13.2 Ambientes

| Ambiente | Propósito | BD |
|---|---|---|
| **Development** | Desarrollo local | SQL Server local |
| **Staging** | Pruebas pre-producción — SendGrid real | Azure SQL Basic |
| **Production** | Usuarios reales | Azure SQL Standard S1 |

Los secretos (`ConnectionString`, API Keys) nunca están en `appsettings.json`. Se leen desde Azure Key Vault al inicio de la aplicación.

---

## 14. Convenciones de Código

### 14.1 Naming

| Elemento | Convención | Ejemplo |
|---|---|---|
| Clases y métodos | PascalCase | `UsuarioService`, `ComprarBoletasAsync` |
| Variables locales y parámetros | camelCase | `usuarioId`, `rifaActiva` |
| Interfaces | Prefijo `I` + PascalCase | `IUsuarioService`, `IEmailHelper` |
| Clases de constantes | PascalCase + sufijo `Constant` | `RifaConstant`, `MonederoConstant` |
| Tablas SQL | PascalCase plural | `Usuarios`, `Transacciones`, `ResultadosSorteo` |
| Columnas SQL | PascalCase | `CreadoEn`, `PasswordHash`, `TipoWallet` |
| Enums | PascalCase (tipo y valores) | `EstadoRifa.Activa`, `TipoWallet.Rickoin` |

### 14.2 Estructura de archivos

- Un archivo = una clase / interfaz / enum
- El namespace refleja la ruta de carpetas: `Rickoin.Application.Services`
- Cada servicio tiene su interfaz en la misma carpeta: `Services/UsuarioService.cs` + `Interfaces/IUsuarioService.cs`

### 14.3 Async / Await

- Todos los métodos que acceden a BD, red o disco son `async Task<T>`
- Incluir `CancellationToken ct = default` en todos los métodos públicos de repositorios y servicios
- Nunca `.Result` ni `.Wait()` — siempre `await`

### 14.4 Queries EF Core

- `.AsNoTracking()` en **todas** las queries de solo lectura
- `.Select(...)` en listados para evitar cargar columnas innecesarias
- `.Include()` solo en vistas de detalle donde se necesitan los datos de la entidad relacionada
- Siempre pasar `CancellationToken` a `ToListAsync`, `FirstOrDefaultAsync`, `SaveChangesAsync`

### 14.5 Registro en DI

- `Scoped` → Repositorios, Services, `RickoinsDbContext`
- `Singleton` → Configuración, helpers sin estado (`PasswordHelper` es estático — no se registra)
- `Transient` → Filtros de autorización

---

*RICKOIN Arquitectura de Software v2.0 — Mayo 2026 — 7 proyectos · Clean Layered Architecture*
