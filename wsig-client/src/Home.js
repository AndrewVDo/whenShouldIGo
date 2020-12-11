import React from 'react'
import Select from 'react-select'

const temperatureOptions = [
    { label: "None",        value: 0 },
    { label: "Freezing",    value: 1 },
    { label: "Cold",        value: 2 },
    { label: "Cool",        value: 3 },
    { label: "Warm",        value: 4 },
    { label: "Hot",         value: 5 }
];

const weatherOptions = [
    { label: "None",        value: 0 },
    { label: "Rainy",       value: 1 },
    { label: "Sunny",       value: 2 }
];

Object.freeze(temperatureOptions);
Object.freeze(weatherOptions);

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            departureCountry: null,
            departure: null,
            destinationCountry: null,
            destination: null,
            preferredTemperature: null,
            preferredWeather: null,
            countryList: [],
            departureAirports: [],
            destinationAirports : []
        };

        this.handleReset = this.handleReset.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.departureCountryChange = this.departureCountryChange.bind(this)
        this.departureChange = this.departureChange.bind(this);
        this.destinationCountryChange = this.destinationCountryChange.bind(this)
        this.destinationChange = this.destinationChange.bind(this);
        this.temperatureChange = this.temperatureChange.bind(this);
        this.weatherChange = this.weatherChange.bind(this);
    }

    async componentDidMount() {
        this.setState({countryList: await this.getCountryList()})
    }

    async getCountryList() {
        try {
            let response = await fetch("http://localhost:5000/countries", {
                "method": "GET",
                "mode": "cors"
            })
            return response.json()
        }
        catch(error) {
            console.log(error)
        }
    }

    async getAirportList(iso_country) {
        try {
            let response = await fetch(`http://localhost:5000/airports?iso_country=${iso_country}`, {
                "method": "GET",
                "mode": "cors"
            })
            return response.json()
        }
        catch(error) {
            console.log(error)
        }
    }

    handleReset() {

        this.setState({
            departureCountry: null,
            departure: null,
            destinationCountry: null,
            destination: null,
            preferredTemperature: null,
            preferredWeather: null
        })
    }

    async whenRequest() {
        try {
            let response = await fetch(`http://localhost:5000/when?departureCountry=${this.state.departureCountry.value}&destinationCountry=${this.state.destinationCountry.value}&departureAirport=${this.state.departure.value}&destinationAirport=${this.state.destination.value}&temperature=${this.state.preferredTemperature.value}&weather=${this.state.preferredWeather.value}`, {
                "method": "GET",
                "mode": "cors"
            })
            return response.json()
        }
        catch(error) {
            console.log(error)
        }
    }

    async handleSubmit() {
        //set to loading state
        const response = await this.whenRequest()
        console.log(response)
    }

    async departureCountryChange(option) {
        this.setState({
            departureCountry: option,
            departure: null
        })
        
        this.getAirportList(option.value).then((airportList) => {
            this.setState({departureAirports: airportList})
        })
    }

    departureChange(option) {
        this.setState({departure: option})
    }

    async destinationCountryChange(option) {
        this.setState({
            destinationCountry: option,
            destination: null
        })
        this.getAirportList(option.value).then((airportList) => {
            this.setState({destinationAirports: airportList})
        })
    }

    destinationChange(option) {
        this.setState({destination: option})
    }

    temperatureChange(option) {
        this.setState({preferredTemperature: option})
    }

    weatherChange(option) {
        this.setState({preferredWeather: option})
    }


    render() {  
        const countryListToOptions = function(country) {
            return { 
                label: (country.name + "\t\u2014\t" + country.alpha3Code),  
                value: country.alpha2Code 
            };
        }

        const airportListToOptions = function(airport) {
            return {
                label: airport.name + "\t\u2014\t" + airport.iata_code,
                value: airport.iata_code
            }
        }

        var element = (
            <div className="home-form">
                <form onSubmit={this.handleSubmit}>
                    <table>
                        <thead>
                            <th colSpan={2}>
                                <h1>When Should I Go?</h1>
                            </th>
                        </thead>
                        <tbody>
                            <tr>
                                <td><label>Departure Country</label></td>
                                <td><Select options={this.state.countryList.map(countryListToOptions)} value={this.state.departureCountry} onChange={this.departureCountryChange}/></td>
                            </tr>
                            <tr>
                                <td><label>Departure Airport</label></td>
                                <td><Select options={this.state.departureAirports.map(airportListToOptions)} value={this.state.departure} onChange={this.departureChange}/></td>
                            </tr>
                            <tr>
                                <td><label>Destination Country</label></td>
                                <td><Select options={this.state.countryList.map(countryListToOptions)} value={this.state.destinationCountry} onChange={this.destinationCountryChange}/></td>
                            </tr>
                            <tr>
                                <td><label>Destination Airport</label></td>
                                <td><Select options={this.state.destinationAirports.map(airportListToOptions)} value={this.state.destination} onChange={this.destinationChange}/></td>
                            </tr>
                            <tr>
                                <td><label>Preferred Temperature</label></td>
                                <td><Select options={temperatureOptions} value={this.state.preferredTemperature} onChange={this.temperatureChange}/></td>
                            </tr>
                            <tr>
                                <td><label>Preferred Weather</label></td>
                                <td><Select options={weatherOptions} value={this.state.preferredWeather} onChange={this.weatherChange}/></td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td><button type="button" onClick={this.handleReset}>Reset</button></td>
                                <td><button type="button" onClick={this.handleSubmit}>Go!</button></td>
                            </tr>
                        </tfoot>
                    </table>
                </form>
            </div>
        )

        return element;
    }
}

export default Home;