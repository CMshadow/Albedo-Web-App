import axios from 'axios';

let stage
if (process.env.REACT_APP_STAGE_OVERWRITE) {
  stage = process.env.REACT_APP_STAGE_OVERWRITE === 'dev' ? 'dev' : 'v1'
} else {
  stage = process.env.NODE_ENV === 'development' ? 'dev' : 'v1'
}

const instance = axios.create({
  baseURL: `https://hmtn4lq275.execute-api.us-west-2.amazonaws.com/${stage}`,
  timeout: 60000,
});

export default instance;
