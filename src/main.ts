import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn"],
  });
  app.enableCors({ origin: "*" });
  app.setGlobalPrefix("api");

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("CloudCodes HR Backend")
    .setDescription("CloudCodes HR System Backend API")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("Auth", "Authentication endpoints")
    .addTag("Users", "User management endpoints")
    .addTag("Employees", "Employee management endpoints")
    .addTag("Leave", "Leave management endpoints")
    .addTag("Clock", "Clock-in/out endpoints")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
  console.log(`Application is running on: http://localhost:${PORT}`);
  console.log(`Swagger is available at: http://localhost:${PORT}/api/docs`);
}
bootstrap();
