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
      "minLength": 1,
      "maxLength": 15
    },
    "roleName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 20
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
      "type": ["string", "null"]
    },
    "createdDate": {
      "type": "string",
      "format": "date-time"
    },
    "lastUpdatedDate": {
      "type": ["string", "null"],
      "format": "date-time"
    },
    "roleType": {
      "type": "string",
      "minLength": 1,
      "maxLength": 15
    },
    "activationStatus": {
      "type": "string"
    },
    "processingStatus": {
      "type": "string"
    },
    "associatedUsers": {
      "type": "number"
    }
  },
  "required": ["tenantId", "applicationCode", "roleName", "roleType", "description", "activationStatus", "processingStatus", "associatedUsers"]
};