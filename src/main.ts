import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import pinoHttp from 'pino-http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('api');

  app.use(
    pinoHttp({
      autoLogging: true,
      level: process.env.LOG_LEVEL || 'info',
      timestamp: () => `,"time":"${new Date().toISOString()}"`,
      customLogLevel: (_res: any, _err: any) => {
        const code = _res.statusCode ?? 0;
        if (code >= 500) return 'error';
        if (code >= 400) return 'warn';
        return 'info';
      },
    }),
  );

  app.useGlobalPipes();

  app.getHttpAdapter().getInstance().get('/', (_req: any, res: any) => {
    _req.log.info(
      {
        port: process.env.PORT || 3001,
        platform: process.env.PLATFORM || 'cloudcodes-hr-backend',
      },
      'health check ping',
    );
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('CloudCodes HR Backend')
    .setDescription('CloudCodes HR System Backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Employees', 'Employee management endpoints')
    .addTag('Leave', 'Leave management endpoints')
    .addTag('Clock', 'Clock-in/out endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
  console.log(`Application is running on: http://localhost:${PORT}`);
  console.log(`Swagger is available at: http://localhost:${PORT}/api/docs`);
  console.log(`Health check available at: http://localhost:${PORT}/`);
}
bootstrap();
