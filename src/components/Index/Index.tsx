import * as React from 'react';
import {Button} from "antd";

class Component extends React.Component<any> {

    login = () => {
       this.props.history.push('/login')
    };

    render() {
        return (
            <div className='Component'>
                <Button onClick={this.login}>登录</Button>
            </div>
        );
    }
}

export default Component