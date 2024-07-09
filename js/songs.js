class Songs{

    list_song=[];
    list_lang=[];
    list_country=null;

    emp_list_song=null;
    lang="all";

    show(){
        var container=$("#container");
        $(container).html('');
        this.list_country=$('<div class="col-12 text-center mb-2" id="list_country"></div>');
        this.emp_list_song=$('<div class="song-list col-12 pl-3 pr-3" id="song-list"><div><i class="fas fa-spinner fa-spin"></i> Loading...</div></div>');
        $(container).append(this.list_country);
        $(container).append(this.emp_list_song);
        
        if(this.list_song.length==0){
            $.getJSON("https://raw.githubusercontent.com/kurotsmile/Database-Store-Json/main/song.json", function(data) {
    
                $.each(data.all_item, function(index, song) {
                    var obj_artist={"name":song.artist,"lang":song.lang};
                    m.addOrUpdateObjectToList(m.list_artist,obj_artist);
    
                    var obj_year={"name":song.year,"lang":song.lang};
                    m.addOrUpdateObjectToList(m.list_year,obj_year);
    
                    var obj_lang={"name":song.lang,"lang":song.lang};
                    m.addOrUpdateObjectToList(m.song.list_lang,obj_lang);
                    m.song.list_song.push(song);
                });
    
                m.song.showListSongByData(m.song.list_song);
            });
        }else{
            m.song.showListSongByData(m.song.list_song);
        }
    }

    showListSongByData(data){
        m.act_menu("m-music");
        $(m.song.emp_list_song).html('');
            $.each(data, function(index, song) {
                var obj_artist={"name":song.artist,"lang":song.lang};
                m.addOrUpdateObjectToList(m.list_artist,obj_artist);

                var obj_year={"name":song.year,"lang":song.lang};
                m.addOrUpdateObjectToList(m.list_year,obj_year);

                var obj_lang={"name":song.lang,"lang":song.lang};
                m.addOrUpdateObjectToList(m.song.list_lang,obj_lang);
                
                var songItem = $(`<div role="button" class="song-item" data-src="${song.mp3}" data-title="${song.name}" data-artist="${song.artist}">
                                    <img src="images/avatar_music.png" alt="Avatar" class="song-avatar">
                                    <div class="song-title">${song.name}</div>
                                    <div class="song-artist">${song.artist}</div>
                                    <div class="btninfo btn-extension"><i class="fas fa-info-circle"></i></div>
                                    <div class="btnvideo btn-extension"><i class="fab fa-youtube"></i></div>
                                    <div class="btnplay btn-extension"><i class="fas fa-play-circle"></i></div>
                                </div>`);
                var btn_info=$(songItem).find(".btninfo");
                $(btn_info).click(()=>{
                    var lyrics='';
                    var containsHtmlTags = /<\/?[a-z][\s\S]*>/i.test(song.lyrics);
                    if(containsHtmlTags) lyrics=$(song.lyrics).text();
                    else lyrics=song.lyrics;
                    Swal.fire({
                        icon:"info",
                        title:song.name,
                        text:lyrics,
                        iconColor: cr.color_btn,
                        confirmButtonColor: cr.color_btn
                    });
                    return false;
                });

                var btn_video=$(songItem).find(".btnvideo");
                $(btn_video).click(()=>{
                    var html='<iframe width="100%" height="315" src="https://www.youtube.com/embed/'+m.song.getYouTubeVideoId(song.link_ytb)+'?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
                    Swal.fire({
                        icon:"info",
                        title:song.name,
                        html:html,
                        iconColor: cr.color_btn,
                        confirmButtonColor: cr.color_btn
                    });
                    return false;
                });

                $(m.song.emp_list_song).append(songItem);
            });

            $('.song-item').click(function() {
                var songSrc = $(this).data('src');
                var songTitle = $(this).data('title');
                var songArtist = $(this).data('artist');

                $('#player-song-title').text(songTitle);
                $('#player-song-artist').text(songArtist);
                $('#mp3-player').find('audio').remove();
                $('#mp3-player').append(`<audio src="${songSrc}" id="audio-player" controls autoplay></audio>`);

                var audioPlayer = $('#audio-player')[0];

                $('#mp3-player').addClass('active');
        
                $('#play-btn').off('click').click(function() {
                    if (audioPlayer.paused) {
                        audioPlayer.play();
                        $(this).html('&#10074;&#10074;');
                    } else {
                        audioPlayer.pause();
                        $(this).html('&#9654;');
                    }
                });

                $('#prev-btn').off('click').click(function() {
                    // Implement previous song functionality if needed
                });

                $('#next-btn').off('click').click(function() {

                });

                $('#play-btn').html('&#10074;&#10074;');
            });

            m.song.showListCountry();
    }

    getYouTubeVideoId(url) {
        var regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        var match = url.match(regex);
        return (match && match[1]) ? match[1] : null;
    }

    showListCountry(){
        $(m.song.list_country).html('');

        var btn_all_l=$(`<button class="btn btn-sm ${(m.song.lang === "all" ? "active" : "all")} m-1 btn-c btn_l"><i class="fas fa-globe"></i></button>`);
        $(m.song.list_country).append(btn_all_l);
        $(btn_all_l).click(()=>{
            m.song.lang="all";
            m.song.showListSongByData(m.song.list_song);
        });

        $.each(m.song.list_lang,function(index,l){
            var btn_l=$(`<button class="btn btn-sm ${(m.song.lang === l.name ? "active" : l.name)} m-1 btn-c btn_l">${l.name}</button>`);
            $(btn_l).click(()=>{
                m.song.lang=l.name;
                var l_new=m.song.showListSongByMeta("lang",l.name);
                m.song.showListSongByData(l_new);
            });
            $(m.song.list_country).append(btn_l);
        });
    }

    showListSongByMeta(filed,val){
        var list_s=[];
        $(m.song.list_song).each(function(index,s){
            if(s[filed]==val) list_s.push(s);
        });
        return list_s;
    }

}
var song=new Songs();
m.song=song;
