import {compose, createStore} from "redux";
import { adoReducer } from "./reducer";


const globalAny: any = global;

// This required for redux devtools integration per these articles:
// https://stackoverflow.com/a/46758271/491436 and https://stackoverflow.com/a/42304473/491436
// @ts-ignore
const enhancers = compose(
    globalAny.window.__REDUX_DEVTOOLS_EXTENSION__ && globalAny.window.__REDUX_DEVTOOLS_EXTENSION__()
);


export const store = createStore(adoReducer, enhancers);
