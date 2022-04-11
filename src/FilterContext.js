import { useState, createContext } from "react";

const FilterContext = createContext();

function FilterProvider({ children }) {
    const [isDeleted, setIsDeleted] = useState(false);
    const [isDone, setIsDone] = useState(null);
    const [keyword, setKeyWord] = useState('');

    const filterOptions = {
        isDeleted,
        isDone,
        keyword
    }
    
    for (const [key, value] of Object.entries(filterOptions)) {
        if (value === null) {
            delete filterOptions[key];
        }
    }

    const filterContext = {
        filterMenu: {
            isDeleted,
            isDone,
            changeIsDeleted() {
                setIsDeleted(!isDeleted);
            }
        },

        catListFilter(task) {
            let filtering = true;
    
            for (const [key, value] of Object.entries(filterOptions)) {
                if (key === 'isDone' || key === 'isDeleted') {
                    filtering = filtering && task[key] === value;
                }
                else if (key === 'keyword') {
                    filtering = filtering && task.task_name.includes(value);
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