import * as React from 'react';

interface IPolygonProps {
    data: any;
    width: number,
}

class Polygon extends React.Component<IPolygonProps> {
    constructor(props) {
        super(props);
    }

    getPoint = (props:IPolygonProps)=>{
        const dates = Object.keys(props.data);
        const YRange = dates.reduce((a,b)=>props.data[b].length> a ? props.data[b].length : a ,0);
        const {width} = props;
        const XRange = new Date().getTime() - Date.parse(dates[dates.length-1]);
        let lastXPoint = 0;
        const points = dates.reduce((a,date)=>{
            const x = (new Date().getTime() - Date.parse(date))/ XRange * width;
            const y = (1 - props.data[date].length/YRange) * 60;
            lastXPoint = x;
            return a.concat(` ${x},${y}`)
        },'0,60');
        return points.concat(` ${lastXPoint},60`)
    };

    render() {
        return (
            <div className='Polygon' id='Polygon'>
                <svg
                    width="100%"
                    height="60"
                    preserveAspectRatio="none"
                >
                    <polygon fill="rgba(215,78,78,0.1)" stroke="rgba(215,78,78,0.5)"
                             strokeWidth="1"
                             points={this.getPoint(this.props)}/>
                </svg>
            </div>
        );
    }
}

export default Polygon