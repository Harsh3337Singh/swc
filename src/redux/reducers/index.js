const initialState = {
    user:'ajay',
    debt:[],
    credit:[]
};

function rootReducer(state = initialState, action) {
    if(action.type === "update_user") {
        
        return {
            ...state,
            user:action.payload
        }
    }

    if(action.type === 'recent_activity'){
        console.log("recentactivity",action.payload)
        return {
            ...state,
            debt:action.payload.debt,
            credit:action.payload.credit
        }
    }
    
    return state;
};

export default rootReducer;
