import * as React from 'react';
import {Dropdown, Icon, Menu} from "antd";
import Todos from 'src/components/Todos/Todos';
import Tomatoes from "src/components/Tomatoes/Tomatoes";
import {connect} from 'react-redux';
import {initTodos} from '../../redux/actions/todos';
import {initTomatoes} from '../../redux/actions/tomatoes';
import Statistics from "src/components/Statistics/Statistics";
import axios from 'src/config/axios';
import history from "../../config/history";
import logo from 'src/static/logo.png'
import './Home.scss';

interface IIndexState {
    user: any
}

const logout = () => {
    localStorage.setItem('x-token', '');
    history.push('/login')
};

const menu = (
    <Menu>
        <Menu.Item key="2" onClick={logout}><Icon type="logout"/>注销用户</Menu.Item>
    </Menu>
);

class Home extends React.Component<any, IIndexState> {

    constructor(props: any) {
        super(props);
        this.state = {
            user: {}
        }
    }

    async componentWillMount() {
        await this.getMe();
        await this.getTodos();
        await this.getTomatoes()
    };

    getTodos = async () => {
        try {
            const response = await axios.get('todos');
            const todos = response.data.resources.map(t => Object.assign({},
                t, {editing: false}));
            this.props.initTodos(todos)
        } catch (e) {
            throw new Error(e)
        }
    };

    getTomatoes = async () => {
        try {
            const response = await axios.get('tomatoes');
            this.props.initTomatoes(response.data.resources);
        } catch (e) {
            throw new Error(e)
        }
    };

    getMe = async () => {
        {
            const response = await axios.get('me');
            this.setState({user: response.data});
        }
    };

    render() {
        return (
            <div className="Home" id="Home">
                <header>
                        <img className='logo' src={logo} alt=""/>
                        <h1>番茄土豆</h1>
                    <Dropdown overlay={menu}>
                        <span className='userInfo'>
                            {this.state.user && this.state.user.account}
                            <Icon type="down" style={{marginLeft: 8}}/>
                        </span>
                    </Dropdown>
                </header>
                <main>
                    <Tomatoes/>
                    <Todos/>
                </main>
                <Statistics/>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    ...ownProps
});

const mapDispatchToProps = {
    initTodos,
    initTomatoes
};

export default connect(mapStateToProps, mapDispatchToProps)(Home)