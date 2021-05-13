import { Router } from "express";

import { ProfileController } from "./controllers/ProfileController";

export const routes = Router();

routes.get("/:username", ProfileController.getnSaveProfile);
