import { useState, createContext } from "react";

const FilterContext = createContext();

function FilterProvider({ children }) {
    const [isDeleted, setIsDeleted] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [isDone, setIsDone] = useState(null);
    const [deadline, setDeadline] = useState(null);

    const filterOptions = {
        isDeleted,
        keyword,
        isDone,
        deadline
    }
    
    for (const [key, value] of Object.entries(filterOptions)) {
        if (value === null) {
            delete filterOptions[key];
        }
    }

    const filterContext = {
        filterMenu: {
            isDeleted,
            keyword,
            isDone,
            deadline,
            changeIsDeleted() {
                setIsDeleted(!isDeleted);
            },
            setKeyword,
            setIsDone,
            setDeadline
        },

        catListFilter(task) {
            let filtering = true;
    
            for (const [key, value] of Object.entries(filterOptions)) {
                if (key === 'isDone' || key === 'isDeleted') {
                    filtering = filtering && task[key] === value;
                }
                else if (key === 'keyword') {
                    filtering = filtering && task.task_name.toLowerCase().includes(value.toLowerCase());
                }
            }
    
            return filtering;
        }
    }

    return (
        <FilterContext.Provider value={filterContext}>
            {children}
        </FilterContext.Provider>
    )
}

export { FilterProvider, FilterContext };