# CONTRATO DE DESARROLLO DE SOFTWARE
## Plataforma Rickoin — Rifas Digitales con Moneda Virtual

---

> **Documento:** Contrato de Prestación de Servicios de Desarrollo de Software  
> **Versión:** 1.0  
> **Ciudad:** Medellín, Antioquia  
> **Fecha de firma:** \_\_\_\_ de \_\_\_\_\_\_\_\_\_\_\_\_\_ de 2026

---

## PARTES CONTRATANTES

**EL DESARROLLADOR / PROVEEDOR:**

> **Nombre:** Alejandro Ortiz  
> **Cédula de ciudadanía:** 1.037.577.974  
> **Ciudad:** Medellín, Antioquia  
> **Rol en el contrato:** Desarrollador de software — responsable del diseño, construcción, pruebas y despliegue de la plataforma.

**EL CLIENTE / CONTRATANTE:**

> **Nombre:** Ricardo \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  
> **Cédula de ciudadanía:** XXXX  
> **Ciudad:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  
> **Rol en el contrato:** Propietario del proyecto y tomador de decisiones sobre alcance, prioridades y presupuesto.

En adelante denominados conjuntamente **"las Partes"**.

---

## OBJETO DEL CONTRATO

El Desarrollador se compromete a diseñar, construir, probar y desplegar la plataforma de software denominada **Rickoin**, consistente en un sistema digital de rifas con moneda virtual propia, de acuerdo con los documentos técnicos y funcionales que forman parte integral de este contrato (ver Cláusula 15).


---

## CLÁUSULAS

---

### 1. ESTRUCTURA DEL PROYECTO — CICLOS Y SPRINTS

El proyecto se ejecutará en **5 ciclos de 6 semanas cada uno**, separados por períodos de revisión de 2 semanas. Cada ciclo se descompone internamente en **sprints de 2 semanas** para fines de seguimiento operativo.

#### Estructura de ciclos acordada:

| Ciclo | Sprints internos | Semanas | Enfoque principal |
|---|---|---|---|
| **Ciclo 1** | Sprint 01, 02, 03 | Semanas 1–6 | Identidad, acceso y base de datos |
| Revisión 1 | — | Semanas 7–8 | Revisión y preparación Ciclo 2 |
| **Ciclo 2** | Sprint 04, 05, 06 | Semanas 9–14 | Monedero, compras y retiros |
| Revisión 2 | — | Semanas 15–16 | Revisión y preparación Ciclo 3 |
| **Ciclo 3** | Sprint 07, 08, 09 | Semanas 17–22 | Rifas y boletas |
| Revisión 3 | — | Semanas 23–24 | Revisión y preparación Ciclo 4 |
| **Ciclo 4** | Sprint 10, 11, 12 | Semanas 25–30 | Motor de sorteos y ganadores |
| Revisión 4 | — | Semanas 31–32 | Revisión y preparación Ciclo 5 |
| **Ciclo 5** | Sprint 13, 14 | Semanas 33–36 | Notificaciones, reportes y documentos legales |
| Post-ciclos | Sprint 15, 16, 17 | Semanas 37–42 | Control de cambios, deuda técnica y despliegue |

**Fecha estimada de go-live:** 12 de marzo de 2027.

> **Nota sobre semanas de revisión:** Estos períodos no generan costo adicional. El Desarrollador los utiliza para estabilización técnica, documentación y preparación del siguiente ciclo. Si el Cliente no tiene solicitudes pendientes, el Desarrollador podrá adelantar trabajo del ciclo siguiente.

---

### 2. REUNIÓN DE PLANIFICACIÓN DE CICLO

Al inicio de cada ciclo, ambas partes celebrarán una **reunión de planificación** para confirmar:

- Las funcionalidades que se desarrollarán en el ciclo
- El alcance concreto de cada funcionalidad
- Las dependencias de terceros que puedan afectar la entrega
- El criterio de aceptación del ciclo

Lo acordado en esta reunión queda como compromiso formal para ese ciclo. Cambios posteriores al inicio del ciclo se regirán por la Cláusula 5.

---

### 3. VALOR DE LOS SPRINTS

Cada sprint de desarrollo tiene un **valor fijo de $500.000 COP**, independientemente de la complejidad técnica interna. Este valor reconoce el tiempo dedicado, no únicamente las líneas de código producidas.

