# ETAPA 1: BUILD (Compilación y Creación del JAR)
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiar archivo de configuración
COPY pom.xml .

# Descargar dependencias
RUN mvn dependency:go-offline -B

# Copiar código fuente
COPY src src

# Empaquetar la aplicación
RUN mvn package -DskipTests -B

# ETAPA 2: RUN (Ejecución)
FROM eclipse-temurin:17-jre-focal AS runner

WORKDIR /app

# Exponer puerto
EXPOSE 8080

# Copiar el JAR generado
# Basado en pom.xml: <artifactId>UDIPSAI-Backend</artifactId> <version>1.0.0</version>
COPY --from=builder /app/target/UDIPSAI-Backend-1.0.0.jar app.jar

# Configuración de variables de entorno por defecto
ENV SPRING_PROFILES_ACTIVE=prod


# Crear usuario no root para mayor seguridad
RUN useradd -m appuser && chown -R appuser /app
USER appuser

# HEALTHCHECK para verificar que la app responde en el puerto 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
	CMD wget --spider -q http://localhost:8080/actuator/health || exit 1

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]