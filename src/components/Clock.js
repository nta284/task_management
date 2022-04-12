import React, { useEffect, useState } from 'react';
import './Clock.scss';

export default function Clock() {
    const [time, setTime] = useState(new Date());
    let minute = time.getMinutes().toString();
    minute = minute.length === 1 ? `0${minute}` : minute;

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timeInterval);
        }
    }, [])

    return (
        <div className='header_clock'>
            <div className="header_clock_time">
                <span>{`${time.getHours()}:${minute}`}</span>
            </div>
            <div className="header_clock_date">
                <span>{`${time.getDate()}/${time.getMonth()}/${time.getFullYear()}`}</span>
            </div>
        </div>
    )
}
