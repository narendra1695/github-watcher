import { Request, Response } from "express";
import { HttpStatusCode as httpStatusCodes } from "../libs/HttpStatusCode";
import { Logger } from "../libs/log";
const config: IConfig = require("../../config/config.json");
import { IConfig } from "../interfaces/config";
import axios from "axios";
import {} from "../mongo";

export class GitController {
  static getGitData = async (_: Request, res: Response) => {
    const username = _.params.username;
    if (!username) {
      Logger.log(
        `GitController::getGitData -> Invalid parameter provided`,
        "error"
      );
      return res.status(httpStatusCodes.NOT_ACCEPTABLE).end();
    }
    try {
      const url: string = config.baseURL + "/users/" + username + "/repos";
      const response = await axios({
        method: "GET",
        url: url,
        headers: { Accept: "application/vnd.github.v3+json" },
      });
      const result = response.data;
      console.log(result.length);
      return res.status(httpStatusCodes.OK).json(result);
    } catch (error) {
      Logger.log(
        `GitController::getGitData -> Fetching ${username}'s GitHub data failed!`,
        "error"
      );
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  };
}
