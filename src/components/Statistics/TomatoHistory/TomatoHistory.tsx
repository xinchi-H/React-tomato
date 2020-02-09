import {Tabs} from "antd";
import {format} from "date-fns";
import dayJs from 'dayjs';
import _ from "lodash";
import * as React from 'react';
import {connect} from 'react-redux';
import './TomatoHistory.scss';
import TomatoHistoryTomatoItem from "./TomatoHistoryTomatoItem";

const {TabPane} = Tabs;

interface ITomatoHistoryProps {
    tomatoes: any[];
}

class TomatoHistory extends React.Component<ITomatoHistoryProps> {
    get finishedTomatoes() {
        return this.props.tomatoes.filter(t => t.ended_at && !t.aborted)
    }

    get abortedTomatoes() {
        return this.props.tomatoes.filter(t => t.aborted)
    }

    get dailyFinishedTomatoes() {
        return _.groupBy(this.finishedTomatoes, (tomato) => {
            return format(tomato.ended_at, 'YYYY-MM-D')
        })
    }

    get finishedDates() {
        return Object.keys(this.dailyFinishedTomatoes).sort((a, b) => Date.parse(b) -
            Date.parse(a))
    }

    constructor(props) {
        super(props)
    }

    render() {
        const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const finishedTomatoList = this.finishedDates.map(date => {
                return (
                    <div key={date} className='dailyTomatoes'>
                        <div className='summary'>
                            <p className="date">
                                <span>{date}</span>
                                <span>{week[dayJs(date).format('d')]}</span>
                            </p>
                            <p className='finishedCount'>
                                完成了{this.dailyFinishedTomatoes[date].length}个番茄闹钟
                            </p>
                        </div>
                        <div className='tomatoList'>
                            {
                                this.dailyFinishedTomatoes[date].map(tomato =>
                                    <TomatoHistoryTomatoItem
                                        key={tomato.id} tomato={tomato} itemType='finished'
                                    />
                                )
                            }
                        </div>
                    </div>
                )
            }
        );
        const abortedTomatoesList = this.abortedTomatoes.map(tomato => {
                return (
                    <TomatoHistoryTomatoItem key={tomato.id} tomato={tomato} itemType='aborted'/>
                )
            }
        );
        return (
            <Tabs defaultActiveKey="1" className='TomatoHistoryWrapper'>
                <TabPane tab="已完成番茄闹钟" key="1">
                    <div className='TomatoHistory' id='TomatoHistory'>
                        {finishedTomatoList}
                    </div>
                </TabPane>
                <TabPane tab="打断的番茄" key="2">
                    <div className='TomatoHistory' id='TomatoHistory'>
                        {abortedTomatoesList}
                    </div>
                </TabPane>
            </Tabs>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    tomatoes: state.tomatoes,
    ...ownProps
});

export default connect(mapStateToProps)(TomatoHistory)