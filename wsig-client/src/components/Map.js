import React from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lng: this.props.dptLng,
            lat: this.props.dptLat,
            zoom: 8
        }
    }

    async componentDidMount() {
        const map = new mapboxgl.Map({
          container: this.mapContainer,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [this.state.lng, this.state.lat],
          zoom: this.state.zoom
        });

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

    render() {
        return (
          <div className="mapContainer">
            <div ref={el => this.mapContainer = el} className="map"/>
          </div>
        )
      }
}

export default Map;