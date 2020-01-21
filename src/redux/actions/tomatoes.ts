import {ADD_TOMATO, INIT_TOMATOES} from "../actionTypes";

export const addTomato = (payload: any) => {
    return{
        payload,
        type: ADD_TOMATO,
    }
};

export const initTomatoes = (payload: any[]) => {
    return{
        payload,
        type: INIT_TOMATOES,
    }
};