| Tipo de sprint | Valor |
|---|---|
| Sprint de desarrollo (01–14) | $500.000 COP por sprint |
| Sprint de control de cambios | Variable (ver Cláusula 5) |
| Sprint de deuda técnica | $0 (sin costo adicional) |
| Sprint de despliegue final | $800.000 COP |

**Valor base estimado del proyecto** (sin contar control de cambios):

| Concepto | Cálculo | Valor |
|---|---|---|
| 14 sprints de desarrollo | 14 × $500.000 | $7.000.000 COP |
| Sprint de deuda técnica | 1 × $0 | $0 |
| Sprint de despliegue final | 1 × $800.000 | $800.000 COP |
| **TOTAL BASE ESTIMADO** | | **$7.800.000 COP** |

> **Importante:** Los sprints de control de cambios (Cláusula 5) no están incluidos en este valor base y se presupuestarán por separado según los cambios solicitados.

---

### 4. FORMA DE PAGO

Cada sprint se paga **al finalizar** y **antes de iniciar el siguiente sprint**. El pago representa la aceptación formal del entregable del sprint (ver Cláusula 11).

**Condición bloqueante:** El Desarrollador no iniciará un nuevo sprint si el sprint anterior no ha sido pagado. Esta condición no constituye incumplimiento del Desarrollador.

**Modalidades aceptadas:** Transferencia bancaria, Nequi, Daviplata u otro medio acordado entre las Partes.

---

### 5. CONTROL DE CAMBIOS

#### 5.1 Principio de alcance variable

El alcance del proyecto es variable y el tiempo es fijo. En la reunión de planificación de cada ciclo se define el alcance comprometido. Las Partes reconocen que ajustar el alcance durante la ejecución es parte natural del proceso.

#### 5.2 Cambios de bajo impacto

Si el cambio solicitado:
- Requiere pocas horas de trabajo
- No altera la arquitectura técnica
- No afecta el cronograma del ciclo en curso
- No modifica entregables ya aceptados

El Desarrollador podrá incorporarlo **sin costo adicional** y a su criterio técnico.

#### 5.3 Cambios de impacto medio

Si el cambio requiere varios días de trabajo o ajustes funcionales importantes, se cobrará un valor proporcional al esfuerzo, tomando como base el valor estándar de un sprint ($500.000 COP).

#### 5.4 Cambios de alto impacto — Sprint de Control de Cambios

Si el cambio:
- Afecta funcionalidades ya entregadas y pagadas
- Requiere rediseño técnico o de base de datos
- Impacta módulos completos
- Altera la arquitectura del sistema

Se habilitará un **Sprint de Control de Cambios** cuyo valor podrá ser igual, menor o mayor a $500.000 COP según análisis técnico del Desarrollador. Si el impacto es mayor, podrán asignarse múltiples sprints de control de cambios.

#### 5.5 Funcionalidades no terminadas al cierre del ciclo

Al finalizar cada ciclo de 6 semanas, si una funcionalidad no quedó terminada, **no se extiende automáticamente**. El Desarrollador presentará al Cliente las opciones:

- **Completar** en el siguiente ciclo si sigue siendo prioritaria
- **Reformular** con un alcance reducido (versión más pequeña)
- **Cancelar** si dejó de ser relevante

Esta decisión se toma en la reunión de planificación del siguiente ciclo, sin costo por la evaluación.

#### 5.6 Cambios sobre sprints no ejecutados

Si el Cliente solicita cambios sobre funcionalidades de sprints futuros que aún no han iniciado, el Desarrollador evaluará el impacto y determinará si se incorpora sin costo, requiere reestructuración del sprint o debe tratarse como un sprint de control de cambios.

---

### 6. SPRINT DE DEUDA TÉCNICA

El **Sprint 16** está destinado a deuda técnica y **no tiene costo adicional para el Cliente**. Incluye:

- Correcciones menores identificadas durante el proyecto
- Estabilización de módulos
- Optimizaciones técnicas pendientes documentadas
- Mejoras de rendimiento sobre funcionalidades ya entregadas

**Condición:** Solo aplica sobre funcionalidades previamente aprobadas, no sobre nuevas solicitudes.

---

### 7. SPRINT DE DESPLIEGUE FINAL

El **Sprint 17** corresponde al despliegue en producción con un valor de **$800.000 COP**. Incluye:

- Configuración del entorno de producción (Azure App Service)
- Publicación y puesta en marcha de la plataforma
- Configuración del dominio rickoin.com.co
- Validaciones finales de funcionamiento
- Activación del correo corporativo (@rickoin.com.co)
- Integración final con pasarela de pagos Wompi
- Entrega de accesos al Cliente

