import { Router } from "express";

import { ReposController } from "./controllers/ReposController";
import { CommitsController } from "./controllers/CommitsController";

export const routes = Router();

routes.get("/:username", ReposController.getRepos);
routes.get("/:username/:repoName", CommitsController.getCommits);
