import React from 'react'

class AirportOptions extends React.Component {
    constructor(props) {
        super(props);
        this.setState({});
    }

    render() {
        const airportOptions = (
            <select value={this.props.stateVar} onChange={this.props.changeCB}>
                <option value="">-Select Airport-</option>
                {this.props.airportList.map((airport) => (
                    <option key={airport._id} value={airport.iata_code}>{airport.name + "\t\u2014\t" + airport.iata_code}</option> 
                ))}
            </select>
        )
        return airportOptions;
    }
}

export default AirportOptions;