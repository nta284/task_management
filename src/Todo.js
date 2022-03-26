import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import './Todo.scss';

export default function Todo(props) {
    const {
        todoIndex,
        isDone,
        backgroundColor,
        children,
        handleDelete,
        handleMarkDone
    } = props;

    function onDeleteTodo() {
        handleDelete(todoIndex);
    }

    function onMarkDoneTodo() {
        handleMarkDone(todoIndex)
    }

    return (
        <div 
            className={isDone ? "todo todo--done" : "todo"}
            style={{backgroundColor: backgroundColor}}
        >
            <span className="todo_name">{children}</span>
            <div className="todo_icon-section">
                <FontAwesomeIcon
                    icon={faTrashCan}
                    className="todo-icon todo-delete-icon"
                    onClick={onDeleteTodo}
                />
                <FontAwesomeIcon
                    icon={faClipboardCheck}
                    className="todo-icon todo-done-icon"
                    onClick={onMarkDoneTodo}
                />
            </div>
        </div>
    )
}