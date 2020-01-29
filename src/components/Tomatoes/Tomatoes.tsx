import * as React from 'react';
import {connect} from 'react-redux';
import axios from "../../config/axios";
import {addTomato, initTomatoes} from "../../redux/actions/tomatoes";
import TomatoAction from './TomatoAction';
import './Tomatoes.scss'

interface ITomatoesProps {
    addTomato: (payload: any) => any;
    initTomatoes: (payload: any[])=>any;
    tomatoes: any[];
}

class Tomatoes extends React.Component<ITomatoesProps> {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.getTomatoes()
    }

    get unfinishedTomato() {
        return this.props.tomatoes.filter(t => !t.description && !t.ended_at)[0]
    }

    getTomatoes = async () => {
        try {
            const response = await axios.get('tomatoes');
            this.props.initTomatoes(response.data.resources);
        } catch (e) {
            throw new Error(e)
        }
    };

    startTomato = async () => {
        try {
            const response = await axios.post('tomatoes', {duration: 25 * 60 * 1000});
            this.props.addTomato(response.data.resource);
        } catch (e) {
            throw new Error(e)
        }
    };

    render() {
        return (
            <div className='Tomatoes' id="Tomatoes">
                <TomatoAction startTomato={this.startTomato}
                              unfinishedTomato={this.unfinishedTomato}/>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    tomatoes: state.tomatoes,
    ...ownProps
});

const mapDispatchToProps = {
    addTomato,
    initTomatoes,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tomatoes)