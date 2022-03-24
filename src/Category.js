import React, { useEffect, useState } from 'react';
import './Category.scss';
import Todo from './Todo';

export default function Category(props) {
    const { catIndex, name, list, handleDelete } = props;

    const colors = [
        "#7A0BC0",
        "#11999E",
        "#FF5713",
        "#4D77FF",
        "#69b469"
    ]

    function onDeleteCatTodo(todoIndex) {
        handleDelete(catIndex, todoIndex);
    }


    return (
        <div className="category">
            <h2 className='category_name'>{name}</h2>
            <div className='category_list'>
                {list.map((ele, index) => (
                    <Todo
                        key={index}
                        todoIdex={index}
                        className='todo'
                        backgroundColor={colors[index % 5]}
                        handleDelete={() => onDeleteCatTodo(index)}
                    >
                        {ele}
                    </Todo>
                ))}
            </div>
        </div>
    )
}
