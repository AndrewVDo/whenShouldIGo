import React from 'react'
import { Link } from 'react-router-dom'
import Plot from 'react-plotly.js';


class Result extends React.Component {
    constructor(props) {
        super(props)
        this.scrollRef = React.createRef()
    }

    render() {
        let result = this.props.location.state.result;
        let pW = 500;
        let pH = 240;

        return(
            <div className="result-page">
                <div className="result">
                    <Link className="link" to='/'>Back</Link>
                    <h1>When Should I Go?</h1>
                    <div ref={this.scrollRef} className="plot-scroll">
                        {/* <Plot
                            data={[
                            {
                                x: result.flightDates,
                                y: result.flightPrices,
                                type: 'scatter',
                                mode: 'lines',
                                marker: {color: 'black'},
                            },
                            ]}
                            layout={ {font: {color: "#000"}, paper_bgcolor: "#eee", plot_bgcolor: "#eee", width: pW, height: pH, title: `Flights Prices from ${result.dptAprt} to ${result.dstAprt}`} }
                        /> */}
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