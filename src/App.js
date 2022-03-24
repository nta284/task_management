import React, { useState, useEffect } from 'react';
import './App.scss';
import Category from './Category';

function App() {
    const [todo, setTodo] = useState('');
    const [todos, setTodos] = useState([
        {
            name: "General",
            category_list: []
        },
        {
            name: "Food",
            category_list: []
        }
    ]);
    const [cat, setCat] = useState("General");

    const handleClick = () => {
        if (todo !== '') {
            
            setTodos(prev => {
                let currentCat = prev.find((ele) => {
                    return ele.name === cat;
                })
                console.log(prev[prev.indexOf(currentCat)].category_list);
                prev[prev.indexOf(currentCat)].category_list.push(todo);
                console.log(prev[prev.indexOf(currentCat)].category_list);

                return prev;
            });
        }
        // setTodo('');
    }

    return (
        <div className="App">
            <div className="wrapper">
                <h3>To-Do List</h3>
                <div className="input-wrapper">
                    <input
                        value={todo}
                        onChange={e => setTodo(e.target.value)}
                        type="text" 
                    />
                    <select onChange={(e) => {setCat(e.target.value)}} name="category" id="">
                        <option value="General">Chung</option>
                        <option value="Food">Food</option>
                    </select>
                    <button 
                        className='add-btn'
                        onClick={handleClick}
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
