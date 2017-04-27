// import client startup through a single index entry point

import './routes.jsx';
import {addLocaleData} from 'react-intl';
import en from 'react-intl/locale-data/en';
import ur from 'react-intl/locale-data/ur';

addLocaleData([...en, ...ur]);