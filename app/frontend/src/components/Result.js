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
            result: this.props.location.state.result,
            month: 0,
            plotWidth: 200
        }

        this.scrollRef = React.createRef();
        this.setMonth = this.setMonth.bind(this)
    }

    async componentDidMount() {
        const {
            result
        } = this.state;

        let stationInfo = await JSON.parse(result.stationInfo);
        let stationData = await JSON.parse(result.stationData);

        this.setState({
            stationMap: this.createStationMapping(stationInfo, stationData),
            plotWidth: this.scrollRef.current.offsetWidth
        })
    }

    createStationMapping(stationInfo, stationData) {
        if (!stationInfo || !stationData) {
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
                let date = new Date(Date.parse(label.substring(i3, label.length - 3)))

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
            stationMap,
            plotWidth
        } = this.state

        return (
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

                        <Plot
                            className="plot"
                            data={[
                                {
                                    x: result.flightDates,
                                    y: result.flightPrices,
                                    type: 'bar',
                                    mode: 'markers',
                                    marker: { color: 'lightblue' },
                                },
                            ]}
                            layout={{
                                margin: { "t": 60, "b": 30, "l": 50, "r": 30 },
                                font: { color: "#fff" },
                                paper_bgcolor: "#333",
                                plot_bgcolor: "#333",
                                width: plotWidth * 0.9 - 1,
                                height: plotWidth / 4,
                                title: `Flights Prices from ${result.dptCity} to ${result.dstCity}`
                            }}
                        />
                        <Plot
                            className="plot"
                            data={[
                                {
                                    x: result.currDates,
                                    y: result.currHist,
                                    type: 'scatter',
                                    mode: 'lines',
                                    marker: { color: 'lightgreen' },
                                },
                            ]}
                            layout={{
                                margin: { "t": 60, "b": 30, "l": 50, "r": 30 },
                                font: { color: "#fff" },
                                paper_bgcolor: "#333",
                                plot_bgcolor: "#333",
                                width: plotWidth * 0.9 - 1,
                                height: plotWidth / 4,
                                title: `${result.dptCurr} ${String.fromCharCode(8594)} ${result.dstCurr} Conversion Rates`
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Result;