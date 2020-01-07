import * as React from 'react';
import {Button} from "antd";
import axios from 'src/config/axios'

interface IIndexState {
    user: any
}

class Index extends React.Component<any, IIndexState> {

    constructor(props: any) {
        super(props);
        this.state = {
            user: {}
        }
    }

    async componentWillMount() {
        await this.getMe()
    };

    getMe = async () => {
        try {
            const response = await axios.get('me');
            this.setState({user: response.data});
            console.log(response);
        } catch (e) {
            // if (e.response.status === 401) {
            //     this.props.history.push('/login')
            // }
        }
    };

    logout = () => {
        localStorage.setItem('x-token', '');
        this.props.history.push('/login')
    };

    render() {
        return (
            <div className='Component'>
                <p>欢迎，{this.state.user && this.state.user.account}</p>
                <Button onClick={this.logout}>注销用户</Button>
            </div>
        );
    }
}

export default Index