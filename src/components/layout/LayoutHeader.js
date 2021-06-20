import { Component } from 'react'
import { connect } from 'react-redux'

import { Dropdown, Menu, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import Cookies from 'js-cookie'
import actionTypes from '@/store/actionTypes.js'
import store from '@/store/index.js'

import actionLogin from '@actions/actionLogin.js'

class LayoutHeader extends Component {
    constructor(props, context) {
        super(props)
        this.state = {
            avatar: ''
        }
    }
    handleLogout = (e) => {
        actionLogin.logout();
        Cookies.remove('token');
        sessionStorage.removeItem('token');
        //退出登录清除菜单缓存
        store.dispatch({ type: actionTypes.CACHE_ROUTES_CHANGE, data: [] });
        this.props.history.push('/login')
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <div onClick={this.handleLogout}>退出登录</div>
                </Menu.Item>
            </Menu>
        )
        return (
            <div style={this.props.style} className="appHead">
                <div className="companyLogo" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <span style={{ color: '#8F1D22', fontSize: 20, fontWeight: 500, marginLeft: 15 }}>z止于至善后台管理系统</span>
                </div>
                <div className="personInfo" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginRight: 20 }}>
                    <div className="" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <img src={this.props.userInfo.avatar || require('../../assets/images/common/default_avatar.png').default} alt='' style={{ width: 35, height: 35, marginRight: 5, borderRadius: '50%' }}></img>
                        <Dropdown overlay={menu} >
                            <div style={{ cursor: 'pointer' }}>
                                <span style={{ marginRight: 5 }}> {this.props.userInfo.nickname}</span>
                                <DownOutlined />
                            </div>
                        </Dropdown>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect((store, props) => {
    return {
        ...props,
        userInfo: store.personalInfo.userInfo,
    }
})(LayoutHeader)