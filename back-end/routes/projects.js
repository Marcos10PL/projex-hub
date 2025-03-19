import express from "express";
import {
  getAllProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  addTask,
  removeTask,
} from "../controllers/projects.js";

const router = express.Router();

router.route("/")
  .get(getAllProjects)
  .post(createProject);

router.route("/:id")
  .get(getProject)
  .patch(updateProject)
  .delete(deleteProject);

router.route("/:id/members")
  .post(addMember)
  .delete(removeMember);

router.route("/:id/tasks")
  .post(addTask)
  .delete(removeTask);

export default router;
