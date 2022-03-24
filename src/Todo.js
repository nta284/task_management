import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import './Todo.scss';

export default function Todo(props) {
    const { index, backgroundColor, children, handleDelete } = props;

    const [done, setDone] = useState(false);

    function onDeleteTodo(index) {
        handleDelete(index);
    }

    return (
        <div 
            className={done ? "todo todo--done" : "todo"}
            style={{backgroundColor: backgroundColor}}
        >
            <span className="todo_name">{children}</span>
            <FontAwesomeIcon 
                icon={faTrashCan}
                className="delete-icon"
                onClick={() => onDeleteTodo(index)}
            />
            <FontAwesomeIcon 
                icon={faClipboardCheck}
                className="done-icon"
                onClick={() => {setDone(!done)}}
            />
        </div>
    )
}