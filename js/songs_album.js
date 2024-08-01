class Songs_Album{

    lang="all";

    show(){
        this.lang=m.lang;
        m.loading();
        if(this.lang=="all")
            this.loadListByData(m.list_album);
        else{
            var l_new=m.song_album.getListByLang(this.lang);
            m.song_album.loadListByData(l_new);
        }
    }

    loadListByData(data){
        data.sort(function(a, b) {
            return new Date(b.name) - new Date(a.name);
        });
        m.act_menu("m-album");
        m.clear();
        $.each(data,function(index,a){
            var albumItem=m.box_item("type_car.png",a.name,'<i class="fas fa-music"></i> '+a.amount+' song (<i class="fas fa-globe-asia"></i> '+a.lang+')');
            $(albumItem).click(function(){
                m.song.showListSongByMeta('album',a.name,m.song_album.lang);
            });
            m.add_item(albumItem);
        });
        this.showListCountry();
    }

    showListCountry(){
        $('#sub_title').html('');

        var btn_all_l=$(`<button class="btn btn-sm ${(m.song_album.lang === "all" ? "active" : "all")} m-1 btn-c btn_l"><i class="fas fa-globe"></i></button>`);
        $(btn_all_l).click(()=>{
            m.song_album.lang="all";
            m.song_album.loadListByData(m.list_album);
        });
        $('#sub_title').append(btn_all_l);

        $.each(m.song.list_lang,function(index,l){
            var btn_l=$(`<button class="btn btn-sm ${(m.song_album.lang === l.name ? "active" : l.name)} m-1 btn-c btn_l">${l.name}</button>`);
            $(btn_l).click(()=>{
                m.song_album.lang=l.name;
                var l_new=m.song_album.getListByLang(l.name);
                m.song_album.loadListByData(l_new);
            });
            $('#sub_title').append(btn_l);
        });

        if(cr.dev){
            var btn_download=$(`<button class="btn btn-sm m-1 btn-c btn_l"><i class="fas fa-arrow-alt-circle-down"></i></button>`);
            $(btn_download).click(()=>{
                var data_download={};
                data_download["all_item"]=m.list_album;
                data_download["collection"]='song_album';
                cr.download(data_download,"song_album.json");
            });
            $('#sub_title').append(btn_download);
        }
    }

    getListByLang(lang){
        var list_album_query=[];
        $.each(m.list_album,function(index,a){
            if(a.lang==lang) list_album_query.push(a);
        });
        return list_album_query;
    }
}
var song_album=new Songs_Album();
m.song_album=song_album;
