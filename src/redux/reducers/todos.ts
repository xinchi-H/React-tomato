import {ADD_TODO} from '../actionTypes'

export default (state = [], action: any): any => {
    switch (action.type) {
        case ADD_TODO:
            return [state, ...action.paylaod];
        default:
            return state
    }
}