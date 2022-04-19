import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Task.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPenToSquare, faEllipsisVertical, faPalette, faShuffle, faClipboard, faCalendarDays, faClock, faReply, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { taskColors } from '../colors';
import { SettingsContext } from '../context/SettingsContext';

export default function Task({
    taskIndex,
    task: taskItem,
    taskHandle,
    isMobile
}) {

    const {
        task_name,
        isDeleted,
        isDone,
        bgColor,
        description,
        date,
        time,
        deadline
    } = taskItem;

    const {
        handleDeleteRestoreTask,
        handleDeleteTaskPermanently,
        handleMarkDoneTask,
        handleEditTask,
        handleEditBgColor,
        handleEditTaskDescription,
        handleDateTime
    } = taskHandle;

    const [isEditing, setIsEditing] = useState(false);
    const [edit, setEdit] = useState(task_name);

    const [iconDisplay, setIconDisplay] = useState(false);
    const [menuToggle, setMenuToggle] = useState(false);

    const [bgColorValue, setBgColorValue] = useState(bgColor);
    const [descriptionValue, setDescriptionValue] = useState(description);

    const [dateActive, setDateActive] = useState(date !== null);
    const [timeActive, setTimeActive] = useState(time !== null);

    const dateTimeStyleList = {
        'normal': "task_date-time",
        'soon': "task_date-time task_date-time--soon",
        'late': "task_date-time task_date-time--late",
        'done': "task_date-time task_date-time--done"
    }

    const editInput = useRef(null);
    const task = useRef(null);
    const currentBgColor = useRef();

    const dateValue = date !== null ? `${date.day}/${date.month + 1}/${date.year}` : null;

    const { lang } = useContext(SettingsContext);

    useLayoutEffect(() => {
        if (!isEditing) {
            if (edit !== '') {
                handleEditTask(taskIndex, edit);
            }
            else {
                handleEditTask(taskIndex, edit);
                setTimeout(() => {
                    editInput.current.focus();
                }, 0);
                setIsEditing(true);
            }
        }
    }, [isEditing])

    useEffect(() => {
        handleEditBgColor(taskIndex, bgColorValue);
        currentBgColor.current = bgColorValue;

        handleEditTaskDescription(taskIndex, descriptionValue);
    }, [bgColorValue, descriptionValue])

    function deactivateTaskMenu(e) {
        if (!task.current.contains(e.target)) {
            setMenuToggle(false);
        }
    }

    function toggleDate() {
        if (!dateActive) {
            handleDateTime(taskIndex, 'SET_DATE');
        }
        else {
            handleDateTime(taskIndex, 'CLEAR_DATE');
        }
    }

    function toggleTime() {
        if (!timeActive) {
            handleDateTime(taskIndex, 'SET_TIME');
        }
        else {
            handleDateTime(taskIndex, 'CLEAR_TIME');
        }
    }

    useEffect(() => {
        setDateActive(date !== null);
        setTimeActive(time !== null);
    }, [date, time])

    // Trigger deactivateTaskMenu when click outside
    useEffect(() => {
        window.addEventListener('click', deactivateTaskMenu);

        return (() => {
            window.removeEventListener('click', deactivateTaskMenu);
        })
    }, [])


    return (
        <div
            className={isDone ? "task task--done" : "task"}
            ref={task}
            onMouseOver={() => {setIconDisplay(true)}}
            onMouseLeave={() => {setIconDisplay(false)}}
        >
            <div className="task-wrapper" style={{background: bgColor}}>
                <div className="task_checkbox" onClick={() => handleMarkDoneTask(taskIndex)}>
                    <FontAwesomeIcon className={isDone ? 'task_check' : 'task_check invisible'} icon={faCheck}/>
                </div>
                <div className="task_content">
                    <div className='editable-wrapper task_name-wrapper'>
                        <span
                            className={isEditing ? "editable task_name editable--inactive" : "editable task_name"}
                        >
                            {task_name}
                        </span>
                        <input
                            className={isEditing ? "editable_edit task_edit" : "editable_edit task_edit editable_edit--inactive"}
                            ref={editInput}
                            value={edit}
                            spellCheck='false'
                            onBlur={() => {
                                setIsEditing(false);
                            }}
                            onKeyDown={e => {
                                if (e.keyCode === 13) {
                                    setIsEditing(false);
                                    editInput.current.blur();
                                }
                            }}
                            onChange={e => setEdit(e.target.value)}
                        />
                    </div>
                    {date && <div className={dateTimeStyleList[deadline === 'normal' ? 'normal' : isDone ? 'done' : deadline]}>{time && `${time}, `}{dateValue && dateValue}</div>}
                </div>
                {isDeleted || <div className={isEditing || iconDisplay || menuToggle || isMobile ? "task_icon-section" : "task_icon-section opacity-0"}>
                    <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="task-icon task-edit-icon"
                        onClick={() => {
                            setIsEditing(true);
                            setTimeout(() => {
                                editInput.current.focus();
                            }, 0);
                        }}
                    />
                    <FontAwesomeIcon
                        icon={faEllipsisVertical}
                        className="task-menu-icon"
                        onClick={() => setMenuToggle(!menuToggle)}
                    />
                </div>}
                {isDeleted && <div className="task_icon-section task_icon-section--deleted">
                    <FontAwesomeIcon
                        icon={faReply}
                        className="task-icon task-restore-icon"
                        onClick={() => handleDeleteRestoreTask(taskIndex)}
                    />
                    <FontAwesomeIcon
                        icon={faTrashCan}
                        className="task-icon task-delete-icon"
                        onClick={() => handleDeleteTaskPermanently(taskIndex)}
                    />
                </div>}
            </div>
            <div className={menuToggle ? "task_menu task_menu--active" : "task_menu"}>
                <div className="task_color">
                    <div className="task_menu_title task_color_title">
                        <FontAwesomeIcon icon={faPalette} className='task_menu_icon'/>
                        <span>{lang === 'VN' ? 'Chọn màu sắc:' : 'Choose Color:'}</span>
                    </div>
                    <div className="task_color_option-list">
                        {taskColors.map((ele, index) => (
                            <div
                                key={index}
                                className={bgColorValue === ele ? "task_color_select task_color_select--selecting" : "task_color_select"}
                                onClick={() => {setBgColorValue(ele)}}
                            >
                                <div className="task_color_select_inner" style={{background: ele}}></div>
                            </div>
                        ))}
                        <div 
                            className="task_color_random-btn"
                            onClick={() => {
                                let newColor = taskColors[Math.floor(Math.random() * taskColors.length)];
                                while (newColor === currentBgColor.current) {
                                    newColor = taskColors[Math.floor(Math.random() * taskColors.length)];
                                }
                                setBgColorValue(newColor);
                            }}
                        >
                            <FontAwesomeIcon className='task_color_random-btn-icon' icon={faShuffle} />
                        </div>
                    </div>
                </div>
                <div className="task_description">
                    <div className="task_menu_title task_description_title">
                        <FontAwesomeIcon icon={faClipboard} className='task_menu_icon'/>
                        <span>{lang === 'VN' ? 'Mô tả:' : 'Description:'}</span>
                    </div>
                    <textarea
                        value={descriptionValue}
                        className='task_description_input'
                        spellCheck='false'
                        placeholder={lang === 'VN' ? 'Thêm mô tả cho công việc này...' : 'Enter description for this task...'}
                        onChange={(e) => {setDescriptionValue(e.target.value)}}
                    ></textarea>
                </div>
                <div className="task_date-and-time">
                    <div className="task_date task_date-and-time_item">
                        <div className="task_menu_title task_date-and-time_title">
                            <div className="checkbox" onClick={toggleDate}>
                                <div className={dateActive ? "checkbox_inner" : "checkbox_inner invisible"}>
                                    <FontAwesomeIcon className='checkbox_tick' icon={faCheck} />
                                </div>
                            </div>
                            <FontAwesomeIcon icon={faCalendarDays} className='task_menu_icon'/>
                            <span>{lang === 'VN' ? 'Ngày' : 'Due date'}</span>
                        </div>
                        <div
                            className={dateActive ? "task_date-and-time_value" : "task_date-and-time_value invisible"}
                            onClick={() => handleDateTime(taskIndex, 'SET_DATE')}
                        >
                            <span>{date && dateValue}</span>
                        </div>
                    </div>
                    <div className={dateActive ? "task_time task_date-and-time_item" : "task_time task_date-and-time_item invisible"}>
                        <div className="task_menu_title task_date-and-time_title">
                            <div className="checkbox" onClick={toggleTime}>
                                <div className={timeActive ? "checkbox_inner" : "checkbox_inner invisible"}>
                                    <FontAwesomeIcon className='checkbox_tick' icon={faCheck} />
                                </div>
                            </div>
                            <FontAwesomeIcon icon={faClock} className='task_menu_icon'/>
                            <span>{lang === 'VN' ? 'Giờ' : 'Time'}</span>
                        </div>
                        <div
                            className={timeActive ? "task_date-and-time_value" : "task_date-and-time_value invisible"}
                            onClick={() => handleDateTime(taskIndex, 'SET_TIME')}
                        >
                            <span>{time}</span>
                        </div>
                    </div>
                </div>
                <div className="task_menu_delete">
                    <span onClick={() => handleDeleteRestoreTask(taskIndex)}>{lang === 'VN' ? 'Xóa' : 'Delete'}</span>
                </div>
            </div>
        </div>
    )
}