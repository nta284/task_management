import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPenToSquare, faEllipsisVertical, faPalette, faShuffle, faClipboard, faCalendarDays, faClock } from '@fortawesome/free-solid-svg-icons';
import './Task.scss';
import colors from '../colors';

export default function Task({
    taskIndex,
    task: taskItem,
    taskHandle
}) {

    const {
        task_name,
        isDone,
        bgColor,
        description,
        date,
        time
    } = taskItem;

    const {
        handleDeleteTask,
        handleMarkDoneTask,
        handleEditTask,
        handleEditBgColor,
        handleEditTaskDescription,
        handleToggleDateTimeModal
    } = taskHandle;

    const [isEditing, setIsEditing] = useState(false);
    const [edit, setEdit] = useState(task_name);

    const [iconDisplay, setIconDisplay] = useState(false);
    const [menuToggle, setMenuToggle] = useState(false);

    const [bgColorValue, setBgColorValue] = useState(bgColor);
    // const [bgColorValue, setBgColorValue] = useState('linear-gradient(90deg, #640b39, #570530)');
    const [descriptionValue, setDescriptionValue] = useState(description);

    const editInput = useRef(null);
    const task = useRef(null);
    const currentBgColor = useRef();

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

    function deactivateMenu(e) {
        if (!task.current.contains(e.target)) {
            setMenuToggle(false);
        }
    }

    useEffect(() => {
        window.addEventListener('click', deactivateMenu);

        return (() => {
            window.removeEventListener('click', deactivateMenu);
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
                    {isDone && <FontAwesomeIcon className='task_check' icon={faCheck}/>}
                </div>
                <div className='task_name-wrapper'>
                    <span
                        className={isEditing ? "task_name task_name--inactive" : "task_name"}
                    >
                        {task_name}
                    </span>
                    <input
                        className={isEditing ? "task_edit" : "task_edit task_edit--inactive"}
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
                <div className={isEditing || iconDisplay || menuToggle ? "task_icon-section" : "task_icon-section opacity-0"}>
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
                </div>
            </div>
            <div className={menuToggle ? "task_menu task_menu--active" : "task_menu"}>
                <div className="task_color">
                    <div className="task_menu_title task_color_title">
                        <FontAwesomeIcon icon={faPalette} className='task_menu_icon'/>
                        <span>Choose Color:</span>
                    </div>
                    <div className="task_color_option-list">
                        {colors.map((ele, index) => (
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
                                let newColor = colors[Math.floor(Math.random() * colors.length)];
                                while (newColor === currentBgColor.current) {
                                    newColor = colors[Math.floor(Math.random() * colors.length)];
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
                        <span>Description:</span>
                    </div>
                    <textarea
                        value={descriptionValue}
                        className='task_description_input'
                        spellCheck='false'
                        placeholder='Enter description for this task...'
                        onChange={(e) => {setDescriptionValue(e.target.value)}}
                    ></textarea>
                </div>
                <div className="task_date-and-time">
                    <div className="task_date task_date-and-time_item">
                        <div className="task_menu_title task_date-and-time_title">
                            <div className="task_date-and-time_checkbox">
                                {date !== '' && <div className="task_date-and-time_checkbox_inner">
                                    <FontAwesomeIcon className='task_date-and-time_checkbox_tick' icon={faCheck} />
                                </div>}
                            </div>
                            <FontAwesomeIcon icon={faCalendarDays} className='task_menu_icon'/>
                            <span>Date</span>
                        </div>
                        <div
                            className={date === '' ? "task_date-and-time_value" : "task_date-and-time_value invisible"}
                            onClick={() => handleToggleDateTimeModal(taskIndex)}
                        >
                            <span>{date}</span>
                        </div>
                    </div>
                    <div className="task_time task_date-and-time_item">
                        <div className="task_menu_title task_date-and-time_title">
                            <div className="task_date-and-time_checkbox">
                                {time !== '' && <div className="task_date-and-time_checkbox_inner">
                                    <FontAwesomeIcon className='task_date-and-time_checkbox_tick' icon={faCheck} />
                                </div>}
                            </div>
                            <FontAwesomeIcon icon={faClock} className='task_menu_icon'/>
                            <span>Time</span>
                        </div>
                        <div
                            className={time !== '' ? "task_date-and-time_value" : "task_date-and-time_value invisible"}
                            onClick={() => handleToggleDateTimeModal(taskIndex)}
                        >
                            <span>{time}</span>
                        </div>
                    </div>
                </div>
                <div className="task_menu_delete">
                    <span onClick={() => handleDeleteTask(taskIndex)}>Delete</span>
                </div>
            </div>
        </div>
    )
}