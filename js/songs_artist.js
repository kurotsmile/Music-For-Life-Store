class Songs_Artist{

    lang="all";

    show(){
        this.lang=m.lang;
        m.loading();
        if(this.lang=="all")
            this.loadListByData(m.list_artist);
        else{
            var l_new=m.song_artist.getListByLang(this.lang);
            m.song_artist.loadListByData(l_new);
        }
    }

    loadListByData(data){
        m.act_menu("m-artist");
        m.clear();
        $.each(data,function(index,a){
            var artistItem=m.box_item("singer.png",a.name,'<i class="fas fa-music"></i> '+a.amount+' song (<i class="fas fa-globe-asia"></i> '+a.lang+')');
            $(artistItem).click(function(){
                m.song.showListSongByMeta('artist',a.name,m.song_artist.lang);
            });
            m.add_item(artistItem);
        });
        this.showListCountry();
    }

    showListCountry(){
        $('#sub_title').html('');

        var btn_all_l=$(`<button class="btn btn-sm ${(m.song_artist.lang === "all" ? "active" : "all")} m-1 btn-c btn_l"><i class="fas fa-globe"></i></button>`);
        $(btn_all_l).click(()=>{
            m.song_artist.lang="all";
            m.song_artist.loadListByData(m.list_artist);
        });
        $('#sub_title').append(btn_all_l);

        $.each(m.song.list_lang,function(index,l){
            var btn_l=$(`<button class="btn btn-sm ${(m.song_artist.lang === l.name ? "active" : l.name)} m-1 btn-c btn_l">${l.name}</button>`);
            $(btn_l).click(()=>{
                m.song_artist.lang=l.name;
                var l_new=m.song_artist.getListByLang(l.name);
                m.song_artist.loadListByData(l_new);
            });
            $('#sub_title').append(btn_l);
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