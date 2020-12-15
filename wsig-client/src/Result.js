import React from 'react'
import { Link } from 'react-router-dom'
import Plot from 'react-plotly.js';
import StationData from './StationData'


class Result extends React.Component {
    constructor(props) {
        super(props)
        this.scrollRef = React.createRef()
    }

    async componentDidMount() {
        let stationInfo = await JSON.parse(this.props.location.state.result.stationInfo)
        let stationData = await JSON.parse(this.props.location.state.result.stationData)

        this.setState({
            stationMap: this.createStationMapping(stationInfo, stationData)
        }, () => {
            console.log(this.state)
        })
    }

    createStationMapping(stationInfo, stationData) {
        let stationMap = {};
        for (const [key, value] of Object.entries(stationInfo.wmo)) {
            stationMap[key] = new StationData(stationInfo, stationData, key);
        }

        for (const [attr, attrList] of Object.entries(stationData)) {
            for (const [label, data] of Object.entries(attrList)) {
    
                let i1 = 1 + label.indexOf("'");
                let i2 = i1 + label.substring(i1).indexOf("'");
                let i3 = 11 + label.indexOf("Timestamp");
    
                let stationId = label.substring(i1, i2);
                let date = Date.parse(label.substring(i3, label.length-3));

                stationMap[stationId].push(date, data, attr);
            };
        }
        return stationMap;
    }

    render() {
        let result = this.props.location.state.result;
        let pW = 600;
        let pH = 400;

        return(
            <div className="result-page">
                <div className="result">
                    <Link className="link" to='/'>Back</Link>
                    <h1>When Should I Go?</h1>
                    <div ref={this.scrollRef} className="plot-scroll">
                        <Plot
                            data={[
                            {
                                x: result.flightDates,
                                y: result.flightPrices,
                                type: 'scatter',
                                mode: 'markers',
                                marker: {color: 'black'},
                            },
                            ]}
                            layout={ {font: {color: "#000"}, paper_bgcolor: "#eee", plot_bgcolor: "#eee", width: pW, height: pH, title: `Flights Prices from ${result.dptAprt} to ${result.dstAprt}`} }
                        />
                        <Plot
                            data={[
                            {
                                x: result.currDates,
                                y: result.currHist,
                                type: 'scatter',
                                mode: 'lines',
                                marker: {color: 'green'},
                            },
                            ]}
                            layout={ {font: {color: "#000"}, paper_bgcolor: "#eee", plot_bgcolor: "#eee", width: pW, height: pH, title: `Historical ${result.dptCurr} to ${result.dstCurr} Conversion Rates`} }
                        />
                        {/* <Plot
                            data={[
                            {
                                x: result.climDates,
                                y: result.tempScores,
                                type: 'scatter',
                                mode: 'lines',
                                marker: {color: 'red'},
                                name: "Temp."
                            },
                            {
                                x: result.climDates,
                                y: result.wthrScores,
                                type: 'scatter',
                                mode: 'lines',
                                marker: {color: 'blue'},
                                name: "Weather"
                            },
                            ]}
                            layout={ {font: {color: "#000"}, paper_bgcolor: "#eee", plot_bgcolor: "#eee", width: pW, height: pH, title: 'Historical Temperature & Weather Scores'} }
                        /> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default Result;