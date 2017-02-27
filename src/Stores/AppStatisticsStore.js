import { observable, autorun } from 'mobx';
import axios from 'axios';

class AppStatisticsStore {

    advancedData = observable.shallowMap({});

    getAdvancedStatsData(geoId) {
        axios.get('/api/advanced_stats/')
            .then((response) => {
                this.advancedData.set("start", response.data.results.start);
                this.advancedData.set("end", response.data.results.end);
                for(let key in response.data.results.data) {
                    this.advancedData.set(key, response.data.results.data[key]);
                }
            });
    }



}

export default AppStatisticsStore;
