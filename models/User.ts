import bcrypt from "bcryptjs";
import mongoose, { model, models, Schema } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  return;
});

// need to write models here as it will give
// list of all models that exists in mongoose instance
const User = models?.User || model<IUser>("User", userSchema);

export default User;
