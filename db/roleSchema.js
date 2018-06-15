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
      validator: function(v) {
        return /^[A-Za-z ]*$/.test(v);
      },
      message: "{PATH} can contain only alphabets and spaces"
    }
  },
  menuGroup: {
    type: Array,
    properties: {
      tenantId: {
        type: String,
        minLength: 1,
        maxLength: 64
      },
      applicationCode: {
        type: String,
        minLength: 3,
        maxLength: 20
      },
      menuGroupCode: {
        type: String,
        minLength: 1,
        maxLength: 20,
        unique: true,
        required: true,
        validate: {
          validator: function(v) {
            return /^[A-Za-z ]*$/.test(v);
          },
          message: "{PATH} can contain only alphabets and spaces"
        }
      },
      title: {
        type: String,
        minLength: 1,
        maxLength: 20
      },
      menuItems: {
        type: Array,
        properties: {
          menuItemType: {
            type: String,
            minLength: 1,
            maxLength: 20
          },
          applicationCode: {
            type: String,
            minLength: 3,
            maxLength: 20
          },
          menuItemCode: {
            type: String,
            minLength: 1,
            maxLength: 20,
            unique: true,
            required: true,
            validate: {
              validator: function(v) {
                return /^[A-Za-z ]*$/.test(v);
              },
              message: "{PATH} can contain only alphabets and spaces"
            }
          },
          title: {
            type: String,
            minLength: 1,
            maxLength: 20
          }
        }
      }
    }
  },
  description: {
    type: String,
    required: true,
    minLength: 0,
    maxLength: 255,
    validate: {
      validator: function(v) {
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
    type: [String, null]
  },
  createdDate: {
    type: Date,
    required: true
  },
  lastUpdatedDate: {
    type: Date,
    required: true
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