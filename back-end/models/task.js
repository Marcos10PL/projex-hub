import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 30,
      trim: true,
      match: /^[a-zA-Z0-9 ]+$/,
    },
    status: {
      type: String,
      enum: ["in-progress", "done"],
      default: "in-progress",
    },
    completedAt: Date,
  },
  { versionKey: false }
);

taskSchema.pre("save", async function () {
  if (!this.isModified("status")) return;

  if (this.status === "done") {
    this.completedAt = new Date();
  } else this.completedAt = null;
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
