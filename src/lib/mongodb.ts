import { type Collection, MongoClient, ServerApiVersion } from "mongodb";
import { type GameStatus } from "~/actions/games";
import { env } from "~/env";

const uri = env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongo = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export default mongo;

export const gamesCollection: Collection<
  Omit<GameStatus, "gameId"> & {
    word: string;
  }
> = mongo.db(env.MONGO_DB).collection("games");
