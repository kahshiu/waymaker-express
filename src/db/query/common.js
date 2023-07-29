const { MY_STATES } = require("@src/vars");

// --------------------
// SECTION: mappers 
// --------------------
const getState = (stateNum) => {
  const stateFound = MY_STATES.find((state) => {
    return state.num == stateNum;
  })
  return stateFound ?? MY_STATES[0]; 
}


// --------------------
// SECTION: db query
// --------------------
const getVersion = async (client, params) => {
  const result = await client.query("select version()", [])
  return result.rows[0]; 
}

module.exports = {
  getState,
  getVersion,
} 