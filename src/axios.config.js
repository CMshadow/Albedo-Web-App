import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://hmtn4lq275.execute-api.us-west-2.amazonaws.com/dev',
  timeout: 10000,
});

export default instance;
