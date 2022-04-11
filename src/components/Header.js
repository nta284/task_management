import React, { useContext, useEffect, useRef, useState } from 'react';
import './Header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faGear, faLanguage, faBrush, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import vietnamFlag from '../img/vietnam.png';
import usaFlag from '../img/united-states.png';
import { SettingsContext } from '../context/SettingsContext';
import { FilterContext } from '../context/FilterContext';
import { themeColors } from '../colors';

export default function Header() {
    const { lang, theme, setLang, setTheme } = useContext(SettingsContext);

    const { filterMenu } = useContext(FilterContext);
    const { isDeleted, isDone, changeIsDeleted } = filterMenu;

    const [settingsToggle, setSettingsToggle] = useState(false);
    const [langDropdownToggle, setLangDropdownToggle] = useState(false);

    const settings = useRef(null);
    const langSelect = useRef(null);

    function deactivateSettings(e) {
        if (!settings.current.contains(e.target)) {
            setSettingsToggle(false);
        }
    }

    function deactivateLangOptions(e) {
        if (!langSelect.current.contains(e.target)) {
            setLangDropdownToggle(false);
        }
    }

    useEffect(() => {
        window.addEventListener('click', deactivateSettings);
        window.addEventListener('click', deactivateLangOptions);
        
        return () => {
            window.removeEventListener('click', deactivateSettings);
            window.removeEventListener('click', deactivateLangOptions);
        }
    }, [])


    return (
        <div className="header">
            <div className='header_page-name'>
                {lang === 'VN' ? 'Quản lý công việc cá nhân' : 'Personal Task Management'}
            </div>
            <div className="header_search-wrapper">
                <FontAwesomeIcon className='header_search-icon' icon={faMagnifyingGlass} />
                <input
                    type="text"
                    placeholder={lang === 'VN' ? 'Tìm kiếm công việc...' : 'Search for tasks ...'}
                    spellCheck='false'
                />
            </div>
            <div className="settings" ref={settings}>
                <div className={settingsToggle ? "settings-wrapper settings-wrapper--active" : "settings-wrapper"}>
                    <FontAwesomeIcon onClick={() => setSettingsToggle(!settingsToggle)} className='setting-icon' icon={faGear} />
                </div>
                <div className={settingsToggle ? "settings_menu" : "settings_menu invisible"}>
                    <div className="settings_menu_header">
                        {lang === 'VN' ? 'Cài đặt' : 'Settings'}
                    </div>
                    <div className="settings_menu_container">
                        <div className="settings_menu_part settings_menu_language">
                            <div className="settings_menu_part_title">
                                <FontAwesomeIcon className='settings_menu_part_title_icon' icon={faLanguage} />
                                <span>
                                    {lang === 'VN' ? 'Ngôn ngữ:' : 'Language:'}
                                </span>
                            </div>
                            <div className="settings_menu_language_select" ref={langSelect}>
                                <div className="settings_menu_language_select-box" onClick={() => setLangDropdownToggle(!langDropdownToggle)}>
                                    {lang === 'VN' && <div className='settings_menu_language_select-box_text'>
                                        <img className='settings_menu_language_flag' src={vietnamFlag} alt="" />
                                        <span>Tiếng Việt</span>
                                    </div>}
                                    {lang === 'EN' && <div className='settings_menu_language_select-box_text'>
                                        <img className='settings_menu_language_flag' src={usaFlag} alt="" />
                                        <span>English</span>
                                    </div>}
                                    <FontAwesomeIcon icon={faAngleDown} />
                                </div>
                                {langDropdownToggle && <div className="settings_menu_language_select_options">
                                    <div
                                        className={lang === 'VN' ? "settings_menu_language_select_option-item selecting-lang" : "settings_menu_language_select_option-item"}
                                        onClick={() => {
                                            setLang('VN');
                                            setTimeout(() => {
                                                setLangDropdownToggle(false);
                                            }, 0);
                                        }}
                                    >
                                        <img className='settings_menu_language_flag' src={vietnamFlag} alt="" />
                                        <span>Tiếng Việt</span>
                                    </div>
                                    <div
                                        className={lang === 'EN' ? "settings_menu_language_select_option-item selecting-lang" : "settings_menu_language_select_option-item"}
                                        onClick={() => {
                                            setLang('EN');
                                            setTimeout(() => {
                                                setLangDropdownToggle(false);
                                            }, 0);
                                        }}
                                    >
                                        <img className='settings_menu_language_flag' src={usaFlag} alt="" />
                                        <span>English</span>
                                    </div>
                                </div>}
                            </div>
                        </div>
                        <div className="settings_menu_part settings_menu_theme">
                            <div className="settings_menu_part_title">
                                <FontAwesomeIcon className='settings_menu_part_title_icon' icon={faBrush} />
                                <span>
                                    {lang === 'VN' ? 'Thay đổi màu nền' : 'Change background'}
                                </span>
                            </div>
                            <div className="settings_menu_theme_select">
                                {themeColors.map(ele => (
                                    <div
                                        key={ele.name}
                                        className={ele.name === theme ? "settings_menu_theme_option theme--selecting" : "settings_menu_theme_option"}
                                        onClick={() => setTheme(ele.name)}
                                    >
                                        <div style={{backgroundColor: ele.palette['primary']}} className="settings_menu_theme_option_inner"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
