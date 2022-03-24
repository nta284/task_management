import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import './Todo.scss';

export default function Todo(props) {
    const { backgroundColor, children } = props;

    const [done, setDone] = useState(false);

    return (
        <div 
            className={done ? "todo todo--done" : "todo"}
            style={{backgroundColor: backgroundColor}}
        >
            <span className="todo_name">{children}</span>
            <FontAwesomeIcon 
                icon={faClipboardCheck}
                className="done-icon"
                onClick={() => {setDone(!done)}}
            />
        </div>
    )
}