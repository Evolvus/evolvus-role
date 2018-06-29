const debug = require("debug")("evolvus-menu-item.test.db.menuItem");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const menuItem = require("../../db/menuItem");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://localhost/Testmenu";

chai.use(chaiAsPromised);

// High level wrapper
// Testing db/menuItem.js
describe("db menuItem testing", () => {
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
    // add a valid menuItem object
    "tenantId":"name",
      "menuItemType": "quicklink",
      "applicationCode": "flux",
      "menuItemCode": "mi1",
      "createdBy": "pavithra",
      "createdDate": new Date().toISOString(),
      "title": "menu item1"
  };
  let object2 = {
  // add a valid menuItem object
   "tenantId":"name",
    "menuItemType": "quicklink",
    "applicationCode": "flux",
    "menuItemCode": "mi2",
    "createdBy": "usha",
    "createdDate":  new Date().toISOString(),
    "title": "menu item 2"
  };
   let object3 = {
    // add a valid menuItem object
     "tenantId":"name",
      "menuItemType": "quicklink",
      "applicationCode": "flux",
      "menuItemCode": "mi6",
      "createdBy": "usha",
      "createdDate": new Date().toISOString(),
      "title": "menu item 2"
    };
//     let object4 = {
//     // add a valid menuItem object
//      "tenantId":"name",
//       "menuItemType": "quicklink",
//       "applicationCode": "flux",
//       "menuItemCode": "mi5",
//       "createdBy": "usha",
//       "createdDate": new Date().toISOString(),
//       "title": "menu item 2"
//     };
//
//   describe("testing menuItem.save", () => {
//     // Testing save
//     // 1. Valid menuItem should be saved.
//     // 2. Non menuItem object should not be saved.
//     // 3. Should not save same menuItem twice.
//     beforeEach((done) => {
//       menuItem.deleteAll()
//         .then((data) => {
//           done();
//         });
//     });
//
//     it("should save valid menuItem to database", (done) => {
//       let testmenuItemCollection = {
//         // add a valid menuItem object
//         tenantId:"name",
//         menuItemType: "quicklink",
//         applicationCode: "flux",
//         menuItemCode: "mi2",
//         createdBy: "usha",
//         createdDate:  new Date().toISOString(),
//         title: "menu item 2"
//
//       };
//       let res = menuItem.save(testmenuItemCollection);
//       expect(res)
//         .to.eventually.have.property("applicationCode")
//         .to.eql("flux")
//         .notify(done);
//     });
//
//     it("should fail saving invalid object to database", (done) => {
//       // not even a  object
//
//       let invalidObject = {
//         // add a invalid menuItem object
//         "tenantId":"name",
//           "applicationCode": 676,
//           "menuItemCode": "mi2",
//           "createdBy": "usha",
//           "createdDate": new Date().toISOString(),
//           "title": "menu item 2"
//       };
//       let res = menuItem.save(invalidObject);
//       expect(res)
//         .to.be.eventually.rejectedWith("menuItemCollection validation failed")
//         .notify(done);
//     });
//   });
//
//   describe("testing menuItem.findAll by limit",()=> {
//     // 1. Delete all records in the table and insert
//     //    4 new records.
//     // find -should return an array of size equal to value of limit with the
//     // roleMenuItemMaps.
//     // Caveat - the order of the roleMenuItemMaps fetched is indeterminate
//
//     // delete all records and insert four roleMenuItemMaps
//       beforeEach((done)=> {
//         menuItem.deleteAll().then(()=> {
//           menuItem.save(object1).then((res)=> {
//             menuItem.save(object2).then((res)=> {
//               menuItem.save(object3).then((res)=> {
//                 menuItem.save(object4).then((res)=> {
//                   done();
//                 });
//               });
//             });
//           });
//         });
//       });
//
//       it("should return limited number of records",(done)=> {
//         let res = menuItem.findAll(3);
//         expect(res)
//           .to.be.fulfilled.then((docs) => {
//             expect(docs)
//               .to.be.a('array');
//             expect(docs.length)
//               .to.equal(3);
//             expect(docs[0])
//               .to.have.property("applicationCode")
//               .to.eql("flux");
//             done();
//           }, (err) => {
//             done(err);
//           })
//           .catch((e) => {
//             done(e);
//           });
//       });
//
//       it("should return all records if value of limit parameter is less than 1 i.e, 0 or -1",(done)=> {
//         let res = menuItem.findAll(-1);
//         expect(res)
//           .to.be.fulfilled.then((docs) => {
//             expect(docs)
//               .to.be.a('array');
//             expect(docs.length)
//               .to.equal(4);
//             expect(docs[0])
//               .to.have.property("applicationCode")
//               .to.eql("flux");
//             done();
//           }, (err) => {
//             done(err);
//           })
//           .catch((e) => {
//             done(e);
//           });
//       });
//   });
//
//   describe("testing roleMenuItemMap.find without data", () => {
//     // delete all records
//     // find should return empty array
//     beforeEach((done) => {
//       menuItem.deleteAll()
//         .then((res) => {
//           done();
//         });
//     });
//
//     it("should return empty array i.e. []", (done) => {
//       let res = menuItem.findAll(2);
//       expect(res)
//         .to.be.fulfilled.then((docs) => {
//           expect(docs)
//             .to.be.a('array');
//           expect(docs.length)
//             .to.equal(0);
//           expect(docs)
//             .to.eql([]);
//           done();
//         }, (err) => {
//           done(err);
//         })
//         .catch((e) => {
//           done(e);
//         });
//     });
//   });
//
//   describe("testing menuItem.findById", () => {
//     // Delete all records, insert one record , get its id
//     // 1. Query by this id and it should return one menuItem
//     // 2. Query by an arbitrary id and it should return {}
//     // 3. Query with null id and it should throw IllegalArgumentException
//     // 4. Query with undefined and it should throw IllegalArgumentException
//     // 5. Query with arbitrary object
//     let testObject = {
//       //add a valid menuItem object
//         "tenantId":"name",
//         "menuItemType": "quicklink",
//         "applicationCode": "flux",
//         "menuItemCode": "mi2",
//         "createdBy": "usha",
//         "createdDate": new Date(),
//         "title": "menu item 2"
//     };
//     var id;
//     beforeEach((done) => {
//       menuItem.deleteAll()
//         .then((res) => {
//           menuItem.save(testObject)
//             .then((savedObj) => {
//               id = savedObj._id;
//               done();
//             });
//         });
//     });
//
//     it("should return menuItem identified by Id ", (done) => {
//       let res = menuItem.findById(id);
//       expect(res)
//         .to.eventually.have.property("applicationCode")
//         .to.eql("flux")
//         .notify(done);
//     });
//
//     it("should return null as no menuItem is identified by this Id ", (done) => {
//       let badId = new mongoose.mongo.ObjectId();
//       let res = menuItem.findById(badId);
//       expect(res)
//         .to.eventually.to.eql(null)
//         .notify(done);
//     });
//   });
//
  describe("testing menuItem.findOne", () => {
    // Delete all records, insert two record
    // 1. Query by one attribute and it should return one menuItem
    // 2. Query by an arbitrary attribute value and it should return {}

    // delete all records and insert two menuItems
    beforeEach((done) => {
      menuItem.deleteAll()
        .then((res) => {
          menuItem.save(object1)
            .then((res) => {
              menuItem.save(object2)
                .then((savedObj) => {
                  done();
                });
            });
        });
    });

    it("should return object for valid attribute value", (done) => {
      // take one valid attribute and its value
      let attributename="applicationCode";
      let attributeValue="flux";
      let res = menuItem.findOne(attributename, attributeValue);
      expect(res)
        .to.eventually.have.property("applicationCode")
        .to.eql("flux")
        .notify(done);
    });
  });
//
//     it("should return null as no menuItem is identified by this attribute ", (done) => {
//       let res = menuItem.findOne("applicationCode", "yuihbkgf");
//       expect(res)
//         .to.eventually.to.eql(null)
//         .notify(done);
//     });
//   });
//
//
// describe("testing menuItem.findMany", () => {
//     // Delete all records, insert two record
//     // 1. Query by one attribute and it should return all menuItems having attribute value
//     // 2. Query by an arbitrary attribute value and it should return {}
//     let menuItem1={
//       //add valid object
//        "tenantId":"name",
//         "menuItemType": "quicklink",
//         "applicationCode": "flux",
//         "menuItemCode": "mi11",
//         "createdBy": "usha",
//         "createdDate":  new Date().toISOString(),
//         "title": "menu item 2"
//     };
//     let menuItem2={
//       //add valid object with one attribute value same as "menuItem1"
//        "tenantId":"name",
//         "menuItemType": "quicklink",
//         "applicationCode": "flux",
//         "menuItemCode": "mi12",
//         "createdBy": "usha",
//         "createdDate":  new Date().toISOString(),
//         "title": "menu item 2"
//     };
//     // delete all records and insert two menuItems
//     beforeEach((done) => {
//       menuItem.deleteAll()
//         .then((res) => {
//           menuItem.save(menuItem1)
//             .then((res) => {
//               menuItem.save(menuItem2)
//                 .then((savedObj) => {
//                   done();
//                 });
//             });
//         });
//     });
//
//     it("should return array of objects for valid attribute value", (done) => {
//       // take one valid attribute and its value
//       let attributename="applicationCode";
//       let attributeValue="flux";
//       let res = menuItem.findMany(attributename, attributeValue);
//       expect(res).to.eventually.be.a("array");
//       //enter proper length according to input attribute
//       expect(res).to.eventually.have.length(2);
//       done();
//     });
//
//     it("should return empty array as no menuItem is identified by this attribute ", (done) => {
//       let res = menuItem.findMany("applicationCode", "fxl");
//       expect(res)
//         .to.eventually.to.eql([])
//         .notify(done);
//     });
//   });
// describe("testing menuItem.deleteOne", () => {
//     // Delete all records, insert two record
//     // 1. Query by one attribute and it should return all menuItems having attribute value
//     // 2. Query by an arbitrary attribute value and it should return {}
//     let menuItem1={
//       //add valid object
//        "tenantId":"name",
//         "menuItemType": "quicklink",
//         "applicationCode": "flux",
//         "menuItemCode": "cda-1",
//         "createdBy": "usha",
//         "createdDate":  new Date().toISOString(),
//         "title": "menu item 2"
//     };
//     let menuItem2={
//       //add valid object with one attribute value same as "menuItem1"
//        "tenantId":"name",
//         "menuItemType": "quicklink",
//         "applicationCode": "cda",
//         "menuItemCode": "cda-2",
//         "createdBy": "usha",
//         "createdDate":  new Date().toISOString(),
//         "title": "menu item 2"
//     };
//     // delete all records and insert two menuItems
//     beforeEach((done) => {
//       menuItem.deleteAll()
//         .then((res) => {
//            menuItem.save(menuItem1)
//             .then((res) => {
//               menuItem.save(menuItem2)
//                 .then((savedObj) => {
//                   done();
//                 });
//             });
//         });
//     });
//
//     it("should delete the object for valid attribute value", (done) => {
//       // take one valid attribute and its value
//       let attributename="applicationCode";
//       let attributeValue="cda";
//       let res = menuItem.deleteOne(attributename, attributeValue);
//       console.log("res", res);
//       expect(res)
//               .to.eventually.have.property("applicationCode")
//              .to.eql("cda")
//              .notify(done);
//       });
//
//
//
//
//       // expect(tasks.length).to.equal(0)
//     });
});