**No incluye:** Costos de servicios de terceros (Azure, dominio, SendGrid, Wompi, Google Workspace).

---

### 8. DEPENDENCIAS DE TERCEROS

El proyecto depende de servicios externos que no son controlados por el Desarrollador:

- **Wompi** (pasarela de pagos colombiana)
- **Azure App Service** y **Azure SQL Database** (infraestructura en la nube)
- **SendGrid** (envío de correos transaccionales)
- **Google Workspace** (correo corporativo, activación en Ciclo 5)
- **Dominio** rickoin.com.co (registro y DNS)
- **Coljuegos** (ente regulador — autorizaciones gubernamentales)

Cuando una funcionalidad dependa de terceros y dichas dependencias impidan finalizarla, el sprint correspondiente se considera **ejecutado** y el Cliente deberá realizar el pago correspondiente. La funcionalidad pendiente quedará documentada como deuda técnica y se retomará cuando la dependencia esté disponible.

---

### 9. VALIDACIÓN Y ACEPTACIÓN DE SPRINTS

Al finalizar cada sprint, el Desarrollador presentará al Cliente un demo funcional del entregable.

El Cliente tendrá **5 días hábiles** para revisar el entregable y comunicar observaciones al Desarrollador.

El **pago del sprint** equivale a la aceptación formal y definitiva del entregable. Una vez realizado el pago:

- El sprint se considera cerrado y aprobado
- Los cambios sobre ese sprint pasarán por el proceso de control de cambios (Cláusula 5)
- No se admiten reclamaciones sobre funcionalidades del sprint ya pagado sin incurrir en costos adicionales

---

### 10. RESPONSABILIDAD DEL CLIENTE EN LAS PRUEBAS

El Cliente es responsable de realizar pruebas funcionales en el entorno de staging (ambiente de pruebas) durante el período de validación de cada sprint.

El Desarrollador brindará acompañamiento para:
- Uso del sistema de pruebas
- Validación de flujos funcionales
- Carga de datos de prueba
- Orientación técnica básica

La **omisión de pruebas** por parte del Cliente no podrá utilizarse posteriormente para exigir cambios gratuitos sobre entregables ya aceptados y pagados.

---

### 11. SEMANAS DE REVISIÓN ENTRE CICLOS

Las semanas de revisión (7-8, 15-16, 23-24, 31-32) son períodos de revisión y preparación. Durante estas semanas:

- Se documentan los aprendizajes del ciclo
- Se refinan las propuestas para el siguiente ciclo
- Se realiza la reunión de planificación para el ciclo siguiente
- No hay entregas formales de desarrollo

**Avance anticipado:** Si no existen solicitudes pendientes durante estas semanas, el Desarrollador podrá avanzar con trabajo del siguiente ciclo sin costo adicional para el Cliente.

---

### 12. MODIFICACIÓN DE FECHAS

El cronograma podrá ajustarse **sin penalización** cuando existan:

- Imprevistos técnicos mayores
- Retrasos atribuibles a dependencias de terceros
- Cambios de alcance solicitados por el Cliente
- Eventos de fuerza mayor
- Demoras en pruebas del entorno de staging

Ningún ajuste de fechas constituirá incumplimiento contractual, siempre que se notifique a la otra parte dentro de los **3 días hábiles** siguientes al evento que origina el ajuste.

---

### 13. PROPIEDAD INTELECTUAL Y TITULARIDAD DEL SOFTWARE

#### 13.1 Durante la ejecución del proyecto

Mientras no se complete el pago total del proyecto, el siguiente conjunto de activos digitales es **propiedad exclusiva del Desarrollador**:

- Código fuente de todos los proyectos (.NET 8)
- Scripts de base de datos (DDL, DML, migraciones)
- Documentación técnica y de arquitectura
- Configuraciones de infraestructura (Azure, SendGrid, dominio)
- Componentes desarrollados específicamente para Rickoin

Durante este período, el Cliente tendrá acceso únicamente a **entornos de prueba (staging)**.

#### 13.2 Cesión tras pago total

Una vez el Cliente realice el **pago total** del proyecto:

- Se entregará el código fuente completo del proyecto Rickoin
- Se transferirán los accesos de administración a todos los servicios
- Se otorgarán los derechos de uso sobre el software desarrollado

#### 13.3 Exclusiones de la cesión

**No se transfieren al Cliente** derechos sobre:

