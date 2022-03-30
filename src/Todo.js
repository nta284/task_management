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

    return (
        <div 
            className={isDone ? "todo todo--done" : "todo"}
            style={{background: backgroundColor}}
        >
            <span className="todo_name">{children}</span>
            <div className="todo_icon-section">
                <FontAwesomeIcon
                    icon={faTrashCan}
                    className="todo-icon todo-delete-icon"
                    onClick={() => handleDelete(todoIndex)}
                />
                <FontAwesomeIcon
                    icon={faClipboardCheck}
                    className="todo-icon todo-done-icon"
                    onClick={() => handleMarkDone(todoIndex)}
                />
            </div>
        </div>
    )
}