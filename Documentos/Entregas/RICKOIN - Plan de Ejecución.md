# RICKOIN — Plan de Ejecución del Proyecto

**Método:** Shape Up (Ryan Singer / Basecamp)  
**Fecha de inicio:** 8 de mayo de 2026  
**Fecha de go-live:** 12 de marzo de 2027  
**Duración total:** ~10 meses  
**Versión:** 1.0 — Mayo 2026

---

## ÍNDICE

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Roles y herramientas](#2-roles-y-herramientas)
3. [Fase 0 — Preproducción](#3-fase-0--preproducción-8-21-de-mayo-2026)
   - [3.1 Compra y configuración del dominio](#31-compra-y-configuración-del-dominio)
   - [3.2 Correos corporativos](#32-correos-corporativos-google-workspace)
   - [3.3 Configuración de SendGrid](#33-configuración-de-sendgrid)
   - [3.4 Recursos Azure](#34-recursos-azure)
   - [3.5 Repositorio y entorno de desarrollo](#35-repositorio-y-entorno-de-desarrollo)
   - [3.6 Tres ambientes: Dev / Staging / Prod](#36-tres-ambientes-dev--staging--prod)
4. [Ciclo 1 — Identidad y Acceso](#4-ciclo-1--identidad-y-acceso-22-mayo--2-julio-2026)
5. [Ciclo 2 — Monedero Rickoin](#5-ciclo-2--monedero-rickoin-17-julio--27-agosto-2026)
6. [Ciclo 3 — Rifas y Marketplace](#6-ciclo-3--rifas-y-marketplace-11-septiembre--22-octubre-2026)
7. [Ciclo 4 — Motor de Sorteos y Premios](#7-ciclo-4--motor-de-sorteos-y-premios-6-noviembre--17-diciembre-2026)
8. [Ciclo 5 — Operaciones y Estabilidad](#8-ciclo-5--operaciones-y-estabilidad-2-enero--12-febrero-2027)
9. [Fase Final — Go-Live](#9-fase-final--go-live-27-febrero--12-marzo-2027)
10. [Estrategia de pruebas con Playwright](#10-estrategia-de-pruebas-con-playwright)
11. [Arquitectura de despliegue](#11-arquitectura-de-despliegue)
12. [Checklist de lanzamiento](#12-checklist-de-lanzamiento)

---

## 1. Resumen ejecutivo

```
FASE 0          CICLO 1         CD-1    CICLO 2          CD-2    CICLO 3
8–21 mayo       22 may–2 jul    2 sem   17 jul–27 ago    2 sem   11 sep–22 oct
──────────────  ──────────────  ─────   ───────────────  ─────   ───────────────
Dominio         Identidad       Bug     Monedero         Bug     Rifas &
Correo          y Acceso        fix     Rickoin          fix     Marketplace
Azure                           Rest                    Rest
Dev setup


        CD-3    CICLO 4              CD-4    CICLO 5          CD-5    GO-LIVE
        2 sem   6 nov–17 dic 2026    2 sem   2 ene–12 feb     2 sem   27 feb–12 mar
        ─────   ──────────────────   ─────   ──────────────   ─────   ─────────────
        Bug     Motor Sorteos        Navidad Operaciones      Final   Lanzamiento
        fix     y Premios            Rest    y Estabilidad    QA      Producción
        Rest
```

### Fechas clave

| Hito | Fecha |
|---|---|
| Inicio de Fase 0 | 8 de mayo de 2026 |
| Fin de Fase 0 / Inicio Ciclo 1 | 22 de mayo de 2026 |
| Fin Ciclo 1 — Identidad funcional en Dev | 2 de julio de 2026 |
| Fin Ciclo 2 — Monedero operativo en Dev | 27 de agosto de 2026 |
| Fin Ciclo 3 — Primera rifa vendible en Dev | 22 de octubre de 2026 |
| Fin Ciclo 4 — Sorteo end-to-end funcional | 17 de diciembre de 2026 |
| Fin Ciclo 5 — Plataforma producción-ready | 12 de febrero de 2027 |
| Despliegue a Producción | 27 de febrero de 2027 |
| **Go-Live público** | **12 de marzo de 2027** |

---

## 2. Roles y herramientas

### Equipo por ciclo

| Rol | Responsabilidad | Cantidad |
|---|---|---|
| Diseñador | UI/UX, wireframes, HTML/CSS/Razor Views, accesibilidad | 1 |
| Programador Senior | Arquitectura, Application layer, Domain, seguridad, Infrastructure | 1 |
| Programador Junior | Controllers, Views lógica, EF Core, tests Playwright | 1 |

> En los ciclos de cool-down no hay desarrollo activo. El equipo usa ese tiempo para corregir bugs menores, actualizar documentación y preparar el pitch del siguiente ciclo.

### Stack confirmado

| Capa | Tecnología |
|---|---|
| Framework | ASP.NET Core MVC (.NET 8) |
| ORM | Entity Framework Core 8 — Code First |
| Base de datos | SQL Server (Azure SQL Database) |
| Hosting | Azure App Service (Windows) |
| Secrets | Azure Key Vault |
| Correo transaccional | SendGrid |
| Correo corporativo | Yopmail.com (Dev/Staging) — Google Workspace (previo al go-live) |
| Tests E2E | Playwright for .NET |
| Control de versiones | Git / GitHub |
| Gestión del proyecto | Basecamp (Kanban por ciclo) |
| Monitoreo | Azure Application Insights + Serilog |
| DNS | Administrador del registrar del dominio |

### Herramientas de desarrollo (instaladas en Fase 0)

- Visual Studio 2022 o VS Code + extensión C#
- .NET 8 SDK
- SQL Server 2022 Developer Edition (local) + SQL Server Management Studio
- Azure CLI (`az`)
- Playwright CLI (`playwright`)
- Git + GitHub Desktop o CLI
- Postman (para pruebas manuales de endpoints)

---

## 3. Fase 0 — Preproducción (8–21 de mayo de 2026)

> **Propósito de la Fase 0:** Dejar toda la infraestructura, herramientas y accesos listos antes de escribir una sola línea de código de producto. Nada del Ciclo 1 empieza hasta que esta fase esté 100 % completa.

---

### 3.1 Compra y configuración del dominio

#### Paso 1 — Elegir y comprar el dominio

**Dominio recomendado:** `rickoin.co`  
**Alternativas:** `rickoin.com`, `rickoin.com.co`, `rickoin.app`

**Registrares recomendados (con soporte para DNS avanzado):**

| Registrar | URL | Precio anual .co | Notas |
|---|---|---|---|
| **Namecheap** (recomendado) | namecheap.com | ~$13 USD | Panel DNS excelente, integración sencilla |
| GoDaddy | godaddy.com | ~$15 USD | Popular pero interfaz confusa |
| Porkbun | porkbun.com | ~$10 USD | Muy económico, DNS incluido |

**Acción:** Registrar `rickoin.co` en Namecheap. Período mínimo: 2 años.

#### Paso 2 — Configurar DNS base

Una vez adquirido el dominio, configurar los siguientes registros en el panel DNS del registrar:

```
# Apuntar el dominio a Azure App Service (se completa en el Paso de Azure)
Tipo: A         Host: @          Valor: [IP del App Service de Prod]     TTL: 300
Tipo: CNAME     Host: www        Valor: rickoin-prod.azurewebsites.net   TTL: 300

# Subdominio de staging (no público)
Tipo: CNAME     Host: staging    Valor: rickoin-staging.azurewebsites.net  TTL: 300

# Certificado SSL — Azure gestiona el certificado automáticamente con App Service Managed Certificates
# (configurar en el paso de Azure)
```

> **Nota:** Los registros MX para el correo corporativo se agregan en el Paso 3.2.  
> **Nota:** Los registros SPF, DKIM y DMARC para SendGrid se agregan en el Paso 3.3.

#### Paso 3 — Verificar propagación del DNS

```bash
# Verificar que los registros se propagaron (puede tardar hasta 48 h)
nslookup rickoin.co
nslookup www.rickoin.co
```

**Criterio de cierre del paso:** `rickoin.co` y `www.rickoin.co` resuelven correctamente a Azure App Service.

---

### 3.2 Correos para desarrollo y pruebas — Yopmail.com

> **⚠ Google Workspace diferido:** Los correos corporativos `@rickoin.co` se configuran en el **Ciclo 5 (Scope C5-D)**, justo antes del go-live, cuando ya se tenga cuenta bancaria y dominio activo con pago. Durante todo el desarrollo y las pruebas (Fases 0 a Ciclo 4 completo) se usan cuentas de **Yopmail.com**.

#### Por qué Yopmail para desarrollo

- Servicio gratuito de correos desechables — no requiere registro ni contraseña
- Cualquier dirección `@yopmail.com` existe automáticamente
- Se puede leer el buzón en [yopmail.com](https://yopmail.com) ingresando el nombre del usuario
- Perfecto para probar flujos de OTP, aprobación de cuentas y notificaciones sin necesitar correos reales
- Los correos llegan en segundos — se pueden leer directamente en el navegador

#### Cuentas Yopmail del proyecto

| Correo | Rol | Uso |
|---|---|---|
| `rickoin.admin@yopmail.com` | Administrador de la plataforma (Dev/Staging) | Login al panel admin, recibe correos de revisión de usuarios |
| `rickoin.soporte@yopmail.com` | Soporte (Dev/Staging) | Pruebas de contacto y notificaciones |
| `rickoin.noreply@yopmail.com` | Remitente ficticio (Dev) | En Dev con `MockEmailService`, el From aparece como esta dirección en los logs |
| `rickoin.test1@yopmail.com` | Usuario de prueba 1 | Ciclo 1 — pruebas de registro y OTP |
| `rickoin.test2@yopmail.com` | Usuario de prueba 2 | Ciclos 2-3 — pruebas de monedero y boletas |
| `rickoin.test3@yopmail.com` | Usuario de prueba 3 | Ciclo 4 — pruebas de sorteo y ganador |
| `rickoin.ganador@yopmail.com` | Usuario ganador de prueba | Ciclo 4 — probar flujo de reclamación de premio |

> **Cómo leer los correos:** abrir [yopmail.com](https://yopmail.com), ingresar el nombre (ej: `rickoin.admin`) y presionar Enter. El buzón carga sin contraseña. Los correos se borran automáticamente a los 8 días.

#### Configuración en el código (Dev y Staging)

En ambiente de **Dev** (`MockMode = true`), los correos no se envían — se escriben al log de Serilog con el asunto y cuerpo completo. Se pueden leer en la consola o en el archivo de log.

En ambiente de **Staging**, SendGrid sí envía los correos. El campo `From` de SendGrid se configura con una dirección verificada temporalmente (puede ser una cuenta personal del desarrollador mientras no existan los correos corporativos). Los destinatarios de prueba son las cuentas Yopmail.

```json
// appsettings.Staging.json (sin secretos — solo configuración)
{
  "SendGrid": {
    "FromName": "Rickoin (Staging)",
    "FromEmail": "rickoin.noreply@yopmail.com"
  }
}
```

> **Nota:** Yopmail no puede recibir correos de todos los servidores — algunos proveedores bloquean el envío a yopmail.com. Si SendGrid bloquea la entrega, usar como alternativa `mailinator.com` (funciona igual, también gratuito y sin registro).

**Criterio de cierre de este paso:** en ambiente de Staging, enviar un correo de prueba a `rickoin.test1@yopmail.com` y verificarlo en [yopmail.com](https://yopmail.com).

---

### 3.2-B Correos corporativos (Google Workspace) — diferido al Ciclo 5

> Esta sección se ejecuta durante el **Cool-Down 5** (13–26 febrero 2027), antes del go-live.

#### Cuentas corporativas a crear

| Correo | Uso | Necesita licencia |
|---|---|---|
| `admin@rickoin.co` | Admin de la plataforma + admin de Google Workspace | ✅ Sí |
| `soporte@rickoin.co` | Atención a usuarios | ✅ Sí |
| `noreply@rickoin.co` | Alias — correos transaccionales enviados por SendGrid | Como alias de admin@ |
| `pagos@rickoin.co` | Alias — notificaciones de pagos y retiros | Como alias de admin@ |

La configuración completa (registros MX, verificación de dominio, aliases) se realiza en el **Scope C5-D** junto con los documentos legales y las páginas institucionales, como parte de la preparación final para el lanzamiento.

---

### 3.3 Configuración de SendGrid

**Por qué SendGrid:** envío transaccional confiable con hasta 100 correos/día en el plan gratuito. Plan Essentials (~$20/mes) cuando se superen los 100/día.

#### Paso a paso — Configuración de SendGrid

```
1. Crear cuenta en sendgrid.com
   → Email: rickoin.admin@yopmail.com  ← usar Yopmail durante desarrollo; cambiar a admin@rickoin.co en go-live
   → Nombre de la empresa: Rickoin

2. Verificar sender identity (dominio):
   Settings → Sender Authentication → Domain Authentication
   → Ingresar dominio: rickoin.co
   → SendGrid generará registros DNS para agregar:
   
   Tipo: CNAME   Host: em1234.rickoin.co    Valor: u1234.wl.sendgrid.net
   Tipo: CNAME   Host: s1._domainkey...     Valor: s1.domainkey...
   Tipo: CNAME   Host: s2._domainkey...     Valor: s2.domainkey...
   
   Agregar estos registros en el panel DNS del registrar.
   Volver a SendGrid y hacer clic en "Verify".

3. Configurar SPF y DMARC (defensa contra spoofing):
   
   # SPF (incluir sendgrid.net en los remitentes autorizados)
   Tipo: TXT   Host: @   Valor: "v=spf1 include:sendgrid.net ~all"
   
   # DMARC
   Tipo: TXT   Host: _dmarc   Valor: "v=DMARC1; p=none; rua=mailto:rickoin.admin@yopmail.com"

4. Crear API Key:
   Settings → API Keys → Create API Key
   Nombre: "Rickoin-Production"
   Permisos: "Restricted Access" → Mail Send: FULL ACCESS
   → Copiar la clave y guardar en Azure Key Vault (Paso 3.4)
   
   Segunda clave para Staging:
   Nombre: "Rickoin-Staging"
   → Guardar también en Key Vault como secreto de staging

5. Crear plantillas de correo transaccional (Dynamic Templates):

   a) OTP_VERIFICACION
      Asunto: "Tu código de verificación Rickoin: {{otp}}"
      Body: Código de 6 dígitos, vigencia 15 min, botón "No fui yo"
   
   b) APROBACION_CUENTA
      Asunto: "¡Tu cuenta Rickoin ha sido aprobada!"
      Body: Bienvenida, enlace directo a la plataforma
   
   c) RECHAZO_CUENTA
      Asunto: "Actualización sobre tu cuenta Rickoin"
      Body: Motivo del rechazo (variable {{motivo}}), enlace para reenviar documento
   
   d) RECUPERACION_PASSWORD
      Asunto: "Restablece tu contraseña Rickoin"
      Body: Enlace de un solo uso, válido por {{horas}} horas
   
   e) NOTIFICACION_RETIRO
      Asunto: "Solicitud de retiro {{estado}}"
      Body: Monto, estado, motivo si aplica
   
   f) GANADOR_RIFA
      Asunto: "¡Felicidades! Ganaste la rifa: {{titulo_rifa}}"
      Body: Instrucciones para reclamar, botón con token único, vigencia {{dias}} días
   
   g) REVISION_USUARIO_ADMIN
      Asunto: "[Admin] Nuevo usuario pendiente: {{nombre}}"
      Body: Datos del usuario, botón [Aprobar], botón [Rechazar]
      (correo va a rickoin.admin@yopmail.com durante desarrollo — a admin@rickoin.co en producción)

6. Verificar envío de prueba:
   Settings → API Keys → usar la clave → enviar correo de prueba
```

**Criterio de cierre:** correo enviado via SendGrid llega a `rickoin.test1@yopmail.com` y se puede verificar en [yopmail.com](https://yopmail.com). El dominio del remitente queda verificado en SendGrid.

---

### 3.4 Recursos Azure

#### Estructura de recursos (dos grupos)

```
Suscripción Azure: Rickoin
│
├── Grupo de recursos: rickoin-dev
│   ├── App Service: rickoin-dev (Plan B1 — ~$13/mes)
│   ├── Azure SQL Database: rickoin-db-dev (Basic 2 GB — ~$5/mes)
│   └── Key Vault: rickoin-kv-dev
│
├── Grupo de recursos: rickoin-staging
│   ├── App Service: rickoin-staging (Plan B2 — ~$30/mes)
│   ├── Azure SQL Database: rickoin-db-staging (S0 — ~$15/mes)
│   └── Key Vault: rickoin-kv-staging
│
└── Grupo de recursos: rickoin-prod
    ├── App Service: rickoin-prod (Plan P1v3 — ~$75/mes)
    ├── Azure SQL Database: rickoin-db-prod (S2 — ~$75/mes)
    ├── Key Vault: rickoin-kv-prod
    └── Application Insights: rickoin-insights
```

> **Costo mensual estimado en producción:** ~$200 USD/mes (App Service P1v3 + SQL S2 + Key Vault + Application Insights). Dev y Staging suman ~$65 USD/mes adicionales durante el desarrollo. A partir del go-live, dev y staging se escalan a planes mínimos (~$20/mes en total).

#### Paso a paso — Creación de recursos (Azure CLI)

```bash
# 1. Login
az login

# 2. Crear grupo de recursos de dev
az group create --name rickoin-dev --location eastus2

# 3. Crear Key Vault (dev)
az keyvault create \
  --name rickoin-kv-dev \
  --resource-group rickoin-dev \
  --location eastus2 \
  --enable-soft-delete true

# 4. Crear SQL Server
az sql server create \
  --name rickoin-sql-server \
  --resource-group rickoin-dev \
  --location eastus2 \
  --admin-user rickoin_admin \
  --admin-password "<contraseña segura>"

# 5. Crear base de datos dev
az sql db create \
  --resource-group rickoin-dev \
  --server rickoin-sql-server \
  --name rickoin-db-dev \
  --edition Basic \
  --capacity 5

# 6. Agregar regla de firewall (solo IPs del equipo)
az sql server firewall-rule create \
  --resource-group rickoin-dev \
  --server rickoin-sql-server \
  --name AllowDevTeam \
  --start-ip-address <ip-del-desarrollador> \
  --end-ip-address <ip-del-desarrollador>

# 7. Crear App Service Plan y App Service (dev)
az appservice plan create \
  --name rickoin-plan-dev \
  --resource-group rickoin-dev \
  --sku B1 \
  --is-linux false

az webapp create \
  --name rickoin-dev \
  --resource-group rickoin-dev \
  --plan rickoin-plan-dev \
  --runtime "DOTNET:8.0"

# 8. Habilitar Managed Identity en el App Service (para acceder a Key Vault sin credenciales)
az webapp identity assign \
  --name rickoin-dev \
  --resource-group rickoin-dev

# 9. Dar acceso al App Service a Key Vault (política de acceso)
# (reemplazar <principal-id> con el ID devuelto en el paso anterior)
az keyvault set-policy \
  --name rickoin-kv-dev \
  --object-id <principal-id> \
  --secret-permissions get list

# 10. Guardar secretos en Key Vault
az keyvault secret set --vault-name rickoin-kv-dev --name "ConnectionStrings--DefaultConnection" \
  --value "Server=rickoin-sql-server.database.windows.net;Database=rickoin-db-dev;User Id=rickoin_admin;Password=<pwd>"

az keyvault secret set --vault-name rickoin-kv-dev --name "SendGrid--ApiKey" \
  --value "<sendgrid-api-key-staging>"

az keyvault secret set --vault-name rickoin-kv-dev --name "SendGrid--FromEmail" \
  --value "noreply@rickoin.co"

az keyvault secret set --vault-name rickoin-kv-dev --name "Auth--CookieSecret" \
  --value "<cookie-secret-32-chars>"

# 11. Repetir pasos 2-10 para el grupo rickoin-staging y rickoin-prod
#     (con nombres y planes distintos)

# 12. Crear Application Insights (solo prod)
az monitor app-insights component create \
  --app rickoin-insights \
  --location eastus2 \
  --resource-group rickoin-prod \
  --application-type web
```

#### Configurar dominio personalizado en App Service (prod)

```bash
# Agregar dominio personalizado al App Service de producción
az webapp config hostname add \
  --webapp-name rickoin-prod \
  --resource-group rickoin-prod \
  --hostname rickoin.co

az webapp config hostname add \
  --webapp-name rickoin-prod \
  --resource-group rickoin-prod \
  --hostname www.rickoin.co

# Crear certificado SSL administrado por Azure (gratuito)
az webapp config ssl create \
  --name rickoin-prod \
  --resource-group rickoin-prod \
  --hostname rickoin.co

# Binding del certificado
az webapp config ssl bind \
  --name rickoin-prod \
  --resource-group rickoin-prod \
  --certificate-thumbprint <thumbprint> \
  --ssl-type SNI

# Forzar HTTPS
az webapp update \
  --name rickoin-prod \
  --resource-group rickoin-prod \
  --https-only true
```

**Criterio de cierre:** los tres ambientes (Dev, Staging, Prod) están creados. El App Service de Dev está accesible en `rickoin-dev.azurewebsites.net`. Los secretos están en Key Vault. No hay credenciales en el código.

---

### 3.5 Repositorio y entorno de desarrollo

#### GitHub — Estructura del repositorio

```bash
# Crear repositorio en GitHub (privado)
# Nombre: rickoin
# Descripción: Plataforma de rifas digitales con moneda virtual

# Estructura de ramas
main          → código deployado en Producción
staging       → código deployado en Staging (pre-prod)
develop       → integración de features completadas
feature/*     → ramas de trabajo por tarea (feature/login, feature/otp, etc.)
bugfix/*      → correcciones de bugs
hotfix/*      → correcciones urgentes sobre main

# Protecciones obligatorias (GitHub → Settings → Branches)
main:    Requiere pull request + aprobación + status checks (build)
staging: Requiere pull request + status checks (build)
develop: Sin protección — merge directo permitido para el equipo
```

#### Creación de la solución .NET

```bash
# Crear directorio del proyecto
mkdir rickoin-src
cd rickoin-src

# Crear solución
dotnet new sln -n Rickoin

# Crear los 7 proyectos (arquitectura en capas)
dotnet new classlib -n Rickoin.Constants  -o src/Rickoin.Constants
dotnet new classlib -n Rickoin.Models     -o src/Rickoin.Models
dotnet new classlib -n Rickoin.Domain     -o src/Rickoin.Domain
dotnet new classlib -n Rickoin.Helpers    -o src/Rickoin.Helpers
dotnet new classlib -n Rickoin.Infrastructure -o src/Rickoin.Infrastructure
dotnet new classlib -n Rickoin.Application   -o src/Rickoin.Application
dotnet new mvc      -n Rickoin.Web           -o src/Rickoin.Web

# Agregar todos los proyectos a la solución
dotnet sln add src/Rickoin.Constants/Rickoin.Constants.csproj
dotnet sln add src/Rickoin.Models/Rickoin.Models.csproj
dotnet sln add src/Rickoin.Domain/Rickoin.Domain.csproj
dotnet sln add src/Rickoin.Helpers/Rickoin.Helpers.csproj
dotnet sln add src/Rickoin.Infrastructure/Rickoin.Infrastructure.csproj
dotnet sln add src/Rickoin.Application/Rickoin.Application.csproj
dotnet sln add src/Rickoin.Web/Rickoin.Web.csproj

# Crear proyecto de pruebas Playwright
dotnet new nunit   -n Rickoin.Tests.E2E   -o tests/Rickoin.Tests.E2E
dotnet sln add tests/Rickoin.Tests.E2E/Rickoin.Tests.E2E.csproj

# Agregar referencias entre proyectos (jerarquía de dependencias)
# Constants → (sin dependencias)
# Models → Constants
# Domain → Models
# Helpers → Models
# Infrastructure → Domain + Helpers
# Application → Domain + Infrastructure + Helpers
# Web → Application + Helpers + Constants

dotnet add src/Rickoin.Models/Rickoin.Models.csproj reference src/Rickoin.Constants/Rickoin.Constants.csproj
dotnet add src/Rickoin.Domain/Rickoin.Domain.csproj reference src/Rickoin.Models/Rickoin.Models.csproj
dotnet add src/Rickoin.Helpers/Rickoin.Helpers.csproj reference src/Rickoin.Models/Rickoin.Models.csproj
dotnet add src/Rickoin.Infrastructure/Rickoin.Infrastructure.csproj reference src/Rickoin.Domain/Rickoin.Domain.csproj
dotnet add src/Rickoin.Infrastructure/Rickoin.Infrastructure.csproj reference src/Rickoin.Helpers/Rickoin.Helpers.csproj
dotnet add src/Rickoin.Application/Rickoin.Application.csproj reference src/Rickoin.Domain/Rickoin.Domain.csproj
dotnet add src/Rickoin.Application/Rickoin.Application.csproj reference src/Rickoin.Infrastructure/Rickoin.Infrastructure.csproj
dotnet add src/Rickoin.Application/Rickoin.Application.csproj reference src/Rickoin.Helpers/Rickoin.Helpers.csproj
dotnet add src/Rickoin.Web/Rickoin.Web.csproj reference src/Rickoin.Application/Rickoin.Application.csproj
dotnet add src/Rickoin.Web/Rickoin.Web.csproj reference src/Rickoin.Helpers/Rickoin.Helpers.csproj
dotnet add src/Rickoin.Web/Rickoin.Web.csproj reference src/Rickoin.Constants/Rickoin.Constants.csproj

# NuGet packages esenciales
cd src/Rickoin.Infrastructure
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Azure.Security.KeyVault.Secrets
dotnet add package Azure.Identity
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.File

cd ../Rickoin.Web
dotnet add package Microsoft.AspNetCore.Authentication.Cookies
dotnet add package SendGrid
dotnet add package Microsoft.Extensions.Azure
dotnet add package Microsoft.ApplicationInsights.AspNetCore

# Tests Playwright
cd ../../tests/Rickoin.Tests.E2E
dotnet add package Microsoft.Playwright.NUnit

# Instalar Playwright browsers
dotnet build
pwsh bin/Debug/net8.0/playwright.ps1 install
```

#### Archivos de configuración inicial

```json
// appsettings.json (en el repo — sin secretos)
{
  "Logging": {
    "LogLevel": { "Default": "Information" }
  },
  "AllowedHosts": "*",
  "SendGrid": {
    "FromName": "Rickoin",
    "FromEmail": "noreply@rickoin.co"
  },
  "Auth": {
    "CookieExpirationMinutes": 1440,
    "StepUpExpirationMinutes": 20
  }
}

// appsettings.Development.json (en el repo — valores de dev sin secretos)
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=RickoinDev;Trusted_Connection=True"
  },
  "SendGrid": {
    "MockMode": true
  }
}

// .gitignore — asegurar que los secretos locales no entren al repo
**/appsettings.Local.json
**/appsettings.Secrets.json
**/*.user
**/bin/
**/obj/
**/.vs/
```

**Criterio de cierre de la Fase 0:**

- [ ] Dominio `rickoin.co` registrado y DNS propagado
- [ ] Cuentas Yopmail del proyecto verificadas (`rickoin.admin@yopmail.com`, `rickoin.test1@yopmail.com`, etc.)
- [ ] Correo de prueba recibido en Yopmail desde SendGrid Staging sin caer en spam
- [ ] SendGrid verificado con dominio — correo de prueba enviado sin caer en spam
- [ ] Los tres ambientes Azure creados (Dev, Staging, Prod) — App Services accesibles
- [ ] Key Vault con secretos de Dev cargados (connection string, SendGrid API key, cookie secret)
- [ ] Repositorio GitHub creado con estructura de ramas
- [ ] Solución .NET con 7 proyectos creada, compila sin errores
- [ ] Proyecto Playwright creado con browsers instalados
- [ ] `dotnet ef` instalado y funcional

---

### 3.6 Tres ambientes: Dev / Staging / Prod

| | Dev | Staging | Production |
|---|---|---|---|
| **URL** | rickoin-dev.azurewebsites.net | staging.rickoin.co | rickoin.co |
| **Base de datos** | SQL local / Azure Basic | Azure S0 | Azure S2 |
| **SendGrid** | `MockMode = true` (correos al log) | API Key Staging — correos reales | API Key Prod — correos reales |
| **Azure App Service** | B1 | B2 | P1v3 |
| **HTTPS** | No obligatorio | Sí | Sí (forzado) |
| **Deploy** | Manual (CLI o VS) | Merge a `staging` (automático) | Merge a `main` (manual + aprobación) |
| **Playwright** | No corre | Corre en cada merge a staging | Smoke test post-deploy |
| **Application Insights** | No | Básico | Completo |
| **Acceso** | Equipo de desarrollo | Equipo interno + QA | Público |

---

## 4. Ciclo 1 — Identidad y Acceso (22 mayo – 2 julio 2026)

**Apetito:** Big Batch — 6 semanas  
**Equipo:** 1 diseñador + 2 programadores  
**Resultado al cierre del ciclo:** Un usuario puede registrarse, confirmar OTP, quedar en Modo Observador, y ser aprobado o rechazado por el administrador. El sistema de login completo con bloqueo, recuperación de contraseña y panel admin básico. Deployado en Dev y Staging.

---

### Scopes del Ciclo 1

> En Shape Up, los **scopes** son porciones de trabajo que atraviesan toda la pila (base de datos, backend, frontend). Cada scope es entregable de forma independiente.

```
SCOPE C1-A │ Base de datos y estructura del proyecto
SCOPE C1-B │ Registro y OTP
SCOPE C1-C │ Modo Observador — dashboard lectura
SCOPE C1-D │ Login, bloqueo y recuperación
SCOPE C1-E │ Panel admin — lista y aprobación de usuarios
SCOPE C1-F │ Deploy a Dev y Staging
```

---

### SCOPE C1-A — Base de datos y estructura del proyecto

**Semana:** 1  
**Quién:** Programador Senior

| Tarea | Detalle |
|---|---|
| Crear entidad `Usuario` | Id (GUID), NombreCompleto, Email (UK), PasswordHash (varbinary), PasswordSalt (varbinary), Estado, Rol, CodigoOtp, OtpExpiracion, TokenRecuperacion, TokenRecuperacionExp, TokenRecuperacionUsado, DocumentoPdfEnviadoEn, IntentosFallidosLogin, BloqueadoHasta, CreadoEn, ActualizadoEn |
| Configurar `RickoinsDbContext` | `OnModelCreating` con fluent API — constraints, índices, conversiones de enum a string |
| Crear migración inicial | `dotnet ef migrations add InitialCreate` — tabla `Usuarios` |
| Aplicar migración a Dev | `dotnet ef database update` contra SQL local |
| Configurar Key Vault en `Program.cs` | `AddAzureKeyVault` con Managed Identity — lectura del connection string |
| Configurar Serilog | Salida a consola (Dev) + archivo rolling daily (producción) |
| Configurar Cookie Authentication | `AddAuthentication().AddCookie()` — claims de rol, expiración 24h |
| Definir constantes base | `Rickoin.Constants`: roles, estados de usuario, claves de claims |
| Seed inicial | Admin creado con `HasData` — email: `rickoin.admin@yopmail.com`, `PasswordHelper.CrearHash("pass-inicial")` (cambiar en go-live por `admin@rickoin.co`) |
| Crear `PasswordHelper` | HMACSHA512 + salt — métodos `CrearHash(string password)` y `VerificarHash(string password, byte[] hash, byte[] salt)` en `Rickoin.Helpers` |

**Criterio de cierre:** `dotnet ef database update` aplica sin errores. Tabla `Usuarios` existe con todos los campos y restricciones. La solución compila.

---

### SCOPE C1-B — Registro y OTP

**Semana:** 2–3  
**Quién:** Programador Junior + Diseñador

| Tarea | Detalle |
|---|---|
| Página de registro | Campos: NombreCompleto, Email, Contraseña, ConfirmarContraseña — validaciones client + server |
| `UsuarioService.RegistrarAsync()` | Verifica email duplicado, hashea contraseña, genera OTP de 6 dígitos, envía correo OTP, guarda usuario con estado `PendienteOtp` |
| Página de confirmación OTP | Campo de 6 dígitos, botón "Reenviar código", contador de tiempo |
| `UsuarioService.ConfirmarOtpAsync()` | Valida código y expiración, cambia estado a `Observador`, invalida el OTP |
| Envío de correo OTP | `SendGridService.EnviarOtpAsync()` usando template `OTP_VERIFICACION` (en Dev: `MockEmailService` que escribe al log) |
| Reenvío de OTP | Genera nuevo código, invalida el anterior, vuelve a enviar |
| Protección anti-abuso | Máx 3 reenvíos por sesión de registro |
| Audit log | `AuditLogs`: eventos `USUARIO_REGISTRADO`, `OTP_CONFIRMADO`, `OTP_FALLIDO` |

---

### SCOPE C1-C — Modo Observador — dashboard de lectura

**Semana:** 3  
**Quién:** Diseñador + Programador Junior

| Tarea | Detalle |
|---|---|
| Layout base del dashboard | Header con nombre, estado de cuenta, saldo (oculto en observador), menú de navegación |
| Banner de cuenta en revisión | Visible en todas las páginas para usuarios en estado `Observador` |
| Página de catálogo (mock) | Grid de rifas con estado — los botones de compra muestran tooltip "Activa tu cuenta para participar" |
| Middleware de autorización | Intercepta peticiones a rutas protegidas desde cuentas `Observador` — retorna 403 |
| Página de subir documento | PDF únicamente, máx 5 MB — botón disponible en modo observador |
| Envío del PDF al admin | `EmailService.EnviarDocumentoParaRevisionAsync()` — el PDF es adjunto del correo, no se guarda en la BD |
| Perfil de usuario | Estado de cuenta visible, sección de documento con estado ("Pendiente de revisión") |

---

### SCOPE C1-D — Login, bloqueo y recuperación de contraseña

**Semana:** 4  
**Quién:** Programador Senior + Programador Junior

| Tarea | Detalle |
|---|---|
| Página de login | Email + contraseña — validaciones, manejo de errores claro |
| `AuthService.LoginAsync()` | Verifica credenciales con `PasswordHelper.VerificarHash()`, verifica estado de cuenta, emite cookie con claims de rol y estado |
| Bloqueo por intentos fallidos | Incrementa `IntentosFallidosLogin`; a partir del 5° intento: `BloqueadoHasta = now + 30 min`, estado `Bloqueado` |
| Desbloqueo automático | Al intentar login, si `BloqueadoHasta < now` → restablece contador y estado `Activo` |
| Página de recuperación | Ingresa correo → si existe, envía token de recuperación por correo |
| `AuthService.SolicitarRecuperacionAsync()` | Genera token de 32 chars (GUID), guarda en `TokenRecuperacion`, establece expiración |
| Página de nueva contraseña | Recibe token en query string, valida vigencia y que no haya sido usado, acepta nueva contraseña |
| `AuthService.RestablecerPasswordAsync()` | Verifica token, hashea nueva contraseña, marca token como usado, guarda |
| Logout | Elimina cookie, limpia sesión financiera |
| Audit log | `LOGIN_EXITOSO`, `LOGIN_FALLIDO`, `CUENTA_BLOQUEADA`, `PASSWORD_RECUPERADO` |

---

### SCOPE C1-E — Panel admin — gestión de usuarios

**Semana:** 4–5  
**Quién:** Programador Junior + Diseñador

| Tarea | Detalle |
|---|---|
| Login del administrador | Redirigir a panel admin al detectar rol `Administrador` en los claims |
| Página: lista de usuarios | Tabla paginada con filtros por estado — badge con cantidad de pendientes en el header |
| Página: detalle de usuario | Datos del usuario, estado de cuenta, fecha de envío del documento |
| Botón aprobar cuenta | Cambia estado a `Activo`, envía correo de aprobación al usuario, registra en `AuditLogs` |
| Botón rechazar cuenta | Modal con campo obligatorio "Motivo de rechazo", cambia estado a `Rechazado`, envía correo con motivo |
| Deep links desde correo | El correo de revisión de documento contiene URL directa al panel admin para ese usuario |
| Vista de usuarios activos | Lista con acceso a historial y acciones futuras (bloqueo manual — Ciclo 5) |
| Audit log | `CUENTA_APROBADA`, `CUENTA_RECHAZADA` |

---

### SCOPE C1-F — Deploy a Dev y Staging

**Semana:** 5–6  
**Quién:** Programador Senior

| Tarea | Detalle |
|---|---|
| Publicar a Dev | `dotnet publish` + deploy al App Service `rickoin-dev` vía Azure CLI |
| Aplicar migraciones en Dev | `dotnet ef database update --connection "..."` |
| Smoke test en Dev | Verificar registro → OTP → login → panel admin manualmente |
| Configurar deploy automático a Staging | GitHub Action: en merge a `staging` → `dotnet publish` → deploy a `rickoin-staging` |
| Aplicar migraciones en Staging | En el pipeline: `dotnet ef database update` |
| Configurar SendGrid en Staging | Usar API Key Staging — correos reales para pruebas |
| Ejecutar suite Playwright en Staging | Ver Sección 10 — pruebas del Ciclo 1 |
| Configurar Application Insights básico | Solo en Staging para este ciclo |

---

### Pruebas Playwright — Ciclo 1

> **Principio:** los tests Playwright corren contra el ambiente de Staging, no contra Dev. Se ejecutan automáticamente en el pipeline de Staging (ver Sección 10 para la estrategia completa).

| ID Test | Escenario | Tipo |
|---|---|---|
| PW-C1-001 | Registro exitoso → OTP → estado Observador | Happy path |
| PW-C1-002 | Registro con email duplicado → mensaje de error | Validación |
| PW-C1-003 | OTP expirado → reenviar OTP → confirmar con nuevo código | Edge case |
| PW-C1-004 | 3 reenvíos de OTP → bloqueo de reenvío | Límite |
| PW-C1-005 | Usuario Observador intenta acceder a ruta protegida → 403 | Seguridad |
| PW-C1-006 | Login exitoso como usuario activo → dashboard | Happy path |
| PW-C1-007 | Login como administrador → panel admin | Happy path |
| PW-C1-008 | 5 intentos fallidos de login → cuenta bloqueada 30 min | Seguridad |
| PW-C1-009 | Recuperación de contraseña end-to-end | Happy path |
| PW-C1-010 | Token de recuperación ya usado → error al intentar reusarlo | Seguridad |
| PW-C1-011 | Admin aprueba cuenta → usuario recibe correo (stub) | Integración |
| PW-C1-012 | Admin rechaza cuenta sin motivo → validación error | Validación |
| PW-C1-013 | Subir PDF de identidad → correo enviado al admin | Integración |
| PW-C1-014 | Subir archivo que no es PDF → error de validación | Validación |
| PW-C1-015 | Subir PDF mayor a 5 MB → error de validación | Validación |

---

### Cool-Down 1 (3–16 de julio de 2026)

| Actividad | Responsable |
|---|---|
| Corrección de bugs encontrados en Staging | Dev Junior |
| Revisión de seguridad manual de todos los flujos de autenticación (OWASP A07) | Dev Senior |
| Shapear el pitch del Ciclo 2 (Monedero Rickoin) | Dev Senior + Diseñador |
| Actualizar documentación técnica (si cambió algo del plan durante el ciclo) | Dev Senior |
| Preparar datos de prueba para el Ciclo 2 (usuarios activos con seed) | Dev Junior |
| Retrospectiva del Ciclo 1 | Equipo completo |

---

## 5. Ciclo 2 — Monedero Rickoin (17 julio – 27 agosto 2026)

**Apetito:** Big Batch — 6 semanas  
**Resultado al cierre:** El usuario activo puede acceder a la zona financiera (Step-Up Auth), ver su saldo de Rickoin y Fichas, ver el historial completo de movimientos, simular una compra de Rickoin (con pasarela de pago mock en Dev/Staging), y solicitar un retiro que el administrador gestiona desde el panel.

---

### Scopes del Ciclo 2

```
SCOPE C2-A │ Step-Up Authentication y sesión financiera
SCOPE C2-B │ Wallets — saldo y migraciones
SCOPE C2-C │ Compra de Rickoin — flujo y pasarela (mock)
SCOPE C2-D │ Retiros — solicitud y gestión admin
SCOPE C2-E │ Asignación de Fichas por el administrador
SCOPE C2-F │ Historial de movimientos y estados del monedero
```

---

### SCOPE C2-A — Step-Up Authentication y sesión financiera

| Tarea | Detalle |
|---|---|
| Middleware `FinancialSessionMiddleware` | Verifica claim `StepUpExpiresAt` en el cookie; si ausente o expirado → redirige a step-up |
| Página de Step-Up | Opciones: (1) confirmar contraseña, (2) código OTP enviado al correo |
| `StepUpService.AutenticarAsync()` | Verifica credencial, emite claim `StepUpExpiresAt = now + 20 min` en el cookie |
| Renovación automática de sesión financiera | Cada acción en zona financiera renueva el timestamp |
| Expiración por inactividad | Al detectar expiración → redirección al step-up con `returnUrl` preservado |
| Audit log | `STEPUP_EXITOSO` |

---

### SCOPE C2-B — Wallets — saldo y migraciones

| Tarea | Detalle |
|---|---|
| Migración EF Core: `Wallets` + `Transacciones` | Según definición del documento de BD — con CHECK constraints |
| Seed de wallets al aprobar usuario | `UsuarioService.AprobarCuentaAsync()` → crea 2 registros en `Wallets` (Rickoin y Fichas con saldo 0) |
| Servicio `MonederoService` | `ObtenerSaldoAsync(usuarioId, tipoWallet)` — lectura atómica con `UPDLOCK` cuando es parte de una transacción |
| Actualización de saldo | `AcreditarAsync()` y `DebitarAsync()` — siempre dentro de una transacción + INSERT inmutable en `Transacciones` |
| UI: header con saldo | Componente Razor partial — actualización en cada página cargada |
| UI: página de monedero | Saldo Rickoin y Fichas — visual diferenciada (Fichas en color diferente, sin opción de retiro) |

---

### SCOPE C2-C — Compra de Rickoin

| Tarea | Detalle |
|---|---|
| UI: página de compra | Monto en COP → conversión en tiempo real a Rickoin (tasa desde `ConfiguracionSistema`) |
| Mock de pasarela de pago (Dev/Staging) | Formulario que simula aprobación/rechazo sin procesar dinero real — botones "Pago exitoso" y "Pago fallido" |
| `CompraService.IniciarCompraAsync()` | Crea registro pendiente, redirige a pasarela (mock) |
| `CompraService.ConfirmarCompraAsync()` | Llamado por callback de la pasarela — acredita Rickoin, inserta `Transaccion` tipo `Compra` con `TasaConversion` guardada |
| `CompraService.FallarCompraAsync()` | Maneja pago fallido — sin cambio de saldo, registra en `AuditLogs` |
| Página de confirmación | Resumen de la compra: COP pagados, Rickoin recibidos, nuevo saldo |
| Historial de compras | Listado en la pestaña Rickoin del monedero |
| Audit log | `COMPRA_RICKOIN` |

> **Nota importante:** La integración con una pasarela de pago real (PSE, Bancolombia, Wompi) se agrega en el Ciclo 5. En los Ciclos 2, 3 y 4 se trabaja con el mock. Esto permite avanzar en todo el modelo financiero sin bloqueos por la integración bancaria.

---

### SCOPE C2-D — Retiros

| Tarea | Detalle |
|---|---|
| Migración EF Core: `Retiros` | Según definición del documento de BD |
| UI: página de solicitud de retiro | Monto en Rickoin → conversión a COP, campo de datos bancarios (número de cuenta, banco, titular) — los datos bancarios NO se guardan en BD |
| `RetiroService.SolicitarAsync()` | Verifica saldo suficiente, debita Rickoin del wallet (saldo reservado), crea registro `Retiro` en estado `Pendiente`, envía correo al admin con los datos bancarios en el cuerpo del correo |
| UI admin: lista de retiros pendientes | Tabla con monto, usuario, fecha de solicitud — sin datos bancarios en la BD |
| UI admin: aprobar / rechazar retiro | Aprobar → `RetiroService.AprobarAsync()` — estado `Aprobado`, correo al usuario. Rechazar → `RetiroService.RechazarAsync()` — estado `Rechazado`, motivo obligatorio, devuelve Rickoin al wallet, correo al usuario |
| Cancelación por usuario | Dentro del plazo configurado en `PlazoRetiroDias` → `RetiroService.CancelarAsync()` — devuelve Rickoin |
| Historial de retiros | Pestaña en el monedero del usuario |
| Audit log | `RETIRO_SOLICITADO`, `RETIRO_APROBADO`, `RETIRO_RECHAZADO`, `RETIRO_CANCELADO` |

---

### SCOPE C2-E — Fichas — asignación por administrador

| Tarea | Detalle |
|---|---|
| UI admin: asignar Fichas a usuario | Panel → usuario → campo de monto de Fichas + motivo obligatorio |
| `FichasService.AsignarAsync()` | Acredita Fichas en el wallet del tipo `Fichas`, inserta `Transaccion` tipo `AsignacionFichas` |
| UI usuario: saldo de Fichas | Visible en header y monedero — label "Fichas" diferenciado de "Rickoin" |
| Restricción: no retiro de Fichas | El botón de retiro en el wallet de Fichas no existe; el backend rechaza cualquier intento con 400 |
| Historial de Fichas | Pestaña independiente en el monedero |
| Audit log | `FICHAS_ASIGNADAS` |

---

### SCOPE C2-F — Historial de movimientos

| Tarea | Detalle |
|---|---|
| Servicio `TransaccionService.ObtenerHistorialAsync()` | Paginado, filtrable por tipo y rango de fechas, ordenado descendente por `CreadoEn` |
| UI: historial Rickoin | Tabla: fecha, tipo, monto, dirección (crédito/débito), descripción, referencia |
| UI: historial Fichas | Tabla equivalente para Fichas |
| Exportar CSV (nice-to-have) | Solo si sobra tiempo — marcado con `~` en el scope |

---

### Pruebas Playwright — Ciclo 2

| ID Test | Escenario | Tipo |
|---|---|---|
| PW-C2-001 | Acceder a zona financiera sin step-up → redirección | Seguridad |
| PW-C2-002 | Step-up con contraseña correcta → sesión financiera activa | Happy path |
| PW-C2-003 | Sesión financiera expira por inactividad → redirección a step-up | Sesión |
| PW-C2-004 | Compra de Rickoin exitosa (mock) → saldo actualizado | Happy path |
| PW-C2-005 | Compra de Rickoin fallida (mock) → saldo sin cambio | Edge case |
| PW-C2-006 | Historial muestra la compra recién realizada | Integración |
| PW-C2-007 | Solicitar retiro con saldo suficiente → estado Pendiente | Happy path |
| PW-C2-008 | Solicitar retiro con saldo insuficiente → error | Validación |
| PW-C2-009 | Cancelar retiro dentro del plazo → Rickoin devueltos | Happy path |
| PW-C2-010 | Admin aprueba retiro → estado Aprobado + correo usuario | Integración |
| PW-C2-011 | Admin rechaza retiro sin motivo → error de validación | Validación |
| PW-C2-012 | Intentar retirar Fichas → error 400 | Seguridad |
| PW-C2-013 | Admin asigna Fichas → saldo del usuario actualizado | Happy path |
| PW-C2-014 | Historial muestra Fichas asignadas | Integración |
| PW-C2-015 | Usuario no puede acceder al monedero de otro usuario | Seguridad |

---

### Cool-Down 2 (28 agosto – 10 septiembre 2026)

| Actividad | Responsable |
|---|---|
| Corrección de bugs encontrados en Staging | Dev Junior |
| Shapear pitch del Ciclo 3 (Rifas y Marketplace) | Dev Senior + Diseñador |
| Definir la pasarela de pago real que se usará en Ciclo 5 (Wompi / PSE) | Dev Senior |
| Seed de datos de prueba para Ciclo 3 (usuarios con saldo) | Dev Junior |
| Retrospectiva del Ciclo 2 | Equipo completo |

---

## 6. Ciclo 3 — Rifas y Marketplace (11 septiembre – 22 octubre 2026)

**Apetito:** Big Batch — 6 semanas  
**Resultado al cierre:** El administrador puede crear y publicar rifas. El usuario puede ver el catálogo, comprar boletas con Rickoin o Fichas (o combinación), y ver su historial de boletas. El sistema controla el equilibrio, cierra la venta automáticamente y maneja la concurrencia en las compras.

---

### Scopes del Ciclo 3

```
SCOPE C3-A │ Loterias y Rifas — modelo y administración
SCOPE C3-B │ Catálogo público de rifas
SCOPE C3-C │ Compra de boletas — flujo y concurrencia
SCOPE C3-D │ Equilibrio, cierre automático y devoluciones
SCOPE C3-E │ Historial de boletas del usuario
```

---

### SCOPE C3-A — Loterias y Rifas — modelo y administración

| Tarea | Detalle |
|---|---|
| Migración EF Core: `Loterias`, `Rifas`, `Boletas` | Según definición del documento de BD — con todos los CHECK constraints |
| Seed de loterías | 8 loterías colombianas del seed inicial del documento de BD |
| UI admin: crear rifa | Formulario: Título, Descripción, ImagenUrl (campo de texto, no upload), ValorEstimadoCop, PrecioBoleta, TotalBoletas, PuntoEquilibrio, MaxBoletasPorUsuario, LoteriaId, ReglaDigitos, ReglaFallback, FechaHoraSorteo |
| `RifaService.CrearAsync()` | Crea rifa en estado `Borrador`, calcula `CierreVentasEn = FechaHoraSorteo - 3h`, valida `PuntoEquilibrio <= TotalBoletas` |
| UI admin: publicar rifa | Botón en el panel — cambia estado a `Activa`, genera todas las filas en `Boletas` |
| `RifaService.PublicarAsync()` | Transacción que cambia estado + INSERT masivo de `TotalBoletas` filas en `Boletas` con estado `Disponible` |
| UI admin: editar / cancelar rifa en Borrador | Solo editable en estado `Borrador`; cancelar en `Borrador` no requiere devoluciones |
| UI admin: lista de rifas | Tabla con estado, progreso de venta, fechas |
| Audit log | `RIFA_CREADA`, `RIFA_PUBLICADA`, `RIFA_CANCELADA` |

---

### SCOPE C3-B — Catálogo público de rifas

| Tarea | Detalle |
|---|---|
| Página de catálogo | Grid responsivo de rifas activas — imagen (del `ImagenUrl` externo), nombre, precio, progreso, boletas disponibles, fecha de cierre |
| Página de detalle de rifa | Toda la info de la rifa, contador regresivo al cierre de venta, lotería asociada, reglas del sorteo, estado actual |
| Barra de progreso | Porcentaje vendido respecto al total y al punto de equilibrio — diferenciados visualmente |
| Filtros y ordenamiento | Por estado, precio, fecha — paginación |
| Rifas cerradas y finalizadas | Visibles en el catálogo con badge de estado — el ganador y resultado son visibles públicamente |
| Modo Observador en catálogo | Ve todas las rifas pero no puede comprar — botón de compra muestra tooltip |

---

### SCOPE C3-C — Compra de boletas — flujo y concurrencia

| Tarea | Detalle |
|---|---|
| UI: seleccionar boletas | El usuario elige cuántas boletas quiere (hasta su límite personal) — previsualización del costo en Rickoin + opción de usar Fichas |
| UI: pago mixto | Si el usuario tiene Fichas, puede combinarlas con Rickoin para el pago — el sistema calcula la proporción |
| `BoletaService.ComprarAsync()` | **Transacción serializable:** SELECT TOP N FROM Boletas WHERE RifaId = @id AND Estado = 'Disponible' WITH (UPDLOCK, ROWLOCK) → actualiza estado a 'Vendida', asigna UsuarioId, debita wallet(s), inserta Transacciones, inserta AuditLog |
| Validaciones | Verifica estado `Activa` de la rifa, `CierreVentasEn > now`, límite por usuario, saldo suficiente |
| Página de confirmación | Lista de boletas asignadas con sus números |
| Control de límite por usuario | `MAX(boletas existentes del usuario en esta rifa) <= MaxBoletasPorUsuario` — se verifica dentro de la transacción |
| Manejo de concurrencia | Si no hay boletas disponibles al momento del `SELECT` → error 409 "No quedan boletas disponibles" — el usuario ve el mensaje y la rifa actualizada |
| Audit log | `BOLETA_COMPRADA` |

---

### SCOPE C3-D — Equilibrio, cierre automático y devoluciones

| Tarea | Detalle |
|---|---|
| Job de cierre automático | `IHostedService` con timer de 15 min — busca rifas `Activa` con `CierreVentasEn <= now` → cambia a `Cerrada` |
| Evaluación de equilibrio | Al cerrar: si `boletasVendidas >= PuntoEquilibrio` → estado `PendienteResultado`; si no → inicia proceso de devolución |
| `DevolucionService.EjecutarDevolucionesAsync()` | Por cada boleta `Vendida` → crea `Transaccion` de `Devolucion` tipo Rickoin (no devuelve Fichas), actualiza boleta a `Devuelta`, cambia rifa a `SinGanador` |
| Correo a participantes | Al ejecutar devoluciones → correo masivo notificando la cancelación por falta de equilibrio |
| UI admin: cancelar rifa manualmente | Cancela rifa en estado `Activa` o `Cerrada` — ejecuta el mismo proceso de devoluciones |
| Audit log | `RIFA_CERRADA`, `DEVOLUCION_BOLETA` |

---

### SCOPE C3-E — Historial de boletas del usuario

| Tarea | Detalle |
|---|---|
| UI: "Mis Boletas" | Lista de boletas del usuario — agrupadas por rifa, con estado (activa, finalizada, devuelta) |
| Detalle por rifa | Al hacer clic en una rifa → ver los números de boleta asignados, estado de la rifa, resultado (si ya existe) |
| Filtros | Por estado de la rifa: activas, finalizadas con ganador, devueltas |

---

### Pruebas Playwright — Ciclo 3

| ID Test | Escenario | Tipo |
|---|---|---|
| PW-C3-001 | Admin crea rifa en Borrador → visible en panel admin | Happy path |
| PW-C3-002 | Admin publica rifa → aparece en catálogo público | Happy path |
| PW-C3-003 | Usuario compra boletas con Rickoin → saldo actualizado | Happy path |
| PW-C3-004 | Usuario compra boletas combinando Rickoin y Fichas | Happy path |
| PW-C3-005 | Usuario intenta comprar más del límite permitido → error | Validación |
| PW-C3-006 | Usuario intenta comprar sin saldo → error | Validación |
| PW-C3-007 | Dos usuarios compran simultáneamente la última boleta disponible → uno recibe error | Concurrencia |
| PW-C3-008 | Catálogo muestra progreso actualizado tras compra | Integración |
| PW-C3-009 | Rifa sin equilibrio → devolución automática → saldo usuario restaurado | Happy path |
| PW-C3-010 | Rifa cerrada no permite compra → error | Validación |
| PW-C3-011 | Historial "Mis Boletas" muestra boletas compradas | Integración |
| PW-C3-012 | Admin cancela rifa → devoluciones ejecutadas | Happy path |
| PW-C3-013 | Modo Observador no puede comprar boletas → 403 | Seguridad |
| PW-C3-014 | Imagen de rifa (URL externa) se carga correctamente | UI |
| PW-C3-015 | Imagen de rifa con URL inválida → placeholder sin romper la página | UI |

---

### Cool-Down 3 (23 octubre – 5 noviembre 2026)

| Actividad | Responsable |
|---|---|
| Corregir bugs de concurrencia encontrados en staging | Dev Senior |
| Shapear pitch Ciclo 4 (Motor de Sorteos) | Dev Senior + Diseñador |
| Prueba de carga manual: compra simultánea de boletas (10 usuarios paralelos) | Dev Senior |
| Retrospectiva del Ciclo 3 | Equipo completo |

---

## 7. Ciclo 4 — Motor de Sorteos y Premios (6 noviembre – 17 diciembre 2026)

**Apetito:** Big Batch — 6 semanas  
**Resultado al cierre:** El administrador puede ingresar el resultado oficial de la lotería. El sistema calcula automáticamente el número ganador, identifica la boleta y el usuario ganador, aplica la regla de fallback si aplica, notifica al ganador, y gestiona la selección y entrega del premio.

---

### Scopes del Ciclo 4

```
SCOPE C4-A │ Registro del resultado oficial y cálculo del ganador
SCOPE C4-B │ Regla de fallback y estado "Sin Ganador"
SCOPE C4-C │ Notificación al ganador y token de reclamación
SCOPE C4-D │ Selección de modalidad de premio
SCOPE C4-E │ Gestión de entrega y vista pública del resultado
```

---

### SCOPE C4-A — Registro del resultado y cálculo del ganador

| Tarea | Detalle |
|---|---|
| Migración EF Core: `ResultadosSorteo`, `Premios` | Según definición del documento de BD — inmutabilidad de `ResultadosSorteo` |
| UI admin: ingresar resultado | Formulario: RifaId (preseleccionada), ResultadoOficial (4 dígitos), confirmación (el admin escribe el número dos veces) |
| `SorteoService.RegistrarResultadoAsync()` | Extrae dígitos según `ReglaDigitos` de la rifa, busca en `Boletas` WHERE `NumeroBoleta = numCalculado AND RifaId = @id AND Estado = 'Vendida'` |
| Inmutabilidad del resultado | Solo INSERT en `ResultadosSorteo` — servicio no expone `Actualizar()` ni `Eliminar()` |
| Audit trail completo | `IpAdmin` capturada del `HttpContext`, `RegistradoPorAdminId` del claim, `RegistradoEn = SYSUTCDATETIME()` |
| Estado de la rifa | Si ganador encontrado → `GanadorEncontrado`; sin ganador → evalúa `ReglaFallback` (Scope C4-B) |
| Audit log | `RESULTADO_REGISTRADO` |

---

### SCOPE C4-B — Regla de fallback y "Sin Ganador"

| Tarea | Detalle |
|---|---|
| `ReglaFallback.SinGanador` | Rifa pasa a estado `SinGanador` → ejecuta devoluciones idénticas al cierre sin equilibrio |
| `ReglaFallback.SiguienteDisponible` | Busca la siguiente boleta vendida con el número más cercano (superior) al calculado; si no hay → `SinGanador` |
| `NotaFallback` en `ResultadosSorteo` | Descripción pública de por qué se aplicó el fallback |
| UI pública | En el detalle de la rifa: muestra el resultado oficial, el número calculado, y si hubo fallback, la explicación |

---

### SCOPE C4-C — Notificación al ganador y token de reclamación

| Tarea | Detalle |
|---|---|
| `PremioService.CrearAsync()` | Crea registro en `Premios` — genera `TokenReclamacion` (GUID de 32 chars), calcula `TokenExpiracion = now + 5 días` |
| Correo al ganador | `EmailService.NotificarGanadorAsync()` — template `GANADOR_RIFA` con botón que contiene el token de reclamación en la URL |
| Página de reclamación | URL: `/premios/reclamar?token=xxxx` — verifica token, muestra opciones de modalidad |
| Validación del token | Token único, no expirado, no usado — `PremioService.ValidarTokenAsync()` |
| Estado del token | Al abrir el enlace → `TokenUsado = true` (no se puede abrir de nuevo desde el correo; el usuario ve el estado en su perfil) |
| Audit log | `GANADOR_NOTIFICADO` |

---

### SCOPE C4-D — Selección de modalidad de premio

| Tarea | Detalle |
|---|---|
| UI: página de selección | Dos opciones: (1) Recibir el artículo físico, (2) Recibir Rickoin (con advertencia del % de penalización) |
| `PremioService.SeleccionarModalidadAsync()` | Registra `Modalidad` en el premio, cambia estado a `SeleccionRealizada`, notifica al admin |
| Opción Artículo | Estado `EnEntrega` — el admin coordina la entrega de forma externa |
| Opción Rickoin | Calcula Rickoin = `ValorEstimadoCop × (1 - PenalizacionPremioRickoin/100) / TasaConversion`, acredita en el wallet, inserta `Transaccion` |
| Expiración del plazo | Job que corre diariamente — premios con `TokenExpiracion < now` y estado `PendienteSeleccion` → `Expirado`, ejecuta devoluciones si aplica |
| UI admin: confirmar entrega de artículo | Botón en panel admin → `PremioService.ConfirmarEntregaAsync()` — estado `Entregado`, correo al ganador |
| Vista del ganador en perfil | El ganador ve el estado de su premio en "Mis Boletas" → detalle de la rifa ganada |
| Audit log | `PREMIO_SELECCIONADO`, `PREMIO_ENTREGADO` |

---

### SCOPE C4-E — Vista pública del resultado

| Tarea | Detalle |
|---|---|
| Página pública de resultado de rifa | Accesible a todos (incluyendo no registrados): resultado oficial, número ganador, nombre del ganador (solo si consintió), fecha del sorteo |
| Banner en el catálogo | Las rifas finalizadas muestran "¡Sorteo realizado! Ver resultado" |
| Historial de sorteos | Página pública con todas las rifas finalizadas y sus resultados — prueba de transparencia |

---

### Pruebas Playwright — Ciclo 4

| ID Test | Escenario | Tipo |
|---|---|---|
| PW-C4-001 | Admin registra resultado → ganador calculado correctamente | Happy path |
| PW-C4-002 | Admin intenta registrar resultado dos veces para la misma rifa → error | Inmutabilidad |
| PW-C4-003 | Fallback `SiguienteDisponible` → ganador correcto identificado | Edge case |
| PW-C4-004 | Fallback `SinGanador` → devoluciones ejecutadas | Happy path |
| PW-C4-005 | Ganador recibe correo con token de reclamación (stub) | Integración |
| PW-C4-006 | Token de reclamación expirado → error al abrir | Seguridad |
| PW-C4-007 | Ganador elige artículo → estado EnEntrega | Happy path |
| PW-C4-008 | Ganador elige Rickoin → Rickoin acreditados con penalización | Happy path |
| PW-C4-009 | Admin confirma entrega → estado Entregado | Happy path |
| PW-C4-010 | Premio expirado por inactividad del ganador | Edge case |
| PW-C4-011 | Vista pública del resultado accesible sin login | Accesibilidad |
| PW-C4-012 | Resultado correcto mostrado en la página de la rifa | Integración |

---

### Cool-Down 4 (18–31 de diciembre de 2026)

> Este cool-down coincide con las fiestas de fin de año. Se reduce la carga.

| Actividad | Responsable |
|---|---|
| Corrección de bugs críticos (solo) | Dev Senior |
| Shapear pitch Ciclo 5 (Operaciones y Estabilidad) | Dev Senior |
| Descanso del equipo | Todos |
| Retrospectiva del Ciclo 4 | Equipo completo |

---

## 8. Ciclo 5 — Operaciones y Estabilidad (2 enero – 12 febrero 2027)

**Apetito:** Big Batch — 6 semanas  
**Resultado al cierre:** La plataforma está producción-ready. Se integra la pasarela de pago real, el dashboard de administración con reportes y métricas, los documentos legales (Términos y Política de Privacidad) visibles para los usuarios, y todos los sistemas de monitoreo y alerta configurados.

---

### Scopes del Ciclo 5

```
SCOPE C5-A │ Pasarela de pago real (Wompi / PSE)
SCOPE C5-B │ Dashboard admin — métricas y reportes
SCOPE C5-C │ Configuración del sistema — panel admin
SCOPE C5-D │ Documentos legales y páginas institucionales
SCOPE C5-E │ Monitoreo, alertas y Application Insights
SCOPE C5-F │ Hardening de seguridad y deuda técnica
```

---

### SCOPE C5-A — Pasarela de pago real

> **Pasarela recomendada:** [Wompi](https://wompi.co) — pasarela colombiana, soporta PSE y tarjetas, API REST, fácil integración, tarifas ~2.9% + $900 COP por transacción.

| Tarea | Detalle |
|---|---|
| Crear cuenta de comercio en Wompi | Documentos del negocio, verificación de cuenta bancaria, clave pública y privada en Key Vault |
| `WompiService` | Reemplaza el `MockPasarelaService` del Ciclo 2 — genera URL de pago con Wompi, maneja webhook de confirmación |
| Webhook de confirmación | Endpoint POST `/api/pagos/wompi/webhook` — verifica firma con clave privada, llama a `CompraService.ConfirmarCompraAsync()` |
| Manejo de timeouts | Si el webhook no llega en N minutos → job que consulta el estado del pago directamente a la API de Wompi |
| Testing con sandbox de Wompi | Wompi provee ambiente de sandbox para pruebas — usar en Staging |
| Actualizar Playwright C2-C004 y C2-C005 | Reemplazar mock por sandbox de Wompi en las pruebas de Staging |

---

### SCOPE C5-B — Dashboard admin — métricas y reportes

| Tarea | Detalle |
|---|---|
| Dashboard principal admin | Tarjetas: usuarios activos, usuarios pendientes, rifas activas, ventas del día, retiros pendientes |
| Métricas de rifas | Por cada rifa: % de boletas vendidas, ingresos totales, proyección de equilibrio |
| Reporte de transacciones | Filtro por tipo, fecha, usuario — exportar a CSV |
| Reporte de retiros | Historial completo con estados, montos, fechas |
| Reporte de usuarios | Lista completa con estado, fecha de registro, última actividad |
| Gráficas | Ventas por día (últimos 30 días), usuarios por estado — gráficas simples con Chart.js |

---

### SCOPE C5-C — Configuración del sistema

| Tarea | Detalle |
|---|---|
| UI admin: configuración global | Tabla con todos los parámetros de `ConfiguracionSistema` — editables desde la UI con validación por `TipoDato` |
| `ConfiguracionService.ObtenerAsync<T>()` | Lee valor de la BD, convierte al tipo indicado |
| `ConfiguracionService.ActualizarAsync()` | Actualiza valor, registra `ActualizadoPorAdminId`, registra en `AuditLogs` |
| Parámetros editables desde panel | TasaConversion, OtpExpiracionMinutos, SesionFinancieraMinutos, MaxBoletasPorUsuario, PlazoRetiroDias, etc. |
| Audit log | `CONFIG_ACTUALIZADA` |

---

### SCOPE C5-D — Documentos legales y páginas institucionales

| Tarea | Detalle |
|---|---|
| Página: Términos y Condiciones | Texto legal completo — accesible desde el footer y el registro |
| Página: Política de Privacidad | Cumplimiento Ley 1581/2012 (HABEAS DATA, Colombia) |
| Página: ¿Cómo funciona? | Explicación del proceso de compra, sorteo, premios y devoluciones — para usuarios nuevos |
| Página: Preguntas Frecuentes | FAQ — al menos 15 preguntas respondidas |
| Footer | Links a todas las páginas legales, contacto (`soporte@rickoin.co`), redes sociales |
| Casilla de aceptación en registro | "He leído y acepto los Términos y Condiciones y la Política de Privacidad" — requerida |
| Cookie banner | GDPR-style, aunque la plataforma es colombiana — buena práctica |

---

### SCOPE C5-E — Monitoreo, alertas y Application Insights

| Tarea | Detalle |
|---|---|
| Application Insights en producción | `AddApplicationInsightsTelemetry()` — ya configurado desde la Fase 0 |
| Dashboard de Application Insights | Failure rate, response times, dependency calls (SQL), active users |
| Alertas | Configurar en Azure Monitor: error rate > 5% → email a `admin@rickoin.co`; response time P95 > 3s → email; SQL CPU > 80% → email |
| Health check endpoint | `GET /health` → retorna 200 si la BD responde — usado por Azure App Service para auto-restart |
| Serilog a Application Insights | `Serilog.Sinks.ApplicationInsights` — todos los logs estructurados van a AI |
| Retención de logs | Application Insights: 90 días. Azure SQL `AuditLogs`: indefinido (es inmutable) |

---

### SCOPE C5-F — Hardening de seguridad y deuda técnica

| Tarea | Detalle |
|---|---|
| Revisión OWASP Top 10 completa | A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection, A07 Authentication — revisión de todo el código |
| HTTPS forzado | `UseHttpsRedirection()` + HSTS configurado (`Strict-Transport-Security: max-age=31536000`) |
| Anti-CSRF tokens | Verificar que todos los formularios POST tienen `[ValidateAntiForgeryToken]` |
| Cabeceras de seguridad HTTP | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Content-Security-Policy` básico |
| Rate limiting | `UseRateLimiter()` en .NET 8 — límite en endpoints de login, registro, reenvío OTP |
| SQL Injection | EF Core previene por defecto — revisar cualquier `FromSqlRaw` o `ExecuteSqlRaw` con parámetros |
| Dependency updates | Actualizar todos los paquetes NuGet a sus versiones estables más recientes |
| Revisión de deuda técnica | Lista de todos los `// TODO:` y `// HACK:` identificados en los ciclos anteriores |

---

### Pruebas Playwright — Ciclo 5

| ID Test | Escenario | Tipo |
|---|---|---|
| PW-C5-001 | Compra con Wompi Sandbox exitosa → saldo actualizado | Integración real |
| PW-C5-002 | Webhook de Wompi con firma inválida → rechazado | Seguridad |
| PW-C5-003 | Dashboard admin muestra métricas correctas | Integración |
| PW-C5-004 | Admin actualiza TasaConversion → nueva tasa visible en compra | Integración |
| PW-C5-005 | Página de Términos y Condiciones accesible desde registro | UI |
| PW-C5-006 | Registro sin aceptar términos → error de validación | Validación |
| PW-C5-007 | Health check endpoint retorna 200 | Infraestructura |
| PW-C5-008 | Intentos excesivos de login → rate limiting activo | Seguridad |
| PW-C5-009 | Headers de seguridad presentes en todas las respuestas | Seguridad |
| PW-C5-010 | HSTS header presente en respuestas HTTPS | Seguridad |

---

### Cool-Down 5 (13–26 de febrero de 2027)

| Actividad | Responsable |
|---|---|
| QA final completo en Staging — todos los flujos end-to-end | Todo el equipo |
| Corrección de bugs críticos encontrados en QA | Dev Senior + Dev Junior |
| Preparar migration plan para Producción | Dev Senior |
| Rehearsal del deploy a Producción (practicar el proceso sin afectar datos reales) | Dev Senior |
| Preparar announcement + correo de bienvenida a usuarios beta | Dev Senior + Diseñador |
| Checklist de lanzamiento (ver Sección 12) | Todo el equipo |

---

## 9. Fase Final — Go-Live (27 febrero – 12 marzo 2027)

### Semana 1 de Go-Live (27 feb – 5 mar 2027) — Despliegue controlado

| Día | Actividades |
|---|---|
| **Lunes 27** | ✅ Deploy a Producción (proceso detallado abajo) |
| **Martes 28** | ✅ Smoke tests en Producción — todos los flujos críticos manualmente |
| **Miércoles 1 mar** | ✅ Crear primer usuario real en la plataforma (el propio equipo) |
| **Jueves 2** | ✅ Crear primera rifa de prueba real (con artículo de bajo valor) |
| **Viernes 3** | ✅ Invitar a 10 usuarios beta de confianza para probar el registro y la compra |

### Proceso de deploy a Producción

```bash
# 1. Verificar que el branch main está limpio y aprobado
git checkout main
git status

# 2. Ejecutar la suite Playwright completa en Staging por última vez
# (desde el pipeline de GitHub Actions)

# 3. Crear tag de versión
git tag -a v1.0.0 -m "Rickoin v1.0.0 — Go-Live"
git push origin v1.0.0

# 4. Aplicar migraciones EF Core en Producción (ANTES de deployar el nuevo código)
# PRECAUCIÓN: siempre migraciones PRIMERO, código DESPUÉS
dotnet ef database update \
  --connection "<connection-string-prod>" \
  --project src/Rickoin.Infrastructure

# 5. Verificar que la migración se aplicó correctamente
# Consultar la tabla __EFMigrationsHistory en la BD de producción

# 6. Deploy del código a Producción
az webapp deploy \
  --name rickoin-prod \
  --resource-group rickoin-prod \
  --src-path publish/rickoin.zip \
  --type zip

# 7. Verificar health check
curl https://rickoin.co/health

# 8. Smoke test manual (5 minutos):
#    - Abrir rickoin.co — carga correctamente
#    - Registro de un usuario nuevo
#    - Login
#    - Ver catálogo

# 9. Si algo falla: ROLLBACK
#    - El App Service de Azure permite volver al deploy anterior en 1 clic
#    - Las migraciones EF Core NO se revierten automáticamente — 
#      las migraciones destructivas deben tener un Down() escrito
```

### Semana 2 de Go-Live (6–12 marzo 2027) — Apertura pública

| Día | Actividades |
|---|---|
| **Lunes 6** | ✅ Abrir registro al público |
| **Martes 7** | ✅ Primera rifa real disponible para compra pública |
| **Miércoles-Viernes** | ✅ Monitoreo intensivo (Application Insights en modo alerta máxima) |
| **Viernes 12** | ✅ Primera retrospectiva post-lanzamiento — ajustes al plan |

---

## 10. Estrategia de pruebas con Playwright

### Organización del proyecto de pruebas

```
tests/Rickoin.Tests.E2E/
├── playwright.config.ts (configuración de ambientes)
├── GlobalSetup.cs       (autenticación compartida, seed de datos)
├── Helpers/
│   ├── AuthHelper.cs    (login como usuario, admin)
│   ├── SeedHelper.cs    (crear usuarios, rifas de prueba)
│   └── MailHelper.cs    (interceptar correos en modo test)
│
├── Ciclo1_Identidad/
│   ├── RegistroTests.cs
│   ├── LoginTests.cs
│   ├── AdminAprobacionTests.cs
│   └── SeguridadTests.cs
│
├── Ciclo2_Monedero/
│   ├── StepUpTests.cs
│   ├── CompraRickoinTests.cs
│   ├── RetiroTests.cs
│   └── FichasTests.cs
│
├── Ciclo3_Rifas/
│   ├── CatalogoTests.cs
│   ├── CompraBoletasTests.cs
│   ├── ConcurrenciaTests.cs
│   └── DevolucionTests.cs
│
├── Ciclo4_Sorteos/
│   ├── RegistroResultadoTests.cs
│   ├── FallbackTests.cs
│   └── PremioTests.cs
│
├── Ciclo5_Operaciones/
│   ├── PasarelaTests.cs
│   ├── SeguridadTests.cs
│   └── MonitoreoTests.cs
│
└── SmokeTests/          (tests rápidos para post-deploy a Producción)
    └── SmokeTests.cs
```

### Configuración de ambientes en Playwright

```csharp
// Archivo: playwright.config.cs (o se configura por variable de entorno)

// Variables de entorno por ambiente
// PLAYWRIGHT_BASE_URL=https://staging.rickoin.co
// PLAYWRIGHT_ADMIN_EMAIL=rickoin.admin@yopmail.com
// PLAYWRIGHT_ADMIN_PASSWORD=<del-key-vault-de-staging>
// PLAYWRIGHT_TEST_USER_EMAIL=rickoin.test1@yopmail.com
// PLAYWRIGHT_TEST_USER2_EMAIL=rickoin.test2@yopmail.com
// PLAYWRIGHT_TEST_WINNER_EMAIL=rickoin.ganador@yopmail.com
```

### Principios de las pruebas

1. **Tests independientes:** Cada test crea sus propios datos y los limpia al final. No dependen del estado dejado por otro test.
2. **Datos de prueba aislados:** Usar `SeedHelper.cs` para crear usuarios, rifas y wallets específicos para cada test.
3. **Correos en modo test:** `MockEmailService` escribe a un buffer en memoria que `MailHelper.cs` puede leer — simula la recepción del correo sin envíos reales.
4. **Sin timeouts arbitrarios:** Usar `WaitForSelector` y `WaitForResponse` de Playwright — nunca `await Task.Delay(ms)`.
5. **Paralelismo controlado:** Los tests de concurrencia (Ciclo 3) se marcan con `[NonParallelizable]` para evitar interferencia.
6. **Smoke tests rápidos:** La suite `SmokeTests/` corre en < 2 minutos y verifica solo los flujos críticos post-deploy.

### Pipeline de CI/CD (GitHub Actions)

```yaml
# .github/workflows/staging-deploy.yml

name: Deploy to Staging + E2E Tests

on:
  push:
    branches: [staging]

jobs:
  build-test-deploy:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup .NET 8
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      
      - name: Restore dependencies
        run: dotnet restore
      
      - name: Build
        run: dotnet build --no-restore --configuration Release
      
      - name: Run Unit Tests (si se agregan en el futuro)
        run: dotnet test --no-build --filter "Category=Unit"
      
      - name: Apply EF Migrations to Staging DB
        run: dotnet ef database update --project src/Rickoin.Infrastructure --connection "${{ secrets.STAGING_CONNECTION_STRING }}"
      
      - name: Publish
        run: dotnet publish src/Rickoin.Web -c Release -o publish/
      
      - name: Deploy to Azure Staging
        uses: azure/webapps-deploy@v3
        with:
          app-name: 'rickoin-staging'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE_STAGING }}
          package: publish/
      
      - name: Install Playwright Browsers
        run: pwsh tests/Rickoin.Tests.E2E/bin/Release/net8.0/playwright.ps1 install --with-deps
      
      - name: Run Playwright E2E Tests
        run: dotnet test tests/Rickoin.Tests.E2E --configuration Release
        env:
          PLAYWRIGHT_BASE_URL: https://staging.rickoin.co
          PLAYWRIGHT_ADMIN_EMAIL: ${{ secrets.STAGING_ADMIN_EMAIL }}
          PLAYWRIGHT_ADMIN_PASSWORD: ${{ secrets.STAGING_ADMIN_PASSWORD }}
      
      - name: Upload Playwright Report (en caso de fallo)
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: tests/Rickoin.Tests.E2E/playwright-report/
```

### Cuándo corren los tests

| Momento | Suite | Ambiente | Duración estimada |
|---|---|---|---|
| Merge a `staging` | Ciclos 1 al actual | Staging | ~15-20 min |
| Pull Request a `main` | Solo SmokeTests | Staging | ~2 min |
| Post-deploy a Producción | SmokeTests | Producción (read-only) | ~2 min |
| Fin de cada cool-down | Suite completa | Staging | ~30 min |

### Tests de smoke para Producción

> Los smoke tests de producción son **solo de lectura** — no crean ni modifican datos. Verifican que la aplicación está en pie y las funciones públicas responden.

| Test | Verificación |
|---|---|
| Cargar página principal | HTTP 200, título correcto |
| Cargar catálogo de rifas | HTTP 200, grid visible |
| Página de login | HTTP 200, formulario presente |
| Página de registro | HTTP 200, formulario presente |
| `/health` endpoint | HTTP 200, `{"status":"Healthy"}` |
| Página de Términos | HTTP 200 |
| Página de Política de Privacidad | HTTP 200 |

---

## 11. Arquitectura de despliegue

### Diagrama de flujo de código

```
[Desarrollador]
    │
    ├── git push feature/xxx
    │       ↓
    │   [Pull Request → develop]
    │       ↓ (revisión del equipo)
    │   [Merge a develop]
    │
    ├── [Merge develop → staging]
    │       ↓
    │   [GitHub Action: staging-deploy.yml]
    │       ↓
    │   [Build → Migrate → Deploy → Playwright tests]
    │       ↓
    │   [Staging aprobado ✅]
    │
    └── [Merge staging → main]
            ↓
        [GitHub Action: prod-deploy.yml]
            ↓
        [Build → Migrate Prod DB → Deploy → Smoke Tests]
            ↓
        [Producción ✅]
```

### Configuración de `Program.cs` por ambiente

```csharp
// Program.cs — configuración de Key Vault según ambiente
var builder = WebApplication.CreateBuilder(args);

// Key Vault (solo en Staging y Prod — en Dev se usa appsettings.Development.json)
if (!builder.Environment.IsDevelopment())
{
    var keyVaultUri = new Uri($"https://rickoin-kv-{builder.Environment.EnvironmentName.ToLower()}.vault.azure.net/");
    builder.Configuration.AddAzureKeyVault(keyVaultUri, new DefaultAzureCredential());
}

// Application Insights (solo Staging y Prod)
if (!builder.Environment.IsDevelopment())
{
    builder.Services.AddApplicationInsightsTelemetry();
}

// Email: mock en Dev, SendGrid en Staging/Prod
if (builder.Environment.IsDevelopment())
    builder.Services.AddSingleton<IEmailService, MockEmailService>();
else
    builder.Services.AddSingleton<IEmailService, SendGridEmailService>();

// Pasarela de pago: mock hasta Ciclo 5
if (builder.Environment.IsDevelopment() || !builder.Configuration.GetValue<bool>("Wompi:Enabled"))
    builder.Services.AddSingleton<IPasarelaService, MockPasarelaService>();
else
    builder.Services.AddSingleton<IPasarelaService, WompiService>();
```

### Seguridad en el pipeline

| Secreto | Dónde se almacena | Cómo lo lee la app |
|---|---|---|
| Connection string (SQL) | Azure Key Vault | Managed Identity → Key Vault en startup |
| SendGrid API Key | Azure Key Vault | Managed Identity → Key Vault en startup |
| Cookie secret | Azure Key Vault | Managed Identity → Key Vault en startup |
| Wompi public/private key | Azure Key Vault | Managed Identity → Key Vault en startup |
| Staging admin credentials | GitHub Secrets | Inyectado como env var en el pipeline |
| Azure publish profile | GitHub Secrets | Inyectado como env var en el pipeline |

**Regla:** ningún secreto vive en el código, en `appsettings.json` ni en variables de entorno del App Service directamente — todos pasan por Key Vault.

---

## 12. Checklist de lanzamiento

> Este checklist se completa durante el Cool-Down 5 y la Fase Final. Todos los ítems deben estar marcados antes de abrir al público.

### Infraestructura

- [ ] Dominio `rickoin.co` apunta correctamente a Azure App Service de Producción
- [ ] `www.rickoin.co` redirige a `rickoin.co` con HTTP 301
- [ ] Certificado SSL activo para `rickoin.co` y `www.rickoin.co`
- [ ] HTTPS forzado — toda conexión HTTP es redirigida a HTTPS
- [ ] Health check `/health` retorna 200 y `{"status":"Healthy"}`
- [ ] Azure App Service de Prod en plan P1v3 (no B1)
- [ ] Azure SQL Database de Prod en tier S2 (no Basic)
- [ ] Auto-scale configurado en App Service (1-3 instancias por CPU > 70%)
- [ ] Backups automáticos de SQL habilitados (retención 30 días)

### Correo y comunicaciones

- [ ] `noreply@rickoin.co` envía sin caer en spam (verificado con mail-tester.com — score > 8/10)
- [ ] `admin@rickoin.co` recibe correos de usuarios correctamente (Google Workspace configurado en Ciclo 5)
- [ ] Todas las plantillas de SendGrid probadas y aprobadas visualmente
- [ ] Registros SPF, DKIM y DMARC presentes y válidos (verificado con MXToolbox)
- [ ] Límites de SendGrid suficientes para la carga esperada (plan seleccionado)

### Seguridad

- [ ] Revisión OWASP Top 10 completada — sin vulnerabilidades críticas
- [ ] Cabeceras de seguridad HTTP presentes (verificado con securityheaders.com — grade A)
- [ ] Rate limiting activo en endpoints sensibles (login, registro, OTP)
- [ ] Anti-CSRF en todos los formularios POST
- [ ] No hay datos sensibles en logs (contraseñas, tokens)
- [ ] Connection strings y API keys en Key Vault — nada en el código ni en appsettings
- [ ] Admin password cambiado del valor inicial del seed
- [ ] Reglas de firewall de SQL Database configuradas (solo App Service puede conectar)

### Base de datos

- [ ] Migración inicial aplicada en Producción — `__EFMigrationsHistory` tiene el registro
- [ ] Seed data aplicado: ConfiguracionSistema con los 12 parámetros iniciales
- [ ] Seed data aplicado: Loterías colombianas (8 registros)
- [ ] Seed data aplicado: Admin inicial con credenciales conocidas
- [ ] Los CHECK constraints están activos (verificado con INSERT de prueba inválido)
- [ ] Las tablas inmutables no tienen permisos UPDATE/DELETE para el usuario de la app

### Funcional

- [ ] Registro completo funciona en Producción (sin crear usuarios reales aún)
- [ ] Login funciona para usuario normal y administrador
- [ ] Correo OTP llega en < 1 minuto
- [ ] Step-Up Auth funciona y expira por inactividad
- [ ] Pasarela Wompi conectada al ambiente de producción (no sandbox)
- [ ] Primera rifa de prueba creada y publicada (artículo de bajo valor)
- [ ] Compra de boleta end-to-end probada con tarjeta de prueba real de Wompi
- [ ] Todos los correos transaccionales probados manualmente
- [ ] Panel admin accesible y funcional

### Legal y compliance

- [ ] Página de Términos y Condiciones publicada con fecha actualizada
- [ ] Política de Privacidad publicada con mención a Ley 1581/2012 (HABEAS DATA)
- [ ] Casilla de aceptación de términos en el registro funciona y es obligatoria
- [ ] Cookie banner visible en el primer acceso
- [ ] Footer con links a documentos legales y correo de contacto

### Monitoreo

- [ ] Application Insights configurado y recibiendo telemetría
- [ ] Alertas de error rate > 5% configuradas en Azure Monitor
- [ ] Alerta de response time P95 > 3s configurada
- [ ] Alerta de SQL CPU > 80% configurada
- [ ] Destino de alertas: `admin@rickoin.co` (si Google Workspace ya está configurado) o `rickoin.admin@yopmail.com`
- [ ] Dashboard de Application Insights revisado y sin errores en las últimas 24h

### Go/No-Go final

> El go-live solo procede si **todos los ítems del checklist están marcados**. Si algún ítem de Seguridad, Base de Datos o Legal no está completo → **No-Go** — se pospone el lanzamiento hasta que esté resuelto.

---

*RICKOIN Plan de Ejecución v1.0 — Mayo 2026*  
*Método: Shape Up (Ryan Singer / Basecamp) — basecamp.com/shapeup*  
*Ciclos: 5 × 6 semanas + cool-downs | Go-live estimado: 12 de marzo de 2027*
