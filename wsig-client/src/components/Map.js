import React from 'react';
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl';
import MapPopup from './MapPopup'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lng: this.props.dptLng,
            lat: this.props.dptLat,
            zoom: 8
        }

        this.markWeatherStations = this.markWeatherStations.bind(this)
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
    
    markWeatherStations(map, stationMap) {
      if(!map || !stationMap) {
        return;
      }

      for ( const[stationId, stationData] of Object.entries(stationMap)) {
        const placeholder = document.createElement('div');
        ReactDOM.render(<MapPopup 
          stationData={stationData} 
          month={3}
        />, placeholder);

        new mapboxgl.Marker()
          .setLngLat([stationData.longitude, stationData.latitude])
          .setPopup(new mapboxgl.Popup({offset:25})
            .setDOMContent(placeholder))
          .addTo(map)

      }
    }

    render() {
        return (
          <div className="mapContainer">
            <div ref={el => this.mapContainer = el} className="map"/>
          </div>
        )
      }
}

export default Map;