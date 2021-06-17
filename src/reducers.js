export const initResps = {data: undefined, loading: false, error: undefined};

export const actions = {
    init: 'INIT',
    success: 'SUCCESS',
    fail: 'FAIL'
}

export function responseReducer(state=initResps, action) {
    switch (action.type) {
        case actions.init: 
            return {
                ...state,
                data: undefined,
                loading: true,
                error: undefined
            };
        case actions.success:
            return {
                ...state,
                data: action.payload,
                loading: false,
                error: undefined
            };
        case actions.fail:
            return {
                ...state,
                data: undefined,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
}