import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTrashCan, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import './Category.scss';
import Task from './Task';

export default function Category({
    catIndex,
    cat_name,
    cat_list,
    taskListHandle
}) {

    const {
        deleteCat,
        deleteTask,
        addTask,
        markDoneTask,
        editTask,
        editTaskBgColor,
        editTaskDescription,
        openDateTimeModal
    } = taskListHandle;

    const [taskInput, setTaskInput] = useState('');
    const [addTaskActive, setAddTaskActive] = useState(false);

    const addTaskInput = useRef(null);
    const addTaskInputSection = useRef(null);

    const taskHandle = {
        handleDeleteTask(taskIndex) {
            deleteTask(catIndex, taskIndex);
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

        handleOpenDateTimeModal(taskIndex) {
            openDateTimeModal(catIndex, taskIndex);
        }
    }

    function handleAddTaskFromCat() {
        setTaskInput('');
        addTaskInput.current.focus();
        if (!cat_list.some(ele => ele.task_name === taskInput)) {
            addTask(catIndex, taskInput);
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

        return () => {
            window.removeEventListener('click', deactivateAddTaskInput);
        }
    }, [])


    return (
        <div className="category">
            <div className='category_header'>
                <span className="category_name">
                    {cat_name}
                </span>
                <div className="category_heading_progress">
                    <div className="category_heading_progress-text">
                        <span>
                            {cat_list.filter(task => !task.isDeleted && task.isDone).length}
                        </span>
                        <span>/</span>
                        <span>
                            {cat_list.filter(task => !task.isDeleted).length}
                        </span>
                    </div>
                    <FontAwesomeIcon 
                        className="category_heading_progress-check"
                        icon={faCheck}
                    />
                </div>
                <FontAwesomeIcon 
                    className="task-icon cat-delete-icon"
                    icon={faTrashCan}
                    onClick={() => deleteCat(catIndex)}
                />
            </div>
            <div className='category_list'>
                {cat_list.map((task, index) => {
                    return (
                        task.isDeleted || <Task
                            key={`${cat_name}-${task.task_name}`}
                            className='task'
                            taskIndex={index}
                            task={task}
                            taskHandle={taskHandle}
                        />
                    )
                })}
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
                    <span>Add a task</span>
                </div>
                <div className={addTaskActive ? "add-input-section add-task-input-section" : "add-input-section add-task-input-section add-input-section--inactive"}>
                    <input
                        className='add-input'
                        value={taskInput}
                        ref={addTaskInput}
                        type="text"
                        spellCheck='false'
                        placeholder='Enter task name...'
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
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}