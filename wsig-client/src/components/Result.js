import React from 'react'
import { Link } from 'react-router-dom'
import Plot from 'react-plotly.js';
import StationData from './StationData'
import Map from './Map'

class Result extends React.Component {
    constructor(props) {
        super(props)
        this.scrollRef = React.createRef()
        this.state = {
            result : this.props.location.state.result
        }
    }

    async componentDidMount() {
        let stationInfo = await JSON.parse(this.state.result.stationInfo)
        let stationData = await JSON.parse(this.state.result.stationData)

        this.setState({
            stationMap: this.createStationMapping(stationInfo, stationData)
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
                let date = new Date(Date.parse(label.substring(i3, label.length-3)))

                stationMap[stationId].push(date, data, attr);
            };
        }
        return stationMap;
    }

    render() {
        // let pW = 600;
        // let pH = 400;

        return(
            <div className="result-page">
                <div className="result">
                    <Link className="link" to='/'>Back</Link>
                    <div ref={this.scrollRef} className="plot-scroll">
                        <h1>{this.state.result.dptCity} {String.fromCharCode(8594)} {this.state.result.dstCity}</h1>

                        {this.state.stationMap && (
                            <Map 
                                stationMap={this.state.stationMap}
                                dptLat={this.state.result.dptLat} 
                                dptLng={this.state.result.dptLng} 
                                dstLat={this.state.result.dstLat} 
                                dstLng={this.state.result.dstLng}
                            />
                        )}

                        {/* <Plot
                            data={[
                            {
                                x: this.state.result.flightDates,
                                y: this.state.result.flightPrices,
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
                                x: this.state.result.currDates,
                                y: this.state.result.currHist,
                                type: 'scatter',
                                mode: 'lines',
                                marker: {color: 'green'},
                            },
                            ]}
                            layout={ {font: {color: "#000"}, paper_bgcolor: "#eee", plot_bgcolor: "#eee", width: pW, height: pH, title: `Historical ${result.dptCurr} to ${result.dstCurr} Conversion Rates`} }
                        /> */}
                        {/* <Plot
                            data={[
                            {
                                x: this.state.result.climDates,
                                y: this.state.result.tempScores,
                                type: 'scatter',
                                mode: 'lines',
                                marker: {color: 'red'},
                                name: "Temp."
                            },
                            {
                                x: this.state.result.climDates,
                                y: this.state.result.wthrScores,
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