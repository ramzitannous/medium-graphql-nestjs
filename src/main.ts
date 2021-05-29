import "source-map-support/register";
import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { MongoErrorFilter } from "./common/mongo-error.filter";
import { JwtAuthGuard } from "./auth/auth.guard";
import * as mongoose from "mongoose";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new MongoErrorFilter());
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  await app.listen(configService.get<number>("SERVER_PORT"));
  mongoose.set("debug", true);
}
bootstrap();
