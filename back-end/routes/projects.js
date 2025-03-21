import express from "express";
import {
  getAllProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  deleteMember,
  createTask,
  deleteTask,
  updateTask,
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

router.route("/:id/members/:memberId")
  .delete(deleteMember);


router.route("/:id/tasks")
  .post(createTask)

router.route("/:id/tasks/:taskId")
  .patch(updateTask)
  .delete(deleteTask);

export default router;
