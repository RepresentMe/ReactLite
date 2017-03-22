import { observable, autorun } from 'mobx';

class DemographicsDataStore {

    usersDemographicsData = observable.shallowMap({});
    questionDemographicsData = observable.shallowMap({});

    getUsersDemographicsData(geoId) {
        let reqStr = '/api/users/demographics/';
        if (geoId) reqStr += '?locations__geo='+geoId;
        return window.API.get(reqStr)
            .then((response) => {
                this.usersDemographicsData.set(geoId, response.data);
                return response.data;
            });
    }

    getQuestionDemographicsData(data) {
        var reqArr = [
            'question='+data.questionId
        ];
        if (data.groupId) {
            reqArr.push('user__group_memberships__group='+data.groupId);
        }
        if (data.geoId) {
            reqArr.push('user__locations__geo=' + data.geoId);
        }
        return window.API.get('/api/question_demographics/?' + reqArr.join('&'))
            .then((response) => {
                this.questionDemographicsData.set(data.questionId, response.data);
                return response.data;
            });
    }



}

export default DemographicsDataStore;
