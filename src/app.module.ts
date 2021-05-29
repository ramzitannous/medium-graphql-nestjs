import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { ArticlesModule } from "./articles/articles.module";
import * as mongoosePaginate from "mongoose-paginate-v2";
import { PUB_SUB } from "./common/constants";
import { PubSub } from "graphql-subscriptions";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
        connectionFactory: (connection) => {
          connection.plugin(mongoosePaginate);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        playground: true,
        debug: config.get<boolean>("DEBUG"),
        autoSchemaFile: join(process.cwd(), "src/schema.gql"),
        installSubscriptionHandlers: true,
        subscriptions: {
          onConnect: (connectionParams: { Authorization: string }) => {
            const authorization = connectionParams.Authorization;
            return { authorization };
          },
        },
        context: ({ connection, req }) =>
          req ? req : { req: { headers: connection.context } },
      }),
    }),
    ArticlesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
