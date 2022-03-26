import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTrashCan } from '@fortawesome/free-solid-svg-icons';
import './Category.scss';
import Todo from './Todo';

export default function Category(props) {
    const {
        catIndex,
        cat_name,
        cat_list,
        handleDeleteTodo,
        handleDeleteCat,
        handleMarkDoneTodo
    } = props;

    const colors = [
        "#FF6D6D",
        "#844AFF",
        "#2BFF8C",
        "#ff9d41",
        "#1370FF",
        "#ec00d9"
    ]

    function onDeleteCatTodo(todoIndex) {
        handleDeleteTodo(catIndex, todoIndex);
    }

    function onDeleteCat() {
        handleDeleteCat(catIndex);
    }

    function onMarkDoneTodo(todoIndex) {
        handleMarkDoneTodo(catIndex, todoIndex);
    }

    return (
        <div className="category">
            <div className='category_heading'>
                <span className="category_name">
                    {cat_name}
                </span>
                <FontAwesomeIcon 
                    icon={faTrashCan}
                    className="todo-icon cat-delete-icon"
                    onClick={onDeleteCat}
                />
            </div>
            <div className='category_list'>
                {cat_list.map((todo, index) => {
                    if (!todo.isDeleted) {
                        return (
                            <Todo
                                key={index}
                                todoIndex={index}
                                className='todo'
                                backgroundColor={colors[index % 6]}
                                onClick={() => {console.log(index)}}
                                isDone={todo.isDone}
                                handleDelete={() => onDeleteCatTodo(index)}
                                handleMarkDone={() => onMarkDoneTodo(index)}
                            >
                                {todo.todo_name}
                            </Todo>
                        )
                    }
                })}
            </div>
        </div>
    )
}
