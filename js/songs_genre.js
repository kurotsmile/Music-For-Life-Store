class Songs_Genre{

    lang="en";

    show(){
        m.loading();
        var l_new=m.song_genre.getListByLang(this.lang);
        this.loadListByData(l_new);      
    }

    loadListByData(data){
        m.act_menu("m-genre");
        m.clear();

        $.each(data,function(index,g){
            var genreItem=m.box_item('song_flower.png',g.name,'<i class="fas fa-music"></i> '+g.amount+' song (<i class="fas fa-globe-asia"></i> '+g.lang+')');
            $(genreItem).click(()=>{
                m.song.showListSongByMeta('genre',g.name,m.song_genre.lang);
            });
            m.add_item(genreItem);
        });
        this.showListCountry();
    }

    showListCountry(){
        $('#sub_title').html('');
        $.each(m.song.list_lang,function(index,l){
            var btn_l=$(`<button class="btn btn-sm ${(m.song_genre.lang === l.name ? "active" : l.name)} m-1 btn-c btn_l">${l.name}</button>`);
            $(btn_l).click(()=>{
                m.song_genre.lang=l.name;
                var l_new=m.song_genre.getListByLang(l.name);
                m.song_genre.loadListByData(l_new);
            });
            $('#sub_title').append(btn_l);
        });

        var btn_download=$(`<button class="btn btn-sm m-1 btn-c btn_l"><i class="fas fa-arrow-alt-circle-down"></i></button>`);
        $(btn_download).click(()=>{
            var data_download={};
            data_download["all_item"]=m.list_genre;
            data_download["collection"]='song_genre';
            cr.download(data_download,"song_genre.json");
        });
        $('#sub_title').append(btn_download);
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