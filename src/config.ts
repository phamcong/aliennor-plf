const isDev = true // process.env.NODE_ENV === 'development';
const isLocal = true // process.env.SERVER_LOCATION === 'local'; // set via .env file

const apiEndpoints = {
    dev: 'https://aliennor.herokuapp.com/api',
    prodLocal: 'https://aliennor.herokuapp.com',
    // dev: 'http://localhost:8080/api',
    // prodLocal: 'http://localhost:8080',
  // prodOnline: 'https://glacial-shore-18891.herokuapp.com'
};

// const prodEndpoint = isLocal ? apiEndpoints.prodLocal : apiEndpoints.prodOnline;
const prodEndpoint = apiEndpoints.prodLocal;

export const config = {
  api: isDev ? apiEndpoints.dev : prodEndpoint,
  dev_api_url: 'http://localhost:8080/api/ecocases'
};

