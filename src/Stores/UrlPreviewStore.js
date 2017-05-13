import { observable, autorun } from 'mobx';

class UrlPreviewStore {

    getAdvancedStatsData(url, fb) {
        window.API.get('http://api.embed.ly/1/oembed?key=0c0d9f6d6dd54ae58f290d352cdfa071&url='+url).then(
          res => {
            fb(res.data);
          }
        );
    }
}

export default UrlPreviewStore;
