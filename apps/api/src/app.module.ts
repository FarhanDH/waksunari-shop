import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
// import { config } from "./config";
import { ConfigModule } from "@nestjs/config";
import { ProductsModule } from "./core/products/products.module";
import { AwsModule } from "./core/aws/aws.module";
import { UsersModule } from "./core/users/users.module";
import { AuthModule } from "./core/auth/auth.module";
import { AppLoggerMiddleware } from "./logger.middleware";
import { config } from "./lib/config";
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    MongooseModule.forRoot(config().db.host, {
      connectionFactory: (connection) => {
        connection.on("connected", () => {
          console.log("MongoDB is connected");
        });
        connection._events.connected();
        return connection;
      },
    }),
    ProductsModule,
    AwsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes("*");
  }
}
