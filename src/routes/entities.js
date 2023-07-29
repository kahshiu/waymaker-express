const { pool } = require("@db/pgConn");
const entities = require("@db/query/entities");
const { EntityType, IcType } = require("../vars");

const enforceIndividualDto = (dto) => {
  dto.entityType = EntityType.INDIVIDUAL;
  dto.icType = IcType.IC;
}
const enforceCompanyDto = (dto) => {
  dto.entityType = EntityType.COMPANY;
  dto.icType = IcType.COMPANY_REGNO;
}


/**
 * @param {express.Router} router 
 */
const registerRoutes = (router) => {

  router.get("/entity", async (req, res) => {
    const dto = entities.conversion.sanitiseDto(req.query);
    const client = await pool.connect();
    const entity = await entities.query.getEntityById(client, dto);

    client.release();
    res.json({entity: entity.dto});
  })
  router.get("/entity/search", async (req, res) => {
    const dto = entities.conversion.sanitiseDto(req.query);
    const client = await pool.connect();
    const entity = await entities.query.searchEntities(client, dto);

    client.release();
    res.json({searched: entity.dto});
  })


  router.post("/individual", async (req, res) => {
    console.log(req.body)
    const dto = entities.conversion.sanitiseDto(req.body);
    enforceIndividualDto(dto);
    const client = await pool.connect();
    const entity = await entities.query.postEntity(client, dto);

    client.release();
    res.json({entity: entity.dto});
  })
  router.patch("/individual", async (req, res) => {
    const dto = entities.conversion.sanitiseDto(req.body);
    enforceIndividualDto(dto);
    const client = await pool.connect();
    const entity = await entities.query.patchEntity(client, dto);

    client.release();
    res.json({entity: entity.dto});
  })


  router.post("/company", async (req, res) => {
    const dto = entities.conversion.sanitiseDto(req.query);
    enforceCompanyDto(dto);
    const client = await pool.connect();
    const entity = await entities.query.postEntity(client, dto);

    client.release();
    res.json({entity: entity.dto});
  })
  router.patch("/individual", async (req, res) => {
    const dto = entities.conversion.sanitiseDto(req.query);
    enforceCompanyDto(dto);
    const client = await pool.connect();
    const entity = await entities.query.postEntity(client, dto);

    client.release();
    res.json({entity: entity.dto});
  })
}

module.exports = { 
  registerRoutes 
}