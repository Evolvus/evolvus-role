const debug = require("debug")("evolvus-role.test.db.role");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const role = require("../../db/role");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204/TestPlatform_Dev";

chai.use(chaiAsPromised);

// High level wrapper
// Testing db/role.js
describe("db role testing", () => {
  /*
   ** Before doing any tests, first get the connection.
   */
  before((done) => {
    mongoose.connect(MONGO_DB_URL);
    let connection = mongoose.connection;
    connection.once("open", () => {
      debug("ok got the connection");
      done();
    });
  });

  let object1 = {
    // add a valid role object
    tenantId: "tid",
    entityCode: "Entity",
    accessLevel: "1",
    applicationCode: "CDA",
    roleName: "admin_One",
    menuGroup: [{
      tenantId: "tid",
      applicationCode: "CDA",
      menuGroupCode: "mgc",
      title: "menugroup title",
      menuItems: [{
        menuItemType: "queues",
        applicationCode: "CDA",
        menuItemCode: "mic",
        title: "menuItem title"
      }, {
        menuItemType: "queues",
        applicationCode: "RTP",
        menuItemCode: "mic",
        title: "menuItem title"
      }]
    }],
    processingStatus: "PENDING_AUTHORIZATION",
    description: "admin_One decription *",
    activationStatus: "ACTIVE",
    associatedUsers: 5,
    createdBy: "kamalarani",
    createdDate: new Date().toISOString(),
    lastUpdatedDate: new Date().toISOString()
  };
  let object2 = {
    // add a valid role object
    tenantId: "tid",
    entityCode: "Entity",
    accessLevel: "1",
    applicationCode: "CDA",
    roleName: "adminTwo",
    menuGroup: [{
      tenantId: "tid",
      applicationCode: "CDA",
      menuGroupCode: "mgcc",
      title: "menugroup title",
      menuItems: [{
        menuItemType: "queues",
        applicationCode: "CDA",
        menuItemCode: "mijc",
        title: "menuItem title"
      }, {
        menuItemType: "queues",
        applicationCode: "RTP",
        menuItemCode: "micl",
        title: "menuItem title"
      }]
    }],
    description: "role",
    activationStatus: "ACTIVE",
    processingStatus: "PENDING_AUTHORIZATION",
    associatedUsers: 5,
    createdBy: "kamalarani",
    createdDate: new Date().toISOString(),
    lastUpdatedDate: new Date().toISOString()
  };
  let object3 = {
    // add a valid role object
    tenantId: "tid",
    entityCode: "Entity",
    accessLevel: "1",
    applicationCode: "CDA",
    roleName: "adminThree",
    menuGroup: [{
      tenantId: "tid",
      applicationCode: "CDA",
      menuGroupCode: "mggcc",
      title: "menugroup title",
      menuItems: [{
        menuItemType: "queues",
        applicationCode: "CDA",
        menuItemCode: "miicc",
        title: "menuItem title"
      }, {
        menuItemType: "queues",
        applicationCode: "RTP",
        menuItemCode: "mmiic",
        title: "menuItem title"
      }]
    }],
    description: "role",
    activationStatus: "ACTIVE",
    processingStatus: "PENDING_AUTHORIZATION",
    associatedUsers: 5,
    createdBy: "kamalarani",
    createdDate: new Date().toISOString(),
    lastUpdatedDate: new Date().toISOString()
  };
  let object4 = {
    // add a valid role object
    tenantId: "tid",
    entityCode: "Entity",
    accessLevel: "1",
    applicationCode: "CDA",
    roleName: "adminFour",
    menuGroup: [{
      tenantId: "tid",
      applicationCode: "CDA",
      menuGroupCode: "mgccc",
      title: "menugroup title",
      menuItems: [{
        menuItemType: "queues",
        applicationCode: "CDA",
        menuItemCode: "micc",
        title: "menuItem title"
      }, {
        menuItemType: "queues",
        applicationCode: "RTP",
        menuItemCode: "mmmic",
        title: "menuItem title"
      }]
    }],
    description: "role",
    activationStatus: "ACTIVE",
    processingStatus: "PENDING_AUTHORIZATION",
    associatedUsers: 5,
    createdBy: "kamalarani",
    createdDate: new Date().toISOString(),
    lastUpdatedDate: new Date().toISOString()
  };

  describe("testing role.save", () => {
    // Testing save
    // 1. Valid role should be saved.
    // 2. Non role object should not be saved.
    // 3. Should not save same role twice.
    beforeEach((done) => {
      role.deleteAll()
        .then((data) => {
          done();
        });
    });

    it("should save valid role to database", (done) => {
      let res = role.save(object1);
      expect(res)
        .to.eventually.have.property('applicationCode')
        .to.eql('CDA')
        .notify(done);
    });

    it("should fail saving invalid object to database", (done) => {
      // not even a  object

      let invalidObject = {
        // add a invalid role object
        tenantId: "tid",
        applicationCode: 345,
        roleName: 4576,
        menuGroup: [{
          tenantId: "tid",
          applicationCode: "CDA",
          menuGroupCode: "mgcc",
          title: "menugroup title",
          menuItems: [{
            menuItemType: "queues",
            applicationCode: "CDA",
            menuItemCode: "micc",
            title: "menuItem title"
          }, {
            menuItemType: "queues",
            applicationCode: "RTP",
            menuItemCode: "mmic",
            title: "menuItem title"
          }]
        }],
        description: "role",
        activationStatus: "ACTIVE",
        processingStatus: "PENDING_AUTHORIZATION",
        associatedUsers: 5,
        createdBy: "kamalarani",
        createdDate: new Date().toISOString(),
        lastUpdatedDate: new Date().toISOString()
      };
      let res = role.save(invalidObject);
      expect(res)
        .to.be.eventually.rejectedWith("roleCollection validation failed")
        .notify(done);
    });
  });

  describe("testing role.findAll by limit", () => {


    // 1. Delete all records in the table and insert
    //    4 new records.
    // find -should return an array of size equal to value of limit with the
    // roleMenuItemMaps.

    // delete all records and insert four roleMenuItemMaps
    beforeEach((done) => {
      role.deleteAll().then(() => {
        role.save(object1).then((res) => {
          role.save(object2).then((res) => {
            role.save(object3).then((res) => {
              role.save(object4).then((res) => {
                done();
              });
            });
          });
        });
      });
    });

    //  There are 3 roles with entity 'Entity',tenandId 'tid' and accessLevel 1 and one role with accessLevel 0
    //  Query the collection with tenantId 'tid', accessLevel 1 and entity 'Entity'
    //  It should return 3 records
    it("should return 2 records based on filter condition", (done) => {
      let orderBy = {
        lastUpdatedDate: -1
      };
      let res = role.findAll('tid', 'Entity', 1, 2, 2, orderBy);

      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(2);
          expect(docs[0])
            .to.have.property('tenantId')
            .to.eql('tid');
          expect(docs[0])
            .to.have.property('entityCode')
            .to.eql('Entity');
          expect(docs[0])
            .to.have.property('accessLevel')
            .to.eql("1");
          done();
        }, (err) => {
          done(err);
        })
        .catch((e) => {
          done(e);
        });
    });

    // There are 4 roles with entity 'Entity',tenandId 'tid' and accessLevel 1
    // Query the collection with tenantId 'tid', accessLevel 1 , entity 'Entity' and limit 2
    // It should return 2 records out of three filterd records
    it("should return limited number records based on filter condition", (done) => {
      let orderBy = {
        lastUpdatedDate: -1
      };
      let res = role.findAll('tid', 'Entity', 1, 3, 1, orderBy);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(3);
          expect(docs[0])
            .to.have.property('tenantId')
            .to.eql('tid');
          expect(docs[0])
            .to.have.property('entityCode')
            .to.eql('Entity');
          expect(docs[0])
            .to.have.property('accessLevel')
            .to.eql("1");
          done();
        }, (err) => {
          done(err);
        })
        .catch((e) => {
          done(e);
        });
    });
  });
  describe("testing role.find without data", () => {
    // delete all records
    // find should return empty array
    beforeEach((done) => {
      role.deleteAll()
        .then((res) => {
          done();
        });
    });

    it("should return empty array i.e. []", (done) => {
      let orderBy = {
        lastUpdatedDate: -1
      };
      let res = role.findAll('tid', 'Entity', 2, 3, orderBy);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(0);
          expect(docs)
            .to.eql([]);
          done();
        }, (err) => {
          done(err);
        })
        .catch((e) => {
          done(e);
        });
    });
  });

  describe("testing role.findById", () => {
    // Delete all records, insert one record , get its id
    // 1. Query by this id and it should return one role
    // 2. Query by an arbitrary id and it should return {}
    // 3. Query with null id and it should throw IllegalArgumentException
    // 4. Query with undefined and it should throw IllegalArgumentException
    // 5. Query with arbitrary object
    let testObject = {
      //add a valid role object
      tenantId: "tid",
      entityCode: 'Entity',
      accessLevel: "1",
      applicationCode: "CDA",
      roleName: "adminOne",
      menuGroup: [{
        tenantId: "tid",
        applicationCode: "CDA",
        menuGroupCode: "mgcc",
        title: "menugroup title",
        menuItems: [{
          menuItemType: "queues",
          applicationCode: "CDA",
          menuItemCode: "micc",
          title: "menuItem title"
        }, {
          menuItemType: "queues",
          applicationCode: "CDA",
          menuItemCode: "mmic",
          title: "menuItem title"
        }]
      }],
      description: "role",
      activationStatus: "ACTIVE",
      processingStatus: "PENDING_AUTHORIZATION",
      associatedUsers: 5,
      createdBy: "kamalarani",
      createdDate: new Date().toISOString(),
      lastUpdatedDate: new Date().toISOString()
    };
    var id;
    beforeEach((done) => {
      role.deleteAll()
        .then((res) => {
          role.save(testObject)
            .then((savedObj) => {
              id = savedObj._id;
              done();
            });
        });
    });

    it("should return role identified by Id ", (done) => {
      let res = role.findById(id);
      expect(res)
        .to.eventually.have.property('applicationCode')
        .to.eql('CDA')
        .notify(done);
    });

    it("should return null as no role is identified by this Id ", (done) => {
      let badId = new mongoose.mongo.ObjectId();
      let res = role.findById(badId);
      expect(res)
        .to.eventually.to.eql(null)
        .notify(done);
    });
  });

  describe("testing role.findOne", () => {

    // Delete all records, insert two record
    // 1. Query by one attribute and it should return one role
    // 2. Query by an arbitrary attribute value and it should return {}

    // delete all records and insert two roles
    beforeEach((done) => {
      role.deleteAll()
        .then((res) => {
          role.save(object1)
            .then((res) => {
              role.save(object2)
                .then((savedObj) => {
                  done();
                });
            });
        });
    });

    it("should return object for valid attribute value", (done) => {
      // take one valid attribute and its value
      let attributename = "roleName";
      let attributeValue = "admin_One";
      let res = role.findOne(attributename, attributeValue);
      expect(res)
        .to.eventually.have.property('roleName')
        .to.eql('admin_One')
        .notify(done);
    });

    it("should return null as no role is identified by this attribute ", (done) => {
      let res = role.findOne(`roleName`, `jhgvg`);
      expect(res)
        .to.eventually.to.eql(null)
        .notify(done);
    });
  });

  describe("testing role.findMany", () => {
    // Delete all records, insert two record
    // 1. Query by one attribute and it should return all roles having attribute value
    // 2. Query by an arbitrary attribute value and it should return {}

    // delete all records and insert two roles
    beforeEach((done) => {
      role.deleteAll()
        .then((res) => {
          role.save(object1)
            .then((res) => {
              role.save(object2)
                .then((savedObj) => {
                  done();
                });
            });
        });
    });

    it("should return array of objects for valid attribute value", (done) => {
      // take one valid attribute and its value
      let attributename = "applicationCode";
      let attributeValue = "CDA";
      let res = role.findMany(attributename, attributeValue);
      expect(res)
        .to.eventually.be.a("array")
        .to.have.length(2)
        .notify(done);

    });

    it("should return empty array as no role is identified by this attribute ", (done) => {
      let res = role.findMany(`applicationCode`, `jhgvgfc`);
      expect(res)
        .to.eventually.to.eql([])
        .notify(done);
    });
  });

  describe('testing update role', () => {
    //Delete all the recods from database
    //add 2 roles
    let id;
    let update = {
      applicationCode: "CDA",
      roleName: "abc"
    };
    beforeEach((done) => {
      role.deleteAll().then((res) => {
        role.save(object1).then((res) => {
          id = res._id;
          role.save(object2).then((res) => {
            done();
          });
        });
      });
    });

    it('should update a role ', (done) => {
      var res = role.update(id, update);
      expect(res).to.eventually.be.a("object")
        .to.have.property("roleName")
        .to.eql(update.roleName)
        .notify(done);
    });

    it("should be rejected when there is no role matching the parameter id", (done) => {
      var res = role.update("5afe65875e5b3218cf267086", update);
      expect(res).to.be.rejectedWith(`There is no such role with id:5afe65875e5b3218cf267086`)
        .notify(done);
    });

    it("should be rejected for arbitrary object as Id parameter ", (done) => {
      // an id is a 12 byte string, -1 is an invalid id value
      let invalidId = "some value";
      let res = role.update(invalidId, update);
      expect(res)
        .to.eventually.to.be.rejectedWith("must be a single String of 12 bytes")
        .notify(done);
    });
  });

  describe("Testing filter by Role details", () => {

    beforeEach((done) => {
      role.deleteAll().then(() => {
        role.save(object1).then((result) => {
          role.save(object2).then((result) => {
            done();
          });
        });
      });
    });

    //Query by processing status as PENDING_AUTHORIZATION, activationStatus as ACTIVE and applicationCode as CDA
    // It should return array of 2 objects
    it("should return filterd values based on query ", (done) => {
      var res = role.filterByRoleDetails({
        processingStatus: 'PENDING_AUTHORIZATION'
        // applicationCode: 'CDA',
        // activationStatus: 'ACTIVE',


      },5,1);
      expect(res).to.eventually.be.a("array")
        .to.have.length(2)
        .notify(done);
    });


    //Query by processing status as authorized
    //It should return empty array as there are no roles with processing status as authorized
    it("should return empty array as there are no roles matching the query parameter ", (done) => {
      var res = role.filterByRoleDetails({
        processingStatus: 'authorized'
      });
      expect(res).to.eventually.be.a("array")
        .to.have.length(0)
        .notify(done);
    });
  });


  describe("testing role.roleCounts", () => {
    //  Delete all records, insert two record
    //  1. Query by one attribute and it should return all roles having attribute value
    //2. Query by an arbitrary attribute value and it should return {}

    //delete all records and insert two roles
    beforeEach((done) => {
      role.deleteAll().then(() => {
        role.save(object1).then((res) => {
          role.save(object2).then((res) => {
            role.save(object3).then((res) => {
              role.save(object4).then((res) => {
                done();
              });
            });
          });
        });
      });
    });

    it("should return Count for valid attribute value", (done) => {
      // take one valid attribute and its value
      let res = role.roleCounts({
        processingStatus: "PENDING_AUTHORIZATION"
      });
         expect(res)
        .to.eventually.deep.equal(4)
        .notify(done);

    });

  });
});
