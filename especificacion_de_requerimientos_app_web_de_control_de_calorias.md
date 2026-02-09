# Documento de Especificación de Requerimientos de Software (ERS)

## 1. Introducción

### 1.1 Propósito del documento
Este documento tiene como objetivo definir de manera clara, estructurada y verificable los requerimientos funcionales y no funcionales para el desarrollo de una **aplicación web moderna de Control de Calorías y Macronutrientes**. Servirá como referencia para diseño, desarrollo, validación y futuras mejoras del sistema.

### 1.2 Alcance del sistema
La aplicación permitirá al usuario controlar su alimentación diaria mediante el **registro de alimentos consumidos**, ya sea de forma manual, por escaneo (imagen o código de barras), y llevar un **seguimiento preciso de calorías, macronutrientes y actividad física**, facilitando el cumplimiento de objetivos nutricionales personalizados.

El sistema estará orientado a usuarios finales (no profesionales de la salud), priorizando facilidad de uso, precisión y visualización clara de datos.

### 1.3 Definiciones y abreviaturas
- **GET**: Gasto Energético Total
- **TMB**: Tasa Metabólica Basal
- **Macros**: Macronutrientes (proteínas, carbohidratos, grasas)
- **ERS**: Especificación de Requerimientos de Software

---

## 2. Descripción General

### 2.1 Perspectiva del producto
La aplicación será una **web app responsive**, accesible desde desktop y dispositivos móviles. Utilizará:
- **Supabase** como base de datos
- **Supabase Auth** para autenticación y gestión de usuarios
- Integración con servicios externos para:
  - Base de datos nutricional
  - Escaneo de códigos de barras
  - (Opcional / futuro) reconocimiento de alimentos por imagen

### 2.2 Clases de usuarios
- **Usuario estándar**: persona que registra su alimentación y actividad física.
- **Administrador (futuro)**: gestión de base de alimentos y métricas del sistema.

### 2.3 Suposiciones y dependencias
- El usuario dispone de conexión a internet.
- Los valores nutricionales pueden variar según la fuente; se aceptan como estimativos.
- El reconocimiento por imagen tendrá un margen de error aceptable y requerirá confirmación del usuario.

---

## 3. Requerimientos Funcionales

### RF-01 Perfil de Usuario Personalizado
El sistema deberá permitir:
- Registro de datos personales:
  - Peso
  - Altura
  - Edad
  - Sexo
  - Nivel de actividad física (Sedentario, Ligero, Moderado, Intenso, Fuerte)
- Cálculo automático de:
  - TMB utilizando fórmula **Harris-Benedict**
  - GET según nivel de actividad
- Definición de objetivo nutricional:
  - Déficit, mantenimiento o superávit calórico

---

### RF-02 Base de Datos Alimentaria
El sistema deberá contar con:
- Biblioteca amplia de alimentos
- Información nutricional detallada:
  - Calorías
  - Proteínas
  - Carbohidratos
  - Grasas
  - (Opcional) Micronutrientes
- Inclusión de marcas comerciales
- Capacidad de ampliación de la base de datos

---

### RF-03 Registro de Alimentos
El sistema deberá permitir registrar alimentos mediante:
- Carga manual (búsqueda en base de datos)
- Escáner de código de barras
- Escaneo por imagen del plato (reconocimiento asistido)

Cada registro deberá incluir:
- Alimento identificado
- Cantidad consumida
- Fecha y horario

---

### RF-04 Control de Porciones
El sistema deberá permitir:
- Registro de cantidades en:
  - Gramos
  - Porciones
  - Tazas / unidades
- Conversión automática a valores nutricionales
- Advertencia al usuario cuando la estimación visual pueda ser imprecisa

---

### RF-05 Cálculo Nutricional
El sistema deberá:
- Calcular automáticamente:
  - Calorías totales por alimento
  - Macronutrientes por alimento
- Acumular:
  - Totales diarios
  - Totales semanales

