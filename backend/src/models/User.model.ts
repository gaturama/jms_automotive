import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  location?: string;
  favoritesBrand?: string;
  showFavorites?: boolean;
  showStats?: boolean;
  profileUrl?: string;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String },
    bio: { type: String, maxlength: 300 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    biometricEnabled: { type: Boolean, default: false },
    notificationsEnabled: { type: Boolean, default: true },
    location: { type: String, default: "" },
    favoritesBrand: { type: String, default: "" },
    showFavorites: { type: Boolean, default: true },
    showStats: { type: Boolean, default: true },
    profileUrl: { type: String },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password as string, 12);
});

UserSchema.methods.comparePassword = async function (
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model<IUser>("User", UserSchema);
