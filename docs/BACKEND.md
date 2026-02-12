# Documentación Técnica del Backend - UDIPSAI

El backend de UDIPSAI es un sistema de gestión empresarial y clínica diseñado para centralizar la atención psicopedagógica. Esta API REST robusta utiliza **Spring Boot 3.2.5** y **Java 17**, implementando un diseño orientado a dominios (Domain-Driven Design simplificado) dentro de una arquitectura modular.

---

## 1. Arquitectura y Estructura de Directorios

El proyecto sigue una estructura de **Monolito Modular**, lo que permite una separación clara de responsabilidades y facilita el mantenimiento.

### Directorios Principales (`src/main/java/com/ucacue/udipsai/`)

*   **`common/`**: Contiene utilidades generales, manejadores de excepciones globales y clases base. Aquí se definen estándares de respuesta y decoradores comunes.
*   **`config/`**: Configuraciones críticas del framework.
    *   `CorsConfig.java`: Configuración de políticas de origen para la comunicación con el frontend.
    *   `SwaggerConfig.java`: Autogeneración de documentación OpenAPI 3.
*   **`infrastructure/`**: Núcleo técnico del sistema.
    *   **`security/`**: Implementación de seguridad con **Spring Security** y **JWT**.
        *   `JwtTokenProvider.java`: Generación y validación de tokens.
        *   `JwtAuthenticationFilter.java`: Filtro para interceptar y validar peticiones.
        *   `SecurityConfig.java`: Definición de rutas públicas/privadas y filtros de seguridad.
    *   **`storage/`**: Lógica para el manejo de archivos físicos y carga de documentos.
*   **`modules/`**: El corazón del negocio, dividido en micro-módulos:
    *   `auth/`: Gestión de usuarios, roles y autenticación.
    *   `paciente/`: CRUD y lógica de búsqueda avanzada de pacientes.
    *   `citas/`: Motor de agendamiento y estados de atención.
    *   `wais/`: Módulo de evaluación psicométrica con lógica de cálculo compleja.
    *   `historiaclinica/`: Acumulación de atenciones y diagnósticos por paciente.

---

## 2. Flujo de Ejecución (Petición HTTP)

Cada petición entrante sigue un patrón estrictamente definido:

1.  **Seguridad (Filter Chain)**: La petición pasa por `JwtAuthenticationFilter`. Si el Token es válido, se establece el contexto de seguridad (`UserPrincipal`).
2.  **Controller (Entry Point)**: Recibe el `DTO` (Data Transfer Object) y utiliza `@Valid` para validaciones sintácticas.
3.  **Service (Business Logic)**: Capa donde reside la lógica compleja. Aquí se anotan los métodos con `@Transactional` para asegurar la integridad de los datos.
4.  **Repository (Data Access)**: Interfaz que extiende `JpaRepository`. Se utiliza **Spring Data JPA** para interactuar con la base de datos PostgreSQL.
5.  **Entity (Persistence)**: Mapeo objeto-relacional (ORM) usando anotaciones de Jakarta Persistence.

---

## 3. Lógica Especializada: El Módulo WAIS-IV

El sistema destaca por su capacidad de procesar la escala **WAIS-IV**. El proceso de cálculo es:

1.  El frontend envía los **Puntajes Crudos** de cada subtest.
2.  El backend recibe estos puntajes y la edad cronológica (calculada en meses).
3.  **Baremos en DB**: El servicio busca en tablas de equivalencias los **Puntajes Escalares**.
4.  **Cálculo de Índices (ICV, IRP, IMT, IVP)**: Se suman los puntajes escalares correspondientes a cada índice.
5.  **Conversión Final**: Se consultan las tablas de conversión para obtener el **CI Total**, Percentiles e Intervalos de Confianza (IC 90%/95%).
6.  La respuesta retorna un objeto JSON detallado con cada paso del cálculo.

---

## 4. Gestión de Reportes y PDF

UDIPSAI utiliza tres estrategias para la documentación clínica:

1.  **JasperReports**: Plantillas estáticas `.jrxml` para reportes rápidos y formateados (listados de pacientes, agendas).
2.  **OpenHTMLtoPDF + Thymeleaf**: Permite crear PDFs a partir de plantillas HTML. Se usa para informes clínicos donde el diseño debe ser similar a una web (como el informe WAIS).
3.  **PDFBox**: Se utiliza para tareas de bajo nivel, como combinar documentos o añadir marcas de agua.

---

## 5. Base de Datos y Persistencia

*   **Motor**: PostgreSQL.
*   **Naming Convention**: Las tablas siguen `snake_case` (ej. `pacientes_fichas`).
*   **Auditoría**: Se rastrean fechas de creación y modificación en tablas críticas.
*   **Relaciones**: Se prefiere el uso de `FetchType.LAZY` para optimizar el rendimiento y evitar cargas masivas innecesarias.

---

## 6. Seguridad y Roles

El sistema implementa **RBAC (Role-Based Access Control)**:
*   `ADMIN`: Control total del sistema.
*   `ESPECIALISTA`: Acceso a sus pacientes y creación de fichas.
*   `PASANTE`: Acceso limitado, requiere supervisión en ciertas fichas.

Los permisos se gestionan a nivel de método usando `@PreAuthorize("hasAuthority('...')")`.

---

## 7. Configuración de Entornos

El sistema maneja perfiles de Spring:
*   `application-dev.properties`: Base de datos local (H2 o Postgres local).
*   `application-prod.properties`: Configuración para servidor en producción con variables de entorno para credenciales.

---

## 8. Endpoints Clave para Desarrolladores

| Verbo | Endpoint | Descripción |
| :--- | :--- | :--- |
| POST | `/api/auth/login` | Retorna el JWT para acceso. |
| GET | `/api/pacientes/search` | Búsqueda filtrada de pacientes. |
| POST | `/api/wais/calcular-crudo` | Motor de cálculo de la escala WAIS. |
| GET | `/v3/api-docs` | JSON de la definición OpenAPI. |

---

## 9. Mantenimiento y Extensibilidad

Para añadir un nuevo módulo (ej. una nueva ficha de evaluación):
1. Crear el paquete en `modules/nuevo_modulo`.
2. Definir la `Entity` y su `Repository`.
3. Crear el `Service` con la lógica de negocio.
4. Definir los `DTOs` de entrada/salida.
5. Exponer a través de un `Controller`.
6. Configurar permisos en `SecurityConfig`.
