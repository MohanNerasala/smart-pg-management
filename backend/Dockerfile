# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the executable jar file to the container
COPY target/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8081

# Run the jar file 
ENTRYPOINT ["java", "-jar", "app.jar"]
