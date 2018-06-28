const debug = require("debug")("evolvus-role:index");
const roleSchema = require("./model/roleSchema")
  .schema;
const roleCollection = require("./db/role");
const validate = require("jsonschema")
  .validate;
const docketClient = require("evolvus-docket-client");

const roleDBSchema = require("./db/roleSchema");

var docketObject = {
  // required fields
  application: "PLATFORM",
  source: "role",
  name: "",
  createdBy: "",
  ipAddress: "",
  status: "SUCCESS", //by default
  eventDateTime: Date.now(),
  keyDataAsJSON: "",
  details: "",
  //non required fields
  level: ""
};

module.exports.role = {
  roleSchema,
  roleDBSchema
};

module.exports.validate = (roleObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof roleObject === "undefined") {
        throw new Error("IllegalArgumentException:roleObject is undefined");
      }
      var res = validate(roleObject, roleSchema);
      debug("validation status: ", JSON.stringify(res));
      if (res.valid) {
        resolve(res.valid);
      } else {
        reject(res.errors[0].stack);
      }
    } catch (err) {
      reject(err);
    }
  });
};

// All validations must be performed before we save the object here
// Once the db layer is called its is assumed the object is valid.
module.exports.save = (roleObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof roleObject === 'undefined' || roleObject == null) {
        throw new Error("IllegalArgumentException: roleObject is null or undefined");
      }
      docketObject.name = "role_save";
      docketObject.keyDataAsJSON = JSON.stringify(roleObject);
      docketObject.details = `role creation initiated`;
      docketClient.postToDocket(docketObject);
      var res = validate(roleObject, roleSchema);
      debug("validation status: ", JSON.stringify(res));
      if (!res.valid) {
        reject(res.errors);
      } else {

        // Other validations here
        // if the object is valid, save the object to the database
        roleCollection.save(roleObject).then((result) => {
          debug(`saved successfully ${result}`);
          resolve(result);
        }).catch((e) => {
          debug(`failed to save with an error: ${e}`);
          reject(e);
        });
      }
    } catch (e) {
      docketObject.name = "role_ExceptionOnSave";
      docketObject.keyDataAsJSON = JSON.stringify(roleObject);
      docketObject.details = `caught Exception on role_save ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

// List all the objects in the database
// makes sense to return on a limited number
// (what if there are 1000000 records in the collection)
module.exports.getAll = (tenantId, entityCode, accessLevel,pageSize, pageNo, orderBy) => {
  return new Promise((resolve, reject) => {
    try {
      if (orderBy == null) {
        orderBy = {
          lastUpdatedDate: -1
        };
      }
      docketObject.name = "role_getAll";
      docketObject.keyDataAsJSON = `getAll with pageSize ${pageSize}`;
      docketObject.details = `role getAll method`;
      docketClient.postToDocket(docketObject);

      roleCollection.findAll(tenantId, entityCode, accessLevel, pageSize,pageNo, orderBy).then((docs) => {
        debug(`role(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        debug(`failed to find all the role(s) ${e}`);
        reject(e);
      });
    } catch (e) {
      docketObject.name = "role_ExceptionOngetAll";
      docketObject.keyDataAsJSON = "roleObject";
      docketObject.details = `caught Exception on role_getAll ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};


// Get the entity idenfied by the id parameter
module.exports.getById = (id) => {
  return new Promise((resolve, reject) => {
    try {

      if (typeof(id) == "undefined" || id == null) {
        throw new Error("IllegalArgumentException: id is null or undefined");
      }
      docketObject.name = "role_getById";
      docketObject.keyDataAsJSON = `roleObject id is ${id}`;
      docketObject.details = `role getById initiated`;
      docketClient.postToDocket(docketObject);

      roleCollection.findById(id)
        .then((res) => {
          if (res) {
            debug(`role found by id ${id} is ${res}`);
            resolve(res);
          } else {
            // return empty object in place of null
            debug(`no role found by this id ${id}`);
            resolve({});
          }
        }).catch((e) => {
          debug(`failed to find role ${e}`);
          reject(e);
        });

    } catch (e) {
      docketObject.name = "role_ExceptionOngetById";
      docketObject.keyDataAsJSON = `roleObject id is ${id}`;
      docketObject.details = `caught Exception on role_getById ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

module.exports.getOne = (attribute, value) => {
  return new Promise((resolve, reject) => {
    try {
      if (attribute == null || value == null || typeof attribute === 'undefined' || typeof value === 'undefined') {
        throw new Error("IllegalArgumentException: attribute/value is null or undefined");
      }

      docketObject.name = "role_getOne";
      docketObject.keyDataAsJSON = `roleObject ${attribute} with value ${value}`;
      docketObject.details = `role getOne initiated`;
      docketClient.postToDocket(docketObject);
      roleCollection.findOne(attribute, value).then((data) => {
        if (data) {
          debug(`role found ${data}`);
          resolve(data);
        } else {
          // return empty object in place of null
          debug(`no role found by this ${attribute} ${value}`);
          resolve({});
        }
      }).catch((e) => {
        debug(`failed to find ${e}`);
      });
    } catch (e) {
      docketObject.name = "role_ExceptionOngetOne";
      docketObject.keyDataAsJSON = `roleObject ${attribute} with value ${value}`;
      docketObject.details = `caught Exception on role_getOne ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caugh!= null && (filterQuery.applicationCode != undefined)t exception ${e}`);
      reject(e);
    }
  });
};

