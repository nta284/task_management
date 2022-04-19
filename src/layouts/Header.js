import React, { useContext, useEffect, useRef, useState } from 'react';
import './Header.scss';
import Clock from '../components/Clock'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faGear, faLanguage, faBrush, faAngleDown, faFilter, faCheck, faCircleXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import vietnamFlag from '../img/vietnam.png';
import usaFlag from '../img/united-states.png';
import { themeColors } from '../colors';
import { SettingsContext } from '../context/SettingsContext';
import { FilterContext } from '../context/FilterContext';

export default function Header({ isMobile }) {
    const { lang, theme, setLang, setTheme } = useContext(SettingsContext);

    const { filterMenu } = useContext(FilterContext);
    const {
        isDeleted,
        keyword,
        isDone,
        deadline,
        changeIsDeleted,
        setIsDone,
        setKeyword,
        setDeadline,
        searchFilterApplying
    } = filterMenu;

    const [searchFilterToggle, setSearchFilterToggle] = useState(false);
    const [searchFocus, setSearchFocus] = useState(false);

    const [settingsToggle, setSettingsToggle] = useState(false);
    const [langDropdownToggle, setLangDropdownToggle] = useState(false);

    const searchFilter = useRef(null);
    const settings = useRef(null);
    const langSelect = useRef(null);

    // Deactivate Search and Filter menu when click outside
    function deactivateSearchFilter(e) {
        if (!searchFilter.current.contains(e.target)) {
            setSearchFilterToggle(false);
        }
    }

    // Handle filter option choosing
    function handleFilterOption(setState, state, value) {
        if (state === value) {
            setState(null);
        }
        else {
            setState(value);
        }
    }


    // Deactivate Settings menu when click outside
    function deactivateSettings(e) {
        if (!settings.current.contains(e.target)) {
            setSettingsToggle(false);
        }
    }

    // Deactivate language dropdown menu when click outside
    function deactivateLangOptions(e) {
        if (!langSelect.current.contains(e.target)) {
            setLangDropdownToggle(false);
        }
    }

    useEffect(() => {
        window.addEventListener('click', deactivateSearchFilter);
        window.addEventListener('click', deactivateSettings);
        window.addEventListener('click', deactivateLangOptions);
        
        return () => {
            window.removeEventListener('click', deactivateSearchFilter);
            window.removeEventListener('click', deactivateSettings);
            window.removeEventListener('click', deactivateLangOptions);
        }
    }, [])


    return (
        <div className="header">
            <div className='header_page-name'>
                {lang === 'VN' ? 'Quản lý công việc cá nhân' : 'Personal Task Management'}
            </div>
            {isMobile || <Clock />}
            <div className="search-filter" ref={searchFilter}>
                <div
                    className={searchFilterToggle || searchFilterApplying ? "search-filter-wrapper search-filter-wrapper--active" : "search-filter-wrapper"}
                    onClick={() => setSearchFilterToggle(!searchFilterToggle)}
                >
                    <FontAwesomeIcon className='filter-icon' icon={faFilter} />
                    <span>{lang === 'VN' ? 'Tìm kiếm và Bộ lọc' : 'Search and Filter'}</span>
                </div>
                <div className={searchFilterToggle ? "header_menu search-filter_menu" : "header_menu search-filter_menu d-none"}>
                    <div className="header_menu_header search-filter_menu_header">
                        {lang === 'VN' ? 'Tìm kiếm và Bộ lọc' : 'Search and Filter'}
                    </div>
                    <div className="header_menu_container search-filter_menu_container">
                        <div className="header_menu_part search-filter_menu_part">
                            <div className="header_menu_part_title search-filter_menu_part_title">
                                <span>{lang === 'VN' ? 'Từ khóa' : 'Keyword'}</span>
                            </div>
                            <div className={searchFocus ? "search-filter_search-wrapper search--focus" : "search-filter_search-wrapper"}>
                                <FontAwesomeIcon className='search-filter_search-icon' icon={faMagnifyingGlass} />
                                <input
                                    value={keyword}
                                    placeholder={lang === 'VN' ? 'Tìm kiếm công việc...' : 'Search for tasks...'}
                                    spellCheck='false'
                                    onFocus={() => setSearchFocus(true)}
                                    onBlur={() => setSearchFocus(false)}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                                <FontAwesomeIcon className='search-filter_clear-icon' icon={faCircleXmark} onClick={() => setKeyword('')}/>
                            </div>
                        </div>
                        <div className="header_menu_part search-filter_menu_part">
                            <div className="header_menu_part_title search-filter_menu_part_title">
                                <span>{lang === 'VN' ? 'Tiến trình' : 'Progress'}</span>
                            </div>
                            <div className="search-filter_select search-filter_progress-select">
                                <div className="search-filter_option search-filter_progress-option" onClick={() => handleFilterOption(setIsDone, isDone, true)}>
                                    <div className="checkbox">
                                        <div className={isDone === true ? "checkbox_inner" : "checkbox_inner invisible"}>
                                            <FontAwesomeIcon className='checkbox_tick' icon={faCheck} />
                                        </div>
                                    </div>
                                    <span>{lang === 'VN' ? 'Đã hoàn thành' : 'Completed'}</span>
                                </div>
                                <div className="search-filter_option search-filter_progress-option" onClick={() => handleFilterOption(setIsDone, isDone, false)}>
                                    <div className="checkbox">
                                        <div className={isDone === false ? "checkbox_inner" : "checkbox_inner invisible"}>
                                            <FontAwesomeIcon className='checkbox_tick' icon={faCheck} />
                                        </div>
                                    </div>
                                    <span>{lang === 'VN' ? 'Chưa hoàn thành' : 'Uncompleted'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="header_menu_part search-filter_menu_part">
                            <div className="header_menu_part_title search-filter_menu_part_title">
                                <span>{lang === 'VN' ? 'Ngày và Giờ' : 'Date and Time'}</span>
                            </div>
                            <div className="search-filter_select search-filter_date-time-select">
                                <div className="search-filter_option search-filter_date-time-option" onClick={() => handleFilterOption(setDeadline, deadline, 'soon')}>
                                    <div className="checkbox">
                                        <div className={deadline === 'soon' ? "checkbox_inner" : "checkbox_inner invisible"}>
                                            <FontAwesomeIcon className='checkbox_tick' icon={faCheck} />
                                        </div>
                                    </div>
                                    <span>{lang === 'VN' ? 'Sắp quá hạn' : 'Due soon'}</span>
                                </div>
                                <div className="search-filter_option search-filter_date-time-option" onClick={() => handleFilterOption(setDeadline, deadline, 'late')}>
                                    <div className="checkbox">
                                        <div className={deadline === 'late' ? "checkbox_inner" : "checkbox_inner invisible"}>
                                            <FontAwesomeIcon className='checkbox_tick' icon={faCheck} />
                                        </div>
                                    </div>
                                    <span>{lang === 'VN' ? 'Đã quá hạn' : 'Past due'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="header_menu_part search-filter_menu_part search-filter_deleted">
                            <div className="search-filter_deleted-toggle" onClick={changeIsDeleted}>
                                <div className="checkbox">
                                    <div className={isDeleted ? "checkbox_inner" : "checkbox_inner invisible"}>
                                        <FontAwesomeIcon className='checkbox_tick' icon={faCheck} />
                                    </div>
                                </div>
                                <div className='search-filter_deleted-toggle_text'>
                                    <FontAwesomeIcon className='trash-can-icon' icon={faTrashCan} />
                                    <span>{lang === 'VN' ? 'Đã xoá' : 'Deleted Tasks'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="settings" ref={settings}>
                <div className={settingsToggle ? "settings-wrapper settings-wrapper--active" : "settings-wrapper"}>
                    <FontAwesomeIcon onClick={() => setSettingsToggle(!settingsToggle)} className='setting-icon' icon={faGear} />
                </div>
                <div className={settingsToggle ? "header_menu settings_menu" : "header_menu settings_menu invisible"}>
                    <div className="header_menu_header settings_menu_header">
                        {lang === 'VN' ? 'Cài đặt' : 'Settings'}
                    </div>
                    <div className="header_menu_container settings_menu_container">
                        <div className="header_menu_part settings_menu_part settings_menu_language">
                            <div className="header_menu_part_title settings_menu_part_title">
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
                        <div className="header_menu_part settings_menu_part settings_menu_theme">
                            <div className="header_menu_part_title settings_menu_part_title">
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
                                        <div style={{backgroundColor: ele.palette['primary']}} className="settings_menu_theme_option_inner">
                                            <div style={{backgroundColor: ele.palette['dark']}} className="theme_option_header"></div>
                                            <div className="theme_option_content">
                                                <div className="theme_option_cat"></div>
                                                <div className="theme_option_cat"></div>
                                                <div className="theme_option_cat"></div>
                                                <div className="theme_option_cat" style={{backgroundColor: ele.palette['light']}}></div>
                                            </div>
                                        </div>
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
