# Documentación Técnica del Frontend - UDIPSAI

La interfaz de usuario de UDIPSAI es una plataforma moderna, reactiva y altamente visual diseñada para psicólogos y especialistas. Está construida sobre **React 19**, utilizando **TypeScript** para la seguridad tipográfica y **Vite** como motor de construcción ultrarrápido.

---

## 1. Arquitectura del Proyecto

El frontend sigue una estructura modular orientada a la mantenibilidad y al crecimiento orgánico.

### Estructura de Carpetas (`src/`)

*   **`api/`**: Contiene la configuración central de **Axios**.
    *   `api.ts`: Instancia de Axios con interceptores de seguridad que inyectan el token JWT automáticamente en cada petición desde `localStorage`.
*   **`components/`**: Galería de componentes reutilizables.
    *   **`form/`**: Inputs, Selects, DatePickers y validadores visuales.
    *   **`ui/`**: Componentes básicos como Botones, Badges y Alertas.
    *   **`common/`**: Componentes de layout repetitivos como `ComponentCard` o `PageMeta`.
    *   **`modals/`**: Diálogos complejos (ej. `PatientSearchModal`).
*   **`context/`**: Proveedores de estado global.
    *   `AuthContext.tsx`: Gestiona el flujo de login, logout y persistencia de la sesión del usuario.
*   **`hooks/`**: Ganchos de React personalizados para encapsular lógica repetitiva (ej. manejo de formularios o detección de scroll).
*   **`layout/`**: Estructuras maestras de la aplicación.
    *   `AppLayout.tsx`: Contiene el Sidebar, el Header y el área de contenido principal.
*   **`pages/`**: Vistas completas de la aplicación, organizadas por dominio (Pacientes, Citas, WAIS, etc.).
*   **`services/`**: Capa de abstracción de datos. Cada archivo (ej. `pacientes.ts`) contiene las funciones que llaman a la API, tipadas con interfaces claras.
*   **`routes/`**: Configuración central de navegación usando **React Router 7**.

---

## 2. Tecnologías y Herramientas

*   **Estado Global**: Se utiliza la Context API de React para la autenticación y el estado de la UI (sidebar abierto/cerrado).
*   **Estilos con Tailwind CSS 4**: Se aprovechan las variables de CSS modernas y el compilador `@tailwindcss/postcss`. Se define una paleta de colores personalizada que incluye el "Rojo UDIPSAI" y el "Dorado Institucional".
*   **Iconografía**: Se utiliza **Lucide React** para mantener una estética limpia y consistente.
*   **Gráficos**: **ApexCharts** y **Recharts** para la visualización de perfiles psicométricos y estadísticas del dashboard.
*   **Formularios**: Implementación manual balanceada con componentes reutilizables para control total sobre las validaciones complejas de salud.

---

## 3. Flujo de Datos y Conectividad

La comunicación con el backend se realiza de la siguiente manera:

1.  **Llamada al Servicio**: Un componente invoca una función del folder `services/`.
2.  **Interceptación**: Axios detecta la petición, recupera el token del `localStorage` y lo añade a las cabeceras `Authorization: Bearer <token>`.
3.  **Manejo de Respuesta**:
    *   **Éxito**: Se retorna el dato tipado.
    *   **Error 401/403**: El interceptor detecta la expiración del token y redirige al usuario al `/login`.
    *   **Error de Negocio**: Se capturan y muestran mediante **React Toastify**.

---

## 4. Implementación Especial: Módulo de Evaluaciones (Fichas)

Las fichas (como el test WAIS-IV) son los componentes más complejos del sistema:

*   **Estado Local Robusto**: Manejan múltiples objetos de estado para datos generales, subtests y resultados.
*   **Lógica de Cálculo Previa**: El frontend realiza cálculos básicos de edad cronológica y validaciones de rango antes de enviar los datos al servidor.
*   **Generación de PDF**: Utiliza **jsPDF** y **jspdf-autotable** para generar informes en el cliente, permitiendo una descarga inmediata sin esperar procesamiento del servidor.
*   **Visualización de Perfil**: El componente `WaisProfileChart` traduce los índices numéricos en un gráfico de líneas dinámico que facilita la interpretación clínica.

---

## 5. Diseño y UX (User Experience)

UDIPSAI prioriza la usabilidad para profesionales de la salud:

*   **Responsive Design**: La interfaz se adapta desde pantallas de tablets hasta monitores de escritorio de alta resolución.
*   **Dark Mode**: Soporte nativo para modo oscuro, reduciendo la fatiga visual durante largas jornadas de ingreso de datos.
*   **Micro-interacciones**: Transiciones suaves y efectos de hover en botones y tarjetas para una sensación de software "premium".
*   **Filtros Inteligentes**: Listados de pacientes con búsqueda en tiempo real y paginación optimizada.

---

## 6. Guía de Estilo y Convenciones

*   **Componentes**: Se prefiere el uso de componentes funcionales con Hooks.
*   **Naming**: PascalCase para archivos de componentes (`PatientCard.tsx`) y camelCase para funciones de servicio (`getPacientesById`).
*   **TypeScript**: Se prohíbe el uso de `any`. Todas las respuestas de la API deben tener una `interface` definida en el servicio correspondiente.

---

## 7. Despliegue y Optimización

*   **Vite**: El proceso de build genera un bundle optimizado, minificado y con nombres de archivo hasheados para evitar problemas de caché.
*   **Code Splitting**: Se utiliza `React.lazy()` y `Suspense` para cargar las vistas de las fichas solo cuando el usuario las necesita, reduciendo el peso del JS inicial.
*   **Variables de Entorno**: Configuración de `VITE_API_URL` para facilitar el cambio entre servidores de desarrollo, testing y producción.

---

## 8. Cómo Añadir una Nueva Página

1. Crear la carpeta de la página en `src/pages/NuevoModulo`.
2. Crear el componente principal y sus sub-componentes.
3. Crear un servicio en `src/services/nuevoModulo.ts` para las llamadas al API.
4. Registrar la ruta en `src/routes/AppRoutes.tsx` (o archivo similar).
5. Añadir el enlace en el Sidebar del Layout.
