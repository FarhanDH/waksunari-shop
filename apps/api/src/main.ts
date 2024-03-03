import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { config } from "./lib/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const configService = app.get(ConfigService);
  const port = configService.get<number>("http.port");
  const origins = configService.get<string[]>("http.cors");

  app.enableCors({
    origin: origins,
    credentials: true,
  });

  app.setGlobalPrefix("api");
  await app
    .listen(+config().http.port)
    .then(() => console.log(`server started 🚀 on port ${port}`));
}
bootstrap();
