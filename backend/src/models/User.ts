import mongoose, { Schema, Document } from 'mongoose';

// User Interface
export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin' | 'volunteer';
  isApproved: boolean;
}

// User Schema
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'volunteer'], default: 'volunteer' },
  isApproved: { type: Boolean, default: false }, // Volunteer approval
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
