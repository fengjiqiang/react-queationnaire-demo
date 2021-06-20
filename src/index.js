import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import Login from '@/pages/login/Login.js'
import 'antd/dist/antd.less'
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import { HashRouter, BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import store from './store/index.js'
import './libs/plugins.js'
import commonActions from './store/actions/commonActions';
import config from '@/config.js'
function banBack() {
  window.history.pushState(null, null, document.URL);
  window.addEventListener("popstate", function () {
    window.history.pushState(null, null, document.URL);
  });
}
banBack()
// 获取权限列表
function getPermission() {
  return commonActions.getPermission()
}
function getAccountType() {
  return commonActions.getAccountType()
}
// 开始渲染app
function renderApp() {
  ReactDOM.render(
    <Provider store={store} >
      <HashRouter>
        {/* <Route path="/" component={App} /> */}
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" component={App} />
          <Redirect key='/' from="" to="/personalinfo" />
        </Switch>
      </HashRouter>
    </Provider>,
    document.getElementById('root')
  );
}
function getToken() {
  return commonActions.getToken()
}
// 渲染前准备工作
function appInit() {
  return getToken().then(() => {
    console.log(config.token)
    return Promise.all([getPermission(), getAccountType()])
  })
}

renderApp()
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
