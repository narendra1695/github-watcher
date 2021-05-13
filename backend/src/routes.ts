import { Router } from "express";

import { GitController } from "./controllers/GitController";

export const routes = Router();

routes.get("/:username", GitController.getGitData);
