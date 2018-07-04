const debug = require("debug")("evolvus-role.test.index");
const chai = require("chai");
const mongoose = require("mongoose");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204/TestPlatform_Dev";
/*
 ** chaiAsPromised is needed to test promises
 ** it adds the "eventually" property
 **
 ** chai and others do not support async / await
 */
const chaiAsPromised = require("chai-as-promised");

const expect = chai.expect;
chai.use(chaiAsPromised);

const role = require("../index");
const db = require("../db/role");

describe('role model validation', () => {
  let roleObject = {
    // add a valid role Object here
    tenantId: "tid",
    entityId: "Entity",
    accessLevel: "0",
    applicationCode: "CDA",
    roleName: "admin_One",
    menuGroup: [{
      tenantId: "tid",
      applicationCode: "CDA",
      menuGroupCode: "mgc",
      title: "menugroup title",
      menuGroupOrder: 1,
      createdBy: "kamalarani",
      createdDate: new Date().toISOString(),
      menuItems: [{
        menuItemType: "queues",
        applicationCode: "CDA",
        menuItemCode: "micc",
        title: "menuItem title",
        menuItemOrder: 1
      }, {
        menuItemType: "queues",
        applicationCode: "RTP",
        menuItemCode: "mmic",
        title: "menuItem title",
        menuItemOrder: 1
      }]
    }],
    description: "admin_One description.",
    activationStatus: "ACTIVE",
    processingStatus: "PENDING_AUTHORIZATION",
    associatedUsers: 5,
    createdBy: "kamalarani",
    createdDate: new Date().toISOString(),
    lastUpdatedDate: new Date().toISOString()
  };

  let invalidObject = {
    //add invalid role Object here
    tenantId: "tid",
    entityId: "Entity",
    accessLevel: "0",
    applicationCode: 457,
    roleName: 457,
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

  let undefinedObject; // object that is not defined
  let nullObject = null; // object that is null

  // before we start the tests, connect to the database
  before((done) => {
    mongoose.connect(MONGO_DB_URL);
    let connection = mongoose.connection;
    connection.once("open", () => {
      debug("ok got the connection");
      done();
    });
  });

  describe("validation against jsonschema", () => {
    it("valid role should validate successfully", (done) => {
      try {
        var res = role.validate(roleObject);
        expect(res)
          .to.eventually.equal(true)
          .notify(done);
        // if notify is not done the test will fail
        // with timeout
      } catch (e) {
        expect.fail(e, null, `valid role object should not throw exception: ${e}`);
      }
    });

    it("invalid role should return errors", (done) => {
      try {
        var res = role.validate(invalidObject);
        expect(res)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    if ("should error out for undefined objects", (done) => {
        try {
          var res = role.validate(undefinedObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

    if ("should error out for null objects", (done) => {
        try {
          var res = role.validate(nullObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

  });

  describe("testing role.save method", () => {

    beforeEach((done) => {
      db.deleteAll().then((res) => {
        done();
      });
    });

    it('should save a valid role object to database', (done) => {
      try {
        var result = role.save(roleObject);
        //replace anyAttribute with one of the valid attribute of a role Object
        expect(result)
          .to.eventually.have.property(`roleName`)
          .to.eql(roleObject.roleName)
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `saving role object should not throw exception: ${e}`);
      }
    });

    it('should not save a invalid role object to database', (done) => {
      try {
        var result = role.save(invalidObject);
        expect(result)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

  });

  describe('testing role.getAll when there is data in database', () => {
    let object1 = {
        //add one valid role object here
        tenantId: "tid",
        entityId: "Entity",
        accessLevel: "1",
        applicationCode: "CDA",
        roleName: "adminThree",
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
      },
      object2 = {
        //add one more valid role object here
        tenantId: "tid",
        applicationCode: "CDA",
        entityId: "Entity",
        accessLevel: "1",
        roleName: "adminTwo",
        menuGroup: [{
          tenantId: "tid",
          applicationCode: "CDA",
          menuGroupCode: "mrgcc",
          title: "menugroup title",
          menuItems: [{
            menuItemType: "queues",
            applicationCode: "CDA",
            menuItemCode: "mircc",
            title: "menuItem title"
          }, {
            menuItemType: "queues",
            applicationCode: "RTP",
            menuItemCode: "mmric",
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
      },
      object3 = {
        tenantId: "tid",
        entityId: "Entity",
        accessLevel: "1",
        applicationCode: "CDA",
        roleName: "adminOne",
        menuGroup: [{
          tenantId: "tid",
          applicationCode: "CDA",
          menuGroupCode: "mgctc",
          title: "menugroup title",
          menuItems: [{
            menuItemType: "queues",
            applicationCode: "CDA",
            menuItemCode: "mictc",
            title: "menuItem title"
          }, {
            menuItemType: "queues",
            applicationCode: "RTP",
            menuItemCode: "mmitc",
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
    beforeEach((done) => {
      db.deleteAll().then((res) => {
        db.save(object1).then((res) => {
          db.save(object2).then((res) => {
            db.save(object3).then((res) => {
              done();
            });
          });
        });
      });
    });

    it('should return limited records as specified by the pageNo parameter', (done) => {
      try {
        let orderBy = {
          lastUpdatedDate: -1
        };
        let res = role.getAll('tid', 'Entity', 1, 2, 2, orderBy);
        expect(res)
          .to.be.fulfilled.then((docs) => {
            expect(docs)
              .to.be.a('array');
            expect(docs.length)
              .to.equal(1);
            done();
          });
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should return records sorted by lastUpdatedDate if orderBy is null or undefined', (done) => {
      try {
        let res = role.getAll('tid', 'Entity', 1, 2, 2, null);
        expect(res)
          .to.be.fulfilled.then((docs) => {
            expect(docs)
              .to.be.a('array');
            expect(docs.length)
              .to.equal(1);
            done();
          });
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should return records sorted by lastUpdatedDate', (done) => {
      try {
        let orderBy = {
          lastUpdatedDate: -1
        };
        let res = role.getAll('tid', 'Entity', 0, 2, orderBy);
        expect(res)
          .to.be.fulfilled.then((docs) => {
            expect(docs)
              .to.be.a('array');
            expect(docs.length)
              .to.equal(2);
            expect(docs[0])
              .to.have.property('roleName')
              .to.eql('adminThree');
            done();
          });
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

  });

  describe('testing role.getAll when there is no data', () => {

    beforeEach((done) => {
      db.deleteAll().then((res) => {
        done();
      });
    });

    it('should return empty array when there  is no data in data base', (done) => {
      try {
        let res = role.getAll('tid', 'Entity', 1, 2, 2);
        expect(res)
          .to.be.fulfilled.then((docs) => {
            expect(docs)
              .to.be.a('array');
            expect(docs.length)
              .to.equal(0);
            expect(docs)
              .to.eql([]);
            done();
          });
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });
  });

  describe('testing getById', () => {
    // Insert one record , get its id
    // 1. Query by this id and it should return one role object
    // 2. Query by an arbitrary id and it should return {}
    // 3. Query with null id and it should throw IllegalArgumentException
    // 4. Query with undefined and it should throw IllegalArgumentException
    var id;
    beforeEach((done) => {
      db.deleteAll().then((res) => {
        db.save(roleObject).then((res) => {
          id = res._id;
          done();
        });
      });
    });

    it('should return one role matching parameter id', (done) => {
      try {
        var res = role.getById(id);
        expect(res).to.eventually.have.property('_id')
          .to.eql(id)
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should return empty object i.e. {} as no role is identified by this Id ', (done) => {
      try {
        let badId = new mongoose.mongo.ObjectId();
        var res = role.getById(badId);
        expect(res).to.eventually.to.eql({})
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for undefined Id parameter ", (done) => {
      try {
        let undefinedId;
        let res = role.getById(undefinedId);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for null Id parameter ", (done) => {
      try {
        let res = role.getById(null);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should be rejected for arbitrary object as Id parameter ", (done) => {
      // an id is a 12 byte string, -1 is an invalid id value
      let id = roleObject;
      let res = role.getById(id);
      expect(res)
        .to.eventually.to.be.rejectedWith("must be a single String of 12 bytes")
        .notify(done);
    });

  });

  describe("testing role.getOne", () => {
    let object1 = {
        //add one valid role object here
        tenantId: "tid",
        entityId: "Entity",
        accessLevel: "0",
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
      },
      object2 = {
        //add one more valid role object here
        tenantId: "tid",
        entityId: "Entity",
        accessLevel: "0",
        applicationCode: "CDA",
        roleName: "adminTwo",
        menuGroup: [{
          tenantId: "tid",
          applicationCode: "CDA",
          menuGroupCode: "mgcfc",
          title: "menugroup title",
          menuItems: [{
            menuItemType: "queues",
            applicationCode: "CDA",
            menuItemCode: "mficc",
            title: "menuItem title"
          }, {
            menuItemType: "queues",
            applicationCode: "RTP",
            menuItemCode: "mmfic",
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
    beforeEach((done) => {
      db.deleteAll().then((res) => {
        db.save(object1).then((res) => {
          db.save(object2).then((res) => {
            done();
          });
        });
      });
    });

    it("should return one role record identified by attribute", (done) => {
      try {
        // take one attribute from object1 or object2 and its value
        let res = role.getOne(`applicationCode`, `CDA`);
        expect(res)
          .to.eventually.be.a("object")
          .to.have.property(`applicationCode`)
          .to.eql(`CDA`)
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should return empty object i.e. {} as no role is identified by this attribute', (done) => {
      try {
        // replace validAttribute and add a bad value to it
        var res = role.getOne(`applicationCode`, `jhv`);
        expect(res).to.eventually.to.eql({})
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
      try {
        //replace validvalue with a valid value for an attribute
        let undefinedAttribute;
        let res = role.getOne(undefinedAttribute, `CDA`);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
      try {
        // replace validAttribute with a valid attribute name
        let undefinedValue;
        let res = role.getOne(`roleName`, undefinedValue);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for null attribute parameter ", (done) => {
      try {
        //replace validValue with a valid value for an attribute
        let res = role.getOne(null, `admin`);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for null value parameter ", (done) => {
      try {
        //replace attributeValue with a valid attribute name
        let res = role.getOne(`roleName`, null);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });
  });


  describe("testing role.getMany", () => {
    let object1 = {
        //add one valid role object here
        tenantId: "tid",
        entityId: "Entity",
        accessLevel: "0",
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
      },
      object2 = {
        //add one more valid role object here
        tenantId: "tid",
        entityId: "Entity",
        accessLevel: "0",
        applicationCode: "CDA",
        roleName: "admin-Two",
        menuGroup: [{
          tenantId: "tid",
          applicationCode: "CDA",
          menuGroupCode: "mgscc",
          title: "menugroup title",
          menuItems: [{
            menuItemType: "queues",
            applicationCode: "CDA",
            menuItemCode: "miscc",
            title: "menuItem title"
          }, {
            menuItemType: "queues",
            applicationCode: "RTP",
            menuItemCode: "mmisc",
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
    beforeEach((done) => {
      db.deleteAll().then((res) => {
        db.save(object1).then((res) => {
          db.save(object2).then((res) => {
            done();
          });
        });
      });
    });

    it("should return array of role records identified by attribute", (done) => {
      try {
        // take one attribute from object1 or object2 and its value
        let res = role.getMany(`applicationCode`, `CDA`);
        expect(res).to.eventually.be.a("array")
          //enter proper length according to input value
          .to.have.length(2)
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should return empty array i.e. [] as no role is identified by this attribute', (done) => {
      try {
        // replace validAttribute and add a bad value to it
        var res = role.getMany(`applicationCode`, `jhvhgv`);
        expect(res).to.eventually.to.eql([])
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
      try {
        //replace validvalue with a valid value for an attribute
        let undefinedAttribute;
        let res = role.getMany(undefinedAttribute, `RTP`);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
      try {
        // replace validAttribute with a valid attribute name
        let undefinedValue;
        let res = role.getMany(`roleType`, undefinedValue);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for null attribute parameter ", (done) => {
      try {
        //replace validValue with a valid value for an attribute
        let res = role.getMany(null, `IT`);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for null value parameter ", (done) => {
      try {
        //replace attributeValue with a valid attribute name
        let res = role.getMany(`roleName`, null);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });
  });

  describe("testing update Role", () => {
    var id;
    let object1 = {
        //add one valid role object here
        tenantId: "tid",
        entityId: "Entity",
        accessLevel: "0",
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
      },
      object2 = {
        //add one more valid role object here
        tenantId: "tid",
        entityId: "Entity",
        accessLevel: "0",
        applicationCode: "CDA",
        roleName: "adminTwo",
        menuGroup: [{
          tenantId: "tid",
          applicationCode: "CDA",
          menuGroupCode: "mgjcc",
          title: "menugroup title",
          menuItems: [{
            menuItemType: "queues",
            applicationCode: "CDA",
            menuItemCode: "micjc",
            title: "menuItem title"
          }, {
            menuItemType: "queues",
            applicationCode: "RTP",
            menuItemCode: "mmijc",
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
    beforeEach((done) => {
      db.deleteAll()
        .then((res) => {
          db.save(object1)
            .then((res) => {
              id = res._id;
              db.save(object2)
                .then((res) => {
                  done();
                });
            });
        });
    });

    it('should update a role and have same _id', (done) => {
      var res = role.update(id, {
        roleName: "adminOne"
      });
      expect(res)
        .to.eventually.be.a("object")
        .to.have.property("_id")
        .to.eql(id)
        .notify(done);
    });

    it('should update a role with new values', (done) => {
      var res = role.update(id, {
        roleName: "technicalop",
        roleType: "IT"
      });
      expect(res)
        .to.eventually.be.a("object")
        .to.have.property("roleName")
        .to.eql("technicalop")
        .notify(done);
    });

    it("should throw IllegalArgumentException for undefined Id parameter ", (done) => {
      let undefinedId;
      let res = role.update(undefinedId, {
        roleName: "Admin"
      });
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for undefined update parameter ", (done) => {
      let undefinedUpdate;
      let res = role.update(id, undefinedUpdate);
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for null Id parameter ", (done) => {
      // an id is a 12 byte string, -1 is an invalid id value+
      let res = role.update(null, {
        roleName: "Admin"
      });
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for null update parameter ", (done) => {
      // an id is a 12 byte string, -1 is an invalid id value+
      let res = role.update(id, null);
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });
  });

  describe("testing filterByRoleDetails", () => {

    let object1 = {
        //add one valid role object here
        tenantId: "tid",
        entityId: "Entity",
        accessLevel: "0",
        applicationCode: "CDA",
        roleName: "adminThree",
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
      },
      object2 = {
        //add one more valid role object here
        tenantId: "tid",
        applicationCode: "CDA",
        entityId: "Entity",
        accessLevel: "0",
        roleName: "adminTwo",
        menuGroup: [{
          tenantId: "tid",
          applicationCode: "CDA",
          menuGroupCode: "mrgcc",
          title: "menugroup title",
          menuItems: [{
            menuItemType: "queues",
            applicationCode: "CDA",
            menuItemCode: "mircc",
            title: "menuItem title"
          }, {
            menuItemType: "queues",
            applicationCode: "RTP",
            menuItemCode: "mmric",
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

    beforeEach((done) => {
      db.deleteAll()
        .then((res) => {
          db.save(object1)
            .then((res) => {
              id = res._id;
              db.save(object2)
                .then((res) => {
                  done();
                });
            });
        });
    });

    //Query by processing status as PENDING_AUTHORIZATION, activationStatus as inACTIVE and applicationCode as CDA
    // It should return array with only one object
    it("should return filterd values based on query ", (done) => {
      var res = role.filterByRoleDetails({
        processingStatus: 'PENDING_AUTHORIZATION'
        // applicationCode: 'CDA',
        // activationStatus: 'ACTIVE'

      }, 5, 1);
      expect(res).to.eventually.be.a("array")
        .to.have.length(2)
        .notify(done);
    });

    //Query by activation status as ACTIVE
    //It should return empty array as there are no roles with activation status as inACTIVE
    it("should return empty array as there are no roles matching the query parameter ", (done) => {
      var res = role.filterByRoleDetails({
        activationStatus: 'inACTIVE'
      });
      expect(res).to.eventually.be.a("array")
        .to.have.length(0)
        .notify(done);
    });

    it("should throw IllegalArgumentException for null query parameter ", (done) => {
      let res = role.filterByRoleDetails(null);
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for undefined query parameter ", (done) => {
      let undefinedQuery;
      let res = role.filterByRoleDetails(undefinedQuery);
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

  });

  describe("testing filterByRoleDetails", () => {

    let object1 = {
        //add one valid role object here
        tenantId: "tid",
        entityId: "Entity",
        accessLevel: "0",
        applicationCode: "CDA",
        roleName: "adminThree",
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
      },
      object2 = {
        //add one more valid role object here
        tenantId: "tid",
        applicationCode: "CDA",
        entityId: "Entity",
        accessLevel: "0",
        roleName: "adminTwo",
        menuGroup: [{
          tenantId: "tid",
          applicationCode: "CDA",
          menuGroupCode: "mrgcc",
          title: "menugroup title",
          menuItems: [{
            menuItemType: "queues",
            applicationCode: "CDA",
            menuItemCode: "mircc",
            title: "menuItem title"
          }, {
            menuItemType: "queues",
            applicationCode: "RTP",
            menuItemCode: "mmric",
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

    beforeEach((done) => {
      db.deleteAll()
        .then((res) => {
          db.save(object1)
            .then((res) => {
              id = res._id;
              db.save(object2)
                .then((res) => {
                  done();
                });
            });
        });
    });

    //  Query by processing status as PENDING_AUTHORIZATION, activationStatus as inACTIVE and applicationCode as CDA
    //It should return array with only one object
    it("should return  role count based on query ", (done) => {
      var res = role.getRoleCounts({
        processingStatus: 'PENDING_AUTHORIZATION'
      });
      expect(res)
        .to.eventually.deep.equal(2)
        .notify(done);
    });

    //Query by activation status as ACTIVE
    //It should return empty array as there are no roles with activation status as inACTIVE
    it("should return 0 as there are no roles matching the query parameter ", (done) => {
      var res = role.getRoleCounts({
        activationStatus: 'inACTIVE'
      });
      expect(res).to.eventually.deep.equal(0)
        .notify(done);
    });

  });
});