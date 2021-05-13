import mongo from "mongodb";

import { Logger } from "./libs/log";

const config: IConfig = require("../config/config.json");
import { IConfig } from "./interfaces/config";

// import { ICustomer } from "./interfaces/Customer";

// export const getNewId = () => new mongo.ObjectId().toHexString();
var ObjectId = require("mongodb").ObjectId;

let client: mongo.MongoClient;
let db: mongo.Db;

// let customerCollection: mongo.Collection<ICustomer>;

try {
  (async () => {
    const inst = await mongo.connect(config.mongoURL, {
      connectTimeoutMS: 5000,
      keepAlive: true,
      numberOfRetries: 3,
      poolSize: 50,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    client = inst;
    db = client.db("medumart");

    // customerCollection = db.collection("customers");
  })();
} catch (error) {
  Logger.log(`Mongo connection error:\n${error}`, "error");
}
