import express from "express";
import {
  getAllProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projects.js";

const router = express.Router();

router.route("/").get(getAllProjects).post(createProject);
router.route("/:id").get(getProject).patch(updateProject).delete(deleteProject);

export default router;
