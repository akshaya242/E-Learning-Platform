const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Notification Schema
const notificationSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  read_status: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
