import mongo from "mongodb";

import { Logger } from "./libs/log";

const config: IConfig = require("../config/config.json");
import { IConfig } from "./interfaces/config";
import { IProfile } from "./interfaces/Profile";
import { IRepo } from "./interfaces/Repo";
import { ICommit } from "./interfaces/Commit";

// export const getNewId = () => new mongo.ObjectId().toHexString();
var ObjectId = require("mongodb").ObjectId;

let client: mongo.MongoClient;
let db: mongo.Db;

let profileCollection: mongo.Collection<IProfile>;
let repoCollection: mongo.Collection<IRepo>;
let commitCollection: mongo.Collection<ICommit>;

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

    repoCollection = db.collection("repo");
    commitCollection = db.collection("commit");
  })();
} catch (error) {
  Logger.log(`Mongo connection error:\n${error}`, "error");
}

export const getProfileByName = async (username: string) => {
  try {
    let result = await profileCollection
      .aggregate([
        {
          $lookup: {
            from: "repo",
            localField: "username",
            foreignField: "username",
            as: "repoData",
          },
        },
        { $match: { username: username } },
      ])
      .toArray();
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
      repo_link: profileData.repo_link,
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

export const insertRepos = async (reposData: any) => {
  try {
    let result = await repoCollection.insertMany(reposData);
    return result.ops;
  } catch (error) {
    Logger.log(`mongo:insertRepos -> ${error}`, "error");
    return Promise.reject(error.errmsg);
  }
};

export const insertCommits = async (commitsData: any) => {
  try {
    let result = await commitCollection.insertMany(commitsData);
    return result.ops;
  } catch (error) {
    Logger.log(`mongo:insertCommits -> ${error}`, "error");
    return Promise.reject(error.errmsg);
  }
};
