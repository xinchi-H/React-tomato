import {ADD_TOMATO,INIT_TOMATOES} from "../actionTypes";

export default (state:any[]=[],action)=>{
    switch (action.type) {
        case ADD_TOMATO:
            return [action.payload,...state];
        case INIT_TOMATOES:
            return [...action.payload];
        default:
            return state
    }
}
