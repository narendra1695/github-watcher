import { Router } from "express";

import { GitDataController } from "./controllers/GitDataController";

export const routes = Router();

routes.get("/:username", GitDataController.getData);
