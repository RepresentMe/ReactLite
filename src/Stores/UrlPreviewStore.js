import { observable, autorun } from 'mobx';

class UrlPreviewStore {

    getAdvancedStatsData(url, fb) {
      window.API.get('https://api.embed.ly/1/oembed?key=63696211820e49e2b2d61dd0f47996f4&url='+url).then(
          res => {
            fb(res.data);
          }
        );
    }
}

export default UrlPreviewStore;
