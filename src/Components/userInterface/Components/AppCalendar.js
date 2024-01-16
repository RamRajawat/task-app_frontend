import { useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function AppCalendar(props) {

    useEffect(function () {
        var date = new Date();
        props.setDeadline(date);
    }, [])

    const handleDateChange = (date) => {
        props.setDeadline(date);
    }

    const dateIsPastOrToday = (date) => {
        const today = new Date();
        return date < today;
    };

    return (
        <div>
            <div className='calendar-container'>
                <Calendar
                    onChange={handleDateChange}
                    value={props.deadline}
                    tileDisabled={({ date }) => dateIsPastOrToday(date)}
                />
            </div>
        </div>
    );
}
