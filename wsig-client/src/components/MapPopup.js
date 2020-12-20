import React from 'react';
import Plot from 'react-plotly.js';

class MapPopup extends React.Component {
    categorizeTemp(avgTemp, month) {
        if(!avgTemp || !avgTemp.data || avgTemp.data.length == 0) {
            return null;
        }

        let temp = [0, 0, 0, 0, 0, 0]
        for(let i=0; i<avgTemp.data.length; i++) {
            if(avgTemp.date[i].getMonth() == month) {
                if(avgTemp.data[i] >= 20.0) {
                    temp[0]++;
                }
                else if(avgTemp.data[i] >= 15.0 && avgTemp.data[i] < 20.0) {
                    temp[1]++;
                }
                else if(avgTemp.data[i] >= 10.0 && avgTemp.data[i] < 15.0) {
                    temp[2]++;
                }
                else if(avgTemp.data[i] >= 5.0 && avgTemp.data[i] < 10.0) {
                    temp[3]++;
                }
                else if(avgTemp.data[i] >= 0.0 && avgTemp.data[i] < 5.0) {
                    temp[4]++;
                }
                else if(avgTemp.data[i] < 0.0) {
                    temp[5]++;
                }
            }
        }
        return temp;
    }

    render() {
        const {
            stationData,
            month
        } = this.props;
        const tempCat = this.categorizeTemp(stationData.tavg, month)

        return(<div className="map-popup">
            <h2>
                {this.props.stationData.name}
            </h2>

            {!tempCat && (<p>Temperature Information Unavailable</p>)}

            {tempCat && (<Plot
                data={[
                {
                    values: tempCat,
                    labels: [
                        'Hot (>20C)', 
                        'Warm (15C - 20C)',
                        'Mild (10C - 15C)', 
                        'Cool (5C - 10C)', 
                        'Cold (0C - 5C)',
                        'Freezing (<0C)'
                    ],
                    type: 'pie',
                    sort: false,
                    hole: 0.5
                },
                ]}
                layout={{
                    width: 200,
                    height: 200,
                    margin: {"t": 0, "b": 0, "l": 0, "r": 0},
                    showlegend: false,
                    annotations: [
                        {
                          font: {
                            size: 14
                          },
                          showarrow: false,
                          text: 'Temperature',
                          x: 0.26,
                          y: 0.5
                        },
                    ],
                    colorway: [
                        'red',
                        'orange',
                        'yellow',
                        'lightblue',
                        'blue',
                        'darkblue'
                    ]
                }}
            />)}
        </div>)
    }
}

export default MapPopup;