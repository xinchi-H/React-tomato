import {ADD_TODO} from './actionTypes'

export const addTodo = (payload: any) => {
    return {
        payload,
        type:ADD_TODO,
    }
};