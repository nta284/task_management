import React from 'react';
import './Category.scss';
import Todo from './Todo';

export default function Category(props) {
    const { name, list } = props;

    const colors = [
        "#7A0BC0",
        "#11999E",
        "#FF5713",
        "#4D77FF"
    ]

    return (
        <div className="category">
            <h2 className='category_name'>{name}</h2>
            <div>
                {list.map((ele, index) => (
                    <Todo 
                        key={index}
                        className='todo'
                        backgroundColor={colors[index % 4]}
                    >
                        {ele}
                    </Todo>
                ))}
            </div>
        </div>
    )
}
