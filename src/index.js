import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import Backendless from 'backendless';

console.log('REACT_APP_ID:', process.env.REACT_APP_ID);
console.log('REACT_APP_API_KEY:', process.env.REACT_APP_API_KEY);
console.log('REACT_APP_CUSTOM_DOMAIN:', process.env.REACT_APP_CUSTOM_DOMAIN);

try {
    Backendless.initApp(
        process.env.REACT_APP_ID,
        process.env.REACT_APP_API_KEY,
        process.env.REACT_APP_CUSTOM_DOMAIN
    );
    console.log('Backendless initialized successfully');
} catch (error) {
    console.error('Backendless initialization failed:', error);
}

ReactDOM.render(<App />, document.getElementById('root'));
