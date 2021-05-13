import { Request, Response } from "express";
import { HttpStatusCode as httpStatusCodes } from "../libs/HttpStatusCode";
import axios from "axios";

import { Logger } from "../libs/log";

import { IConfig } from "../interfaces/config";
const config: IConfig = require("../../config/config.json");

import { getProfileByName, insertProfile } from "../mongo";

export class ProfileController {
  static getnSaveProfile = async (_: Request, res: Response) => {
    const username = _.params.username;
    if (!username) {
      Logger.log(
        `GitController::getnSaveProfile -> Invalid username provided`,
        "error"
      );
      return res.status(httpStatusCodes.NOT_ACCEPTABLE).end();
    }
    try {
      let profile: any = [];
      profile = await getProfileByName(username);
      if (profile.length > 0) {
        Logger.log(
          `GitController::getnSaveProfile -> ${username}'s profile already exists in DB. Fetching data...`
        );
        return res.status(httpStatusCodes.OK).send(profile);
      } else {
        console.log("profile dosen't exists!");
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
          avatar: result["avatar_url"],
          profileURL: result["html_url"],
          followers: result["followers"],
          following: result["following"],
        };
        Logger.log(
          `GitController::getRepos -> Fetching ${username}'s profile successful!`
        );
        profile = await insertProfile(_profile);
        return res.status(httpStatusCodes.OK).json(profile);
      }
    } catch (error) {
      Logger.log(
        `GitController::getRepos -> Fetching or storing ${username}'s repository(s) failed!`,
        "error"
      );
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  };
}
