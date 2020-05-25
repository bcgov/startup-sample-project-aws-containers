const axios = require('axios');
const qs = require('querystring');
const NodeCache = require('node-cache');

const tokenUrl = `https://${process.env.DB_SUFFIX === 'production' ? 'sso' : 'sso-test'}.pathfinder.gov.bc.ca/auth/realms/vtkayq4c/protocol/openid-connect/token`;
const submitURL = `https://${process.env.DB_SUFFIX === 'production' ? '' : 'test-'}serviceflow.pathfinder.gov.bc.ca/camunda/engine-rest/process-definition/key/covid_travel_plan_gateway/start`;
const appCache = new NodeCache();


const auth = {
  username: process.env.BCS_USER,
  password: process.env.BCS_PW,
  grant_type: 'password',
  client_id: 'camunda-identity-service',
  client_secret: process.env.BCS_CLI_SECRET,
};

const getToken = async () => {
  if (appCache.get('ServiceBCToken') !== undefined) return appCache.get('ServiceBCToken');

  const { data } = await axios.post(tokenUrl, qs.stringify(auth), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'application/json',
    },
  });

  appCache.set('ServiceBCToken', data.access_token, data.expires_in - 10);
  return data.access_token;
};

const postServiceItem = async (item) => {
  try {
    const token = await getToken();
    const response = await axios.post(submitURL, {
      variables: {
        rawvariables: {
          value: JSON.stringify(item),
          type: 'String',
        },
      },
    }, {
      headers: {
        'Accept-Encoding': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      status: 'success',
      serviceBCId: response.data.id,
    };
  } catch (error) {
    return {
      status: 'fail',
      errorDetails: JSON.stringify(error),
    };
  }
};

// start function call
module.exports = postServiceItem;
