import * as React from 'react';
import {connect} from 'react-redux';
import {format} from "date-fns";
import _ from "lodash";

interface ITodoHistoryProps {
    todos: any[];
}

const TodoItem = (props) => {
    return (<div>
        <span>{props.updated_at}</span>
        <span>{props.description}</span>
    </div>)
};

class TodoHistory extends React.Component <ITodoHistoryProps> {
    get finishedTodos() {
        return this.props.todos.filter(t => t.completed && !t.deleted)
    }

    get deletedTodoes() {
        return this.props.todos.filter(t => t.deleted)
    }

    get dailyFinishedTodos() {
        return _.groupBy(this.finishedTodos, (todo) => {
            return format(todo.updated_at, 'YYY-MM-D')
        })
    }

    get dates() {
        return Object.keys(this.dailyFinishedTodos).sort((a, b) => Date.parse(b) -
            Date.parse(a))
    }

    constructor(props) {
        super(props)
    }

    render() {
        const todoList = this.dates.map(date => {
                return (
                    <div key={date}>
                        <div>
                            {date}
                            完成了{this.dailyFinishedTodos[date].length}个任务
                        </div>
                        <div>
                            {
                                this.dailyFinishedTodos[date].map(todo =>
                                    <TodoItem key={todo.id} {...todo}/>)
                            }
                        </div>

                    </div>
                )
            }
        );
        return (
            <div className='TodoHistory' id='TodoHistory'>
                {todoList}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    todos: state.todos,
    ...ownProps
});

export default connect(mapStateToProps)(TodoHistory)