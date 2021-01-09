var money_obj = {};
var history_obj = {};
var mystate = [money_obj, history_obj];

const rouletteReducer = (state = -1, action) => {	
	//console.log("user_info0-- ", action);
	switch(action.type){
		case "calculate_money":	
			money_obj = action;	
			mystate[0] = money_obj;		
			//console.log("user_info1-- ", mystate);
			
			state = mystate;			
			return state;	
		case "get_history":	
			history_obj = action;	
			mystate[1] = history_obj;
			//console.log("user_info2-- ", history_obj, mystate);
			
			state = mystate;			
			return state;				
		default: 
			return state;
	}
}

export default rouletteReducer;