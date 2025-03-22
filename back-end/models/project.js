import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 255,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      min: 3,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    status: {
      type: String,
      enum: ["planned", "active", "completed", "completed-delayed", "delayed"],
      default: "active",
    },
    dueDate: Date,
    completedAt: Date,
  },
  { timestamps: true, versionKey: false }
);

projectSchema.pre("save", async function () {
  if (!this.isModified("status")) return;

  if (this.status === "completed") {
    this.completedAt = new Date();
  } else this.completedAt = null;
});

projectSchema.post("findOne", async doc => {
  if (doc) await populateMembers(doc);
});

projectSchema.post("find", async docs => {
  if (Array.isArray(docs)) {
    await Promise.all(docs.map(populateMembers));
  }
});

projectSchema.post("save", async doc => {
  if (doc) await populateMembers(doc);
});

const populateMembers = async doc => {
  await doc.populate("owner", "_id username");
  await doc.populate("members", "_id username");
  await doc.populate("tasks");
};

const Project = mongoose.model("Project", projectSchema);

export default Project;
