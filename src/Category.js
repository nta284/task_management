import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTrashCan, faCheck } from '@fortawesome/free-solid-svg-icons';
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
        "linear-gradient(90deg, #ff5f5f, #ff2a2a)",
        "linear-gradient(90deg, #9b06d6, #8E05C2)",
        "linear-gradient(90deg, #71ac65, #4E9F3D)",
        "linear-gradient(90deg, #4e5157, #454a52)",
        "linear-gradient(90deg, #eea526, #e79b18)",
        "linear-gradient(90deg, #0a8cd8, #0087d4)",
        "linear-gradient(90deg, #eb4f7b, #eb4a77)"
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
                <div className="category_heading_progress">
                    <div className="category_heading_progress-text">
                        <span>
                            {cat_list.filter(todo => !todo.isDeleted && todo.isDone).length}
                        </span>
                        <span>/</span>
                        <span>
                            {cat_list.filter(todo => !todo.isDeleted).length}
                        </span>
                    </div>
                    <FontAwesomeIcon 
                        icon={faCheck}
                        className="category_heading_progress-check"
                    />
                </div>
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
                                backgroundColor={colors[index % 7]}
                                isDone={todo.isDone}
                                handleDelete={() => onDeleteCatTodo(index)}
                                handleMarkDone={() => onMarkDoneTodo(index)}
                            >
                                {todo.todo_name}
                            </Todo>
                        )
                    }
                    return <></>;
                })}
            </div>
        </div>
    )
}
