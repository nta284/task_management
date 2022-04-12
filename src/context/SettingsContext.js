import { useState, useEffect, createContext } from "react";
import { themeColors } from '../colors';

const SettingsContext = createContext();

function SettingsProvider({ children }) {
    const [lang, setLang] = useState(() => {
        const settingsStorage = JSON.parse(localStorage.getItem('settings'));

        return settingsStorage?.lang ?? 'VN';
        // return 'VN';
    });

    const [theme, setTheme] = useState(() => {
        const settingsStorage = JSON.parse(localStorage.getItem('settings'));

        return settingsStorage?.theme ?? 'theme-blue';
    });

    const settingsContext = {
        lang,
        theme,
        setLang,
        setTheme
    }

    useEffect(() => {
        const selectedTheme = themeColors.find(ele => ele.name === theme);

        const root = document.documentElement;

        root?.style.setProperty("--primary-color", selectedTheme.palette['primary']);
        root?.style.setProperty("--dark-color", selectedTheme.palette['dark']);
        root?.style.setProperty("--light-color", selectedTheme.palette['light']);
        root?.style.setProperty("--lightest-color", selectedTheme.palette['lightest']);
    }, [theme])

    useEffect(() => {
        const stringnifiedSettings = JSON.stringify({
            lang,
            theme
        })
        localStorage.setItem('settings', stringnifiedSettings);
    }, [lang, theme])

    return (
        <SettingsContext.Provider value={settingsContext}>
            {children}
        </SettingsContext.Provider>
    )
}

export { SettingsProvider, SettingsContext };