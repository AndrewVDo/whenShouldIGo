import React from 'react'
import CountryOptions from './CountryOptions'
import AirportOptions from './AirportOptions'

const temperatureEnum = ({
    "none"      :   0,
    "freezing"  :   1,
    "cold"      :   2,
    "cool"      :   3,
    "warm"      :   4,
    "hot"       :   5
});

const weatherEnum = ({
    "none"      :   0,
    "snowy"     :   1,
    "rainy"     :   2,
    "cloudy"    :   3,
    "sunny"     :   4
});

Object.freeze(temperatureEnum);
Object.freeze(weatherEnum);

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            departureCountry: "",
            departure: "",
            destinationCountry: "",
            destination: "",
            preferredTemperature: temperatureEnum.none,
            preferredWeather: weatherEnum.none,
            countryList: [],
            departureAirports: [],
            destinationAirports : []
        };

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
        console.log(process.env)
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

    handleSubmit(event) {
        //...
    }

    departureCountryChange(event) {
        this.setState({
            departureCountry: event.target.value,
        })
        this.getAirportList(event.target.value).then((airportList) => {
            this.setState({departureAirports: airportList})
        })
    }

    departureChange(event) {
        this.setState({departure: event.target.value})
    }

    async destinationCountryChange(event) {
        this.setState({
            destinationCountry: event.target.value,
        })
        this.getAirportList(event.target.value).then((airportList) => {
            this.setState({destinationAirports: airportList})
        })
    }

    destinationChange(event) {
        this.setState({destination: event.value})
    }

    temperatureChange(event) {
        this.setState({preferredTemperature: event.value})
    }

    weatherChange(event) {
        this.setState({preferredWeather: event.value})
    }


    render() {  
        var element = (
            <div className="home-form">
                <form onSubmit={this.handleSubmit}>
                    <table><tbody>
                        <tr>
                            <td><label>Departure Country</label></td>
                            <td><CountryOptions stateVar={this.state.departureCountry} changeCB={this.departureCountryChange} countryList={this.state.countryList}></CountryOptions></td>
                        </tr>
                        <tr>
                            <td><label>Departure Airport</label></td>
                            <td><AirportOptions stateVar={this.state.departure} changeCB={this.departureChange} airportList={this.state.departureAirports}></AirportOptions></td>
                        </tr>
                        <tr>
                            <td><label>Destination Country</label></td>
                            <td><CountryOptions stateVar={this.state.destinationCountry} changeCB={this.destinationCountryChange} countryList={this.state.countryList}></CountryOptions></td>
                        </tr>
                        <tr>
                            <td><label>Destination Airport</label></td>
                            <td><AirportOptions stateVar={this.state.destination} changeCB={this.destinationChange} airportList={this.state.destinationAirports}></AirportOptions></td>
                        </tr>
                        <tr>
                            <td><label>Preferred Temperature</label></td>
                            <td><select value={this.state.preferredTemperature} onChange={this.temperatureChange}>
                                <option value={temperatureEnum.none}>None</option>
                                <option value={temperatureEnum.freezing}>Freezing</option>
                                <option value={temperatureEnum.cold}>Cold</option>
                                <option value={temperatureEnum.cool}>Cool</option>
                                <option value={temperatureEnum.warm}>Warm</option>
                                <option value={temperatureEnum.hot}>Hot</option>
                            </select></td>
                        </tr>
                        <tr>
                            <td><label>Preferred Weather</label></td>
                            <td><select value={this.state.preferredWeather} onChange={this.weatherChange}>
                                <option value={weatherEnum.none}>None</option>
                                <option value={weatherEnum.snowy}>Snowy</option>
                                <option value={weatherEnum.rainy}>Rainy</option>
                                <option value={weatherEnum.cloudy}>Cloudy</option>
                                <option value={weatherEnum.sunny}>Sunny</option>
                            </select></td>
                        </tr>
                    </tbody></table>
                </form>
            </div>
        )

        return element;
    }
}

export default Home;