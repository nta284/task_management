import React, { useState, useEffect, useReducer, useRef, useContext } from 'react';
import './App.scss';
import Category from './components/Category';
import { taskColors } from './colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faPlus, faClock, faXmark } from '@fortawesome/free-solid-svg-icons';
import Calendar from 'react-calendar';
import TimePicker from 'react-time-picker/dist/entry.nostyle';
import './components/Calendar-and-Clock.scss';
import { SettingsContext } from './context/SettingsContext';
import { nanoid } from 'nanoid';
import Header from './components/Header';

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

    const { lang } = useContext(SettingsContext);

    // useReducer for taskList
    const initTaskList = [];

    function initializer() {
        const taskListStorage = JSON.parse(localStorage.getItem('taskList'));

        // if (taskListStorage !== null && taskListStorage[0].id === null) {
        //     return taskListStorage.map(cat => {
        //         return {
        //             id: nanoid(),
        //             cat_name: cat.cat_name,
        //             cat_list: cat.cat_list.map(task => {
        //                 return {
        //                     ...task,
        //                     id: nanoid()
        //                 }
        //             })
        //         }
        //     })
        // }
        // else {
        //     return [
        //         {
        //             id: nanoid(),
        //             cat_name: "Chung",
        //             cat_list: []
        //         }
        //     ]
        // }

        return taskListStorage ?? [
            {
                id: nanoid(),
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
                if (catInput !== '') {
                    setCatInput('');
        
                    return [
                        ...taskList,
                        {
                            id: nanoid(),
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
                                id: nanoid(),
                                task_name: action.payload.taskValue,
                                isDone: false,
                                isDeleted: false,
                                bgColor: taskColors[Math.floor(Math.random() * taskColors.length)],
                                description: '',
                                date: null,
                                time: null,
                                deadline: null
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

        dateTimeHandling(catIndex, taskIndex, action) {
            setTargetIndex({
                catIndex,
                taskIndex
            });

            if (action === 'SET_DATE') {
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
    
                setToggleModal(true);
            }
            else if (action === 'SET_TIME') {
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
                setTime(() => {
                    if (!taskList[catIndex].cat_list[taskIndex].time) {
                        return '12:00';
                    }
                    return taskList[catIndex].cat_list[taskIndex].time;
                });
    
                setToggleModal(true);
            }
            else if (action === 'CLEAR_DATE' || action === 'CLEAR_TIME') {
                setTime(null);
                setTaskDateTime(action, catIndex, taskIndex);
            }
        }
    }

    function setTaskDateTime(action, catIndex, taskIndex) {
        if (action === 'SET') {
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
        else if (action === 'CLEAR_DATE') {
            taskListDispatch({
                type: 'EDIT_TASK_DATE_TIME',
                payload: {
                    catIndex,
                    taskIndex,
                    date: null,
                    time: null
                }
            })
        }
        else if (action === 'CLEAR_TIME') {
            taskListDispatch({
                type: 'EDIT_TASK_DATE_TIME',
                payload: {
                    catIndex,
                    taskIndex,
                    date: taskList[catIndex].cat_list[taskIndex].date,
                    time: null
                }
            })
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

    // Trigger deactivateAddCatInput when click outside
    useEffect(() => {
        window.addEventListener('click', deactivateAddCatInput);

        return () => {
            window.removeEventListener('click', deactivateAddCatInput);
        }
    }, [])


    // Save taskList to localStorage
    useEffect(() => {
        const stringnifiedTaskList = JSON.stringify(taskList);
        localStorage.setItem('taskList', stringnifiedTaskList);
    }, [taskList])


    return (
        <div className="App">
            <div className="wrapper">
                <Header />
                <div className="tasklist-section">
                    {taskList.map((category, index) => (
                        <Category
                            key={category.id}
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
                            <span>{lang === 'VN' ? 'Thêm danh mục mới' : 'Add a new category'}</span>
                        </div>
                        <div className={addCatActive ? "add-input-section add-cat-input-section" : "add-input-section add-cat-input-section add-input-section--inactive"}>
                            <input
                                className='add-input'
                                value={catInput}
                                ref={addCatInput}
                                type="text"
                                spellCheck='false'
                                placeholder={lang === 'VN' ? 'Nhập tên danh mục...' : 'Enter category name...'}
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
                                {lang === 'VN' ? 'Thêm' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
                {toggleModal && <div className="date-and-time-modal" onClick={e => {setTaskDateTime('SET');e.stopPropagation()}}>
                    <div className="date-and-time-modal_container" onClick={e => {e.stopPropagation()}}>
                        <div className="date-and-time-modal_half">
                            <div className="date-and-time-modal_half_title">
                                {lang === 'VN' ? 'Ngày' : 'Date'}
                            </div>
                            <Calendar 
                                value={date}
                                onChange={setDate}
                            />
                        </div>
                        <div className="date-and-time-modal_half">
                            <div className="date-and-time-modal_half_title">
                                {lang === 'VN' ? 'Giờ (Không bắt buộc)' : 'Time (Optional)'}
                            </div>
                            <TimePicker
                                value={time}
                                clockIcon={<FontAwesomeIcon icon={faClock} />}
                                clearIcon={<FontAwesomeIcon icon={faXmark} className='x-mark'/>}
                                onChange={setTime}
                            />
                        </div>
                        <div className="date-and-time-modal_save-btn" onClick={() => setTaskDateTime('SET')}>
                            {lang === 'VN' ? 'Lưu' : 'Save'}
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    );
}

export default App;