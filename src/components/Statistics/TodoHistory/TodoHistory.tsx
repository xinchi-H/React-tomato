import {Tabs, Pagination} from "antd";
import {format} from "date-fns";
import dayJs from 'dayjs';
import _ from "lodash";
import * as React from 'react';
import {connect} from 'react-redux';
import './TodoHistory.scss'
import TodoHistoryTodoItem from "./TodoHistoryTodoItem";

const {TabPane} = Tabs;

interface ITodoHistoryProps {
    todos: any[];
}

class TodoHistory extends React.Component <ITodoHistoryProps, any> {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            deletedCurrentPage: 1
        }
    }

    get finishedTodos() {
        return this.props.todos.filter(t => t.completed && !t.deleted)
    }

    get deletedTodoes() {
        return this.props.todos.filter(t => t.deleted)
    }

    get dailyFinishedTodos() {
        return _.groupBy(this.finishedTodos, (todo) => {
            return format(todo.updated_at, 'YYYY-MM-D')
        })
    }

    get finishedDates() {
        return Object.keys(this.dailyFinishedTodos).sort((a, b) => Date.parse(b) -
            Date.parse(a))
    }

    togglePage = (currentPage: number) => {
        this.setState({currentPage})
    };

    toggleDeletedPage = (deletedCurrentPage: number) => {
        this.setState({deletedCurrentPage})
    };

    render() {
        const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const {currentPage} = this.state;
        const finishedTodoList = this.finishedDates.slice((currentPage - 1) * 3, currentPage * 3).map(date => {
                return (
                    <div key={date} className='dailyTodos'>
                        <div className='summary'>
                            <p className="date">
                                <span>{date}</span>
                                <span>{week[dayJs(date).format('d')]}</span>
                            </p>
                            <p className='finishedCount'>
                                完成了{this.dailyFinishedTodos[date].length}个任务
                            </p>
                        </div>
                        <div className='todoList'>
                            {
                                this.dailyFinishedTodos[date].map(todo =>
                                    <TodoHistoryTodoItem
                                        key={todo.id} todo={todo} itemType='finished'
                                    />
                                )
                            }
                        </div>
                    </div>
                )
            }
        );
        const {deletedCurrentPage} = this.state;
        const deletedTodoList = this.deletedTodoes.slice((deletedCurrentPage - 1) * 15, deletedCurrentPage * 15).map(todo => {
                return (
                    <TodoHistoryTodoItem key={todo.id} todo={todo} itemType='deleted'/>
                )
            }
        );
        return (
            <Tabs defaultActiveKey="1" className='TodoHistoryWrapper'>
                <TabPane tab="已完成任务" key="1">
                    <div className='TodoHistory' id='TodoHistory'>
                        {finishedTodoList}
                        <div className='Pagination_wrapper'>
                            <Pagination
                                size="small"
                                defaultCurrent={1}
                                pageSize={3}
                                hideOnSinglePage={true}
                                total={Object.keys(this.dailyFinishedTodos).length}
                                current={this.state.currentPage}
                                onChange={this.togglePage}/>
                            <span className='tips'>
                                总计{
                                Object.keys(this.dailyFinishedTodos)
                                    .reduce((a, b) => a + this.dailyFinishedTodos[b].length, 0)
                            }个任务
                            </span>
                        </div>
                    </div>
                </TabPane>
                <TabPane tab="已删除任务" key="2">
                    <div className='TodoHistory' id='TodoHistory'>
                        {deletedTodoList}
                        <div className='Pagination_wrapper'>
                            <Pagination
                                size="small"
                                defaultCurrent={1}
                                pageSize={15}
                                hideOnSinglePage={true}
                                total={Object.keys(this.deletedTodoes).length}
                                current={this.state.deletedCurrentPage}
                                onChange={this.toggleDeletedPage}/>
                            <span className='tips'>
                                总计{
                                this.deletedTodoes.length
                            }个任务
                            </span>
                        </div>
                    </div>
                </TabPane>
            </Tabs>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    todos: state.todos,
    ...ownProps
});

export default connect(mapStateToProps)(TodoHistory)