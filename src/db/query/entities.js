const { formatNumber, formatString } = require("@src/helpers");

// -------------------------
// SECTION: data conversions
// -------------------------
const defaultDto = {
  entityId: 0
  , entityType: 0
  , entityName: ""
  , icType: 0
  , icNo: ""
  , mobileNo: ""
  , officeNo: ""
  , email: ""
  , address1: ""
  , address2: ""
  , address3: ""
  , postcode: ""
  , addressCity: ""
  , addressState: 0 
  , note: ""
}

const defaultModel = {
  entity_id: 0
  , entity_type: 0
  , entity_name: ""
  , ic_type: 0
  , ic_no: ""
  , mobile_no: ""
  , office_no: ""
  , email: ""
  , address1: ""
  , address2: ""
  , address3: ""
  , postcode: ""
  , address_city: ""
  , address_state: 0
  , note: ""
}

const sanitiseDto = (params) => {
  const dto = {};
  dto.entityId = formatNumber(params.entityId, defaultDto.entityId);
  dto.entityType = formatNumber(params.entityType, defaultDto.entityType);
  dto.entityName = formatString(params.entityName, defaultDto.entityName); 

  dto.icType = formatNumber(params.icType, defaultDto.icType); 
  dto.icNo = formatString(params.icNo, defaultDto.icNo); 
  dto.mobileNo = formatString(params.mobileNo, defaultDto.mobileNo); 
  dto.officeNo = formatString(params.officeNo, defaultDto.officeNo); 
  dto.email = formatString(params.email, defaultDto.email); 

  dto.address1 = formatString(params.address1, defaultDto.address1); 
  dto.address2 = formatString(params.address2, defaultDto.address2); 
  dto.address3 = formatString(params.address3, defaultDto.address3); 
  dto.postcode = formatString(params.postcode, defaultDto.postcode); 
  dto.addressCity = formatString(params.addressCity, defaultDto.addressCity); 
  dto.addressState = formatNumber(params.addressState, defaultDto.addressState); 
  dto.note = formatString(params.note, defaultDto.note); 
  return dto;
}

const dtoToModel = (dto) => {
  const model = {};
  model.entity_id = formatNumber(dto.entityId, defaultModel.entity_id);
  model.entity_type = formatNumber(dto.entityType, defaultModel.entity_type);
  model.entity_name = formatString(dto.entityName, defaultModel.entity_name); 

  model.ic_type = formatNumber(dto.icType, defaultModel.ic_type); 
  model.ic_no = formatString(dto.icNo, defaultModel.ic_no); 
  model.mobile_no = formatString(dto.mobileNo, defaultModel.mobile_no); 
  model.office_no = formatString(dto.officeNo, defaultModel.office_no); 
  model.email = formatString(dto.email, defaultModel.email); 

  model.address1 = formatString(dto.address1, defaultModel.address1); 
  model.address2 = formatString(dto.address2, defaultModel.address2); 
  model.address3 = formatString(dto.address3, defaultModel.address3); 
  model.postcode = formatString(dto.postcode, defaultModel.postcode); 
  model.address_city = formatString(dto.addressCity, defaultModel.address_city); 
  model.address_state = formatNumber(dto.addressState, defaultModel.address_state); 
  model.note = formatString(dto.note, defaultModel.note); 
  return model;
}

const modelToDto = (model) => {
  const dto = {};
  dto.entityId = formatNumber(model.entity_id, defaultDto.entityId);
  dto.entityType = formatNumber(model.entity_type, defaultDto.entityType);
  dto.entityName = formatString(model.entity_name, defaultDto.entityName); 

  dto.icType = formatNumber(model.ic_type, defaultDto.icType); 
  dto.icNo = formatString(model.ic_no, defaultDto.icNo); 
  dto.mobileNo = formatString(model.mobile_no, defaultDto.mobileNo); 
  dto.officeNo = formatString(model.office_no, defaultDto.officeNo); 
  dto.email = formatString(model.email, defaultDto.email); 

  dto.address1 = formatString(model.address1, defaultDto.address1); 
  dto.address2 = formatString(model.address2, defaultDto.address2); 
  dto.address3 = formatString(model.address3, defaultDto.address3); 
  dto.postcode = formatString(model.postcode, defaultDto.postcode); 
  dto.addressCity = formatString(model.address_city, defaultDto.addressCity); 
  dto.addressState = formatNumber(model.address_state, defaultDto.addressState); 
  dto.note = formatString(model.note, defaultDto.note); 
  return dto;
}

