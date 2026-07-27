import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend requests
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Swagger OpenAPI Setup
  const config = new DocumentBuilder()
    .setTitle('Currency Converter API')
    .setDescription(
      'NestJS Backend API for Currency Conversions & Historical Rates using freecurrencyapi.com',
    )
    .setVersion('1.0')
    .addTag('currency')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const nodeEnv = process.env.NODE_ENV || 'development';
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(
    `🚀 NestJS Currency Backend running in [${nodeEnv.toUpperCase()}] mode on http://localhost:${port}`,
  );
  console.log(
    `📚 Swagger Documentation available on http://localhost:${port}/api/docs`,
  );
}
void bootstrap();
