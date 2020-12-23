import React from 'react';
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl';
import MapPopup from './MapPopup'

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmV3ZDExMjAiLCJhIjoiY2tpcXNpbDRyMXphbzJxbmFyYnFhYzE4MiJ9.3yLy7Fp28bQw_tvvbpONhA';

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lng: this.props.dptLng,
            lat: this.props.dptLat,
            zoom: 8,
        }
    }

    async componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });

        this.markWeatherStations(map, this.props.stationMap)

        setTimeout(() => {
            map.flyTo({
                center: [
                    this.props.dstLng,
                    this.props.dstLat
                ],
                essential: true
            })
        }, 3000)
    }

    componentDidUpdate() {
        this.updateWeatherStations(this.props.stationMap)
    }

    markWeatherStations(map, stationMap) {
        if (!map || !stationMap) {
            return;
        }

        for (const [stationId, stationData] of Object.entries(stationMap)) {
            new mapboxgl.Marker()
                .setLngLat([stationData.longitude, stationData.latitude])
                .setPopup(new mapboxgl.Popup({ offset: 5 })
                    .setDOMContent(stationData.popup))
                .addTo(map)

        }

        this.updateWeatherStations(stationMap)
    }

    updateWeatherStations(stationMap) {
        for (const [stationId, stationData] of Object.entries(stationMap)) {
            ReactDOM.render(<MapPopup
                stationData={stationData}
                month={this.props.month}
            />, stationData.popup);
        }
    }

    render() {
        return (
            <div className="mapContainer">
                <div ref={el => this.mapContainer = el} className="map" />
            </div>
        )
    }
}

export default Map;