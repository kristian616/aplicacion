# Sistema Web - Banda de Guerra UNEFA (Núcleo Falcón)

Aplicación web desarrollada para la gestión administrativa, control de acceso, repositorio de partituras/toques y monitoreo de la Banda de Guerra de la UNEFA.

---

## Tabla de Contenido
1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación y Configuración Local](#instalación-y-configuración-local)
4. [Ejecución de Pruebas Unitarias](#ejecución-de-pruebas-unitarias)
5. [Ejecución con Docker](#ejecución-con-docker)
6. [Canalización de Integración y Despliegue](#canalización-de-integración-y-despliegue)
7. [Endpoints API y Diagnóstico](#endpoints-api-y-diagnóstico)
8. [Seguridad y Observabilidad](#seguridad-y-observabilidad)

---

## Arquitectura del Sistema

El sistema cuenta con un servidor backend desacoplado construido sobre **Node.js** y **Express**. Aplica validación estricta de esquemas (JSDoc), middleware para el control de acceso por roles (**RBAC**), inyección de identificadores únicos de trazabilidad (**Correlation ID**) y generación de logs estructurados en formato JSON.

### Diagrama de Arquitectura (Mermaid)

```mermaid
graph TD;
    A[Usuario / Cliente HTTP] -->|Petición con X-Correlation-ID| B[Middleware de Trazabilidad y Logging JSON]
    B --> C{¿Ruta Pública o Protegida?}
    
    C -->|Pública / Diagnóstico| D[Endpoints /diag/ready & /diag/metrics]
    C -->|Acceso a Sistema| E[Servicio de Autenticación /login]
    C -->|API de Toques| F[Middleware RBAC - verificarRol]
    
    F -->|Permitido| G[Validación JSDoc - validarToqueDefensivo]
    F -->|Denegado| H[Respuesta 403 Forbidden]
    
    G -->|Payload Válido| I[Procesar / Persistir en toques.json]
    G -->|Payload Inválido| J[Respuesta 400 Bad Request]