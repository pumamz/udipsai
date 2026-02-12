# Plan de Mejoras y Escalamiento - UDIPSAI

Este documento detalla una hoja de ruta técnica para llevar el sistema UDIPSAI al siguiente nivel, mejorando su robustez, seguridad, rendimiento y escalabilidad.

## Backend (Spring Boot)

### 1. Arquitectura y Código
- [ ] **Implementar Manejo Global de Excepciones**: Usar `@ControllerAdvice` para estandarizar las respuestas de error en formato JSON.
- [ ] **Versionado de API**: Cambiar rutas a `/api/v1/...` para permitir cambios breaking sin afectar clientes antiguos.
- [ ] **Migraciones de Base de Datos**: Integrar **Liquibase** o **Flyway** para gestionar el esquema de la base de datos de forma controlada y reproducible.
- [ ] **Validación Avanzada**: Sustituir validaciones manuales por anotaciones `@Valid` de Jakarta Validation y validadores personalizados.
- [ ] **Soft Deletes**: Implementar borrado lógico en entidades críticas (Pacientes, Citas) para auditoría y recuperación de datos.
- [ ] **Auditoría JPA**: Usar `@CreatedDate`, `@LastModifiedDate` y `@CreatedBy` para rastrear quién y cuándo modificó los registros.

### 2. Rendimiento
- [ ] **Caché con Redis**: Implementar caché para tablas de referencia (baremos de WAIS, listas de instituciones) que no cambian frecuentemente.
- [ ] **Optimización de Consultas**: Revisar relaciones y usar `@EntityGraph` o `join fetch` para evitar el problema de N+1 consultas.
- [ ] **Procesamiento Asíncrono**: Mover la generación de reportes pesados a hilos en segundo plano usando `@Async` o colas de mensajes (RabbitMQ).

### 3. Seguridad
- [ ] **Refrescar Tokens**: Implementar Refresh Tokens para mejorar la seguridad y la experiencia de usuario (evitar cierres de sesión repentinos).
- [ ] **Rate Limiting**: Limitar el número de peticiones por IP para prevenir ataques de fuerza bruta o DoS.
- [ ] **Escaneo de Vulnerabilidades**: Configurar herramientas como Dependabot o Snyk para detectar dependencias obsoletas o inseguras.

## Frontend (React)

### 1. Estado y Datos
- [ ] **Migrar a React Query (TanStack Query)**: Para gestionar el cacheo de peticiones, re-intentos automáticos y estados de carga de forma profesional.
- [ ] **Gestión de Estado Global**: Si la lógica crece, implementar **Zustand** para un estado global ligero y eficiente (sesión, tema, filtros).
- [ ] **Formularios Dinámicos**: Implementar **React Hook Form** junto con **Zod** para validaciones de esquema robustas y menos boilerplate code.

### 2. Experiencia de Usuario (UX)
- [ ] **Skeleton Loaders**: Sustituir los típicos spinners de carga por skeletons que mejoren la percepción de velocidad.
- [ ] **Modo Offline**: Implementar capacidades básicas de PWA para que los especialistas puedan consultar agendas sin conexión estable.
- [ ] **Internacionalización (i18n)**: Configurar `react-i18next` para soportar múltiples idiomas en el futuro.
- [ ] **Error Boundaries**: Implementar límites de error para capturar fallos en componentes específicos sin romper toda la aplicación.

### 3. Rendimiento
- [ ] **Code Splitting**: Asegurar que las rutas se carguen bajo demanda (`React.lazy`) para reducir el tamaño del bundle inicial.
- [ ] **Optimización de Imágenes**: Implementar carga perezosa (lazy loading) y formatos modernos (WebP) para fotos de perfil o documentos.

## Infraestructura y DevOps

### 1. Despliegue y Escalado
- [ ] **Containerización Avanzada**: Optimizar los Dockerfiles para producción (multi-stage builds) para reducir el tamaño de las imágenes.
- [ ] **Almacenamiento en la Nube**: Migrar la carpeta `uploads` a **AWS S3** o **MinIO** para permitir que el backend escale horizontalmente sin perder archivos locales.
- [ ] **CI/CD Pipelines**: Configurar GitHub Actions o GitLab CI para ejecutar tests automáticamente y desplegar en servidores de staging/prod.

### 2. Observabilidad
- [ ] **Monitoreo**: Implementar **Prometheus** y **Grafana** para visualizar métricas de salud del sistema, uso de memoria y tiempos de respuesta.
- [ ] **Logging Centralizado**: Configurar un stack ELK (Elasticsearch, Logstash, Kibana) o Grafana Loki para buscar logs de forma eficiente.
- [ ] **Health Checks**: Configurar `spring-boot-starter-actuator` para monitorear el estado de la DB y la aplicación.

## Nuevas Funcionalidades Recomendadas

- [ ] **Módulo de Telemedicina**: Integrar APIs de videoconferencia (Jitsi, Zoom) para sesiones remotas.
- [ ] **Notificaciones**: Sistema de envío de correos (Amazon SES) o SMS (Twilio) para recordatorios de citas automáticos.
- [ ] **Firma Digital**: Integrar firmas electrónicas en los informes y consentimientos informados de los pacientes.
- [ ] **Dashboard de Analítica**: Panel para administradores con estadísticas de atención, diagnósticos más frecuentes y productividad por especialista.
