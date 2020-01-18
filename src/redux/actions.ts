import {ADD_TODO,INIT_TODOS,UPDATE_TODO,EDIT_TODO} from './actionTypes'

export const addTodo = (payload: any) => {
    return {
        payload,
        type: ADD_TODO,
    }
};

export const initTodos = (payload: any[]) => {
    return{
        payload,
        type: INIT_TODOS,
    }
};

export const updateTodo = (payload: any) => {
    return{
        payload,
        type: UPDATE_TODO,
    }
};

export const editTodo = (payload: number) => {
    return{
        payload,
        type: EDIT_TODO,
    }
};