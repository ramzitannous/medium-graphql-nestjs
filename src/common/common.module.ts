import { Module } from "@nestjs/common";
import { PUB_SUB } from "./constants";
import { PubSub } from "graphql-subscriptions";

const pubSubProvider = {
  provide: PUB_SUB,
  useValue: new PubSub(),
};

@Module({
  providers: [pubSubProvider],
  exports: [pubSubProvider],
})
export class CommonModule {}
