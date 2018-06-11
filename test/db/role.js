const debug = require("debug")("evolvus-role.test.db.role");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const role = require("../../db/role");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204/TestroleCollection";

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
    applicationCode: "CDA",
    roleName: "admin",
    roleType: "IT",
    description: "role",
    status: "active"
  };
  let object2 = {
  // add a valid role object
    tenantId: "tid",
    applicationCode: "CDA",
    roleName: "operation",
    roleType: "IT",
    description: "role",
    status: "inactive"
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
      let testroleCollection = {
        // add a valid role object
        tenantId: "tid",
        applicationCode: "CDA",
        roleName: "RTP-operation",
        roleType: "IT",
        description: "role",
        status: "active"
      };
      let res = role.save(testroleCollection);
      expect(res)
        .to.eventually.include(testroleCollection)
        .to.have.property('applicationCode')
        .to.eql('CDA')
        .notify(done);
    });

    it("should fail saving invalid object to database", (done) => {
      // not even a  object

      let invalidObject = {
        // add a invalid role object
        tenantId: "tid",
        roleName: 234,
        roleType: 764,
        description: "role",
        status: "active"
      };
      let res = role.save(invalidObject);
      expect(res)
        .to.be.eventually.rejectedWith("roleCollection validation failed")
        .notify(done);
    });
  });

  describe("testing role.findAll by limit",()=> {

    let object1 = {
      // add a valid role object
      tenantId: "tid",
      applicationCode: "CDA",
      roleName: "admin1",
      roleType: "IT",
      description: "role",
      status: "active",
      createdDate: new Date()
    };
    let object2 = {
    // add a valid role object
    tenantId: "tid",
    applicationCode: "CDA",
    roleName: "operation1",
    roleType: "IT",
    description: "role",
    status: "inactive",
    createdDate: new Date()
    };
    let object3 = {
    // add a valid role object
    tenantId: "tid",
    applicationCode: "CDA",
    roleName: "RTP-operation1",
    roleType: "IT",
    description: "role",
    status: "active",
    createdDate: new Date()
    };
    let object4 = {
    // add a valid role object
    tenantId: "tid",
    applicationCode: "CDA",
    roleName: "CDA-operation1",
    roleType: "IT",
    description: "role",
    status: "active",
    createdDate: new Date()
    };
    // 1. Delete all records in the table and insert
    //    4 new records.
    // find -should return an array of size equal to value of limit with the
    // roleMenuItemMaps.
    // Caveat - the order of the roleMenuItemMaps fetched is indeterminate

    // delete all records and insert four roleMenuItemMaps
      beforeEach((done)=> {
        role.deleteAll().then(()=> {
          role.save(object1).then((res)=> {
            role.save(object2).then((res)=> {
              role.save(object3).then((res)=> {
                role.save(object4).then((res)=> {
                  done();
                });
              });
            });
          });
        });
      });

      it("should return limited number of records",(done)=> {
        let res = role.findAll(3);
        expect(res)
          .to.be.fulfilled.then((docs) => {
            expect(docs)
              .to.be.a('array');
            expect(docs.length)
              .to.equal(3);
            expect(docs[0])
              .to.have.property('applicationCode')
              .to.eql('CDA');
            done();
          }, (err) => {
            done(err);
          })
          .catch((e) => {
            done(e);
          });
      });

      it("should return all records if value of limit parameter is less than 1 i.e, 0 or -1",(done)=> {
        let res = role.findAll(-1);
        expect(res)
          .to.be.fulfilled.then((docs) => {
            expect(docs)
              .to.be.a('array');
            expect(docs.length)
              .to.equal(4);
            expect(docs[0])
              .to.have.property('applicationCode')
              .to.eql('CDA');
            done();
          }, (err) => {
            done(err);
          })
          .catch((e) => {
            done(e);
          });
      });
  });

  describe("testing roleMenuItemMap.find without data", () => {
    // delete all records
    // find should return empty array
    beforeEach((done) => {
      role.deleteAll()
        .then((res) => {
          done();
        });
    });

    it("should return empty array i.e. []", (done) => {
      let res = role.findAll(2);
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
      applicationCode: "CDA",
      roleName: "CDA-operation",
      roleType: "IT",
      description: "role",
      status: "active"
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
        .to.eventually.include(testObject)
        .to.have.property('applicationCode')
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
    let object1 = {
      // add a valid role object
      tenantId: "tid",
      applicationCode: "CDA",
      roleName: "admin1",
      roleType: "IT",
      description: "role",
      status: "active"
    };
    let object2 = {
    // add a valid role object
    tenantId: "tid",
    applicationCode: "RTP",
    roleName: "operation1",
    roleType: "IT",
    description: "role",
    status: "active"
    };
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
      let attributename="roleName";
      let attributeValue="operation1";
      let res = role.findOne(attributename, attributeValue);
      expect(res)
        .to.eventually.include(object2)
        .to.have.property('applicationCode')
        .to.eql('RTP')
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
    let role1={
      //add valid object
      tenantId: "tid",
      applicationCode: "RTP",
      roleName: "RTP-op",
      roleType: "IT",
      description: "role",
      status: "active"
    };
    let role2={
      //add valid object with one attribute value same as "role1"
      tenantId: "tid",
      applicationCode: "RTP",
      roleName: "RTP-op1",
      roleType: "IT",
      description: "role",
      status: "active"
    };
    // delete all records and insert two roles
    beforeEach((done) => {
      role.deleteAll()
        .then((res) => {
          role.save(role1)
            .then((res) => {
              role.save(role2)
                .then((savedObj) => {
                  done();
                });
            });
        });
    });

    it("should return array of objects for valid attribute value", (done) => {
      // take one valid attribute and its value
      let attributename="applicationCode";
      let attributeValue="RTP";
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
});
