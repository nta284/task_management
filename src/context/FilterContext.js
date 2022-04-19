import { useState, createContext, useEffect } from "react";

const FilterContext = createContext();

function FilterProvider({ children }) {
    const [isDeleted, setIsDeleted] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [isDone, setIsDone] = useState(null);
    const [deadline, setDeadline] = useState(null);

    const [searchFilterApplying, setSearchFilterApplying] = useState(false);

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

    useEffect(() => {
        setSearchFilterApplying(isDeleted === true || keyword !== '' || isDone !== null || deadline !== null);
    }, [deadline, isDeleted, isDone, keyword])

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
            setDeadline,
            searchFilterApplying
        },

        catListFilter(task) {
            let filtering = true;
    
            for (const [key, value] of Object.entries(filterOptions)) {
                if (key === 'isDone' || key === 'deadline' || key === 'isDeleted') {
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