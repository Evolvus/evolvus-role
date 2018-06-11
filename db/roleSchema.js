const mongoose = require("mongoose");
const validator = require("validator");


var roleSchema = new mongoose.Schema({
  // Add all attributes below tenantId
  tenantId: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 64
  },
  applicationCode: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 15
  },
  roleName: {
    type: String,
    required: true,
    unique: true,
    minLength: 1,
    maxLength: 20
  },
  description: {
    type: String,
    required: true,
    minLength: 0,
    maxLength: 255
  },
  createdBy: {
    type: String
  },
  updatedBy: {
    type: [String, null]
  },
  createdDate: {
    type: Date
  },
  lastUpdatedDate: {
    type: Date
  },
  roleType: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 15
  },
  status: {
    type: String,
    required: true
  }
});
module.exports = roleSchema;
