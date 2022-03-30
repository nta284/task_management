import React, { useState, useEffect, useReducer } from 'react';
import './App.scss';
import Category from './Category';

function App() {
    const [cat, setCat] = useState('');
    const [currentCat, setCurrentCat] = useState('Chung');

    const [todo, setTodo] = useState('');

    // useReducer for todos
    const initTodos = [];

    function initializer() {
        const todolistStorage = localStorage.getItem('todoList');

        return JSON.parse(todolistStorage) ?? [
            {
                cat_name: "Chung",
                cat_list: []
            }
        ]
    }

    function todosReducer(todos, action) {
        let newTodos = [...todos];

        switch(action.type) {
            case 'ADD_CAT':
                if (cat !== '' && !todos.some(todo => todo.cat_name === cat)) {
                    setCat('');
                    setCurrentCat(cat);
        
                    return [
                        ...todos,
                        {
                            cat_name: cat,
                            cat_list: []
                        }
                    ]
                }
                else {
                    return newTodos;
                }

            case 'DELETE_CAT':
                return todos.filter((ele, index) => {
                    return index !== action.catIndex;
                })

            case 'ADD_TODO':
                if (todo !== '') {
                    let newTodos = [...todos];
                    let targetCat = todos.find(ele => ele.cat_name === currentCat);
                    let newTodo = {
                        todo_name: todo,
                        isDone: false,
                        isDeleted: false
                    }
                    setTodo('');
                    
                    newTodos[newTodos.indexOf(targetCat)].cat_list.push(newTodo);
                    return newTodos;
                }
                else {
                    return newTodos;
                }

            case 'DELETE_TODO':
                newTodos[action.catIndex].cat_list[action.todoIndex].isDeleted = !newTodos[action.catIndex].cat_list[action.todoIndex].isDeleted;
                return newTodos;

            case 'MARK_DONE_TODO':
                newTodos[action.catIndex].cat_list[action.todoIndex].isDone = !newTodos[action.catIndex].cat_list[action.todoIndex].isDone;
                return newTodos;

            default:
                return newTodos;
        }
    }

    const [todos, todosDispatch] = useReducer(todosReducer, initTodos, initializer);


    function addCat() {
        todosDispatch({
            type: 'ADD_CAT'
        })
    }

    function deleteCat(catIndex) {
        todosDispatch({
            type: 'DELETE_CAT',
            catIndex
        })
    }

    function addTodo() {
        todosDispatch({
            type: 'ADD_TODO'
        })
    }

    function deleteTodo(catIndex, todoIndex) {
        todosDispatch({
            type: 'DELETE_TODO',
            catIndex,
            todoIndex
        })
    }

    function markDoneTodo(catIndex, todoIndex) {
        todosDispatch({
            type: 'MARK_DONE_TODO',
            catIndex,
            todoIndex
        })
    }

    useEffect(() => {
        const todolistJSON = JSON.stringify(todos);
        localStorage.setItem('todoList', todolistJSON);
    }, [todos])

    useEffect(() => {
        if (!todos.some(todo => todo.cat_name === currentCat) && todos.length > 0) {
            setCurrentCat(todos[0].cat_name);
        }
    }, [todos, currentCat])

    return (
        <div className="App">
            <div className="background"></div>
            <div className="wrapper">
                <div className="addtodo-section">
                    <h3>Personal Task Manager</h3>
                    <div className="todo-input-wrapper">
                        <input
                            value={todo}
                            placeholder="Thêm việc cần làm"
                            onChange={e => setTodo(e.target.value)}
                            onKeyDown={e => {
                                if (e.keyCode === 13) {
                                    addTodo();
                                }
                            }}
                        />
                        <button 
                            className='add-btn'
                            onClick={addTodo}
                        >
                            Thêm
                        </button>
                    </div>
                    <h4>Danh sách danh mục:</h4>
                    <div className="cat-input-wrapper">
                        <input
                            value={cat}
                            placeholder="Thêm danh mục mới"
                            onChange={e => {setCat(e.target.value)}}
                            onKeyDown={e => {
                                if (e.keyCode === 13) {
                                    addCat();
                                }
                            }}
                        />
                        <button className='addcat-btn' onClick={addCat}>
                            Thêm danh mục
                        </button>
                    </div>
                    <div className="cat-list">
                        {todos.map((todo, index) => {
                            let isSelecting = currentCat === todo.cat_name;
                            return (
                                <div 
                                    key={index}
                                    className={isSelecting ? "cat-select cat-select--selecting" : "cat-select"}
                                    onClick={() => {setCurrentCat(todo.cat_name)}}
                                >
                                    <div className="cat-select-name">{todo.cat_name}</div>
                                    <div className="cat-select-box">
                                        <div 
                                            className={isSelecting ? "cat-select-dot cat-select-dot--selecting" : "cat-select-dot"}
                                        >
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="todolist-section">
                    <>
                        {todos.map((category, index) => (
                            <Category
                                key={index}
                                catIndex={index}
                                cat_name={category.cat_name}
                                cat_list={category.cat_list}
                                handleDeleteCat={deleteCat}
                                handleDeleteTodo={deleteTodo}
                                handleMarkDoneTodo={markDoneTodo}
                            />
                        ))}
                    </>
                </div>
            </div>
        </div>
    );
}

export default App;