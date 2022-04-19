import React, { useState, useEffect, useReducer, useRef, useContext } from 'react';
import './App.scss';
import Header from './layouts/Header';
import Category from './components/Category';
import './components/Calendar-and-Clock.scss';
import Calendar from 'react-calendar';
import TimePicker from 'react-time-picker/dist/entry.nostyle';
import { taskColors } from './colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faPlus, faClock, faXmark } from '@fortawesome/free-solid-svg-icons';
import { nanoid } from 'nanoid';
import { SettingsContext } from './context/SettingsContext';

function App() {
    const [catInput, setCatInput] = useState('');
    const [addCatActive, setAddCatActive] = useState(false);

    const [toggleModal, setToggleModal] = useState(false);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(null);
    const [targetIndex, setTargetIndex] = useState({
        catIndex: null,
        taskIndex: null
    })

    const [clock, setClock] = useState(new Date());
    const [clockMinute, setClockMinute] = useState(new Date().getMinutes());

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const addCatInput = useRef(null);
    const addCatInputSection = useRef(null);

    const { lang } = useContext(SettingsContext);

    // useReducer for taskList
    const initTaskList = [];

    function initializer() {
        const taskListStorage = JSON.parse(localStorage.getItem('taskList'));

        // if (taskListStorage !== null) {
        //     return taskListStorage.map(cat => {
        //         return {
        //             cat_name: cat.cat_name,
        //             cat_list: cat.cat_list.map(task => {
        //                 return {
        //                     ...task,
        //                     deadline: null
        //                 }
        //             })
        //         }
        //     })
        // }
        // else {
        //     return [
        //         {
        //             cat_name: "Chung",
        //             cat_list: []
        //         }
        //     ]
        // }

        const today = new Date();

        return taskListStorage ?? [
            {
                id: nanoid(),
                cat_name: "Demo",
                cat_list: [
                    {
                        id: nanoid(),
                        task_name: 'Công việc 1',
                        isDone: false,
                        isDeleted: false,
                        bgColor: taskColors[0],
                        description: '',
                        date: {
                            day: today.getDate() + 1,
                            month: today.getMonth(),
                            year: today.getFullYear()
                        },
                        time: null,
                        deadline: 'normal'
                    },
                    {
                        id: nanoid(),
                        task_name: 'Công việc 2',
                        isDone: false,
                        isDeleted: false,
                        bgColor: taskColors[5],
                        description: '',
                        date: {
                            day: today.getDate() + 2,
                            month: today.getMonth(),
                            year: today.getFullYear()
                        },
                        time: '08:00',
                        deadline: 'normal'
                    },
                    {
                        id: nanoid(),
                        task_name: 'Công việc 3',
                        isDone: false,
                        isDeleted: false,
                        bgColor: taskColors[2],
                        description: '',
                        date: null,
                        time: null,
                        deadline: 'normal'
                    }
                ]
            },
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
                    setTimeout(() => {
                        setCatInput('');
                        addCatInputSection.current.scrollIntoView();
                    }, 0);
                    
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

            case 'EDIT_CAT':
                return [
                    ...taskList.slice(0, action.payload.catIndex),
                    {
                        ...taskList[action.payload.catIndex],
                        cat_name: action.payload.newValue
                    },
                    ...taskList.slice(action.payload.catIndex + 1)
                ]

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
                                deadline: 'normal'
                            }
                        ]
                    },
                    ...taskList.slice(action.payload.catIndex + 1)
                ]

            case 'DELETE_RESTORE_TASK':
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

            case 'DELETE_TASK_PERMANENTLY':
                let newCatList = taskList[action.payload.catIndex].cat_list;
                newCatList = newCatList.filter((task, index) => index !== action.payload.taskIndex);

                return [
                    ...taskList.slice(0, action.payload.catIndex),
                    {
                        ...taskList[action.payload.catIndex],
                        cat_list: newCatList
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

            case 'EDIT_TASK_DEADLINE':
                return [
                    ...taskList.slice(0, action.payload.catIndex),
                    {
                        ...taskList[action.payload.catIndex],
                        cat_list: [
                            ...taskList[action.payload.catIndex].cat_list.slice(0, action.payload.taskIndex),
                            {
                                ...taskList[action.payload.catIndex].cat_list[action.payload.taskIndex],
                                deadline: action.payload.deadlineValue
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

        editCat(catIndex, newValue) {
            taskListDispatch({
                type: 'EDIT_CAT',
                payload: {
                    catIndex,
                    newValue
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

        deleteRestoreTask(catIndex, taskIndex) {
            taskListDispatch({
                type: 'DELETE_RESTORE_TASK',
                payload: {
                    catIndex,
                    taskIndex
                }
            })
        },

        deleteTaskPermanently(catIndex, taskIndex) {
            taskListDispatch({
                type: 'DELETE_TASK_PERMANENTLY',
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

            taskListDispatch({
                type: 'EDIT_TASK_DEADLINE',
                payload: {
                    catIndex,
                    taskIndex,
                    deadlineValue: 'normal'
                }
            })
            // console.log(action);

            switch (action) {
                case 'SET_DATE':
                    setDate(() => {
                        let targetTaskDate = taskList[catIndex].cat_list[taskIndex].date;
                        if (targetTaskDate === null){
                            console.log('No date');
                            return new Date();
                        }
                        // console.log(targetTaskDate);
                        return new Date(
                            targetTaskDate.year,
                            targetTaskDate.month,
                            targetTaskDate.day
                        )
                    });
        
                    // console.log('Toggle modal');
                    setToggleModal(true);
                    break;

                case 'SET_TIME':
                    setDate(() => {
                        let targetTaskDate = taskList[catIndex].cat_list[taskIndex].date;
                        if (targetTaskDate === null){
                            // console.log('No date');
                            return new Date();
                        }
                        console.log(targetTaskDate);
                        return new Date(
                            targetTaskDate.year,
                            targetTaskDate.month,
                            targetTaskDate.day
                            )
                        });
                    setTime(() => {
                        let targetTaskTime = taskList[catIndex].cat_list[taskIndex].time;
                        if (targetTaskTime === null) {
                            // console.log('No time');
                            return '12:00';
                        }
                        console.log(targetTaskTime);
                        return targetTaskTime;
                    });
        
                    setToggleModal(true);
                    break;

                case 'CLEAR_DATE':
                case 'CLEAR_TIME':
                    setTime(null);
                    setTaskDateTime(action, catIndex, taskIndex);
                    break;

                default:
                    break;
            }
        }
    }

    function setTaskDateTime(action, catIndex, taskIndex) {
        taskListDispatch({
            type: 'EDIT_TASK_DEADLINE',
            payload: {
                catIndex,
                taskIndex,
                deadlineValue: 'normal'
            }
        })

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

    function handleWindowResize() {
        setIsMobile(window.innerWidth <= 768);
    }

    // Window events
    useEffect(() => {
        window.addEventListener('click', deactivateAddCatInput);
        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('click', deactivateAddCatInput);
            window.removeEventListener('resize', handleWindowResize);
        }
    }, [])

    // Clock
    useEffect(() => {
        const timeInterval = setInterval(() => {
            setClock(new Date());
        }, 1000);

        return () => {
            clearInterval(timeInterval);
        }
    }, [])

    useEffect(() => {
        setClockMinute(clock.getMinutes());
    }, [clock])
    
    // Update deadline status of tasks
    useEffect(() => {
        // console.clear();
        taskList.forEach((cat, catIndex) => {
            for (let taskIndex = 0; taskIndex < cat.cat_list.length; taskIndex ++) {
                const { date, time, deadline } = cat.cat_list[taskIndex];

                if (date === null || deadline === 'late') {
                    continue;
                }
                else if (date !== null && deadline !== 'late') {
                    const { day, month, year } = date;

                    if (time === null) {
                        const due = new Date(year, month, day);

                        if (clock >= due) {
                            taskListDispatch({
                                type: 'EDIT_TASK_DEADLINE',
                                payload: {
                                    catIndex,
                                    taskIndex,
                                    deadlineValue: 'late'
                                }
                            })
                        }
                        else {
                            if (deadline !== 'soon') {
                                if (due - clock <= 86400000) {
                                    taskListDispatch({
                                        type: 'EDIT_TASK_DEADLINE',
                                        payload: {
                                            catIndex,
                                            taskIndex,
                                            deadlineValue: 'soon'
                                        }
                                    })
                                }
                                else {
                                    continue;
                                }
                            }
                            else {
                                continue;
                            }
                        }
                    }
                    else if (time !== null) {
                        const due = new Date(year, month, day, time.slice(0, 2), time.slice(3, 5));

                        if (clock >= due) {
                            taskListDispatch({
                                type: 'EDIT_TASK_DEADLINE',
                                payload: {
                                    catIndex,
                                    taskIndex,
                                    deadlineValue: 'late'
                                }
                            })
                        }
                        else {
                            if (deadline !== 'soon') {
                                if (due - clock <= 86400000) {
                                    taskListDispatch({
                                        type: 'EDIT_TASK_DEADLINE',
                                        payload: {
                                            catIndex,
                                            taskIndex,
                                            deadlineValue: 'soon'
                                        }
                                    })
                                }
                                else {
                                    continue;
                                }
                            }
                            else {
                                continue;
                            }
                        }
                    }
                }
            }
        })
    }, [clockMinute, taskList])


    // Save taskList to localStorage
    useEffect(() => {
        const stringnifiedTaskList = JSON.stringify(taskList);
        localStorage.setItem('taskList', stringnifiedTaskList);
    }, [taskList])


    return (
        <div className="App">
            <div className="wrapper">
                <Header isMobile={isMobile}/>
                <div className="tasklist-section">
                    {taskList.map((category, index) => (
                        <Category
                            key={category.id}
                            catIndex={index}
                            cat_name={category.cat_name}
                            cat_list={category.cat_list}
                            taskListHandle={taskListHandle}
                            isMobile={isMobile}
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
                {toggleModal && <div className="date-and-time-modal" onClick={e => {setTaskDateTime('SET', targetIndex.catIndex, targetIndex.taskIndex);e.stopPropagation()}}>
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
                        <div className="date-and-time-modal_save-btn" onClick={() => setTaskDateTime('SET', targetIndex.catIndex, targetIndex.taskIndex)}>
                            {lang === 'VN' ? 'Lưu' : 'Save'}
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    );
}

export default App;