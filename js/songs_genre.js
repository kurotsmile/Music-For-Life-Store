class Songs_Genre{

    emp_list_genre="";
    emp_list_country="";

    lang="en";

    show(){
        var container=$("#container");
        $(container).html('');
        this.emp_list_country=$('<div class="col-12 text-center mb-2" id="list_country"></div>');
        this.emp_list_genre=$('<div class="song-list col-12 pl-3 pr-3" id="song-list"></div>');
        $(container).append(this.emp_list_country);
        $(container).append(this.emp_list_genre);
        var l_new=m.song_genre.getListByLang(this.lang);
        this.loadListByData(l_new);      
    }

    loadListByData(data){
        m.act_menu("m-genre");
        $(this.emp_list_genre).html('');

        $.each(data,function(index,g){
            var genreItem = $(`<div role="button" class="song-item">
            <img src="images/song_flower.png" alt="Avatar Genre" class="song-avatar">
            <div class="song-title">${g.name}</div>
            <div class="song-artist"><i class="fas fa-music"></i> ${g.amount} song (<i class="fas fa-globe-asia"></i> ${g.lang})</div>
            </div>`);
            $(genreItem).click(()=>{
                m.song.showListSongByMeta('genre',g.name,m.song_genre.lang);
            });
            $(m.song_genre.emp_list_genre).append(genreItem);
        });
        this.showListCountry();
    }

    showListCountry(){
        $(this.emp_list_country).html('');

        $.each(m.song.list_lang,function(index,l){
            var btn_l=$(`<button class="btn btn-sm ${(m.song_genre.lang === l.name ? "active" : l.name)} m-1 btn-c btn_l">${l.name}</button>`);
            $(btn_l).click(()=>{
                m.song_genre.lang=l.name;
                var l_new=m.song_genre.getListByLang(l.name);
                m.song_genre.loadListByData(l_new);
            });
            $(m.song_genre.emp_list_country).append(btn_l);
        });
    }

    getListByLang(lang){
        var list_query=[];
        $.each(m.list_genre,function(index,g){
            if(g.lang==lang) list_query.push(g);
        });
        return list_query;
    }
}
var song_genre=new Songs_Genre();
m.song_genre=song_genre;