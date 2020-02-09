import {format} from "date-fns";
import _ from "lodash";
import * as React from 'react';
import {connect} from 'react-redux';
import Polygon from './Polygon';
import TodoHistory from "./TodoHistory/TodoHistory";
import './Statistics.scss';
import TomatoHistory from "./TomatoHistory/TomatoHistory";

interface IStatisticsProps {
    todos: any[];
    tomatoes: any[];
}

interface IState {
    activeId: number
    liWidth: number
    ulWidth: number
}

class Statistics extends React.Component<IStatisticsProps, IState> {
    liNode: HTMLLIElement | null;
    ulNode: HTMLUListElement | null;

    constructor(props) {
        super(props);
        this.state = {
            activeId: -1,
            liWidth: this.liNode ? this.liNode.offsetWidth - 2 : 0,
            ulWidth: this.ulNode ? this.ulNode.offsetWidth - 2 : 0
        };
        this.updateSize = this.updateSize.bind(this)
    }

    get finishedTomatoes() {
        return this.props.tomatoes.filter(tomato => !tomato.aborted)
            .filter(tomato => tomato.description && tomato.ended_at)
    }

    get dailyTomatoes() {
        return _.groupBy(this.finishedTomatoes, (tomato) => {
            return format(tomato.started_at, 'YYYY-MM-D')
        })
    }

    get finishedTodos() {
        return this.props.todos.filter(t => t.completed && !t.deleted)
    }

    get dailyTodos() {
        return _.groupBy(this.finishedTodos, (todo) => {
            return format(todo.updated_at, 'YYYY-MM-D')
        })
    }

    toggleActivePane(index) {
        if (this.state.activeId !== index) {
            this.setState({
                activeId: index
            })
        }
    }

    updateSize() {
        const liWidth = this.liNode ? this.liNode.offsetWidth - 2 : 0;
        let ulWidth = this.ulNode ? this.ulNode.offsetWidth - 66 : 0;
        if (ulWidth < 0) {
            ulWidth = 0
        }
        if (this.state.liWidth !== liWidth) {
            this.setState({liWidth})
        }
        if (this.state.ulWidth !== ulWidth) {
            this.setState({ulWidth})
        }
    }

    componentDidMount() {
        this.updateSize();
        window.addEventListener('resize', this.updateSize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateSize);
    }

    render() {
        return (
            <div className='Statistics' id='Statistics'>
                <ul ref={ulNode => this.ulNode = ulNode}>
                    <li className={this.state.activeId === 0 ? 'active' : ''}
                        onClick={this.toggleActivePane.bind(this, 0)}>
                        <div className='desc'>
                            <span className="title">番茄历史</span>
                            <span className='subtitle'>累计完成番茄</span>
                            <span className='quantity'>{this.finishedTomatoes.length}</span>
                        </div>
                        {this.finishedTomatoes.length !== 0 ?
                            <Polygon width={this.state.liWidth}
                                     data={this.dailyTomatoes}
                            />
                            : null}
                    </li>
                    <li ref={li => this.liNode = li} className={this.state.activeId === 1 ? 'active' : ''}
                        onClick={this.toggleActivePane.bind(this, 1)}>
                        <div className='desc'>
                            <span className="title">任务历史</span>
                            <span className='subtitle'>累计完成任务</span>
                            <span className='quantity'>{this.finishedTodos.length}</span>
                        </div>
                        {this.finishedTodos.length !== 0 ?
                            <Polygon width={this.state.liWidth}
                                     data={this.dailyTodos}
                            />
                            : null}
                    </li>
                </ul>
                {this.state.activeId === 0 ?
                    <TomatoHistory/>
                    : null
                }
                {this.state.activeId === 1 ?
                    <TodoHistory/>
                    : null
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    todos: state.todos,
    tomatoes: state.tomatoes,
    ...ownProps
});

export default connect(mapStateToProps)(Statistics)