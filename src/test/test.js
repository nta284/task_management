import { nanoid } from 'nanoid';
import { taskColors } from '../colors';

const taskList = [
    {
        id: nanoid(),
        cat_name: 'Chung',
        cat_list: [
            {
                id: nanoid(),
                task_name: 'Task 1',
                isDone: false,
                isDeleted: false,
                bgColor: taskColors[Math.floor(Math.random() * taskColors.length)],
                description: '',
                date: null,
                time: null,
                deadline: 'normal'
            }
        ]
    }
]