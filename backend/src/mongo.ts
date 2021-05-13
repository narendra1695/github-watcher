import mongo from "mongodb";

import { Logger } from "./libs/log";

const config: IConfig = require("../config/config.json");
import { IConfig } from "./interfaces/config";
import { IProfile } from "./interfaces/Profile";

// export const getNewId = () => new mongo.ObjectId().toHexString();
var ObjectId = require("mongodb").ObjectId;

let client: mongo.MongoClient;
let db: mongo.Db;

let profileCollection: mongo.Collection<IProfile>;

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
    db = client.db("github-watcher");

    profileCollection = db.collection("profile");
    profileCollection.createIndex({ userID: 1 }, { unique: true });
  })();
} catch (error) {
  Logger.log(`Mongo connection error:\n${error}`, "error");
}

export const getProfileByName = async (username: string) => {
  try {
    let result = await profileCollection.find({ username: username }).toArray();
    return result;
  } catch (error) {
    Logger.log(`mongo:getProfileByName -> ${error}`, "error");
    return Promise.reject(error.errmsg);
  }
};

export const insertProfile = async (profileData: IProfile) => {
  try {
    let profile: IProfile = {
      username: profileData.username,
      userID: profileData.userID,
      name: profileData.name,
      company: profileData.company,
      blog: profileData.blog,
      location: profileData.location,
      email: profileData.email,
      bio: profileData.bio,
      publicRepoCount: profileData.publicRepoCount,
      avatar: profileData.avatar,
      profileURL: profileData.profileURL,
      followers: profileData.followers,
      following: profileData.following,
    };
    let result = await profileCollection.insertOne(profile);
    return result.ops;
  } catch (error) {
    Logger.log(`mongo:insertProfile -> ${error}`, "error");
    return Promise.reject(error.errmsg);
  }
};