// -------------------------
// SECTION: data query 
// -------------------------
/**
 * getEntityById, supply id to get the entire entity object
 * @param {client} client 
 * @param {*} params 
 * @returns 
 */
const getEntityById = async (client, params) => {
  const model = dtoToModel(params);
  const sql = `select 
    entity_id
  , entity_type
  , entity_name
  , ic_type
  , ic_no
  , mobile_no 
  , office_no 
  , email
  , address1
  , address2
  , address3
  , postcode
  , address_city
  , address_state
  , note 
  from profiler.entities
  where entity_id = $1`;
  const result = await client.query(sql, [model.entity_id]);
  const dto = result.rows.map((item) => modelToDto(item));
  return { dto };
}

const searchEntities = async (client, params) => {
  const model = dtoToModel(params);
  const sql = `select 
    entity_id
  , entity_type
  , entity_name
  , ic_type
  , ic_no
  , mobile_no 
  , office_no 
  , email
  , address1
  , address2
  , address3
  , postcode
  , address_city
  , address_state
  , note 
  from profiler.entities
  where 
    entity_type = $1
    and (
      ($2 = '' or entity_name ilike $3)
      and ($4 = '' or ic_no = $5)
      and (
        ($6 = '' or mobile_no = $7)
        or ($6 = '' or office_no = $7)
      )
      and ($8 = '' or email = $9)
    );`;
  const result = await client.query(sql, [
    model.entity_type
    , model.entity_name , `%${model.entity_name}%`
    , model.ic_no, `%${model.ic_no}%`
    , model.mobile_no, `%${model.mobile_no}%`
    , model.email,`%${model.email}%`
  ]);
  const dto = result.rows.map((item) => modelToDto(item));
  return { dto };
}

const postEntity = async (client, params) => {
  const model = dtoToModel(params);
  const sql = `insert into profiler.entities (
      entity_type
    , entity_name
    , ic_type
    , ic_no
    , mobile_no   
    , office_no   
    , email
    , address1  
    , address2  
    , address3  
    , postcode  
    , address_city      
    , address_state     
    , note              
  ) values (
      $1
    , $2
    , $3
    , $4
    , $5
    , $6
    , $7
    , $8
    , $9
    , $10
    , $11
    , $12
    , $13
    , $14
  ) returning entity_id;`;

  const result = await client.query(sql, [
    model.entity_type
    , model.entity_name
    , model.ic_type
    , model.ic_no
    , model.mobile_no // $5
    , model.office_no
    , model.email
    , model.address1 // $8
    , model.address2
    , model.address3
    , model.postcode
    , model.address_city // $12
    , model.address_state 
    , model.note
  ]);
  const dto = result.rows.map((item) => modelToDto(item));
  return { dto };
};

const patchEntity = async (client, params) => {
  const model = dtoToModel(params);
  console.log(model)
  const sql = `update profiler.entities set
      entity_name = $3
    , ic_type = $4
    , ic_no = $5
    , mobile_no = $6
    , office_no = $7
    , email = $8
    , address1 = $9
    , address2 = $10
    , address3 = $11
    , postcode = $12
    , address_city = $13
    , address_state = $14
    , note = $15
    where entity_id = $1 
      and entity_type = $2
    returning entity_id;`;

  const result = await client.query(sql, [
    model.entity_id
    , model.entity_type
    , model.entity_name
    , model.ic_type
    , model.ic_no
    , model.mobile_no // $6
    , model.office_no
    , model.email
    , model.address1 // $9
    , model.address2
    , model.address3
    , model.postcode
    , model.address_city // $13
    , model.address_state 
    , model.note
  ]);
  const dto = result.rows.map((item) => modelToDto(item));
  return { dto };
}

module.exports = {
  conversion: {
    defaultDto,
    defaultModel,
    sanitiseDto,
    dtoToModel,
    modelToDto,
  },
  query: {
    getEntityById,
    searchEntities,
    postEntity,
    patchEntity,
  }
} 