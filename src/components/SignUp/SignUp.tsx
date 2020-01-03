import * as React from 'react';
import {Input, Icon, Button} from 'antd';
import axios from 'src/config/axios'

interface ISignUpState {
    account: string,
    password: string,
    passwordConformation: string
}

class SignUp extends React.Component<any, ISignUpState> {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            password: '',
            passwordConformation: ''
        }
    }

    onChangeAccount = (e) => {
        this.setState({account: e.target.value})
    };
    onChangePassword = (e) => {
        this.setState({password: e.target.value})
    };
    onChangePasswordConformation = (e) => {
        this.setState({passwordConformation: e.target.value})
    };
    submit = async () => {
        const {account, password, passwordConformation} = this.state;
        try {
            await axios.post('sign_up/user', {
                account,
                password,
                password_confirmation: passwordConformation,
            });
            console.log("成功");
        } catch (e) {
            throw new Error(e)
        }
    };

    render() {
        const {account, password, passwordConformation} = this.state;
        return (
            <div className='SignUp'>
                <Input
                    placeholder="请输入你的用户名"
                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                    value={account}
                    onChange={this.onChangeAccount}
                />
                <Input.Password
                    value={password}
                    placeholder="请输入密码"
                    onChange={this.onChangePassword}
                />
                <Input.Password
                    value={passwordConformation}
                    placeholder="请确认密码"
                    onChange={this.onChangePasswordConformation}
                />
                <Button onClick={this.submit}>注册</Button>
            </div>
        );
    }
}

export default SignUp