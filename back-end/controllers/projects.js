import BadRequestError from "../errors/bad-request.js";
import NotFoundError from "../errors/not-found.js";
import ForbiddenError from "../errors/forbidden.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import User from "../models/user.js";
import { StatusCodes } from "http-status-codes";

const getAllProjects = async (req, res) => {
  const query = req.query;
  const userId = req.user._id;

  const projects = await Project.find({
    $or: [{ owner: userId }, { members: userId }],
  });

  res.status(StatusCodes.OK).json({
    success: true,
    msg: projects.length
      ? "Projects fetched successfully"
      : "No projects found",
    projects,
  });
};

const getProject = async (req, res) => {
  const userId = req.user._id;

  const project = await Project.findOne({
    _id: req.params.id,
    $or: [{ owner: userId }, { members: userId }],
  });

  if (!project) throw new NotFoundError("No project found");

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Project fetched successfully",
    project,
  });
};

const createProject = async (req, res) => {
  const { name, description, status } = req.body;
  let { dueDate } = req.body;
  const ownerId = req.user._id;

  dueDate = dueDate ? new Date(dueDate) : null;

  if (!name || !description)
    throw new BadRequestError("Please provide a name and description");

  const projectExists = await Project.findOne({ name, owner: ownerId });

  if (projectExists) throw new BadRequestError("Project already exists");

  const project = await Project.create({
    name,
    description,
    owner: ownerId,
    status,
    dueDate,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: "Project created successfully",
    project,
  });
};

const updateProject = async (req, res) => {
  const { name, description, status } = req.body;
  let { dueDate } = req.body;

  dueDate = dueDate ? new Date(dueDate) : null;

  if (!name && !description && !status && !dueDate)
    throw new BadRequestError("Please provide at least one field to update");

  const project = await Project.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!project) throw new NotFoundError("No project found");

  let state = false;

  if (name) {
    project.name = name;
    state = true;
  }

  if (description) {
    project.description = description;
    state = true;
  }

  if (status) {
    project.status = status;
    state = true;
  }

  if (dueDate) {
    project.dueDate = dueDate;
    state = true;
  }

  if (!state) throw new BadRequestError("No changes made");

  await project.save();

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Project updated successfully",
    project,
  });
};

const deleteProject = async (req, res) => {
  const project = await Project.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!project) throw new NotFoundError("No project found");

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Project deleted successfully",
    project,
  });
};

const addMember = async (req, res) => {
  const { id: memberId } = req.body;
  const userId = req.user._id;

  if (!memberId) throw new BadRequestError("Please provide a member ID");

  if (userId.equals(memberId))
    throw new BadRequestError("You cannot add yourself as a member");

  const member = await User.findById(memberId);

  if (!member) throw new NotFoundError("No user found");

  const project = await Project.findOne({
    _id: req.params.id,
    owner: userId,
  });

  if (!project) throw new NotFoundError("No project found");

  const memberExists = project.members.some(member =>
    member._id.equals(memberId)
  );

  if (memberExists) throw new BadRequestError("Member already exists");

  project.members.push(memberId);
  await project.save();

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Member added successfully",
    project,
  });
};

const deleteMember = async (req, res) => {
  const memberId = req.params.memberId;

  const member = await User.findById(memberId);

  if (!member) throw new NotFoundError("No user found");

  const project = await Project.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!project) throw new NotFoundError("No project found");

  const memberExists = project.members.some(member =>
    member._id.equals(memberId)
  );

  if (!memberExists) throw new BadRequestError("Member does not exist");

  project.members = project.members.filter(
    member => !member._id.equals(memberId)
  );

  await project.save();

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Member removed successfully",
    project,
  });
};

const createTask = async (req, res) => {
  const { name, description, status } = req.body;
  let { dueDate } = req.body;

  dueDate = dueDate ? new Date(dueDate) : null;

  if (!name || !description)
    throw new BadRequestError("Please provide a name and description");

  const project = await Project.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!project) throw new NotFoundError("No project found");

  const task = await Task.create({
    name,
    description,
    dueDate,
    status,
  });

  project.tasks.push(task._id);

  await project.save();

  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: "Task created successfully",
    project,
  });
};

const updateTask = async (req, res) => {
  const { name, description, status } = req.body;
  let { dueDate } = req.body;
  const taskId = req.params.taskId;
  const userId = req.user._id;

  dueDate = dueDate ? new Date(dueDate) : null;

  if (!name && !description && !status && !dueDate)
    throw new BadRequestError("Please provide at least one field to update");

  const task = await Task.findById(taskId);

  if (!task) throw new NotFoundError("No task found");

  const project = await Project.findOne({
    _id: req.params.id,
    $or: [{ owner: userId }, { members: userId }],
  });

  if (!project) throw new NotFoundError("No project found");

  const isAuthorizedOwner = project.owner._id.equals(userId);
  const isAuthorizedMember = project.members.some(member =>
    member.equals(userId)
  );

  if (!isAuthorizedOwner && !isAuthorizedMember)
    throw new ForbiddenError("Not authorized to update this task");

  let state = false;

  if (isAuthorizedOwner) {
    if (name) {
      task.name = name;
      state = true;
    }

    if (description) {
      task.description = description;
      state = true;
    }

    if (status) {
      task.status = status;
      state = true;
    }

    if (dueDate) {
      task.dueDate = dueDate;
      state = true;
    }
  }

  if (isAuthorizedMember) {
    if (status) {
      task.status = status;
      state = true;
    }
  }

  if (!state) throw new BadRequestError("No changes made");

  await task.save();

  const updatedProject = await Project.findOne({
    _id: req.params.id,
    $or: [{ owner: userId }, { members: userId }],
  });

  if (!updatedProject) throw new NotFoundError("No project found");

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Task updated successfully",
    updatedProject,
  });
};

const deleteTask = async (req, res) => {
  const taskId = req.params.taskId;
  const projectId = req.params.id;

  const project = await Project.findOne({
    _id: projectId,
    owner: req.user._id,
  });

  if (!project) throw new NotFoundError("No project found");

  const taskExists = project.tasks.some(task => task._id.equals(taskId));

  if (!taskExists) throw new NotFoundError("No task found");

  project.tasks = project.tasks.filter(task => !task._id.equals(taskId));
  await project.save();

  await Task.findByIdAndDelete(taskId);

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Task deleted successfully",
    project,
  });
};

export {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  deleteMember,
  createTask,
  deleteTask,
  updateTask,
};
