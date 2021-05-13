import { Request, Response } from "express";
import { HttpStatusCode as httpStatusCodes } from "../libs/HttpStatusCode";
import axios from "axios";

import { Logger } from "../libs/log";

import { IConfig } from "../interfaces/config";
const config: IConfig = require("../../config/config.json");
import { ICommit } from "../interfaces/Commit";

import {} from "../mongo";

export class CommitsController {
  static getCommits = async (_: Request, res: Response) => {
    const username = _.params.username;
    const repoName = _.params.repoName;
    if (!username || !repoName) {
      Logger.log(
        `CommitsController::getCommits -> Invalid parameter provided`,
        "error"
      );
      return res.status(httpStatusCodes.NOT_ACCEPTABLE).end();
    }
    try {
      const commitURL: string =
        config.baseURL + "/repos/" + username + "/" + repoName + "/commits";
      const response: any = await axios({
        method: "GET",
        url: commitURL,
        headers: { Accept: "application/vnd.github.v3+json" },
      });
      console.log(response.data);
      const result: ICommit = response.data.map((item: any) => {
        const newData: any = {};

        newData["sha"] = item["sha"];
        newData["message"] = item["commit"]["message"];
        newData["commitURL"] = item["html_url"];

        return newData;
      });
      Logger.log(
        `CommitsController::getCommits -> Fetching ${username}'s commits successful!`
      );
      return res.status(httpStatusCodes.OK).json(result);
    } catch (error) {
      Logger.log(
        `CommitsController::getCommits -> Fetching ${username}'s commits failed!`,
        "error"
      );
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  };
}
