import axios from 'axios';

const instance = axios.create({
    baseURL:'https://blog-data-base.firebaseio.com/'
});

export default instance;