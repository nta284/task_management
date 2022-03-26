import React, { useState, useEffect } from 'react';
import './App.scss';
import Category from './Category';

function App() {
    const [cat, setCat] = useState('');
    const [currentCat, setCurrentCat] = useState('Chung');

    const [todo, setTodo] = useState('');
    const [todos, setTodos] = useState(() => {
        const todolistStorage = localStorage.getItem('todoList');

        return JSON.parse(todolistStorage) ?? [
            {
                cat_name: "Chung",
                cat_list: []
            }
        ]
    });

    function addCat() {
        if (cat !== '') {
            setCat('');

            setTodos(prev => [
                ...prev,
                {
                    cat_name: cat,
                    cat_list: []
                }
            ])

            setCurrentCat(cat);
        }
    }

    function addTodo() {
        if (todo !== '') {
            let newTodos = [...todos];
            let targetCat = todos.find(ele => ele.cat_name === currentCat);
            let newTodo = {
                todo_name: todo,
                isDone: false,
                isDeleted: false
            }

            newTodos[newTodos.indexOf(targetCat)].cat_list.push(newTodo);
            setTodos(newTodos);
        }
        setTodo('');
    }

    function deleteTodo(catIndex, todoIndex) {
        let newTodos = [...todos];

        newTodos[catIndex].cat_list[todoIndex].isDeleted = !newTodos[catIndex].cat_list[todoIndex].isDeleted;

        setTodos(newTodos);
    }

    function deleteCat(catIndex) {
        setTodos(prev => prev.filter((ele, index) => {
            return index !== catIndex;
        }))
    }

    function markDoneTodo(catIndex, todoIndex) {
        let newTodos = [...todos];

        newTodos[catIndex].cat_list[todoIndex].isDone = !newTodos[catIndex].cat_list[todoIndex].isDone;

        setTodos(newTodos);
    }

    useEffect(() => {
        const todolistJSON = JSON.stringify(todos);
        localStorage.setItem('todoList', todolistJSON);
    })

    return (
        <div className="App">
            <div className="background"></div>
            <div className="wrapper">
                <div className="addtodo-section">
                    <h3>To-Do List</h3>
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
                    
                    {/* <select onChange={e => {setCurrentCat(e.target.value)}} value={currentCat} name="" id="">
                        {todos.map((todo, index) => (
                            <option
                                key={index}
                                value={todo.name}
                            >
                                {todo.name}
                            </option>
                        ))}
                    </select> */}
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
                    <div className="cat-section">
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
                                handleDeleteTodo={deleteTodo}
                                handleDeleteCat={deleteCat}
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