---

### RF-06 Seguimiento de Ejercicio
El sistema deberá permitir:
- Registrar actividad física diaria
- Seleccionar tipo de ejercicio
- Estimar gasto calórico
- Ajustar balance calórico diario (ingesta vs gasto)

---

### RF-07 Visualización de Progreso
El sistema deberá mostrar:
- Gráficos diarios y semanales de:
  - Calorías
  - Macronutrientes
- Evolución del peso corporal
- Cumplimiento de metas nutricionales

---

### RF-08 Historial y Reportes
El sistema deberá:
- Guardar historial completo de registros
- Permitir consultas por fecha
- Exportar datos (opcional) en formatos estándar

---

## 4. Requerimientos No Funcionales

### RNF-01 Usabilidad
- Interfaz moderna, clara e intuitiva
- Diseño responsive
- Flujo de registro rápido (mínimos clics)

### RNF-02 Rendimiento
- Tiempo de respuesta menor a 2 segundos
- Escaneo de código de barras casi instantáneo

### RNF-03 Seguridad de Datos
- Autenticación segura mediante Supabase Auth
- Encriptación de datos sensibles
- Cumplimiento de buenas prácticas en manejo de datos de salud

### RNF-04 Escalabilidad
- Arquitectura preparada para aumento de usuarios
- Base de datos extensible

### RNF-05 Mantenibilidad
- Código modular
- Separación clara entre frontend, backend y servicios externos

---

## 5. Arquitectura Tecnológica (Propuesta)

- **Frontend**: Framework moderno (React / Next.js / similar)
- **Backend / DB**: Supabase
- **Autenticación**: Supabase Auth
- **APIs externas**:
  - Base nutricional
  - Escaneo de códigos de barras
  - Reconocimiento de imágenes (IA)

---

## 6. Alcance v1, v2 y definición de MVP

### 6.1 Objetivo de la versión inicial (MVP)
El MVP debe permitir al usuario **registrar consumo y actividad**, obtener **totales diarios/semanales**, y ver **progreso** con una experiencia ágil y confiable. El reconocimiento por imagen se implementará en modo **IA asistida** para minimizar errores.

### 6.2 Alcance recomendado por fases

**MVP (v1.0) – “listo para usar”**
- Autenticación y perfil
- Cálculo TMB/GET y metas
- Registro manual + búsqueda en base nutricional
- Control de porciones (g/ml/porción/unidad)
- Totales diarios y semanales (calorías + macros)
- Registro de peso y gráficos de progreso
- Escáner de código de barras
- Exportación simple (CSV)
- Seguridad de datos (RLS, políticas, cifrado en tránsito)

**v1.1 – “más cómodo”**
- Recordatorios y notificaciones
- Metas de macros personalizadas por objetivo
- Modo offline parcial (cola local + sincronización)

**v1.2 – “IA + integraciones”**
- Reconocimiento por imagen (IA asistida con confirmación)
- Integración con servicios de actividad física (Google Fit / Apple Health) (si aplica)

---

## 7. Requerimientos Funcionales (extendidos)

### RF-09 Metas de Macronutrientes Personalizadas
El sistema deberá permitir:
- Configurar metas diarias de macros:
  - Proteínas (g)
  - Carbohidratos (g)
  - Grasas (g)
- Proponer metas automáticas según objetivo:
  - Déficit / Mantenimiento / Superávit
- Permitir ajuste manual por el usuario.

**Criterios de aceptación**
- El usuario puede elegir “automático” o “manual”.
- La UI muestra metas y progreso (g y %).

---

### RF-10 Notificaciones y Recordatorios
El sistema deberá:
- Permitir activar/desactivar notificaciones.
- Configurar recordatorios por:
  - Horarios de comidas
  - Registro de peso (semanal)
- Notificar alertas inteligentes opcionales:
  - “Te faltan X g de proteína para tu meta”
  - “Hoy estás excediendo grasas / carbs”

