class Music{
    list_artist=[];
    list_year=[];
    list_genre=[];
    lang="en";

    m_menu="";

    file_avatar=["avatar_music.png","song_1.png","song_2.png","song_3.png","song_4.png","song_5.png","song_6.png","song_7.png"];

    url_data="https://raw.githubusercontent.com/kurotsmile/Database-Store-Json/main/song.json";
    //url_data="https://drive.google.com/uc?export=download&id=1UcsqJa0wh3GwMKFyH3RXWID-FQPoKb-U";
    unlock_all_mp3=false;

    onLoad(){
        cr.setSiteName("Music For Life Store");
        cr.setSiteUrl("https://music-for-life-drab.vercel.app");
        cr.set_color_btn("#ff8c00");
        cr.setVer("0.3");
        cr.loadJs("js/songs.js","song");
        cr.loadJs("cr_player/cr_player.js","cr_player","onCreate");
        cr.onLoad();
        cr.act_done_pay=(data)=>{m.check_pay(data);};
        if(localStorage.getItem("unlock_all_mp3")!=null){
            if(localStorage.getItem("unlock_all_mp3")=="1") this.unlock_all_mp3=true;
        }
    }

    show_list_song(){
        m.song.show();
    }

    show_list_year(){
        cr.loadJs("js/songs_year.js","song_year","show");
    }

    show_list_artist(){
        cr.loadJs("js/songs_artist.js","song_artist","show");
    }

    show_list_genre(){
        cr.loadJs("js/songs_genre.js","song_genre","show");
    }

    act_menu(id){
        $(".btn-m").removeClass("text-white");
        $("#"+id).addClass("text-white");
        this.m_menu=id;
    }

    addOrUpdateObjectToList(list_obj, data_obj_add) {
        var addedOrUpdate = false;
        for (var i = 0; i < list_obj.length; i++) {
            if (list_obj[i].name === data_obj_add.name && list_obj[i].lang === data_obj_add.lang) {
                list_obj[i].amount = (list_obj[i].amount || 0) + 1;
                addedOrUpdate = true;
                break;
            }
        }

        if (!addedOrUpdate) {
            data_obj_add.amount=1;
            list_obj.push(data_obj_add);
        }
    }

    show_about(){
        this.act_menu("m-about");
        var lang_show="";
        if(this.lang=="all")
            lang_show="en";
        else
            lang_show=this.lang;

        cr.get("about/"+lang_show+".html",(data)=>{
            $("#container").html(data);
        });
    }

    download_artist(){
        var data_download={};
        data_download["all_item"]=m.list_artist;
        data_download["collection"]='song_artist';
        m.download_json(data_download,"song_artist.json");
    }
    
    download_year(){
        var data_download={};
        data_download["all_item"]=m.list_year;
        data_download["collection"]='song_year';
        m.download_json(data_download,"song_year.json");
    }

    download_genre(){
        var data_download={};
        data_download["all_item"]=m.list_genre;
        data_download["collection"]='song_genre';
        m.download_json(data_download,"song_genre.json");
    }

    download_song(){
        var data_download={};
        var list_new=[];
        $(m.song.list_song).each(function(index,s){
            delete(s["index"]);
            list_new.push(s);
        });
        data_download["all_item"]=list_new;
        data_download["collection"]='song';
        m.download_json(data_download,"song.json");
    }
    
    download_json(data,file_name){
        var jsonString = JSON.stringify(data);
        var blob = new Blob([jsonString], { type: "application/json" });
    
        var url = URL.createObjectURL(blob);
        
        var a = document.createElement('a');
        a.href = url;
        a.download = file_name;
        a.click();
        URL.revokeObjectURL(url);
    }

