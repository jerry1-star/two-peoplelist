import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173,http://localhost:5174')
    .split(',').map((s) => s.trim()).filter(Boolean)
  app.enableCors({
    origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
    credentials: true,
  })

  app.setGlobalPrefix('api')

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }))

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('人人都是产品专家 API')
      .setDescription('API 文档')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document)
  }

  await app.listen(process.env.PORT ?? 3000)
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`)
  console.log(`Swagger docs: http://localhost:${process.env.PORT ?? 3000}/api/docs`)
}
bootstrap()
