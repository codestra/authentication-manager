import mongoose from 'mongoose';

const MockSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Number },
  activated: { type: Boolean },
  activationToken: { type: String },
});

const MockModel = mongoose.model('Mock', MockSchema);

export default MockModel;
