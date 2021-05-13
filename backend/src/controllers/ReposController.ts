import { Request, Response } from "express";
import { HttpStatusCode as httpStatusCodes } from "../libs/HttpStatusCode";
import axios from "axios";

import { Logger } from "../libs/log";

import { IConfig } from "../interfaces/config";
const config: IConfig = require("../../config/config.json");
import { IRepo } from "../interfaces/Repo";

import {} from "../mongo";

export class ReposController {
  static getRepos = async (_: Request, res: Response) => {
    const username = _.params.username;
    if (!username) {
      Logger.log(
        `GitController::getRepos -> Invalid parameter provided`,
        "error"
      );
      return res.status(httpStatusCodes.NOT_ACCEPTABLE).end();
    }
    try {
      const repoURL: string = config.baseURL + "/users/" + username + "/repos";
      const response: any = await axios({
        method: "GET",
        url: repoURL,
        headers: { Accept: "application/vnd.github.v3+json" },
      });
      const result: IRepo = response.data.map((item: any) => {
        const newData: any = {};

        newData["name"] = item["name"];
        newData["isPrivate"] = item["private"];
        newData["description"] = item["description"];
        newData["repoURL"] = item["html_url"];
        newData["commit_link"] = item["commits_url"].replace("{/sha}", "");

        return newData;
      });
      Logger.log(
        `GitController::getRepos -> Fetching ${username}'s repository(s) successful!`
      );
      return res.status(httpStatusCodes.OK).json(result);
    } catch (error) {
      Logger.log(
        `GitController::getRepos -> Fetching ${username}'s repository(s) failed!`,
        "error"
      );
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  };
}
