import axios from 'axios';

class GeoService {

  checkPostcode(postcode) {
    return axios.get("https://maps.googleapis.com/maps/api/geocode/json?components=postal_code%3A" + encodeURIComponent(postcode) + "&key=" + window.authSettings.googleMapsAPI);
  }

}

export default new GeoService;