**Criterios de aceptación**
- El usuario puede seleccionar horarios.
- Las notificaciones se entregan según configuración.

---

### RF-11 Reconocimiento de Alimentos por Imagen (IA Asistida)
El sistema deberá permitir:
- Subir una foto del plato.
- Obtener una lista de alimentos detectados con:
  - Nombre del alimento
  - Probabilidad/score
  - Estimación de porción (opcional)
- Requerir confirmación del usuario antes de registrar.
- Permitir edición manual de:
  - Alimentos identificados (agregar/eliminar)
  - Cantidades

**Criterios de aceptación**
- La IA **nunca registra** sin confirmación.
- El usuario puede corregir alimentos y porciones.

---

### RF-12 Modo Offline Parcial
El sistema deberá:
- Permitir registrar comidas sin conexión.
- Guardar registros en cola local.
- Sincronizar al recuperar conexión.
- Resolver conflictos de forma determinista:
  - Prioridad a timestamp del cliente
  - Reconciliación al sincronizar

**Criterios de aceptación**
- Los registros offline aparecen en el historial.
- Al reconectar, se sincronizan sin duplicar.

---

### RF-13 Integración con Apps/Dispositivos de Actividad Física
El sistema deberá:
- Permitir conectar una fuente externa (si el usuario autoriza).
- Importar:
  - Pasos
  - Entrenamientos
  - Calorías activas
- Mapear datos importados al módulo de ejercicio.

**Criterios de aceptación**
- El usuario puede conectar/desconectar.
- Los datos importados se reflejan en el balance diario.

---

## 8. Requerimientos No Funcionales (ampliados)

### RNF-06 Privacidad y derechos del usuario
- Recolección mínima de datos (data minimization).
- Consentimiento explícito para integraciones de salud.
- Exportación y eliminación de datos por el usuario.

### RNF-07 Trazabilidad
- Auditoría básica de cambios (creación/edición/eliminación de registros).
- Versionado simple de metas y perfil.

---

## 9. Arquitectura Tecnológica (óptima para desarrollo)

### 9.1 Componentes
- **Frontend (Web)**: Next.js (React) + UI kit (shadcn/ui o similar)
- **Backend**: Supabase
  - Postgres (DB)
  - Auth (login/registro)
  - Storage (imágenes de platos)
  - Edge Functions (procesos serverless)
- **Servicios externos**:
  - Base nutricional (API internacional)
  - Escaneo de códigos de barras (EAN/UPC)
  - Motor IA para reconocimiento de alimentos (imagen)
  - Notificaciones (Web Push)

### 9.2 Decisiones de arquitectura (cerradas)
- **Base nutricional**: API internacional con **caching local obligatorio** en tabla `foods` (uso prioritario en Argentina).
- **Reconocimiento por imagen**: IA asistida **solo identifica alimentos**; las porciones son siempre definidas por el usuario.
- **Notificaciones**: recordatorios + alertas inteligentes activables/desactivables.
- **Unidades de porción**: soporte completo (g, ml, unidad, porción, taza, cucharada).

---

## 11. Experiencia de Usuario (UX) – Flujos clave (UX) – Flujos clave

### 11.1 Onboarding
1) Registro/Login
2) Datos básicos
3) Cálculo TMB/GET
4) Configuración de objetivo
5) Metas de macros (auto/manual)

### 11.2 Registrar comida manual
1) Buscar alimento
2) Seleccionar cantidad/unidad
3) Confirmar
4) Ver totales del día

### 11.3 Registrar por barcode
1) Abrir cámara
2) Escanear
3) Confirmar alimento
4) Definir porción
5) Registrar

### 11.4 Registrar por imagen (IA asistida)
1) Tomar/subir foto
2) Ver lista sugerida con scores
3) Corregir alimentos y porciones
4) Confirmar
5) Registrar

---

## 12. Backlog (Historias de Usuario) para desarrollo

