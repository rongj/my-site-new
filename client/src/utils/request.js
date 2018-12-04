import qs from 'qs';
import axios from 'axios';


axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

axios.defaults.headers = {
	'X-Requested-With': 'XMLHttpRequest'
}

axios.interceptors.response.use(res=> {
	return Promise.resolve(res);
})

export {
	axios
}