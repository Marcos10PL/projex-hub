import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["to-do", "in-progress", "done"],
      default: "to-do",
    },
    dueDate: Date,
    completedAt: Date,
  },
  { timestamps: true, versionKey: false }
);

taskSchema.pre("save", async function () {
  if (this.isModified("status") && this.status === "done") {
    this.completedAt = Date.now();
  } else this.completedAt = null;
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
