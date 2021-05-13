import { Router } from "express";

import { ProfileController } from "./controllers/ProfileController";
// import { ReposController } from "./controllers/ReposController";
// import { CommitsController } from "./controllers/CommitsController";

export const routes = Router();

routes.get("/:username", ProfileController.getnSaveProfile);
// routes.get("/:username/:repoName", CommitsController.getCommits);
