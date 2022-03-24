import React, { useState, useEffect } from 'react';
import './App.scss';
import Category from './Category';

function App() {
    const [cat, setCat] = useState('');
    const [catList, setCatList] = useState(['Chung']);
    const [currentCat, setCurrentCat] = useState('Chung');

    const [todo, setTodo] = useState('');
    const [todos, setTodos] = useState(() => {
        const todolistStorage = localStorage.getItem('todolist');
        return [
            {
                name: "Chung",
                category_list: []
            }
        ];

        // return JSON.parse(todolistStorage) ?? [
        //     {
        //         name: "Chung",
        //         category_list: []
        //     },
        //     {
        //         name: "Bài tập",
        //         category_list: []
        //     },
        //     {
        //         name: "Chung",
        //         category_list: []
        //     },
        //     {
        //         name: "Bài tập",
        //         category_list: []
        //     }
        // ]
    });

    function addCat() {
        if (cat !== '') {
            setCatList(prev => [...prev, cat]);
            setCat('');
        }
    }

    const addTodo = () => {
        if (todo !== '') {
            setTodos(prev => {
                let targetCat = prev.find(ele => ele.name === currentCat);

                prev[prev.indexOf(targetCat)].category_list.push(todo);

                return prev;
            })
        }
        setTodo('');
    }

    // useEffect(() => {
    //     const todolistJSON = JSON.stringify(todos);

    //     localStorage.setItem('todolist', todolistJSON);
    // })

    function deleleTodo(catIndex, todoIndex) {
        console.log(catIndex, todoIndex);

        let newTodos = [...todos];

        newTodos[catIndex].category_list.splice(todoIndex, 1);

        setTodos(newTodos);
    }

    return (
        <div className="App">
            <div className="background"></div>
            <div className="wrapper">
                <div className="addtodo-section">
                    <h3>To-Do List</h3>
                    <div className="todo-input-wrapper">
                        <input
                            value={todo}
                            onChange={e => setTodo(e.target.value)}
                        />
                        <select onChange={e => {setCurrentCat(e.target.value)}} name="" id="">
                            {catList.map((cat, index) => (
                                <option
                                    key={index}
                                    value={cat}
                                >
                                    {cat}
                                </option>
                            ))}
                        </select>
                        <button 
                            className='add-btn'
                            onClick={addTodo}
                        >
                            Thêm
                        </button>
                    </div>
                    <div className="cat-input-wrapper">
                        <input
                            value={cat}
                            onChange={e => {setCat(e.target.value)}}
                        />
                        <button onClick={addCat}>
                            Thêm danh mục
                        </button>
                    </div>
                </div>
                <div className="todolist-section">
                    <>
                        {todos.map((category, index) => (
                            <Category
                                key={index}
                                catIndex={index}
                                name={category.name}
                                list={category.category_list}
                                handleDelete={deleleTodo}
                            />
                        ))}
                    </>
                </div>
            </div>
        </div>
    );
}

export default App;
