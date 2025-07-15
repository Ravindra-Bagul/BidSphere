# Use Maven with JDK 17 to build the app
FROM maven:3.9.6-eclipse-temurin-17 as build

# Set working directory
WORKDIR /app

# Copy source code
COPY . .

# Build using system Maven
RUN mvn clean package -DskipTests

# Use JDK 17 runtime for smaller final image
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/auction-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run the app
CMD ["java", "-jar", "app.jar"]
