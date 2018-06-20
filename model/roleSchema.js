/*
 ** JSON Schema representation of the role model
 */
module.exports.schema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "roleModel",
  "type": "object",
  "properties": {
    "tenantId": {
      "type": "string",
      "minLength": 1,
      "maxLength": 64
    },
    "applicationCode": {
      "type": "string",
      "minLength": 3,
      "maxLength": 20
    },
    "roleName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 20
    },
    "menuGroup": {
      "type": "array",
      "properties": {
        "tenantId": {
          "type": "string",
          "minLength": 1,
          "maxLength": 64
        },
        "applicationCode": {
          "type": "string",
          "minLength": 3,
          "maxLength": 20
        },
        "menuGroupCode": {
          "type": "string",
          "minLength": 1,
          "maxLength": 20
        },
        "title": {
          "type": "string",
          "minLength": 1,
          "maxLength": 20
        },
        "selectedFlag":{
          "type":"boolean"
        },
        "menuItems": {
          "type": "array",
          "properties": {
            "menuItemType": {
              "type": "string",
              "minLength": 1,
              "maxLength": 20
            },
            "applicationCode": {
              "type": "string",
              "minLength": 3,
              "maxLength": 20
            },
            "menuItemCode": {
              "type": "string",
              "minLength": 1,
              "maxLength": 20
            },
            "title": {
              "type": "string",
              "minLength": 1,
              "maxLength": 20
            },
            "selectedFlag":{
              "type":"boolean"
            }
          }
        }
      }
    },
    "description": {
      "type": "string",
      "minLength": 0,
      "maxLength": 255
    },
    "createdBy": {
      "type": "string"
    },
    "updatedBy": {
      "type": "string"
    },
    "createdDate": {
      "type": "string",
      "format": "date-time"
    },
    "lastUpdatedDate": {
      "type": "string",
      "format": "date-time"
    },
    "enableFlag": {
      "type": "number",
      "default": 1
    },
    "deletedFlag": {
      "type": "number",
      "default": 0
    },
    "activationStatus": {
      "type": "string",
      "enum": ["active", "inactive"]
    },
    "processingStatus": {
      "type": "string",
      "enum": ["authorized", "unauthorized", "rejected"]
    },
    "associatedUsers": {
      "type": "number"
    }
  },
  "required": ["tenantId", "applicationCode", "roleName", "menuGroup", "activationStatus", "processingStatus", "associatedUsers", "createdBy", "createdDate"]
};