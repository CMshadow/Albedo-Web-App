import axios from 'axios';

const instance = axios.create({
    baseURL:'https://xt18hpbqsj.execute-api.us-east-2.amazonaws.com/dev/blogs/'
});

export default instance;