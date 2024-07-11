class Music{
    list_artist=[];
    list_year=[];
    list_genre=[];
    lang="en";

    m_menu="";

    file_avatar=["avatar_music.png","song_1.png","song_2.png","song_3.png","song_4.png","song_5.png","song_6.png","song_7.png"];

    url_data="https://raw.githubusercontent.com/kurotsmile/Database-Store-Json/main/song.json";

    onLoad(){
        cr.setSiteName("Music For Life Store");
        cr.set_color_btn("#ff8c00");
        cr.loadJs("js/songs.js","song");
        cr.loadJs("cr_player/cr_player.js","cr_player","onCreate");
        cr.onLoad();
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

    donwload_artist(){
        var data_download={};
        data_download["all_item"]=m.list_artist;
        data_download["collection"]='song_artist';
        m.download_json(data_download,"song_artist.json");
    }
    
    donwload_year(){
        var data_download={};
        data_download["all_item"]=m.list_year;
        data_download["collection"]='song_year';
        m.download_json(data_download,"song_year.json");
    }

    donwload_genre(){
        var data_download={};
        data_download["all_item"]=m.list_genre;
        data_download["collection"]='song_genre';
        m.download_json(data_download,"song_genre.json");
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
        });
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
}

var m;
$(document).ready(function() {
    m=new Music();
    m.onLoad();

    var scrollTopBtn = $("#scrollTopBtn");

    $(window).scroll(function() {
         var windowHeight = $(window).height();
         var scrollHeight = $(document).height();
         var scrollTop = $(window).scrollTop();
 
         if (scrollTop > windowHeight / 2) {
             scrollTopBtn.fadeIn();
         } else {
             scrollTopBtn.fadeOut();
         }
 
         var scrollRight = ($(window).width() - $('.container').offset().left - $('.container').width()) / 2 - 50;
         scrollTopBtn.css('right', scrollRight);
    });
 
    scrollTopBtn.click(function() {
         $("html, body").animate({ scrollTop: 0 }, "slow");
         return false;
    });
});