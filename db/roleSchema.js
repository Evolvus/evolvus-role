const mongoose = require("mongoose");
const validator = require("validator");
const { menu } = require("evolvus-menu");

var Menu = mongoose.model("menuCollection", menu.menuDBschema);

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
    minLength: 3,
    maxLength: 20
  },
  roleName: {
    type: String,
    required: true,
    unique: true,
    minLength: 1,
    maxLength: 20,
    validate: {
      validator: function (v) {
        return /^[A-Za-z ]*$/.test(v);
      },
      message: "{PATH} can contain only alphabets and spaces"
    }
  },
  menuGroup: {
    type: Array,
    ref: 'Menu',
    required:true
  },
  description: {
    type: String,
    required: true,
    minLength: 0,
    maxLength: 255,
    validate: {
      validator: function (v) {
        return /^[A-Za-z ]*$/.test(v);
      },
      message: "{PATH} can contain only alphabets and spaces"
    }
  },
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String
  },
  createdDate: {
    type: Date,
    required: true
  },
  lastUpdatedDate: {
    type: Date
  },
  enableFlag: {
    type: Number,
    default: 1
  },
  deletedFlag: {
    type: Number,
    default: 0
  },
  activationStatus: {
    type: String,
    required: true
  },
  processingStatus: {
    type: String,
    required: true
  },
  associatedUsers: {
    type: Number,
    required: true
  }
});
module.exports = roleSchema;