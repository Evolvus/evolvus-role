const debug = require("debug")("evolvus-role:db:role");
const mongoose = require("mongoose");
const ObjectId = require('mongodb')
  .ObjectID;

const roleSchema = require("./roleSchema");

// Creates a roleCollection collection in the database
var roleCollection = mongoose.model("roleCollection", roleSchema);

// Saves the roleCollection object to the database and returns a Promise
// The assumption here is that the Object is valid
module.exports.save = (object) => {
  return new Promise((resolve, reject) => {
    try {
      // any exception during construction will go to catch
      let role = new roleCollection(object);
      // on resolve we need to resolve the this method
      // on reject or exception we reject it,
      // this is because the record either saves or it doesnt
      // in any case it does not save, is a reject
      role.save()
        .then((data) => {
          debug("saved successfully", data._id);
          resolve(data);
        }, (err) => {
          debug(`rejected save.. ${err}`);
          reject(err);
        })
        .catch((e) => {
          debug(`exception on save: ${e}`);
          reject(e);
        });
    } catch (e) {
      debug(`caught exception: ${e}`);
      reject(e);
    }
  });
};


// Returns a limited set if all the role(s) with a Promise
// if the collectiom has no records it Returns
// a promise with a result of  empty object i.e. {}
module.exports.findAll = (tenantId, entityCode, accessLevel,pageSize,pageNo,orderBy) => {
  let query = {
    tenantId: tenantId,
    accessLevel: {
      $gte: accessLevel
    },
    entityCode: entityCode,
    deletedFlag: 0
  };
var qskip = pageSize * (pageNo - 1);
var  qlimit = pageSize;
  if (qlimit < 1){
    // var list =[];
    // list.push(roleCollection.find(query).sort(orderBy));
    // console.log(list.length);
    return roleCollection.find(query).skip(qskip).limit(qlimit).sort(orderBy);
  } else {
    return roleCollection.find(query).skip(qskip).limit(qlimit).sort(orderBy);
  }
};


// Finds the role which matches the value parameter from role collection
// If there is no object matching the attribute/value, return empty object i.e. {}
// null, undefined should be rejected with Invalid Argument Error
// Should return a Promise
module.exports.findOne = (attribute, value) => {
  return new Promise((resolve, reject) => {
    try {
      var query = {};
      query[attribute] = value;
      roleCollection.findOne(query)
        .then((data) => {
          debug(`role found ${data}`);
          resolve(data);
        }, (err) => {
          debug(`rejected find.. ${err}`);
          reject(err);
        })
        .catch((e) => {
          debug(`exception on find: ${e}`);
          reject(e);
        });
    } catch (e) {
      debug(`caught exception: ${e}`);
      reject(e);
    }
  });
};

// Finds all the roles which matches the value parameter from role collection
// If there is no object matching the attribute/value, return empty object i.e. {}
// null, undefined should be rejected with Invalid Argument Error
// Should return a Promise
module.exports.findMany = (attribute, value, orderBy) => {
  return new Promise((resolve, reject) => {
    try {
      var query = {};
      query[attribute] = value;
      roleCollection.find(query).sort(orderBy)
        .then((data) => {
          debug(`role found ${data}`);
          resolve(data);
        }, (err) => {
          debug(`rejected find.. ${err}`);
          reject(err);
        })
        .catch((e) => {
          debug(`exception on find: ${e}`);
          reject(e);
        });
    } catch (e) {
      debug(`caught exception: ${e}`);
      reject(e);
    }
  });
};

// Finds the role for the id parameter from the role collection
// If there is no object matching the id, return empty object i.e. {}
// null, undefined, invalid objects should be rejected with Invalid Argument Error
// All returns are wrapped in a Promise
//
module.exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    try {
      roleCollection.findById({
          _id: new ObjectId(id)
        })
        .then((res) => {
          debug("findById successfull: ", res);
          resolve(res);
        }, (err) => {
          debug(`rejected finding roleCollection.. ${err}`);
          reject(err);
        })
        .catch((e) => {
          debug(`exception on finding role: ${e}`);
          reject(e);
        });
    } catch (e) {
      debug(`caught exception: ${e}`);
      reject(e);
    }
  });
};

//Finds one role by its code and updates it with new values
module.exports.update = (id, update) => {
  return new Promise((resolve, reject) => {
    try {
      roleCollection.findById({
        _id: new ObjectId(id)
      }).then((app) => {
        if (app) {
          app.set(update);
          app.save().then((res) => {
            debug(`updated successfully ${res}`);
            resolve(res);
          }).catch((e) => {
            debug(`failed to update ${e}`);
            reject(e);
          });
        } else {
          debug(`role not found with id, ${id}`);
          reject(`There is no such role with id:${id}`);
        }
      }).catch((e) => {
        debug(`exception on findById ${e}`);
        reject(e.message);
      });
    } catch (e) {
      debug(`caught exception ${e}`);
      reject(e.message);
    }
  });
};

// Filters role collection by roleDetails
// Returns a promise

module.exports.filterByRoleDetails = (filterQuery,pageSize,pageNo, orderBy) => {
    try {
      var qskip =pageSize * (pageNo - 1);
      var  qlimit = pageSize;
        if (qlimit < 1){
          // var list =[];
          // list.push(roleCollection.find(query).sort(orderBy));
          // console.log(list.length);
          return roleCollection.find(filterQuery).skip(qskip).limit(qlimit).sort(orderBy);
        } else {
          return roleCollection.find(filterQuery).skip(qskip).limit(qlimit).sort(orderBy);
        }
    } catch (e) {
      debug(`Caught Exception ${e}`);
      reject(e);
    }
  };
module.exports.roleCounts=(countQuery, orderBy)=>{
  // if (limit < 1) {

    return roleCollection.count(countQuery);
  // } else {

    // return roleCollection.count(countQuery).limit(limit).sort(orderBy);
  // }
};

// Deletes all the entries of the collection.
// To be used by test only
module.exports.deleteAll = () => {
  return roleCollection.remove({});
};
