# Sistema Web - Banda de Guerra UNEFA (Núcleo Falcón)

Aplicación web desarrollada para la gestión administrativa, control de acceso y repositorio de partituras/toques de la Banda de Guerra de la UNEFA.


## 📋 Tabla de Contenido
1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación y Configuración Local](#instalación-y-configuración-local)
4. [Ejecución con Docker (Contenedorización)](#ejecución-con-docker-contenedorización)
5. [Endpoints y Endpoints de Diagnóstico](#endpoints-y-endpoints-de-diagnóstico)


## 🏛️ Arquitectura del Sistema
El sistema implementa un servidor backend basado en Node.js con Express, aplicando políticas de seguridad, control de acceso por autenticación y trazabilidad mediante IDs de correlación.
# Sistema Web - UNEFA Banda de Guerra


## 📐 Diagrama de Arquitectura (Mermaid)

```mermaid
graph TD;
    A[Usuario / Cliente] -->|Petición HTTP| B[Servidor Express (server.js)]
    B -->|Validación JSDoc / Lógica| C{¿Datos Válidos?}
    C -->|Sí| D[Procesar Petición / Respuesta 200/201]
    C -->|No| E[Respuesta de Error 400/401]
    B -->|Lectura de datos| F[toques.json]