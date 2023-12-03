
# package manager 
Yarn 

# To reset cache and start
yarn start --reset-cache 

# .env file

https://github.com/zetachang/react-native-dotenv

then create .env file at root
and add code snippet below inside babel.config.js

"plugins": [
    ["module:react-native-dotenv", {
      "moduleName": "@env",
      "path": ".env",
      "blacklist": null,
      "whitelist": null,
      "safe": false,
      "allowUndefined": true
    }]
  ]

usage 

import {URL_BASE} from '@env';
then pod install and reset cache 

# state management

redux-toolkit
https://redux-toolkit.js.org/

# persistent storage

async storage react native community
https://react-native-async-storage.github.io/async-storage/docs/install/


# UI Framework

- React native paper
- Styled components

