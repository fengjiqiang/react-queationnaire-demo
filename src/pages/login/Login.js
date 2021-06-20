import React from 'react'
import { connect } from 'react-redux'
import BaseCmp from '@components/BaseCmp.js'
import { Form } from 'antd'
import Cookies from 'js-cookie'
import { RLInput, RLButton } from '@components/index.js'
import { Input } from 'antd';
import actionLogin from '@actions/actionLogin.js'

import './login.less'
import images from '@/libs/images/index.js'

const commonImg = images.commonImg

class Login extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: {
                username: '',
                password: ''
            }
        }
    }

    handleSubmit = () => {
        const { username, password } = this.state.userInfo
        actionLogin.login({
            username,
            password
        }).then(res => {
            if (res.code === 200) {
                Cookies.set('token', res.data.token);
                sessionStorage.setItem('token', res.data.token)
                this.props.history.push('/personalinfo')
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    login = () => {
        const { username, password } = this.state.userInfo
        return (
            <Form
                name="normal_login"
                style={{ width: 300 }}
                onFinish={this.handleSubmit}
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: '请填写用户名称',
                        },
                    ]}
                >
                    <RLInput
                        inputStyle={{ border: 'none', borderBottom: '1px solid #e5e5e5', fontSize: 16, paddingLeft: 10, paddingRight: 0, paddingBottom: 8 }}
                        placeholder="请输入账号"
                        onChange={(e) => {
                            this.setState({
                                userInfo: {
                                    ...this.state.userInfo,
                                    username: e.target.value
                                }
                            })
                        }}
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请填写登录密码',
                        },
                    ]}
                >
                    <Input.Password
                        type="password"
                        visibilityToggle={true}
                        inputStyle={{ border: 'none', borderBottom: '1px solid #e5e5e5', fontSize: 16, paddingLeft: 0, paddingRight: 0, paddingBottom: 8 }}
                        placeholder="请输入密码"
                        onChange={(e) => {
                            this.setState({
                                userInfo: {
                                    ...this.state.userInfo,
                                    password: e.target.value
                                }
                            })
                        }}
                        style={{ border: 'none', borderBottom: '1px solid #e5e5e5', fontSize: 16}}
                    />
                </Form.Item>

                <Form.Item>
                    <RLButton
                        className="login-button"
                        label="登 录"
                        type="primary"
                        htmlType="submit"
                        width="100%"
                        height={40}
                        style={{ marginTop: 24 }}
                        disabled={!username || !password}
                    />
                </Form.Item>
            </Form>
        )
    }

    render() {
        return (
            <div className="login-container">
                <img alt=''
                    style={{ height: 348, width: 348 }}
                    src={commonImg.login}
                />
                <div className="login-form">
                    <img alt=''
                        style={{ height: 80, width: 80 }}
                        src={commonImg.logo}
                    />
                    <div style={{ height: 33, fontSize: 24, fontWeight: 500, marginTop: 16, marginBottom: 60 }}>
                        中债e联后台管理系统
                    </div>
                    { this.login() }
                </div>
            </div>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props
    }
})(Login)
