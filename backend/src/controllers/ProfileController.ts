import { Request, Response } from "express";
import { HttpStatusCode as httpStatusCodes } from "../libs/HttpStatusCode";
import axios from "axios";

import { Logger } from "../libs/log";

import { IConfig } from "../interfaces/config";
const config: IConfig = require("../../config/config.json");

import {
  getProfileByName,
  insertCommits,
  insertProfile,
  insertRepos,
} from "../mongo";

export class ProfileController {
  static getnSaveProfile = async (_: Request, res: Response) => {
    const username = _.params.username;
    if (!username) {
      Logger.log(
        `ProfileController::getnSaveProfile -> Invalid username provided`,
        "error"
      );
      return res.status(httpStatusCodes.NOT_ACCEPTABLE).end();
    }
    try {
      let profile: any = [];
      profile = await getProfileByName(username);
      if (profile.length > 0) {
        console.log("profile already exists. Returning from DB!");
        Logger.log(
          `ProfileController::getnSaveProfile -> ${username}'s profile already exists. Fetching profile...`
        );
        return res.status(httpStatusCodes.OK).send(profile);
      } else {
        console.log("creating profile!");
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
          let repos: any = [];
          const repoResponse: any = await axios({
            method: "GET",
            url: repoURL,
            headers: { Accept: "application/vnd.github.v3+json" },
          });
          Logger.log(
            `ReposController::getnSaveRepos -> Fetching ${username}'s repository(s) successful!`
          );

          repos = repoResponse.data.map((item: any) => {
            const newData: any = {};

            newData["username"] = item["owner"]["login"];
            newData["userID"] = item["owner"]["id"];
            newData["name"] = item["name"];
            newData["description"] = item["description"];
            newData["repoURL"] = item["html_url"];
            newData["commit_link"] = item["commits_url"].replace("{/sha}", "");

            return newData;
          });
          repos = await insertRepos(repos);
          Logger.log(
            `ReposController::getnSaveRepos -> Saving ${username}'s repo(s) successful!`
          );

          // fetching commits
          let commitURLS: any = [];
          for (var i = 0; i <= repos.length - 1; i -= -1) {
            commitURLS.push(repos[i]["commit_link"]);
          }
          if (commitURLS.length > 0) {
            let commitResponse: any;
            // commitResponse = await axios.all([
            //   {
            //     method: "GET",
            //     url: commitURLS,
            //     headers: { Accept: "application/vnd.github.v3+json" },
            //   },
            // ]);

            commitResponse = axios
              .all(commitURLS)
              .then(
                axios.spread((...responses) => {
                  console.log("from axios", responses);
                })
              )
              .catch((error: any) => {
                console.log(error);
              });

            let commits: any = commitResponse.data.map((item: any) => {
              const newData: any = {};

              newData["sha"] = item["sha"];
              newData["message"] = item["commit"]["message"];
              newData["commitURL"] = item["html_url"];

              return newData;
            });
            console.log("commits", commits);
            commits = await insertCommits(commits);
            console.log(commits);
            Logger.log(
              `CommitsController::getnSaveCommits -> Fetching ${username}'s commits successful!`
            );

            profile = await getProfileByName(username);
            return res.status(httpStatusCodes.OK).json(profile);
          }
        } else {
          Logger.log(
            `ProfileController::getnSaveProfile -> Saving ${username}'s profile failed!`,
            "error"
          );
          return res
            .status(httpStatusCodes.NOT_FOUND)
            .json("Repo link not found!");
        }
        Logger.log(
          `ProfileController::getnSaveProfile -> Saving ${username}'s profile successful!`
        );
      }
    } catch (error) {
      Logger.log(
        `ProfileController::getnSaveProfile -> Saving ${username}'s profile failed!`,
        "error"
      );
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  };
}
