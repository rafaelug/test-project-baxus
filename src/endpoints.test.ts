const request = require("supertest")("http://localhost:8888");
const expect = require("chai").expect;

describe("POST /sign", function () {
    it("check no data", async function () {
        const response = await request.post("/sign").send({});
    
        expect(response.status).to.eql(405);
    });
    it("check id not UUID format", async function () {
        const response = await request.post("/sign").send({msg: '', id:'58ef3aac-84d9-11ee-b9d1-0242ac122'});
    
        expect(response.status).to.eql(405);
    });
    it("check id IN UUID format", async function () {
      const response = await request.post("/sign").send({msg: 'sdddasas a s as a', id:'58ef3aac-84d9-11ee-b9d1-0242ac120002'});
  
      expect(response.status).to.eql(200);
    });
  
  
  });

describe("GET /check", function () {
  it("check no id param", async function () {
    const response = await request.get("/check");

    expect(response.status).to.eql(405);
  });

  it("check empty id param", async function () {
    const response = await request.get("/check?id=");

    expect(response.status).to.eql(405);
  });

  it("check id not in UUID format", async function () {
    const response = await request.get("/check?id=asdasdasdasd");

    expect(response.status).to.eql(405);
  });

  it("check id IN UUID format", async function () {
    const response = await request.get("/check?id=6fcaffe1-0b9a-49d9-9eb8-fd596f7745b5");

    expect(response.status).to.eql(405);
  });

});