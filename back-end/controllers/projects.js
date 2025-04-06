import BadRequestError from "../errors/bad-request.js";
import NotFoundError from "../errors/not-found.js";
import ForbiddenError from "../errors/forbidden.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import User from "../models/user.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

const getAllProjects = async (req, res) => {
  const { status, search, sort, dueDate, dueDateAfter, dueDateBefore } =
    req.query;

  const userId = req.user._id;

  const query = {
    $or: [{ owner: userId }, { members: userId }],
  };

  if (status) query.status = status;
  if (search) query.name = { $regex: search, $options: "i" };

  let result = Project.find(query);

  if (sort === "latest") result = result.sort({ createdAt: -1 });
  if (sort === "oldest") result = result.sort({ createdAt: 1 });

  if (sort === "dueDateAsc") result = result.sort({ dueDate: 1 });
  if (sort === "dueDateDesc") result = result.sort({ dueDate: -1 });

  if (dueDate === "today") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    result = result.where("dueDate").gte(today).lt(tomorrow);
  }

  if (dueDate === "thisWeek") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    result = result.where("dueDate").gte(today).lt(nextWeek);
  }

  if (dueDate === "nextWeek") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextNextWeek = new Date(nextWeek);
    nextNextWeek.setDate(nextNextWeek.getDate() + 7);

    result = result.where("dueDate").gte(nextWeek).lt(nextNextWeek);
  }

  if (dueDate === "thisMonth") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    result = result.where("dueDate").gte(today).lt(nextMonth);
  }

  if (dueDate === "nextMonth") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextNextMonth = new Date(nextMonth);
    nextNextMonth.setMonth(nextNextMonth.getMonth() + 1);

    result = result.where("dueDate").gte(nextMonth).lt(nextNextMonth);
  }

  if (dueDate === "noDueDate") {
    result = result.where("dueDate").eq(null);
  }

  if (dueDate === "overdue") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    result = result.where("dueDate").lt(today);
  }

  if (dueDateAfter) {
    const date = new Date(dueDateAfter);
    date.setHours(0, 0, 0, 0);

    result = result.where("dueDate").gte(date);
  }

  if (dueDateBefore) {
    const date = new Date(dueDateBefore);
    date.setUTCHours(23, 59, 59, 999);

    result = result.where("dueDate").lt(date);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalProjects = await Project.countDocuments(result);

  result = result.skip(skip).limit(limit);
  const projects = await result;

  const totalPages = Math.ceil(totalProjects / limit);

  res.status(StatusCodes.OK).json({
    success: true,
    msg: projects.length
      ? "Projects fetched successfully"
      : "No projects found",
    currentPage: page,
    totalPages,
    totalProjects,
    projects,
  });
};

const getProject = async (req, res) => {
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new BadRequestError("Invalid project ID");
  }

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

  if (projectExists)
    throw new BadRequestError("Project already exists with this name");

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

  // dueDate can be null if the user wants to remove it
  if (dueDate !== null) dueDate = dueDate ? new Date(dueDate) : undefined;

  if (!name && !description && !status && dueDate === undefined)
    throw new BadRequestError("Please provide at least one field to update");

  const project = await Project.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!project) throw new NotFoundError("No project found");

  let state = false;

  if (name && name !== project.name) {
    const existingProject = await Project.findOne({ name });
    if (existingProject)
      throw new BadRequestError("Project already exists with this name");

    project.name = name;
    state = true;
  }

  if (description && description !== project.description) {
    project.description = description;
    state = true;
  }

  if (status && status !== project.status) {
    project.status = status;
    state = true;
  }

  if (dueDate === null) {
    project.dueDate = null;
    state = true;
  }

  if (dueDate !== undefined && dueDate !== project.dueDate) {
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
  });
};

const addMember = async (req, res) => {
  const { username: usernameMember } = req.body;
  const { _id: userId, username } = req.user;

  if (!usernameMember) throw new BadRequestError("Please provide a username");

  if (usernameMember === username)
    throw new BadRequestError("You cannot add yourself as a member");

  const member = await User.findOne({ username: usernameMember });

  if (!member) throw new NotFoundError("No user found");

  const project = await Project.findOne({
    _id: req.params.id,
    owner: userId,
  });

  if (!project) throw new NotFoundError("No project found");

  const memberExists = project.members.some(member =>
    member._id.equals(member._id)
  );

  if (memberExists) throw new BadRequestError("Member already exists");

  project.members.push(member._id);
  await project.save();

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Member added successfully",
    project,
  });
};

const deleteMember = async (req, res) => {
  const memberId = req.params.memberId;

  if (!mongoose.Types.ObjectId.isValid(memberId))
    throw new BadRequestError("Invalid member ID");

  if (req.user._id.equals(memberId))
    throw new BadRequestError("You cannot remove yourself as a member");

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
  const { name, status } = req.body;

  if (!name) throw new BadRequestError("Please provide a name");

  const project = await Project.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!project) throw new NotFoundError("No project found");

  const task = await Task.create({
    name,
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
  const { name, status } = req.body;
  const taskId = req.params.taskId;
  const userId = req.user._id;

  if (!name && !description && !status)
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

    if (status) {
      task.status = status;
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