    show_setting(){
        var html_extension='';
        if(cr.dev){
            html_extension+='<div class="form-group">';
            html_extension+='<label for="unlockallmp3"><i class="fas fa-database"></i> Database Json</label>';
            html_extension+='<div class="d-block">';
            html_extension+='<button class="btn btn-dark m-1 btn-sm" onclick="m.download_song();return false"><i class="fas fa-download"></i> Download Song</button>';
            html_extension+='<button class="btn btn-dark m-1 btn-sm" onclick="m.download_artist();return false"><i class="fas fa-download"></i> Download Artist</button>';
            html_extension+='<button class="btn btn-dark m-1 btn-sm" onclick="m.download_genre();return false"><i class="fas fa-download"></i> Download Genre</button>';
            html_extension+='<button class="btn btn-dark m-1 btn-sm" onclick="m.download_year();return false"><i class="fas fa-download"></i> Download Year</button>';
            html_extension+='<button class="btn btn-dark m-1 btn-sm" onclick="m.download_site_map();return false"><i class="fas fa-download"></i> Download Site Map</button>';
            html_extension+='</div>';
            html_extension+='</div>';
        }

        if(this.unlock_all_mp3==false){
            html_extension+='<div class="form-group">';
            html_extension+='<label for="unlockallmp3"><i class="fas fa-shopping-cart"></i> Buy functionality</label>';
            html_extension+='<button class="btn btn-dark m-1" onclick="m.show_pay_unlock_all_mp3();return false"><i class="fas fa-unlock-alt"></i> Unlock Mp3 music download function</button>';
            html_extension+='<small class="form-text text-muted">Buy once and use unlimited mp3 file downloads forever</small>';
            html_extension+='</div>';
        }
        cr.show_setting((setting)=>{
            m.lang=setting.lang;
            m.song.lang=m.lang;
            if(m.song_artist!=null) m.song_artist.lang=m.lang;
            if(m.song_year!=null) m.song_year.lang=m.lang;
            if(m.song_genre!=null) m.song_genre.lang=m.lang;
            if(m.m_menu=="m-music") m.show_list_song();
            if(m.m_menu=="m-artist") m.show_list_artist();
            if(m.m_menu=="m-year") m.show_list_year();
            if(m.m_menu=="m-genre") m.show_list_genre();
            if(m.m_menu=="m-pp") m.show_pp();
        },html_extension);
    }

    show_pp(){
        cr.show_pp("#container",()=>{
            m.act_menu("m-pp");
            cr.top();
        });
    }

    show_tos(){
        cr.show_tos("#container",()=>{
            m.act_menu("m-tos");
            cr.top();
        });
    }

    show_search(){
        cr.showSearch((val)=>{
            m.key_search=val;
            cr.loadJs("js/search.js","search","show");
        });
    }

    getCurrentDateFormatted() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    download_site_map(){
        var xml='<?xml version="1.0" encoding="UTF-8"?>';
        xml+='<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
            $(m.song.list_song).each(function(index,s){
                xml+='<url>';
                xml+='<loc>'+cr.site_url+'?song='+s.name.trim()+'</loc>';
                xml+='<lastmod>'+m.getCurrentDateFormatted()+'</lastmod>';
                xml+='<changefreq>monthly</changefreq>';
                xml+='<priority>0.8</priority>';
                xml+='</url>';
            })
        xml+='</urlset>';
        var blob = new Blob([xml], { type: "application/xml" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "sitemap.xml";
        a.click();
        URL.revokeObjectURL(url);
    }

    show_pay_unlock_all_mp3(){
        cr.show_pay("Unlock AlL Mp3 download","Unlock Mp3 music download function, you do not need to buy each song once you have paid for this item","6.99","1","unlock_all_mp3");
    }

    check_pay(data){
        if(data.type=="unlock_all_mp3"){
            m.unlock_all_mp3=true;
        }
    }
}

var m;
$(document).ready(function() {
    m=new Music();
    m.onLoad();

    var scrollTopBtn = $("#scrollTopBtn");

    $(window).scroll(function() {
         var windowHeight = $(window).height();
         var scrollTop = $(window).scrollTop();
 
         if (scrollTop > windowHeight / 2) {
             scrollTopBtn.fadeIn();
         } else {
             scrollTopBtn.fadeOut();
         }
    });
 
    scrollTopBtn.click(function() {
         $("html, body").animate({ scrollTop: 0 }, "slow");
         return false;
    });
});