- Frameworks y librerías de terceros (open source o comerciales)
- Herramientas internas reutilizables del Desarrollador no específicas de Rickoin
- Metodologías propias del Desarrollador
- Componentes genéricos desarrollados previamente por el Desarrollador

#### 13.4 Derechos sobre el nombre y marca

Los derechos sobre la marca **Rickoin**, el dominio **rickoin.com.co** y el modelo de negocio son exclusivos del Cliente. El Desarrollador no tendrá ningún derecho sobre estos activos al finalizar el contrato.

---

### 14. SUSPENSIÓN, PAUSA O ABANDONO DEL PROYECTO

Si el Cliente:

- Suspende voluntariamente el proyecto
- Deja de responder solicitudes necesarias para continuar
- No entrega información requerida en los plazos acordados
- No aprueba entregables sin justificación técnica documentada
- Interrumpe el desarrollo por más de **15 días calendario** sin causa atribuible al Desarrollador

El proyecto entrará en **estado de pausa por responsabilidad del Cliente**. En dicho caso:

- El cronograma quedará automáticamente congelado
- El Desarrollador podrá reasignar recursos a otros proyectos
- Las fechas pactadas perderán vigencia

Cuando el Cliente solicite reactivar el proyecto:

- Se realizará una reevaluación técnica del estado del proyecto
- Se recalcularán tiempos y cronograma
- Podrán generarse **costos de reactivación** si existen impactos técnicos u operativos

Si la suspensión supera los **60 días calendario**, el Desarrollador podrá dar por terminado el contrato de manera unilateral, conservando todos los pagos recibidos como reconocimiento del trabajo ejecutado.

---

### 15. DOCUMENTOS QUE HACEN PARTE INTEGRAL DE ESTE CONTRATO

Este contrato forma un conjunto indivisible con los siguientes documentos técnicos y funcionales:

| Documento | Descripción |
|---|---|
| RICKOIN — Plan de Sprints | 17 sprints, cronograma y entregables por sprint |
| RICKOIN — Plan de Ciclos | 5 ciclos de desarrollo con alcance, riesgos y entregables |
| RICKOIN — Historias de Usuario | Criterios de aceptación por funcionalidad |
| RICKOIN — Arquitectura de Base de Datos | Modelo de datos, DDL y reglas de negocio |
| RICKOIN — Plan de Ejecución | Infraestructura, despliegue y checklist de go-live |
| RICKOIN — Documento Consolidado | Requisitos funcionales y no funcionales completos |

En caso de contradicción entre este contrato y los documentos técnicos, prevalece este contrato en lo jurídico y los documentos técnicos en lo funcional.

---

### 16. TERMINACIÓN ANTICIPADA

Cualquiera de las partes podrá terminar anticipadamente el contrato mediante aviso escrito con mínimo **10 días calendario** de anticipación.

**Si la terminación es decisión del Cliente:**
- Deberá pagar todos los sprints ejecutados hasta la fecha
- Deberá pagar desarrollos en curso con avance demostrable
- No podrá exigir la entrega de componentes no pagados

**Si la terminación es por incumplimiento del Desarrollador:**
- Se entregará al Cliente únicamente lo que haya sido pagado y efectivamente desarrollado, documentos, codigo fuente y configuraciones correspondientes a esos entregables
- No se realizarán devoluciones por pagos ya efectuados
- El Desarrollador no tendrá derecho a pagos adicionales por trabajo no demostrado

---

### 17. CAMBIOS VERBALES O INFORMALES

Ninguna solicitud realizada mediante llamadas, WhatsApp, reuniones verbales o mensajes informales modificará automáticamente el alcance del proyecto.

Todo cambio que afecte el alcance, el costo o el cronograma deberá quedar **documentado y aprobado formalmente** (correo electrónico o documento firmado) antes de ejecutarse.

---

### 18. RESPONSABILIDAD DEL CLIENTE SOBRE EL MODELO DE NEGOCIO

El Desarrollador construye software, no asesora legalmente al Cliente. El Cliente es el único responsable de:

- La legalidad del modelo de negocio de rifas digitales en Colombia
- Los permisos y autorizaciones ante **Coljuegos**
- Las licencias comerciales y tributarias requeridas
- El cumplimiento de las normas de habeas data y protección de datos personales (Ley 1581 de 2012)
- Los términos y condiciones legales propios de la plataforma
- Las autorizaciones gubernamentales necesarias para operar

