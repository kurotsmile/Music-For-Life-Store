class Songs_year{

    lang="en";

    show(){
        m.loading();
        var l_new=m.song_year.getListByLang(this.lang);
        this.loadListByData(l_new);      
    }

    loadListByData(data){
        data.sort(function(a, b) {
            return new Date(b.name) - new Date(a.name);
        });
        m.act_menu("m-year");
        m.clear();
        $.each(data,function(index,y){
            var yearItem=m.box_item('timer_music.png',y.name,'<i class="fas fa-music"></i> '+y.amount+' song (<i class="fas fa-globe-asia"></i> '+y.lang+')');
            $(yearItem).click(()=>{
                m.song.showListSongByMeta('year',y.name,m.song_year.lang);
            });
            m.add_item(yearItem);
        });
        this.showListCountry();
    }

    showListCountry(){
        $('#sub_title').html('');
        $.each(m.song.list_lang,function(index,l){
            var btn_l=$(`<button class="btn btn-sm ${(m.song_year.lang === l.name ? "active" : l.name)} m-1 btn-c btn_l">${l.name}</button>`);
            $(btn_l).click(()=>{
                m.song_year.lang=l.name;
                var l_new=m.song_year.getListByLang(l.name);
                m.song_year.loadListByData(l_new);
            });
            $('#sub_title').append(btn_l);
        });

        if(cr.dev){
            var btn_download=$(`<button class="btn btn-sm m-1 btn-c btn_l"><i class="fas fa-arrow-alt-circle-down"></i></button>`);
            $(btn_download).click(()=>{
                var data_download={};
                data_download["all_item"]=m.list_year;
                data_download["collection"]='song_year';
                cr.download(data_download,"song_year.json");
            });
            $('#sub_title').append(btn_download);
        }
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