### EPIC A – Cuenta y Perfil
- US-A1: Como usuario quiero registrarme/iniciar sesión para guardar mis datos.
- US-A2: Como usuario quiero completar mi perfil para calcular TMB/GET.

### EPIC B – Metas y cálculo
- US-B1: Como usuario quiero que se calculen mis calorías objetivo.
- US-B2: Como usuario quiero metas de macros automáticas o manuales.

### EPIC C – Registro de alimentos
- US-C1: Como usuario quiero buscar alimentos en una base amplia.
- US-C2: Como usuario quiero registrar porciones en distintas unidades.
- US-C3: Como usuario quiero ver el total diario/semanal de calorías y macros.

### EPIC D – Barcode
- US-D1: Como usuario quiero escanear un código de barras para cargar un alimento.

### EPIC E – Imagen (IA asistida)
- US-E1: Como usuario quiero subir una foto del plato y que sugiera alimentos.
- US-E2: Como usuario quiero editar lo detectado antes de registrar.

### EPIC F – Ejercicio
- US-F1: Como usuario quiero registrar ejercicio y ver balance diario.
- US-F2: Como usuario quiero integrar datos de actividad (si autorizo).

### EPIC G – Progreso y reportes
- US-G1: Como usuario quiero ver gráficos de progreso (peso, calorías, macros).
- US-G2: Como usuario quiero exportar mis datos.

### EPIC H – Notificaciones
- US-H1: Como usuario quiero configurar recordatorios.
- US-H2: Como usuario quiero alertas inteligentes opcionales.

### EPIC I – Offline
- US-I1: Como usuario quiero registrar sin internet y sincronizar luego.

---

## 13. Plan de Entrega (óptimo para mandar a desarrollar)

### Sprint 0 – Preparación
- Repositorio, CI/CD, entornos (dev/stage/prod)
- Setup Supabase (Auth, DB, Storage, RLS)
- Esqueleto UI + Design System

### Sprint 1–2 – MVP Core
- Perfil, TMB/GET, metas
- foods + búsqueda
- Registro manual + porciones
- Dashboard diarios/semanales

### Sprint 3 – Barcode
- Escaneo + integración + caching foods

### Sprint 4 – Progreso + export
- Gráficos peso/calorías/macros
- Export CSV

### Sprint 5–6 – IA asistida
- Upload imagen + Edge Function + resultados
- UI de confirmación/corrección
- Generación de food_entries

### Sprint 7 – Notificaciones + Offline parcial
- Configuración + Web Push
- Cola local + sync + resolución de conflictos

### Sprint 8 – Integración actividad (si aplica)
- OAuth + import + mapping

---

## 14. Criterios de Aceptación (finales)

- El usuario puede registrarse/iniciar sesión y sus datos se protegen con RLS.
- Se calcula TMB/GET y se generan metas de calorías y macros.
- El usuario registra comidas manual, barcode e imagen (IA asistida con confirmación).
- Se muestran totales diarios y semanales (calorías y macros) y progreso del peso.
- Registro de ejercicio afecta el balance diario.
- Exportación CSV funciona.
- Notificaciones se pueden configurar y activar/desactivar.
- Offline parcial registra y sincroniza sin duplicados.

---

## 15. Decisiones aprobadas (para evitar ambigüedades)

1) **Base nutricional con foco Argentina**
- Uso inicial en Argentina.
- Implementación recomendada: enfoque mixto (API con buen soporte de barcode + caching en foods + alta manual cuando no exista).

2) **IA por imagen: Alcance A**
- La IA sugiere alimentos.
- La porción/cantidad la define el usuario.
- Confirmación obligatoria antes de registrar.

3) **Notificaciones: Recordatorios + Alertas inteligentes**
- Recordatorios por horarios.
- Alertas por desbalance y faltantes de macros/calorías (configurable).

4) **Unidades de porción: completas**
- g, ml, unidad, porción, taza, cucharada.

---

**Fin del documento**

