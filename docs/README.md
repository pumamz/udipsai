# UDIPSAI - Sistema de Gestión de Atención Psicopedagógica

Este repositorio contiene el sistema UDIPSAI, una plataforma integral para la gestión de pacientes, citas y evaluaciones psicopedagógicas. El sistema está dividido en dos partes principales: el backend (API) y el frontend (Interfaz de usuario).

## Estructura del Proyecto

- **udipsai-back**: API robusta desarrollada en Java con Spring Boot.
- **udipsai-front**: Aplicación web moderna desarrollada en React con TypeScript y Vite.
- **docs**: Documentación técnica detallada del sistema.

## Documentación Detallada

Puedes encontrar información específica sobre cada componente en los siguientes enlaces:

- [Documentación del Backend](./BACKEND.md)
- [Documentación del Frontend](./FRONTEND.md)
- [Plan de Mejoras y Escalamiento](./IMPROVEMENTS.md)

## Tecnologías Principales

### Backend
- **Lenguaje**: Java 17
- **Framework**: Spring Boot 3.2.5
- **Base de Datos**: PostgreSQL
- **Seguridad**: Spring Security + JWT
- **Documentación API**: Swagger / OpenAPI 3
- **Generación de Reportes**: JasperReports, iText, PDFBox

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **Estado/Rutas**: React Router 7
- **Visualización**: ApexCharts, Recharts, FullCalendar

## Instalación Rápida

### Requisitos
- Docker y Docker Compose
- JDK 17
- Node.js 20+

### Ejecución con Docker
```bash
docker-compose up -d
```

### Ejecución en Desarrollo
1. **Backend**:
   ```bash
   cd udipsai-back
   ./mvnw spring-boot:run
   ```
2. **Frontend**:
   ```bash
   cd udipsai-front
   npm install
   npm run dev
   ```
