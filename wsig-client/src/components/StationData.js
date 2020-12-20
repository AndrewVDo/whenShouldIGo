class DateData {
    constructor() {
        this.date = []
        this.data = []

        this.push = this.push.bind(this);
    }

    push(date, data) {
        this.date.push(date);
        this.data.push(data);
    }
}

class StationData {
    constructor(stationInfo, stationData, ix) {
        this.id = stationInfo.wmo[ix];
        this.name = stationInfo.name[ix];
        this.region = stationInfo.region[ix];

        this.latitude = stationInfo.latitude[ix];
        this.longitude = stationInfo.longitude[ix];
        this.distance = stationInfo.distance[ix];
        this.elevation = stationInfo.elevation[ix];

        this.popup = document.createElement('div'); //used to update popup on map

        this.push = this.push.bind(this);
        
    }

    push(date, data, attr) {
        if(!(attr in this)) {
            this[attr] = new DateData();
        }

        this[attr].push(date, data);
    }
}

export default StationData;