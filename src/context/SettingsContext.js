import { useState,  createContext } from "react";

const SettingsContext = createContext();

function SettingsProvider({ children }) {
    const [lang, setLang] = useState('VN');
    const [theme, setTheme] = useState('theme-green');

    const settingsContext = {
        lang,
        theme,
        setLang,
        setTheme
    }

    return (
        <SettingsContext.Provider value={settingsContext}>
            {children}
        </SettingsContext.Provider>
    )
}

export { SettingsProvider, SettingsContext };