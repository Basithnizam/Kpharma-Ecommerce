const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const AdminSchema = new Schema({
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  ProfilePic: { type: String },
});

const Admin = mongoose.model('admins', AdminSchema);

module.exports = Admin;