El Desarrollador no será responsable por sanciones, cierres o requerimientos derivados del incumplimiento del Cliente frente a estas obligaciones.

---

### 19. LIMITACIÓN DE RESPONSABILIDAD TÉCNICA

El Desarrollador no será responsable por:

- Pérdidas económicas derivadas de errores causados por cambios constantes de alcance
- Retrasos originados en terceros (Wompi, Azure, Coljuegos, etc.)
- Errores causados por mal uso del sistema por parte de usuarios finales
- Daños derivados de información incorrecta o tardía suministrada por el Cliente
- Costos de plataformas, dominios y servicios externos
- Desarrollo del documento de términos y condiciones legales, políticas de privacidad o asesoría legal

---

### 20. CONFIDENCIALIDAD

Ambas partes se comprometen a mantener la confidencialidad sobre:

- El modelo de negocio de la plataforma Rickoin
- Los datos técnicos, arquitectura y código fuente
- La información financiera del proyecto
- Los datos personales de los usuarios

Esta obligación de confidencialidad se extiende por **2 años** después de la terminación del contrato.

---

### 21. VIGENCIA

Este contrato entra en vigencia a partir de la fecha de firma por ambas partes y se extiende hasta la **entrega total del proyecto**, el pago completo acordado y el cumplimiento de todas las obligaciones aquí descritas.

---

## FIRMAS

En constancia de aceptación de los términos descritos, las Partes suscriben el presente contrato en la ciudad de **Medellín, Antioquia**, el \_\_\_\_ de \_\_\_\_\_\_\_\_\_\_\_\_\_ de 2026.

---

### EL DESARROLLADOR

```
Nombre:     Alejandro Ortiz
C.C.:       1.037.577.974
Ciudad:     Medellín, Antioquia
Firma:      ____________________________
Fecha:      ____________________________
```

---

### EL CLIENTE

```
Nombre:     Ricardo ___________________
C.C.:       XXXX
Ciudad:     ___________________________
Firma:      ____________________________
Fecha:      ____________________________
```

---

## ANEXO A — CRONOGRAMA DE PAGOS ESTIMADO

| Sprint | Descripción | Valor | Semana estimada de pago |
|---|---|---|---|
| Sprint 01 | Base de datos y documentación técnica | $500.000 | Sem 2 |
| Sprint 02 | Registro, OTP y Modo Observador | $500.000 | Sem 4 |
| Sprint 03 | Login, recuperación y panel admin | $500.000 | Sem 6 |
| Sprint 04 | Step-Up Auth y monedero | $500.000 | Sem 10 |
| Sprint 05 | Compra de Rickoin e integración de pagos | $500.000 | Sem 12 |
| Sprint 06 | Retiros, admin y Fichas | $500.000 | Sem 14 |
| Sprint 07 | Creación de rifas y catálogo público | $500.000 | Sem 18 |
| Sprint 08 | Compra de boletas y concurrencia | $500.000 | Sem 20 |
| Sprint 09 | Historial, validaciones y ajustes | $500.000 | Sem 22 |
| Sprint 10 | Motor de sorteos | $500.000 | Sem 26 |
| Sprint 11 | Resultados y validación de ganador | $500.000 | Sem 28 |
| Sprint 12 | Notificación y premio | $500.000 | Sem 30 |
| Sprint 13 | Notificaciones SendGrid y configuración | $500.000 | Sem 34 |
| Sprint 14 | Dashboard, reportes y documentos legales | $500.000 | Sem 36 |
| Sprint 15 | Control de Cambios | Variable | Sem 38 |
| Sprint 16 | Deuda Técnica | $0 | — |
| Sprint 17 | Despliegue Final y Puesta en Marcha | $800.000 | Sem 42 |
| **TOTAL BASE** | | **$7.800.000 COP** | |

> El valor de control de cambios (Sprint 15) se determinará según las solicitudes del Cliente durante el proyecto y se presupuestará por separado antes de ejecutarse.

---

## ANEXO B — ENTORNOS Y ACCESOS

| Entorno | Propósito | Acceso del Cliente |
|---|---|---|
| **Local** (localhost) | Desarrollo activo del Desarrollador | No |
| **Staging** (Azure) | Pruebas y validación de sprints | Sí — durante validación de cada sprint |
| **Producción** (Azure) | Plataforma live para usuarios finales | Sí — después del Sprint 17 y pago total |

---

*Fin del documento — ANEXO CONTRACTUAL basico-refinado v1.0*
