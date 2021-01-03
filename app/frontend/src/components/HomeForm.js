import React from 'react'
import Select from 'react-select'
import { Redirect } from 'react-router-dom'
import countryList from './country-list'

class HomeForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            departureCountry: null,
            departure: null,
            destinationCountry: null,
            destination: null,
            departureAirports: [],
            destinationAirports: [],
            result: null,
            goMessage: "Go!"
        };

        this.handleReset = this.handleReset.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.departureCountryChange = this.departureCountryChange.bind(this)
        this.departureChange = this.departureChange.bind(this);
        this.destinationCountryChange = this.destinationCountryChange.bind(this)
        this.destinationChange = this.destinationChange.bind(this);
    }

    async getAirportList(iso_country) {
        try {
            let response = await fetch(`/airports?iso_country=${iso_country}`, {
                "method": "GET",
                "mode": "cors"
            })
            return response.json()
        }
        catch (error) {
            console.log(error)
            alert("The airport list could not be fetched from server")
        }
    }

    handleReset() {
        this.setState({
            departureCountry: null,
            departure: null,
            destinationCountry: null,
            destination: null,
        });
    }

    async whenRequest() {
        try {
            let response = await fetch(`/when?departureCountry=${this.state.departureCountry.value}&destinationCountry=${this.state.destinationCountry.value}&departureAirport=${this.state.departure.value}&destinationAirport=${this.state.destination.value}`, {
                "method": "GET",
                "mode": "cors"
            })
            return response.json()
        }
        catch (error) {
            console.log(error)
            alert("Sorry that request didn't work please try another one!")
            this.setState({
                goMessage: "Go!",
                result: null
            })
        }
    }

    async handleSubmit() {
        this.setState({
            goMessage: "Loading..."
        });

        try {
            let result = await this.whenRequest();
            this.setState({
                goMessage: "Go!",
                result: result
            })
        }
        catch (error) {
            console.log(error)
            alert("Sorry that request didn't work please try another one!")
            this.setState({
                goMessage: "Go!",
                result: null
            })
        }
    }

    async departureCountryChange(option) {
        this.setState({
            departureCountry: option,
            departure: null
        })

        this.getAirportList(option.value).then((airportList) => {
            this.setState({ departureAirports: airportList })
        })
    }

    departureChange(option) {
        this.setState({ departure: option })
    }

    async destinationCountryChange(option) {
        this.setState({
            destinationCountry: option,
            destination: null
        })
        this.getAirportList(option.value).then((airportList) => {
            this.setState({ destinationAirports: airportList })
        })
    }

    destinationChange(option) {
        this.setState({ destination: option })
    }


    render() {
        if (this.state.result) {
            return <Redirect to={{
                pathname: '/search',
                state: { result: this.state.result }
            }}></Redirect>
        }

        const countryListToOptions = function (country) {
            return {
                label: country.name,
                value: country.isoCode
            };
        }

        const airportListToOptions = function (airport) {
            return {
                label: airport.iata_code + "\t\u2014\t" + airport.name,
                value: airport.iata_code
            }
        }

        var element = (
            <div className="home-form">
                <form onSubmit={this.handleSubmit}>
                    <table>
                        <thead>
                            <tr><th colSpan={2}>
                                <h1>When Should I Go?</h1>
                            </th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><label>Departure Country</label></td>
                                <td><Select options={countryList.map(countryListToOptions)} value={this.state.departureCountry} onChange={this.departureCountryChange} /></td>
                            </tr>
                            <tr>
                                <td><label>Departure Airport</label></td>
                                <td><Select options={this.state.departureAirports.map(airportListToOptions)} value={this.state.departure} onChange={this.departureChange} /></td>
                            </tr>
                            <tr>
                                <td><label>Destination Country</label></td>
                                <td><Select options={countryList.map(countryListToOptions)} value={this.state.destinationCountry} onChange={this.destinationCountryChange} /></td>
                            </tr>
                            <tr>
                                <td><label>Destination Airport</label></td>
                                <td><Select options={this.state.destinationAirports.map(airportListToOptions)} value={this.state.destination} onChange={this.destinationChange} /></td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td><button className="homeButton" type="button" onClick={this.handleReset}>Reset</button></td>
                                <td><button className="homeButton" type="button" onClick={this.handleSubmit}>{this.state.goMessage}</button></td>
                            </tr>
                        </tfoot>
                    </table>
                </form>
            </div>
        )

        return element;
    }
}

export default HomeForm;