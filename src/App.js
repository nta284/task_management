import React, { useState, useEffect, useReducer, useRef } from 'react';
import './App.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faPlus, faGear, faMagnifyingGlass, faClock, faXmark } from '@fortawesome/free-solid-svg-icons';
import Calendar from 'react-calendar';
import TimePicker from 'react-time-picker/dist/entry.nostyle';
import './components/Calendar-and-Clock.scss';
import Category from './components/Category';
import colors from './colors';

function App() {
    const [catInput, setCatInput] = useState('');
    const [addCatActive, setAddCatActive] = useState(false);

    const [toggleModal, setToggleModal] = useState(false);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('');
    const [targetIndex, setTargetIndex] = useState({
        catIndex: null,
        taskIndex: null
    })

    const addCatInput = useRef(null);
    const addCatInputSection = useRef(null);

    // useReducer for taskList
    const initTaskList = [];

    function initializer() {
        const taskListStorage = localStorage.getItem('taskList');

        return JSON.parse(taskListStorage) ?? [
            {
                cat_name: "Chung",
                cat_list: []
            }
        ]
    }

    function taskListReducer(taskList, action) {
        // let newTaskList = [...taskList];

        switch(action.type) {
            case 'ADD_CAT':
                addCatInput.current.focus();
                if (catInput !== '' && !taskList.some(cat => cat.cat_name === catInput)) {
                    setCatInput('');
        
                    return [
                        ...taskList,
                        {
                            cat_name: catInput,
                            cat_list: []
                        }
                    ]
                }
                else {
                    return taskList;
                }

            case 'DELETE_CAT':
                return taskList.filter((ele, index) => {
                    return index !== action.payload.catIndex;
                })

            case 'ADD_TASK':
                return [
                    ...taskList.slice(0, action.payload.catIndex),
                    {
                        ...taskList[action.payload.catIndex],
                        cat_list: [
                            ...taskList[action.payload.catIndex].cat_list,
                            {
                                task_name: action.payload.taskValue,
                                isDone: false,
                                isDeleted: false,
                                bgColor: colors[Math.floor(Math.random() * colors.length)],
                                description: '',
                                date: null,
                                time: ''
                            }
                        ]
                    },
                    ...taskList.slice(action.payload.catIndex + 1)
                ]

            case 'DELETE_TASK':
                // IMPURE FUNCTION

                // newTaskList[action.payload.catIndex].cat_list[action.payload.taskIndex].isDeleted = !newTaskList[action.payload.catIndex].cat_list[action.payload.taskIndex].isDeleted;
                // return newTaskList;

                return [
                    ...taskList.slice(0, action.payload.catIndex),
                    {
                        ...taskList[action.payload.catIndex],
                        cat_list: [
                            ...taskList[action.payload.catIndex].cat_list.slice(0, action.payload.taskIndex),
                            {
                                ...taskList[action.payload.catIndex].cat_list[action.payload.taskIndex],
                                isDeleted: !taskList[action.payload.catIndex].cat_list[action.payload.taskIndex].isDeleted
                            },
                            ...taskList[action.payload.catIndex].cat_list.slice(action.payload.taskIndex + 1)
                        ]
                    },
                    ...taskList.slice(action.payload.catIndex + 1)
                ]

            case 'MARK_DONE_TASK':
                // IMPURE FUNCTION --> cause dispatch to be called twice
                // let done = newTaskList[action.catIndex].cat_list[action.taskIndex].isDone;
                // console.log(done, action.taskIndex);
                // newTaskList[action.catIndex].cat_list[action.taskIndex] = {
                //     ...newTaskList[action.catIndex].cat_list[action.taskIndex],
                //     isDone: !newTaskList[action.catIndex].cat_list[action.taskIndex].isDone
                // }
                // return newTaskList;

                // PURE FUNCTION --> USE THIS INSTEAD
                return [
                    ...taskList.slice(0, action.payload.catIndex),  // all the cat before target cat
                    {
                        ...taskList[action.payload.catIndex],
                        cat_list: [
                            ...taskList[action.payload.catIndex].cat_list.slice(0, action.payload.taskIndex),  // all the task before target task
                            {
                                ...taskList[action.payload.catIndex].cat_list[action.payload.taskIndex],
                                isDone: !taskList[action.payload.catIndex].cat_list[action.payload.taskIndex].isDone
                            },
                            ...taskList[action.payload.catIndex].cat_list.slice(action.payload.taskIndex + 1)  // all the task after target task
                        ]
                    },
                    ...taskList.slice(action.payload.catIndex + 1)  // all the cat after target cat
                ]

            case 'EDIT_TASK':
                return [
                    ...taskList.slice(0, action.payload.catIndex),
                    {
                        ...taskList[action.payload.catIndex],
                        cat_list: [
                            ...taskList[action.payload.catIndex].cat_list.slice(0, action.payload.taskIndex),
                            {
                                ...taskList[action.payload.catIndex].cat_list[action.payload.taskIndex],
                                task_name: action.payload.newValue
                            },
                            ...taskList[action.payload.catIndex].cat_list.slice(action.payload.taskIndex + 1)
                        ]
                    },
                    ...taskList.slice(action.payload.catIndex + 1)
                ]

            case 'EDIT_TASK_BG_COLOR':
                return [
                    ...taskList.slice(0, action.payload.catIndex),
                    {
                        ...taskList[action.payload.catIndex],
                        cat_list: [
                            ...taskList[action.payload.catIndex].cat_list.slice(0, action.payload.taskIndex),
                            {
                                ...taskList[action.payload.catIndex].cat_list[action.payload.taskIndex],
                                bgColor: action.payload.newColor
                            },
                            ...taskList[action.payload.catIndex].cat_list.slice(action.payload.taskIndex + 1)
                        ]
                    },
                    ...taskList.slice(action.payload.catIndex + 1)
                ]

            case 'EDIT_TASK_DESCRIPTION':
                return [
                    ...taskList.slice(0, action.payload.catIndex),
                    {
                        ...taskList[action.payload.catIndex],
                        cat_list: [
                            ...taskList[action.payload.catIndex].cat_list.slice(0, action.payload.taskIndex),
                            {
                                ...taskList[action.payload.catIndex].cat_list[action.payload.taskIndex],
                                description: action.payload.descriptionValue
                            },
                            ...taskList[action.payload.catIndex].cat_list.slice(action.payload.taskIndex + 1)
                        ]
                    },
                    ...taskList.slice(action.payload.catIndex + 1)
                ]

            case 'EDIT_TASK_DATE_TIME':
                return [
                    ...taskList.slice(0, action.payload.catIndex),
                    {
                        ...taskList[action.payload.catIndex],
                        cat_list: [
                            ...taskList[action.payload.catIndex].cat_list.slice(0, action.payload.taskIndex),
                            {
                                ...taskList[action.payload.catIndex].cat_list[action.payload.taskIndex],
                                date: action.payload.date,
                                time: action.payload.time
                            },
                            ...taskList[action.payload.catIndex].cat_list.slice(action.payload.taskIndex + 1)
                        ]
                    },
                    ...taskList.slice(action.payload.catIndex + 1)
                ]

            default:
                return taskList;
        }
    }

    const [taskList, taskListDispatch] = useReducer(taskListReducer, initTaskList, initializer);

    const taskListHandle = {
        addCat() {
            taskListDispatch({
                type: 'ADD_CAT'
            })
        },

        deleteCat(catIndex) {
            taskListDispatch({
                type: 'DELETE_CAT',
                payload: {
                    catIndex
                }
            })
        },

        addTask(catIndex, taskValue) {
            taskListDispatch({
                type: 'ADD_TASK',
                payload: {
                    catIndex,
                    taskValue
                }
            })
        },

        deleteTask(catIndex, taskIndex) {
            taskListDispatch({
                type: 'DELETE_TASK',
                payload: {
                    catIndex,
                    taskIndex
                }
            })
        },

        markDoneTask(catIndex, taskIndex) {
            taskListDispatch({
                type: 'MARK_DONE_TASK',
                payload: {
                    catIndex,
                    taskIndex
                }
            })
        },

        editTask(catIndex, taskIndex, newValue) {
            taskListDispatch({
                type: 'EDIT_TASK',
                payload: {
                    catIndex,
                    taskIndex,
                    newValue
                }
            })
        },

        editTaskBgColor(catIndex, taskIndex, newColor) {
            taskListDispatch({
                type: 'EDIT_TASK_BG_COLOR',
                payload: {
                    catIndex,
                    taskIndex,
                    newColor
                }
            })
        },

        editTaskDescription(catIndex, taskIndex, descriptionValue) {
            taskListDispatch({
                type: 'EDIT_TASK_DESCRIPTION',
                payload: {
                    catIndex,
                    taskIndex,
                    descriptionValue
                }
            })
        },

        openDateTimeModal(catIndex, taskIndex) {
            setDate(() => {
                let targetTaskDate = taskList[catIndex].cat_list[taskIndex].date;
                if (targetTaskDate === null){
                    return new Date();
                }
                return new Date(
                    targetTaskDate.year,
                    targetTaskDate.month,
                    targetTaskDate.day
                )
            });
            setTime(taskList[catIndex].cat_list[taskIndex].time);

            setToggleModal(true);
            setTargetIndex({
                catIndex,
                taskIndex
            });
        }
    }

    function activateAddCatInput(e) {
        setAddCatActive(true);
        setTimeout(() => {
            addCatInput.current.focus();
        }, 0);
    }

    function deactivateAddCatInput(e) {
        if (!addCatInputSection.current.contains(e.target)) {
            setAddCatActive(false);
            setCatInput('');
        }
    }

    function setTaskDateTime() {
        setToggleModal(false);
        taskListDispatch({
            type: 'EDIT_TASK_DATE_TIME',
            payload: {
                ...targetIndex,
                date: {
                    day: date.getDate(),
                    month: date.getMonth(),
                    year: date.getFullYear()
                },
                time
            }
        })
    }

    // Trigger deactivateAddCatInput when click outside
    useEffect(() => {
        window.addEventListener('click', deactivateAddCatInput);

        return () => {
            window.removeEventListener('click', deactivateAddCatInput);
        }
    }, [])


    // Save taskList to localStorage
    useEffect(() => {
        const tasklistJSON = JSON.stringify(taskList);
        localStorage.setItem('taskList', tasklistJSON);
    }, [taskList])


    return (
        <div className="App">
            <div className="wrapper">
                <div className="header">
                    <div className='header_page-name'>Personal Task Management</div>
                    <div className="header_search-wrapper">
                        <FontAwesomeIcon className='header_search-icon' icon={faMagnifyingGlass} />
                        <input type="text" placeholder='Search for tasks ...' spellCheck='false'/>
                    </div>
                    <FontAwesomeIcon className='header_setting-icon' icon={faGear} />
                </div>
                <div className="tasklist-section">
                    {taskList.map((category, index) => (
                        <Category
                            key={category.cat_name}
                            catIndex={index}
                            cat_name={category.cat_name}
                            cat_list={category.cat_list}
                            taskListHandle={taskListHandle}
                        />
                    ))}
                    <div ref={addCatInputSection} className="add-section add-cat-section">
                        <div 
                            className={addCatActive ? "add-activate-btn add-cat-activate-btn add-activate-btn--inactive" : "add-activate-btn add-cat-activate-btn"} 
                            onClick={activateAddCatInput}
                        >
                            <FontAwesomeIcon 
                                icon={faPlus}
                                className="add-activate_icon"
                            />
                            <span>Add a new category</span>
                        </div>
                        <div className={addCatActive ? "add-input-section add-cat-input-section" : "add-input-section add-cat-input-section add-input-section--inactive"}>
                            <input
                                className='add-input'
                                value={catInput}
                                ref={addCatInput}
                                type="text"
                                spellCheck='false'
                                placeholder='Enter category name...'
                                onChange={(e) => setCatInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.keyCode === 13) {
                                        taskListHandle.addCat();
                                    }
                                }}
                            />
                            <button 
                                className='add-btn'
                                onClick={taskListHandle.addCat}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
                {toggleModal && <div className="date-and-time-modal" onClick={e => {setTaskDateTime();e.stopPropagation()}}>
                    <div className="date-and-time-modal_container" onClick={e => {e.stopPropagation()}}>
                        <div className="date-and-time-modal_half">
                            <div className="date-and-time-modal_half_title">
                                Date
                            </div>
                            <Calendar 
                                value={date}
                                onChange={setDate}
                            />
                        </div>
                        <div className="date-and-time-modal_half">
                            <div className="date-and-time-modal_half_title">
                                Time
                            </div>
                            <TimePicker
                                value={time}
                                amPmAriaLabel="Select AM/PM"
                                format="h:m a"
                                clockIcon={<FontAwesomeIcon icon={faClock} />}
                                clearIcon={<FontAwesomeIcon icon={faXmark} className='x-mark'/>}
                                onChange={setTime}
                            />
                        </div>
                        <div className="date-and-time-modal_save-btn" onClick={setTaskDateTime}>Save</div>
                    </div>
                </div>}
            </div>
        </div>
    );
}

export default App;