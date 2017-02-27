import { observable, autorun } from 'mobx';
import axios from 'axios';

class DemographicsDataStore {

    demographicsData = observable.shallowMap({});
    
    getDemographicsData(geoId) {
        let reqStr = '/api/users/demographics/';
        if (geoId) reqStr += '?locations__geo='+geoId;
        axios.get(reqStr)
            .then((response) => {
                this.demographicsData.set(geoId, response.data);
            });
    }

    

}

export default DemographicsDataStore;
