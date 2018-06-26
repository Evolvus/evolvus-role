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
      "minItems": 1,
      "items": {
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
          "selectedFlag": {
            "type": "boolean",
            "default": "false"
          },
          "menuGroupOrder": {
            "type": "number"
          },
          "createdBy": {
            "type": "string"
          },
          "createdDate": {
            "type": "string",
            "format": "date-time"
          },
          "menuItems": {
            "type": "array",
            "minItems": 1,
            "items": {
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
                "selectedFlag": {
                  "type": "boolean",
                  "default": "false"
                },
                "menuItemOrder": {
                  "type": "number",
                  "required": "true"
                }
              },
              "required": ["menuItemType", "applicationCode", "menuItemCode", "title", "menuItemOrder"]
            }
          }
        },
        "required": ["tenantId", "applicationCode", "menuGroupCode", "menuGroupOrder", "title", "createdDate", "createdBy", "menuItems"]
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
      "type": "string",
      "enum": ["0", "1"]
    },
    "deletedFlag": {
      "type": "string",
      "enum": ["0", "1"],
      "default": "0"
    },
    "activationStatus": {
      "type": "string",
      "enum": ["ACTIVE", "INACTIVE"]
    },
    "processingStatus": {
      "type": "string",
      "enum": ["PENDING_AUTHORIZATION", "AUTHORIZED", "REJECTED"],
      "default": "PENDING_AUTHORIZATION"
    },
    "associatedUsers": {
      "type": "number"
    },
    "accessLevel": {
      "type": "string"
    },
    "entityCode": {
      "type": "string"
    }
  },
  "required": ["tenantId", "applicationCode", "roleName", "menuGroup", "activationStatus", "associatedUsers", "createdBy", "createdDate", "lastUpdatedDate", "accessLevel", "entityCode"]
};