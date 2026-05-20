# Stage 1: Build Jar
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app

# Copy parent pom and module poms first
COPY pom.xml ./
COPY discovery-server/pom.xml ./discovery-server/
COPY api-gateway/pom.xml ./api-gateway/
COPY auth-service/pom.xml ./auth-service/
COPY product-service/pom.xml ./product-service/
COPY order-service/pom.xml ./order-service/
COPY payment-service/pom.xml ./payment-service/
COPY recommendation-service/pom.xml ./recommendation-service/
COPY review-service/pom.xml ./review-service/
COPY notification-service/pom.xml ./notification-service/
COPY analytics-service/pom.xml ./analytics-service/

# Copy sources
COPY auth-service/src ./auth-service/src

# Compile only this module and its dependencies
RUN mvn clean package -pl auth-service -am -DskipTests

# Stage 2: Runtime Environment
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/auth-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-XX:TieredStopAtLevel=1", "-Xmx384m", "-Xms64m", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
