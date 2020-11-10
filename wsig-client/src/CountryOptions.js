import React from 'react'

class CountryOptions extends React.Component {
    constructor(props) {
        super(props);
        this.setState({});
    }

    render() {
        const countryOptions = (
            <select value={this.props.stateVar} onChange={this.props.changeCB}>
                <option value="">-Select Country-</option>
                {this.props.countryList.map((country) => (
                    <option key={country.name} value={country.alpha3Code}>{country.alpha3Code + "\t\u2014\t" + country.name}</option> 
                ))}
            </select>
        )
        return countryOptions;
    }
}

export default CountryOptions;