module.exports.getMany = (attribute, value, orderBy) => {
  return new Promise((resolve, reject) => {
    try {
      if (attribute == null || value == null || typeof attribute === 'undefined' || typeof value === 'undefined') {
        throw new Error("IllegalArgumentException: input attribute/value is null or undefined");
      }
      if (orderBy == null || typeof orderBy === 'undefined') {
        orderBy = {
          lastUpdatedDate: -1
        };
      }
      docketObject.name = "role_getMany";
      docketObject.keyDataAsJSON = `roleObject ${attribute} with value ${value}`;
      docketObject.details = `role getMany initiated`;
      docketClient.postToDocket(docketObject);
      roleCollection.findMany(attribute, value, orderBy).then((data) => {
        if (data) {
          debug(`role found ${data}`);
          resolve(data);
        } else {
          // return empty object in place of null
          debug(`no role found by this ${attribute} ${value}`);
          resolve([]);
        }
      }).catch((e) => {
        debug(`failed to find ${e}`);
      });
    } catch (e) {
      docketObject.name = "role_ExceptionOngetMany";
      docketObject.keyDataAsJSON = `roleObject ${attribute} with value ${value}`;
      docketObject.details = `caught Exception on role_getMany ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

module.exports.update = (id, update) => {
  return new Promise((resolve, reject) => {
    try {
      if (id == null || update == null) {
        throw new Error("IllegalArgumentException:id/update is null or undefined");
      }
      docketObject.name = "role_update";
      docketObject.keyDataAsJSON = `roleObject ${id} to be updated with  ${update}`;
      docketObject.details = `role update initiated`;
      docketClient.postToDocket(docketObject);
      roleCollection.update(id, update).then((resp) => {
        debug("updated successfully", resp);
        resolve(resp);
      }).catch((error) => {
        debug(`failed to update ${error}`);
        reject(error);
      });
    } catch (e) {
      docketObject.name = "role_ExceptionOnUpdate";
      docketObject.keyDataAsJSON = `roleObject ${id} to be updated with  ${update}`;
      docketObject.details = `caught Exception on role_update ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

module.exports.filterByRoleDetails = (filterQuery, orderBy) => {
  return new Promise((resolve, reject) => {
    try {
      let queryObject = {};
      if (filterQuery == null || typeof filterQuery === 'undefined') {
        throw new Error("IllegalArgumentException: filterQuery is null or undefined");
      } else {
        if (filterQuery.applicationCode != null && (filterQuery.applicationCode !== 'undefined')) {
          queryObject.applicationCode = filterQuery.applicationCode;
        }
        if (filterQuery.activationStatus != null && (filterQuery.activationStatus != 'undefined')) {
          queryObject.activationStatus = filterQuery.activationStatus;
        }
        if (filterQuery.processingStatus != null && (filterQuery.processingStatus != 'undefined')) {
          queryObject.processingStatus = filterQuery.processingStatus;
        }
        queryObject.deletedFlag = 0;
      }
      if (orderBy == null || typeof orderBy === 'undefined') {
        orderBy = {
          lastUpdatedDate: -1
        };
      }
      docketObject.name = "role_filterByRoleDetails";
      docketObject.keyDataAsJSON = `Filter the role collection by query ${filterQuery}`;
      docketObject.details = `role_filterByRoleDetails initiated`;
      docketClient.postToDocket(docketObject);

      roleCollection.filterByRoleDetails(queryObject, orderBy).then((filteredData) => {
        if (filteredData.length > 0) {
          debug(`filtered Data is ${filteredData}`);
          resolve(filteredData);
        } else {
          debug(`No data available for filter query ${filterQuery}`);
          resolve([]);
        }
      }).catch((e) => {
        debug(`failed to find ${e}`);
      });
    } catch (e) {
      docketObject.name = "role_ExceptionOnFilterByRoleDetails";
      docketObject.keyDataAsJSON = `Filter the role collection by query ${filterQuery}`;
      docketObject.details = `caught Exception on role_filterByRoleDetails ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

module.exports.getRoleCounts = (tenantId, entityCode, accessLevel, pageSize,pageNo, orderBy) => {
  return new Promise((resolve, reject) => {
    try {

      if (pageSize == null) {
        pageSize = -1;
      }
      if (orderBy == null) {
        orderBy = {
          lastUpdatedDate: -1
        };
      }
      docketObject.name = "role_getAll";
      docketObject.keyDataAsJSON = `getAll with pageSize ${pageSize}`;
      docketObject.details = `role getAll method`;
      docketClient.postToDocket(docketObject);

      roleCollection.findAll(tenantId, entityCode, accessLevel, pageSize,pageNo, orderBy).then((docs) => {
        debug(`role(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        debug(`failed to find all the role(s) ${e}`);
        reject(e);
      });
    } catch (e) {
      docketObject.name = "role_ExceptionOngetAll";
      docketObject.keyDataAsJSON = "roleObject";
      docketObject.details = `caught Exception on role_getAll ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};
