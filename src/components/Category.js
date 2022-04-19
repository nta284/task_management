import React, { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react';
import './Category.scss';
import Task from './Task';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCheck, faPlus, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { SettingsContext } from '../context/SettingsContext';
import { FilterContext } from '../context/FilterContext';

export default function Category({
    catIndex,
    cat_name,
    cat_list,
    taskListHandle,
    isMobile
}) {

    const {
        deleteCat,
        editCat,
        deleteRestoreTask,
        deleteTaskPermanently,
        addTask,
        markDoneTask,
        editTask,
        editTaskBgColor,
        editTaskDescription,
        dateTimeHandling
    } = taskListHandle;

    const [taskInput, setTaskInput] = useState('');
    const [addTaskActive, setAddTaskActive] = useState(false);

    const [catMenuToggle, setCatMenuToggle] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [edit, setEdit] = useState(cat_name);

    const catMenu = useRef(null);
    const editInput = useRef(null);

    const addTaskInput = useRef(null);
    const addTaskInputSection = useRef(null);
    const catList = useRef(null);

    const { lang } = useContext(SettingsContext);
    const { filterMenu, catListFilter } = useContext(FilterContext);

    const taskHandle = {
        handleDeleteRestoreTask(taskIndex) {
            deleteRestoreTask(catIndex, taskIndex);
        },

        handleDeleteTaskPermanently(taskIndex) {
            deleteTaskPermanently(catIndex, taskIndex);
        },
        
        handleMarkDoneTask(taskIndex) {
            markDoneTask(catIndex, taskIndex);
        },
        
        handleEditTask(taskIndex, newValue) {
            editTask(catIndex, taskIndex, newValue);
        },

        handleEditBgColor(taskIndex, bgColorValue) {
            editTaskBgColor(catIndex, taskIndex, bgColorValue);
        },
        
        handleEditTaskDescription(taskIndex, descriptionValue) {
            editTaskDescription(catIndex, taskIndex, descriptionValue);
        },

        handleDateTime(taskIndex, action) {
            dateTimeHandling(catIndex, taskIndex, action);
        }
    }

    useLayoutEffect(() => {
        if (!isEditing) {
            if (edit !== '') {
                editCat(catIndex, edit);
            }
            else {
                editCat(catIndex, edit);
                setTimeout(() => {
                    editInput.current.focus();
                }, 0);
                setIsEditing(true);
            }
        }
    }, [isEditing])

    function deactivateCatMenu(e) {
        if (!catMenu.current.contains(e.target)) {
            setCatMenuToggle(false);
        }
    }

    function handleAddTaskFromCat() {
        addTaskInput.current.focus();
        if (taskInput !== '') {
            addTask(catIndex, taskInput);
            setTimeout(() => {
                setTaskInput('');
                catList.current.children[catList.current.children.length - 1].scrollIntoView();
            }, 0);
        }
    }

    function activateAddTaskInput(e) {
        setAddTaskActive(true);
        setTimeout(() => {
            addTaskInput.current.focus();
        }, 0);
    }

    function deactivateAddTaskInput(e) {
        if (!addTaskInputSection.current.contains(e.target)) {
            setAddTaskActive(false);
            setTaskInput('');
        }
    }

    // Trigger deactivateAddTaskInput when click outside
    useEffect(() => {
        window.addEventListener('click', deactivateAddTaskInput);
        window.addEventListener('click', deactivateCatMenu);

        return () => {
            window.removeEventListener('click', deactivateAddTaskInput);
            window.removeEventListener('click', deactivateCatMenu);
        }
    }, [])


    return (
        <div className="category">
            <div className='category_header'>
                <div className='editable-wrapper category_name-wrapper'>
                    <span
                        className={isEditing ? "editable category_name editable--inactive" : "editable category_name"}
                    >
                        {cat_name}
                    </span>
                    <input
                        className={isEditing ? "editable_edit category_edit" : "editable_edit category_edit editable_edit--inactive"}
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
                {filterMenu.searchFilterApplying || <div className="category_heading_details">
                    <div className="category_heading_details-text">
                        <span>
                            {cat_list.filter(task => !task.isDeleted && task.isDone).length}
                        </span>
                        <span>/</span>
                        <span>
                            {cat_list.filter(task => !task.isDeleted).length}
                        </span>
                    </div>
                    <FontAwesomeIcon 
                        className="category_heading_details-check"
                        icon={faCheck}
                    />
                </div>}
                {filterMenu.searchFilterApplying && <div className="category_heading_details">
                    <div className="category_heading_details-text">
                        <span>
                            {cat_list.filter(task => catListFilter(task)).length}
                        </span>
                        <span>{lang === 'VN' ? ' kết quả' : ' results'}</span>
                    </div>
                </div>}
                <div ref={catMenu} className="category_menu-wrapper">
                    <FontAwesomeIcon 
                        className="cat-menu-icon"
                        icon={faEllipsisVertical}
                        onClick={() => setCatMenuToggle(!catMenuToggle)}
                    />
                    <div className={catMenuToggle ? "category_menu category_menu--active" : "category_menu"}>
                        <div
                            className="category_menu_item"
                            onClick={() => {
                                setCatMenuToggle(false);
                                setIsEditing(true);
                                setTimeout(() => {
                                    editInput.current.focus();
                                }, 0);
                            }}
                        >
                            {lang === 'VN' ? 'Sửa tên danh mục' : 'Edit category title'}
                        </div>
                        <div
                            className="category_menu_item"
                            onClick={() => {
                                setCatMenuToggle(false);
                                deleteCat(catIndex);
                            }}
                        >
                            {lang === 'VN' ? 'Xóa danh mục' : 'Delete category'}
                        </div>
                    </div>
                </div>
            </div>
            <div className='category_list-wrapper'>
                <div ref={catList} className="category_list">
                    {cat_list.map((task, index) => {
                        return (
                            catListFilter(task) && <Task
                                key={task.id}
                                className='task'
                                taskIndex={index}
                                task={task}
                                taskHandle={taskHandle}
                                isMobile={isMobile}
                            />
                        )
                    })}
                </div>
            </div>
            <div ref={addTaskInputSection} className="add-section category_footer">
                <div
                    className={addTaskActive ? "add-activate-btn add-task-activate-btn add-activate-btn--inactive" : "add-activate-btn add-task-activate-btn"} 
                    onClick={activateAddTaskInput}
                >
                    <FontAwesomeIcon 
                        className="add-activate_icon"
                        icon={faPlus}
                    />
                    <span>{lang === 'VN' ? 'Thêm công việc' : 'Add a task'}</span>
                </div>
                <div className={addTaskActive ? "add-input-section add-task-input-section" : "add-input-section add-task-input-section add-input-section--inactive"}>
                    <input
                        className='add-input'
                        value={taskInput}
                        ref={addTaskInput}
                        type="text"
                        spellCheck='false'
                        placeholder={lang === 'VN' ? 'Nhập tên công việc...' : 'Enter task name...'}
                        onChange={(e) => setTaskInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.keyCode === 13) {
                                handleAddTaskFromCat();
                            }
                        }}
                    />
                    <button 
                        className='add-btn'
                        onClick={handleAddTaskFromCat}
                    >
                        {lang === 'VN' ? 'Thêm' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    )
}