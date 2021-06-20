import reducers from './reducers/index.js'
import { createStore, applyMiddleware } from 'redux'
// import logger from 'redux-logger';
import promiseMiddleware from 'redux-promise';
function actionMiddleware(extraArgument) {
    return ({ dispatch, getState }) => next => action => {
        // console.log('action:',action)
        if (action && action.type === 'operate' && typeof action.cb == 'function') {
            action.cb(action.params)
        } else {
            return next(action);
        }

    };
}
export default createStore(reducers, applyMiddleware(actionMiddleware(), promiseMiddleware));