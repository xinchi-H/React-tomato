import {format} from "date-fns";
import * as React from 'react';
import {connect} from 'react-redux';
import {updateTomato} from "../../../redux/actions/tomatoes";
import axios from 'src/config/axios';
// import './TomatoHistoryTomatoItem.scss';

interface ITomatoHistoryTomatoItemProps {
    tomato: any;
    itemType: string;
    updateTomato: (payload: any) => void;
}

class TomatoHistoryTomatoItem extends React.Component<ITomatoHistoryTomatoItemProps> {
    constructor(props) {
        super(props)
    }

    updateTomato = async (params: any) => {
        try {
            const response = await axios.put(`tomatoes/${this.props.tomato.id}`, params);
            this.props.updateTomato(response.data.resource)
        } catch (e) {
            throw new Error(e)
        }
    };

    render() {
        let action;
        let formatText;
        let time;
        if (this.props.itemType === 'finished') {
            formatText = 'HH:mm';
            time = this.props.tomato.ended_at;
            action = (
                <div className="action">
                    {/*<span onClick={() => this.updateTomato({completed: false})}>编辑</span>*/}
                    <span onClick={() => this.updateTomato({aborted: true})}>删除</span>
                </div>
            )
        } else if (this.props.itemType === 'aborted') {
            formatText = 'YYYY-MM-DD';
            time = this.props.tomato.created_at;
            action = (
                <div className="action">
                    <span onClick={() => this.updateTomato({aborted: null})}>恢复</span>
                </div>
            )
        }
        return (
            <div className='TodoHistoryTodoItem' id='TodoHistoryTodoItem'>
                <div className="text">
                     <span className='time'>
                         {format(time, formatText)}
                     </span>
                    <span className='description'>{this.props.tomato.description ||'番茄描述为空'}</span>
                </div>
                {action}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    ...ownProps
});

const mapDispatchToProps = {
    updateTomato,
};

export default connect(mapStateToProps, mapDispatchToProps)(TomatoHistoryTomatoItem);