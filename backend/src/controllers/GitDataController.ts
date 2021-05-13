import { Request, Response } from "express";
import { HttpStatusCode as httpStatusCodes } from "../libs/HttpStatusCode";
import axios from "axios";

import { Logger } from "../libs/log";

import { IConfig } from "../interfaces/config";
const config: IConfig = require("../../config/config.json");

import { getData, insertProfile, insertRepos } from "../mongo";

export class GitDataController {
  static getData = async (_: Request, res: Response) => {
    const username = _.params.username;
    if (!username) {
      Logger.log(
        `GitDataController::getData -> Invalid username provided`,
        "error"
      );
      return res.status(httpStatusCodes.NOT_ACCEPTABLE).end();
    }
    try {
      let profile: any = [];
      const profileURL: string = config.baseURL + "/users/" + username;
      const response: any = await axios({
        method: "GET",
        url: profileURL,
        headers: { Accept: "application/vnd.github.v3+json" },
      });
      let result: any = response.data;
      const _profile: any = {
        username: result["login"],
        userID: result["id"],
        name: result["name"],
        company: result["company"],
        blog: result["blog"],
        location: result["location"],
        email: result["email"],
        bio: result["bio"],
        publicRepoCount: result["public_repos"],
        repo_link: result["repos_url"],
        avatar: result["avatar_url"],
        profileURL: result["html_url"],
        followers: result["followers"],
        following: result["following"],
      };
      profile = await insertProfile(_profile);

      // fetching repos
      let repoURL: string = profile[0]["repo_link"];
      if (repoURL) {
        const repoResponse: any = await axios({
          method: "GET",
          url: repoURL,
          headers: { Accept: "application/vnd.github.v3+json" },
        });

        let repos: any = repoResponse.data.map((item: any) => {
          const newData: any = {};

          newData["username"] = item["owner"]["login"];
          newData["userID"] = item["owner"]["id"];
          newData["repoID"] = item["id"];
          newData["name"] = item["name"];
          newData["description"] = item["description"];
          newData["repoURL"] = item["html_url"];

          return newData;
        });
        let result = await insertRepos(repos);
        console.log(result);

        Logger.log(
          `GitDataController::getData -> Saving ${username}'s repo(s) successful!`
        );
      }
      profile = await getData(username);
      Logger.log(
        `GitDataController::getData -> Fetching ${username}'s repository(s) successful!`
      );
      return res.status(httpStatusCodes.OK).json(profile);
    } catch (error) {
      Logger.log(
        `GitDataController::getData -> Saving ${username}'s profile failed!`,
        "error"
      );
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  };
}
