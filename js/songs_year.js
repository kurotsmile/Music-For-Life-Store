class Songs_year{

    emp_list_year="";
    emp_list_country="";

    lang="all";

    show(){

        var container=$("#container");
        $(container).html('');
        this.emp_list_country=$('<div class="col-12 text-center mb-2" id="list_country"></div>');
        this.emp_list_year=$('<div class="song-list col-12 pl-3 pr-3" id="song-list"></div>');
        $(container).append(this.emp_list_country);
        $(container).append(this.emp_list_year);
        this.loadListByData(m.list_year);      
    }

    loadListByData(data){
        $(m.song_year.emp_list_year).html('');

        $.each(data,function(index,y){
            var songItem = `<div role="button" class="song-item">
            <img src="images/timer_music.png" alt="Avatar Year" class="song-avatar">
            <div class="song-title">${y.name}</div>
            <div class="song-artist"><i class="fas fa-music"></i> ${y.amount} song (<i class="fas fa-globe-asia"></i> ${y.lang})</div>
            </div>`;
            $(m.song_year.emp_list_year).append(songItem);
        });
        this.showListCountry();
    }

    showListCountry(){
        $(this.emp_list_country).html('');

        var btn_all_l=$(`<button class="btn btn-sm ${(m.song_year.lang === "all" ? "active" : "all")} m-1 btn-c btn_l"><i class="fas fa-globe"></i></button>`);
        $(this.emp_list_country).append(btn_all_l);
        $(btn_all_l).click(()=>{
            m.song_year.lang="all";
            m.song_year.loadListByData(m.list_year);
        });

        $.each(m.song.list_lang,function(index,l){
            var btn_l=$(`<button class="btn btn-sm ${(m.song_year.lang === l.name ? "active" : l.name)} m-1 btn-c btn_l">${l.name}</button>`);
            $(btn_l).click(()=>{
                m.song_year.lang=l.name;
                var l_new=m.song_year.getListByLang(l.name);
                m.song_year.loadListByData(l_new);
            });
            $(m.song_year.emp_list_country).append(btn_l);
        });

        var btn_download=$(`<button class="btn btn-sm m-1 btn-c btn_l"><i class="fas fa-arrow-alt-circle-down"></i></button>`);
        $(m.song_year.emp_list_country).append(btn_download);
        $(btn_download).click(()=>{
            m.donwload_year();
        });
    }

    getListByLang(lang){
        var list_art_query=[];
        $.each(m.list_year,function(index,y){
            if(y.lang==lang) list_art_query.push(y);
        });
        return list_art_query;
    }
}

var song_year=new Songs_year();
m.song_year=song_year;