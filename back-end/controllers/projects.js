import BadRequestError from "../errors/bad-request.js";
import NotFoundError from "../errors/not-found.js";
import Project from "../models/project.js";
import User from "../models/user.js";
import { StatusCodes } from "http-status-codes";

const getAllProjects = async (req, res) => {
  const query = req.query;

  const projects = await Project.find();
  res.status(StatusCodes.OK).json({ success: true, projects });
};

const getProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) throw new NotFoundError("No project found");

  res.status(StatusCodes.OK).json({ success: true, project });
};

const createProject = async (req, res) => {
  const { name, description, status, dueDate } = req.body;
  const ownerId = req.user._id;

  if (!name || !description)
    throw new BadRequestError("Please provide all fields");

  const projectExists = await Project.findOne({
    $and: [{ name }, { ownerId }],
  });

  if (projectExists) throw new BadRequestError("Project already exists");

  const project = await Project.create({
    name,
    description,
    owner: ownerId,
    status,
    dueDate,
  });

  res.status(StatusCodes.CREATED).json({ success: true, project });
};

const updateProject = async (req, res) => {
  res.send("Update project");
};

const deleteProject = async (req, res) => {
  res.send("Delete project");
};

const addMember = async (req, res) => {
  const { id: memberId } = req.body;
  const projectId = req.params.id;

  if (!memberId) throw new BadRequestError("Please provide a member ID");

  const member = await User.findById(memberId);

  if (!member) throw new NotFoundError("No user found");

  const project = await Project.findById(projectId);

  if (!project) throw new NotFoundError("No project found");

  const memberExists = project.members.includes(memberId);

  if (memberExists) throw new BadRequestError("Member already exists");

  project.members.push(memberId);
  await project.save();

  res.status(StatusCodes.OK).json({ success: true, project });
};

const removeMember = async (req, res) => {
  res.send("Remove member");
};

const addTask = async (req, res) => {
  res.send("Add task");
};

const removeTask = async (req, res) => {
  res.send("Remove task");
};

export {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  addTask,
  removeTask,
};
