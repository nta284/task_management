import React from 'react';
import ReactDOM from 'react-dom';
import './reset.scss';
import './index.scss';
import App from './App';
import { SettingsProvider } from './SettingsContext';
import { FilterProvider } from './FilterContext';

ReactDOM.render(
    <SettingsProvider>
        <FilterProvider>
            <App />
        </FilterProvider>
    </SettingsProvider>,
document.getElementById('root'));
