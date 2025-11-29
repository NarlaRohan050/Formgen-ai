// src/lib/models.ts
import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const FormSchema = new Schema({
  userId: { type: String, required: true },
  title: String,
  purpose: String,
  prompt: String,
  schema: { type: Object, required: true },
}, { timestamps: true });

const SubmissionSchema = new Schema({
  formId: { type: String, required: true },
  userId: String,
  responses: { type: Object, required: true }, // ✅ FIXED: added "responses"
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);
export const Form = models.Form || model('Form', FormSchema);
export const Submission = models.Submission || model('Submission', SubmissionSchema);