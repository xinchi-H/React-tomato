import {Tabs, Pagination} from "antd";
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

class TomatoHistory extends React.Component<ITomatoHistoryProps, any> {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            abortedCurrentPage: 1
        }
    }

    get finishedTomatoes() {
        return this.props.tomatoes.filter(t => !t.aborted)
            .filter(t => t.description && t.ended_at)
    }

    get abortedTomatoes() {
        return this.props.tomatoes.filter(t => t.aborted)
    }

    get dailyFinishedTomatoes() {
        return _.groupBy(this.finishedTomatoes, (t) => {
            return format(t.ended_at, 'YYYY-MM-D')
        })
    }

    get finishedDates() {
        return Object.keys(this.dailyFinishedTomatoes).sort((a, b) => Date.parse(b) -
            Date.parse(a))
    }

    togglePage = (currentPage: number) => {
        this.setState({currentPage})
    };

    toggleAbortedPage = (abortedCurrentPage: number) => {
        this.setState({abortedCurrentPage})
    };

    render() {
        const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const {currentPage} = this.state;
        const finishedTomatoList = this.finishedDates.slice((currentPage - 1) * 3, currentPage * 3).map(date => {
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
        const {abortedCurrentPage} = this.state;
        const abortedTomatoesList = this.abortedTomatoes.slice((abortedCurrentPage - 1) * 15, abortedCurrentPage * 15).map(tomato => {
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
                        <div className='Pagination_wrapper'>
                            <Pagination
                                size="small"
                                defaultCurrent={1}
                                pageSize={3}
                                hideOnSinglePage={true}
                                total={Object.keys(this.dailyFinishedTomatoes).length}
                                current={this.state.currentPage}
                                onChange={this.togglePage}/>
                            <span className='tips'>
                                总计{
                                Object.keys(this.dailyFinishedTomatoes)
                                    .reduce((a, b) => a + this.dailyFinishedTomatoes[b].length, 0)
                            }个番茄闹钟
                            </span>
                        </div>
                    </div>
                </TabPane>
                <TabPane tab="打断的番茄" key="2">
                    <div className='TomatoHistory' id='TomatoHistory'>
                        {abortedTomatoesList}
                        <div className='Pagination_wrapper'>
                            <Pagination
                                size="small"
                                defaultCurrent={1}
                                pageSize={15}
                                hideOnSinglePage={true}
                                total={Object.keys(this.abortedTomatoes).length}
                                current={this.state.abortedCurrentPage}
                                onChange={this.toggleAbortedPage}/>
                            <span className='tips'>
                                总计{
                                this.abortedTomatoes.length
                            }个番茄闹钟
                            </span>
                        </div>
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