class Songs_Artist{

    emp_list_artist="";
    emp_list_country="";

    lang="all";

    show(){
        var container=$("#container");
        $(container).html('');
        this.emp_list_country=$('<div class="col-12 text-center mb-2" id="list_country"></div>');
        this.emp_list_artist=$('<div class="song-list col-12 pl-3 pr-3" id="song-list"></div>');
        $(container).append(this.emp_list_country);
        $(container).append(this.emp_list_artist);
        this.loadListByData(m.list_artist);
    }

    loadListByData(data){
        m.act_menu("m-artist");
        $(this.emp_list_artist).html('');
        $.each(data,function(index,a){
            var artistItem = $(`<div role="button" class="song-item">
            <img src="images/singer.png" alt="Avatar Artist" class="song-avatar">
            <div class="song-title">${a.name}</div>
            <div class="song-artist"><i class="fas fa-music"></i> ${a.amount} song (<i class="fas fa-globe-asia"></i> ${a.lang})</div>
            </div>`);

            $(artistItem).click(function(){
                m.song.showListSongByMeta('artist',a.name);
            });
            $(m.song_artist.emp_list_artist).append(artistItem);
        });
        this.showListCountry();
    }

    showListCountry(){
        $(this.emp_list_country).html('');

        var btn_all_l=$(`<button class="btn btn-sm ${(m.song_artist.lang === "all" ? "active" : "all")} m-1 btn-c btn_l"><i class="fas fa-globe"></i></button>`);
        $(this.emp_list_country).append(btn_all_l);
        $(btn_all_l).click(()=>{
            m.song_artist.lang="all";
            m.song_artist.loadListByData(m.list_artist);
        });

        $.each(m.song.list_lang,function(index,l){
            var btn_l=$(`<button class="btn btn-sm ${(m.song_artist.lang === l.name ? "active" : l.name)} m-1 btn-c btn_l">${l.name}</button>`);
            $(btn_l).click(()=>{
                m.song_artist.lang=l.name;
                var l_new=m.song_artist.getListByLang(l.name);
                m.song_artist.loadListByData(l_new);
            });
            $(m.song_artist.emp_list_country).append(btn_l);
        });

        var btn_download=$(`<button class="btn btn-sm m-1 btn-c btn_l"><i class="fas fa-arrow-alt-circle-down"></i></button>`);
        $(this.emp_list_country).append(btn_download);
        $(btn_download).click(()=>{
            m.donwload_artist();
        });
    }

    getListByLang(lang){
        var list_art_query=[];
        $.each(m.list_artist,function(index,a){
            if(a.lang==lang) list_art_query.push(a);
        });
        return list_art_query;
    }

}
var song_artist=new Songs_Artist();
m.song_artist=song_artist;