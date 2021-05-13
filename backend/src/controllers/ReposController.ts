import { Request, Response } from "express";
import { HttpStatusCode as httpStatusCodes } from "../libs/HttpStatusCode";
import axios from "axios";

import { Logger } from "../libs/log";

import { IConfig } from "../interfaces/config";
const config: IConfig = require("../../config/config.json");

// import { insertRepository } from "../mongo";

export class ReposController {
  static getnSaveProfile = async (_: Request, res: Response) => {
    const username = _.params.username;
    if (!username) {
      Logger.log(
        `GitController::getRepos -> Invalid username provided`,
        "error"
      );
      return res.status(httpStatusCodes.NOT_ACCEPTABLE).end();
    }
    try {
      const profileURL: string = config.baseURL + "/users/" + username;
      const response: any = await axios({
        method: "GET",
        url: profileURL,
        headers: { Accept: "application/vnd.github.v3+json" },
      });
      let result: any = response.data;

      const profile: any = {
        userID: result["id"],
        name: result["name"],
        company: result["company"],
        blog: result["blog"],
        location: result["location"],
        email: result["email"],
        bio: result["bio"],
        publicRepoCount: result["public_repos"],
        avatar: result["avatar_url"],
        profileURL: result["html_url"],
        followers: result["followers"],
        following: result["following"],
      };

      Logger.log(
        `GitController::getRepos -> Fetching ${username}'s profile successful!`
      );
      return res.status(httpStatusCodes.OK).json(profile);
    } catch (error) {
      Logger.log(
        `GitController::getRepos -> Fetching or storing ${username}'s repository(s) failed!`,
        "error"
      );
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  };

  // static getRepos = async (_: Request, res: Response) => {
  //   const username = _.params.username;
  //   if (!username) {
  //     Logger.log(
  //       `GitController::getRepos -> Invalid parameter provided`,
  //       "error"
  //     );
  //     return res.status(httpStatusCodes.NOT_ACCEPTABLE).end();
  //   }
  //   try {
  //     const repoURL: string = config.baseURL + "/users/" + username + "/repos";
  //     const response: any = await axios({
  //       method: "GET",
  //       url: repoURL,
  //       headers: { Accept: "application/vnd.github.v3+json" },
  //     });

  //     Logger.log(
  //       `GitController::getRepos -> Fetching ${username}'s repository(s) successful!`
  //     );

  //     const updatedData: any = response.data.map((item: any) => {
  //       const newData: any = {};

  //       newData["name"] = item["name"];
  //       newData["isPrivate"] = item["private"];
  //       newData["description"] = item["description"];
  //       newData["repoURL"] = item["html_url"];
  //       newData["commit_link"] = item["commits_url"].replace("{/sha}", "");

  //       return newData;
  //     });
  //     if (updatedData.length >= 0) {
  //       // const repoData: any = JSON.parse(updatedData);
  //       const result = await insertRepository(updatedData);
  //       Logger.log(
  //         `GitController::getRepos -> Stored ${username}'s repository(s) in DB!`
  //       );
  //       return res.status(httpStatusCodes.OK).json(result);
  //     }
  //   } catch (error) {
  //     Logger.log(
  //       `GitController::getRepos -> Fetching or storing ${username}'s repository(s) failed!`,
  //       "error"
  //     );
  //     return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json(error);
  //   }
  // };
}
