import React from 'react'
import CountryOptions from './CountryOptions'

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

const timeframeEnum = ({
    "none"      :   0,
    "month"     :   1,
    "6months"   :   2,
    "year"      :   3
});

Object.freeze(temperatureEnum);
Object.freeze(weatherEnum);
Object.freeze(timeframeEnum);

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
            timeframe: timeframeEnum.none,
            countryList: []
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
        try {
            let response = await fetch("https://restcountries-v1.p.rapidapi.com/all", {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "08181ebff5mshfa3fb616d86e8cep17fdd3jsnb5b413f70f8a",
                    "x-rapidapi-host": "restcountries-v1.p.rapidapi.com"
                }
            })
            return response.json()
        }
        catch(error) {
            console.log(error)
        }
    }

    getAirportList() {
        fetch("https://airport-info.p.rapidapi.com/airport", {
            "method": "GET",    
            "headers": {
                "x-rapidapi-key": "08181ebff5mshfa3fb616d86e8cep17fdd3jsnb5b413f70f8a",
                "x-rapidapi-host": "airport-info.p.rapidapi.com"
            }
        })
        .then(response => {
            console.log(response)
        })
        .catch(err => {
            console.error(err);
        });
    }

    handleSubmit(event) {
        //...
    }

    departureCountryChange(event) {
        this.setState({departureCountry: event.value})
    }

    departureChange(event) {
        this.setState({departure: event.value})
    }

    destinationCountryChange(event) {
        this.setState({destinationCountry: event.value})
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

    timeframeChange(event) {
        //...
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
                            <td><input type="text" value={this.state.departure} onChange={this.departureChange}></input></td>
                        </tr>
                        <tr>
                            <td><label>Destination Country</label></td>
                            <td><CountryOptions stateVar={this.state.destinationCountry} changeCB={this.destinationCountryChange} countryList={this.state.countryList}></CountryOptions></td>
                        </tr>
                        <tr>
                            <td><label>Destination Airport</label></td>
                            <td><input type="text" value={this.state.destination} onChange={this.destinationChange}></input></td>
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
                        <tr>
                            <td><label>Timeframe</label></td>
                            <td><select value={this.state.timeframe} onChange={this.timeframeChange}>
                                <option value={timeframeEnum.none}>None</option>
                                <option value={timeframeEnum.month}>Within 1 month</option>
                                <option value={timeframeEnum["6months"]}>Within 6 months</option>
                                <option value={timeframeEnum.year}>Within 1 year</option>
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