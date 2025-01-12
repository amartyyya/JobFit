import mongoose, { Schema, Document } from "mongoose";

// Interfaces
export interface Project extends Document {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Info extends Document {
  introduction: string;
  experience: string;
  linkedin: string;
  codechef: string;
  codeforces: string;
  github: string;
  leetcode: string;
  gfg: string;
  projects: Project[];
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
}

// Schemas
const ProjectSchema = new Schema<Project>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: [String], required: true },
  link: { type: String },
});

const InfoSchema = new Schema<Info>({
  introduction: { type: String, required: true },
  experience: { type: String, required: true },
  linkedin: { type: String, required: true },
  codechef: { type: String, match: [/^https?:\/\//, "Please enter a valid URL"] },
  codeforces: { type: String, match: [/^https?:\/\//, "Please enter a valid URL"] },
  github: { type: String, required: true, match: [/^https?:\/\//, "Please enter a valid URL"] },
  leetcode: { type: String, match: [/^https?:\/\//, "Please enter a valid URL"] },
  gfg: { type: String, match: [/^https?:\/\//, "Please enter a valid URL"] },
  projects: { type: [ProjectSchema], required: true, validate: [arrayMinLength, "At least one project is required"] },
});

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyCode: { type: String },
  verifyCodeExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessage: { type: Boolean, default: true },
});

// Helper function
function arrayMinLength(val: any[]) {
  return val.length >= 1;
}

// Model registration
let UserModel: mongoose.Model<User>;
let InfoModel: mongoose.Model<Info>;

try {
  UserModel = mongoose.model<User>("User");
} catch (e) {
  UserModel = mongoose.model<User>("User", UserSchema);
}

try {
  InfoModel = mongoose.model<Info>("UserPortfolioInfo");
} catch (e) {
  InfoModel = mongoose.model<Info>("UserPortfolioInfo", InfoSchema);
}

export { InfoModel, UserModel };
