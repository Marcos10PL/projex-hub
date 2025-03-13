const getAllProjects = async (req, res) => {
  res.json({ success: true, msg: "All projects" });
}

const getProject = async (req, res) => {
  res.send("Single project");
}

const createProject = async (req, res) => {
  res.send("Create project");
}

const updateProject = async (req, res) => {
  res.send("Update project");
}

const deleteProject = async (req, res) => {
  res.send("Delete project");
}

export { getAllProjects, getProject, createProject, updateProject, deleteProject };