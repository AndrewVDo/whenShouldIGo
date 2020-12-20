import React from 'react'
import { Link } from 'react-router-dom'
import Plot from 'react-plotly.js';
import StationData from './StationData'
import Map from './Map'
import MonthSlider from './MonthSlider'

class Result extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            stationMap: null,
            result : this.props.location.state.result,
            month : 0
        }

        this.setMonth = this.setMonth.bind(this)
    }

    async componentDidMount() {
        const {
            result
        } = this.state;

        let stationInfo = await JSON.parse(result.stationInfo);
        let stationData = await JSON.parse(result.stationData);

        this.setState({
            stationMap: this.createStationMapping(stationInfo, stationData)
        })
    }

    createStationMapping(stationInfo, stationData) {
        if(!stationInfo || !stationData) {
            return null;
        }

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

    setMonth(month) {
        month += (month < 0) ? 12 : 0
        this.setState({
            month: month % 12
        })
    }

    render() {
        const {
            result,
            month,
            stationMap
        } = this.state

        return(
            <div className="result-page">
                <div className="result">
                    <Link className="link" to='/'>Back</Link>
                    <div ref={this.scrollRef} className="plot-scroll">
                        <h1>{result.dptCity} {String.fromCharCode(8594)} {result.dstCity}</h1>

                        <MonthSlider month={month} setMonth={this.setMonth}></MonthSlider>

                        {stationMap && (
                            <Map 
                                stationMap={stationMap}
                                dptLat={result.dptLat} 
                                dptLng={result.dptLng} 
                                dstLat={result.dstLat} 
                                dstLng={result.dstLng}
                                month={month}
                            />
                        )}

                        {/* <Plot
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
                        /> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default Result;