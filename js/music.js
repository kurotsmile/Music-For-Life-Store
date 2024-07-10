class Music{
    list_artist=[];
    list_year=[];
    list_genre=[];
    lang="en";

    onLoad(){
        cr.set_color_btn("#ff8c00");
        cr.loadJs("js/songs.js","song");
        cr.loadJs("cr_player/cr_player.js","cr_player","onCreate");
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

    act_menu(id){
        $(".btn-m").removeClass("text-white");
        $("#"+id).addClass("text-white");
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