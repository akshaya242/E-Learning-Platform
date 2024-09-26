const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
  isVerified: { type: Boolean, default: false },
  institution: { type: String }, // For instructors
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Profile Schema
const profileSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String },
  profile_picture: { type: String },
  contact_number: { type: String },
  address: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// const User = mongoose.model('User', userSchema);
const Profile = mongoose.model('Profile', profileSchema)


const User = mongoose.model('User', userSchema);

module.exports = {
  User: mongoose.model('User', userSchema),
  Profile: mongoose.model('Profile', profileSchema),
};
