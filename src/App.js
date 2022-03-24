import React, { useState, useEffect } from 'react';
import './App.scss';
import Category from './Category';

function App() {
    const [todo, setTodo] = useState('');
    const [cat, setCat] = useState('General');
    const [todos, setTodos] = useState(() => {
        const todolistStorage = localStorage.getItem('todolist');

        return JSON.parse(todolistStorage) ?? [
            {
                name: "General",
                category_list: []
            },
            {
                name: "Homework",
                category_list: []
            }
        ]
    });

    const addTodo = () => {
        if (todo !== '') {
            setTodos(prev => {
                let currentCat = prev.find(ele => ele.name === cat);

                prev[prev.indexOf(currentCat)].category_list.push(todo);

                return prev;
            })
        }
        setTodo('');
    }

    useEffect(() => {
        const todolistJSON = JSON.stringify(todos);

        localStorage.setItem('todolist', todolistJSON);

    })

    return (
        <div className="App">
            <div className="background"></div>
            <div className="wrapper">
                <h3>To-Do List</h3>
                <div className="input-wrapper">
                    <input
                        value={todo}
                        onChange={e => setTodo(e.target.value)}
                        type="text" 
                    />
                    <select onChange={e => {setCat(e.target.value)}} name="" id="">
                        <option value="General">General</option>
                        <option value="Homework">Homework</option>
                    </select>
                    <button 
                        className='add-btn'
                        onClick={addTodo}
                    >
                        Add
                    </button>
                </div>
                <div className='todolist'>
                    {todos.map((category, index) => (
                        <Category
                            key={index}
                            name={category.name}
                            list={category.category_list}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
