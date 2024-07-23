import { Kafka as UpstashKafka } from "@upstash/kafka";
import { env } from "./env";

export const upstashKafka = new UpstashKafka({
  url: env.UPSTASH_KAFKA_REST_URL,
  username: env.UPSTASH_KAFKA_USERNAME,
  password: env.UPSTASH_KAFKA_PASSWORD,
});
