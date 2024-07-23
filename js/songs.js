class Songs {

    list_song = [];
    list_lang = [];
    
    lang = "en";
    box_info_menu_cur = "none";
    file_avatar_song = "";

    view_song_by_query_url="";
    data_view_temp=null;

    show() {
        var agr_song_name=cr.arg("song");
        if(agr_song_name){
            this.view_song_by_query_url=agr_song_name;
        }

        m.loading();

        this.lang = m.lang;
        if (this.list_song.length == 0) {
            $.getJSON(m.url_data, function (data) {

                $.each(data.all_item, function (index, song) {

                    var obj_artist = { "name": song.artist, "lang": song.lang };
                    m.addOrUpdateObjectToList(m.list_artist, obj_artist);

                    var obj_year = { "name": song.year, "lang": song.lang };
                    m.addOrUpdateObjectToList(m.list_year, obj_year);

                    var obj_genre = { "name": song.genre, "lang": song.lang };
                    m.addOrUpdateObjectToList(m.list_genre, obj_genre);

                    var obj_lang = { "name": song.lang, "lang": song.lang };
                    m.addOrUpdateObjectToList(m.song.list_lang, obj_lang);

                    song['index']=index;
                    m.song.list_song.push(song);

                    if(m.song.view_song_by_query_url!=""&&m.song.data_view_temp==null){
                        if(song.name.toLowerCase().trim().indexOf(m.song.view_song_by_query_url.toLowerCase().trim())!==-1){
                            m.song.data_view_temp=song;
                        }
                    }
                });

                m.song.showListSong();
            });
        } else {
            this.showListSong();
        }
    }

    showListSong() {
        if (this.lang == "all")
            m.song.showListSongByData(m.song.list_song);
        else {
            var l_new = m.song.getListSongByMeta("lang", this.lang);
            m.song.showListSongByData(l_new);
        }

        if(this.data_view_temp!=null){
            this.showInfoByData(this.data_view_temp);
            if(history!=null) history.replaceState({}, cr.site_name, '/');
            this.data_view_temp=null;
            this.view_song_by_query_url="";
        }
    }

    randomAvatar() {
        this.file_avatar_song = cr.get_random(m.file_avatar);
    }

    showListSongByData(data) {
        m.act_menu("m-music");
        $("#all_item").html('');
        this.randomAvatar();
        $.each(data, function (index, song) {
            var empSong=m.song.songItemEmp(song);
            $(empSong).click(()=>{
                cr_player.play(song.mp3, song.name,song.artist);
            })
            $("#all_item").append(empSong);
        });
        m.song.showListCountry();
        $("[title]").tooltip();
    }

    songItemEmp(song) {
        var songItemEmp = m.box_item(this.file_avatar_song,song.name,song.artist);
        var songItem=$(songItemEmp).find(".song-item");
        var btn_info = $('<div class="btninfo btn-extension" title="Info"><i class="fas fa-info-circle"></i></div>');

        $(btn_info).click(() => {
            m.song.showInfoByData(song);
            return false;
        });
        $(songItem).append(btn_info);

        if (song.lyrics != null && song.lyrics != "") {
            var btnlyrics = $('<div class="btnlyrics btn-extension" title="Lyrics"><i class="fas fa-font"></i></div>');
            $(btnlyrics).click(() => {
                m.song.showlyrics(song);
                return false;
            });
            $(songItem).append(btnlyrics);
        }

        if (song.link_ytb != null) {
            var btn_video = $('<div class="btnvideo btn-extension" title="Watch video"><i class="fab fa-youtube"></i></div>');
            $(btn_video).click(() => {
                m.song.showVideo(song);
                return false;
            });
            $(songItem).append(btn_video);
        }

        var btn_download = $('<div class="btndownload btn-extension" title="Download song by file mp3"><i class="fas fa-arrow-alt-circle-down"></i></div>');
        $(btn_download).click(() => {
            if(m.unlock_all_mp3==false)
                cr.show_pay(song.name,'Pay to download and use mp3 files for use on your other devices!','2.00',song.mp3,'link');
            else
                window.open(song.mp3, '_blank').focus();
            return false;
        });
        $(songItem).append(btn_download);

        var btn_add_playlist=$('<div class="btnAddPlaylist btn-extension" title="Add this song to a playlist"><i class="fas fa-plus-circle"></i></div>');
        $(btn_add_playlist).click(()=>{
            cr_player.add_song(song.mp3, song.name, song.artist);
            return false;
        });
        $(songItem).append(btn_add_playlist);

        if(cr.dev){
            var btn_edit=$('<div class="btnEdit btn-extension" title="Edit info"><i class="fas fa-pen-square"></i></div>');
            $(btn_edit).click(()=>{
                var index_update=song["index"];
                delete(song["index"]);
                cr_data.edit(song,(db)=>{
                    song[index_update]=db;
                    Swal.fire({
                        icon:"success",
                        title:"Edit Song",
                        text:"Update Success!",
                        confirmButtonColor:cr.color_btn
                    });
                });
                return false;
            });
            $(songItem).append(btn_edit);
        }

        return songItemEmp;
    }

    showVideo(data) {
        m.song.box_info_menu_cur = "video";
        var html = '<iframe width="100%" height="315" src="https://www.youtube.com/embed/' + m.song.getYouTubeVideoId(data.link_ytb) + '?autoplay=0" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
        html += '<div id="all_btn_dock"></div>';
        Swal.fire({
            title: data.name,
            html: html,
            confirmButtonColor: cr.color_btn,
            didOpen: () => {
                m.song.menuSubInfoBox(data);
            }
        });
        cr_player.pause();
    }

    showlyrics(data) {
        m.song.box_info_menu_cur = "lyrics";
        var lyrics = '';
        var containsHtmlTags = /<\/?[a-z][\s\S]*>/i.test(data.lyrics);
        if (containsHtmlTags) lyrics = $(data.lyrics).text();
        else lyrics = data.lyrics;
        lyrics += '<div id="all_btn_dock"></div>';
        Swal.fire({
            title: data.name,
            html: lyrics,
            confirmButtonColor: cr.color_btn,
            didOpen: () => {
                m.song.menuSubInfoBox(data);
            }
        });
    }

    showInfoByData(data) {
        m.song.box_info_menu_cur = "info";
        var t_table_info = '<table class="table table-striped table-hover table-responsive fs-9 w-100 text-break" style="text-align:left;width:100%;display: table;">';
        t_table_info += '<tbody>';
        $.each(data, function (k, v) {
            if (v != "" && v != null) {
                if (k == "mp3") return true;
                if (k == "lyrics") return true;
                if (k == "avatar") return true;
                t_table_info += m.song.getValByKeyTable(k, v);
            }
        });
        t_table_info += '</tbody>';
        t_table_info += '</table>';
        t_table_info += '<div id="all_btn_dock"></div>';
        Swal.fire({
            icon: "info",
            title: data.name,
            html: t_table_info,
            confirmButtonColor: cr.color_btn,
            iconColor: cr.color_btn,
            didOpen: () => {
                m.song.menuSubInfoBox(data);
            }
        });
    }

    menuSubInfoBox(data) {
        var btn_play= $('<button class="btn btn-sm btn-c btn-msg m-1 animate__animated animate__bounceIn"  title="Play this song"><i class="fas fa-play"></i></button>');
        $(btn_play).click(()=>{
            cr_player.play(data.mp3, data.name, data.artist);
            $(this).tooltip('hide');
            Swal.close();
        });
        $("#all_btn_dock").append(btn_play);

        var btn_add_playlist= $('<button class="btn btn-sm btn-c btn-msg m-1 animate__animated animate__bounceIn"  title="Add this song to a playlist"><i class="fas fa-plus-circle"></i></button>');
        $(btn_add_playlist).click(()=>{
            cr_player.add_song(data.mp3, data.name, data.artist);
            $(this).tooltip('hide');
            Swal.close();
        });
        $("#all_btn_dock").append(btn_add_playlist);

        if (data.lyrics != null) {
            var btn_lyrics = $('<button class="btn btn-sm btn-c btn-msg ' + (m.song.box_info_menu_cur === "lyrics" ? "active" : "lyrics") + ' m-1 animate__animated animate__bounceIn" title="Lyrics"><i class="fas fa-font"></i></button>');
            $(btn_lyrics).click(function () { 
                m.song.showlyrics(data);
                $(this).tooltip('hide');
            });
            $("#all_btn_dock").append(btn_lyrics);
        }

        if (data.link_ytb != null) {
            var btn_ytb = $('<button class="btn btn-sm btn-c btn-msg ' + (m.song.box_info_menu_cur === "video" ? "active" : "lyrics") + ' m-1 animate__animated animate__bounceIn" title="Watch Video"><i class="fab fa-youtube"></i></button>');
            $(btn_ytb).click(function () { 
                m.song.showVideo(data);
                $(this).tooltip('hide');
             });
            $("#all_btn_dock").append(btn_ytb);
        }

        var btn_info = $('<button class="btn btn-sm btn-c btn-msg ' + (m.song.box_info_menu_cur === "info" ? "active" : "info") + ' m-1 animate__animated animate__bounceIn" title="Info Song"><i class="fas fa-info-circle"></i></button>');
        $(btn_info).click(function () { 
            m.song.showInfoByData(data);
            $(this).tooltip('hide'); 
        });
        $("#all_btn_dock").append(btn_info);

        var btn_share = $('<button class="btn btn-sm btn-c btn-msg m-1 animate__animated animate__bounceIn" title="Share"><i class="fas fa-share-alt"></i></button>');
        $(btn_share).click(function () {
            var link_share=cr.site_url+"?song="+data.name;
            $(this).tooltip('hide');
            cr.show_share(link_share,data.name);
        });
        $("#all_btn_dock").append(btn_share);
        
        var btn_download = $('<button class="btn btn-sm btn-c btn-msg m-1 animate__animated animate__bounceIn" title="Buy Mp3 File"><i class="fas fa-arrow-alt-circle-down"></i></button>');
        $(btn_download).click(function () {
            $(this).tooltip('hide');
            cr.show_pay(data.name);
        });
        $("#all_btn_dock").append(btn_download);

        $('.btn-msg').tooltip();
    }

    getValByKeyTable(k, v) {
        var val = '';
        var html = '';
        var btn_extension = '';
        switch (k.toLowerCase()) {
            case "link_ytb":
                val = m.song.getYouTubeVideoId(v);
                btn_extension = '<a target="_blank" href="' + v + '" class="btn btn-sm btn-dark"><i class="fas fa-external-link-square-alt"></i></a>';
                break;
            case "artist":
                btn_extension = '<a onclick="m.song.showListSongByMeta(\'artist\',\'' + v + '\',\'' + m.song.lang + '\')" class="btn btn-sm btn-dark"><i class="fas fa-list"></i></a>';
                val = v;
                break;
            case "genre":
                btn_extension = '<a onclick="m.song.showListSongByMeta(\'genre\',\'' + v + '\',\'' + m.song.lang + '\')" class="btn btn-sm btn-dark"><i class="fas fa-list"></i></a>';
                val = v;
                break;
            default:
                val = v;
                break;
        }

        if (val != '') {
            html = '<tr>';
            html += '<td>'+cr_data.getIconBykey(k)+' ' + k + '</td>';
            html += '<td>' + val + '</td>';
            html += '<td>' + btn_extension + '</td>';
            html += '</tr>';
        }
        return html;
    }

    getYouTubeVideoId(url) {
        var regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        var match = url.match(regex);
        return (match && match[1]) ? match[1] : null;
    }

    showListCountry() {
        $("#sub_title").html('');

        var btn_all_l = $(`<button class="btn btn-sm ${(m.song.lang === "all" ? "active" : "all")} m-1 btn-c btn_l"><i class="fas fa-globe"></i></button>`);
        $("#sub_title").append(btn_all_l);
        $(btn_all_l).click(() => {
            m.song.lang = "all";
            m.song.showListSongByData(m.song.list_song);
        });

        $.each(m.song.list_lang, function (index, l) {
            var btn_l = $(`<button class="btn btn-sm ${(m.song.lang === l.name ? "active" : l.name)} m-1 btn-c btn_l">${l.name}</button>`);
            $(btn_l).click(() => {
                m.song.lang = l.name;
                var l_new = m.song.getListSongByMeta("lang", l.name);
                m.song.showListSongByData(l_new);
            });
            $("#sub_title").append(btn_l);
        });

        var btn_add = $(`<button class="btn btn-sm m-1 btn-c btn_l"><i class="fas fa-plus-circle"></i></button>`);
        $("#sub_title").append(btn_add);
        $(btn_add).click(() => {
            if(cr.dev){
                var obj_new=cr_data.clear_value(m.song.list_song[0]);
                delete(obj_new["index"]);
                cr_data.add(obj_new,(data)=>{
                    Swal.fire({
                        icon:"success",
                        title:"Add song",
                        text:"Add song success"
                    });
                    m.song.list_song.push(data);
                });
            }else{
                Swal.fire({
                    title: 'Add Song',
                    html: `
                      <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc1tKxxJ8bQrCWst_xkL4Vnsss71gz9loLbewY4-Yqzs-4WoQ/viewform?embedded=true" width="100%" height="480" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
                    `,
                    showCloseButton: true,
                    showCancelButton: false,
                    showConfirmButton:false
                });
            }
        });
    }

    getListSongByMeta(filed, val, lang = null) {
        var list_s = [];
        $(m.song.list_song).each(function (index, s) {
            if (lang != null && lang != "all") {
                if (s[filed] == val && lang == s.lang) list_s.push(s);
            } else {
                if (s[filed] == val) list_s.push(s);
            }
        });
        return list_s;
    }

    showListSongByMeta(filed, val, lang = null) {
        var html = '<div class="container-fluid"><div class="row"><div class="col-12"><table class="table table-striped table-hover table-responsive fs-9 w-100 "><tbody id="box_list_song"></tbody></table></div></div></div>';
        Swal.fire({
            title: val,
            html: html,
            confirmButtonColor: cr.color_btn,
            didOpen: () => {
                var list_song = m.song.getListSongByMeta(filed, val, lang);
                $.each(list_song, function (index, s) {
                    var html = '';
                    html = '<tr role="button" class="w-100">';
                    html += '<td style="width:5%"><i class="fas fa-music"></i></td>';
                    html += '<td style="width:80%">' + s.name + '</td>';
                    html += '<td style="width:5%"><button class="btn btn-sm btn-dark btn-box animate__animated animate__bounceIn"><i class="fas fa-play" title="Play One"></i></button></td>';
                    html += '<td class="col_1" style="width:5%"></td>';
                    html += '<td class="col_2" style="width:5%"></td>';
                    html += '</tr>';
                    var item_box = $(html);
                    $(item_box).click(() => {
                        cr_player.play(s.mp3, s.name, s.artist);
                        Swal.close();
                    });

                    var btn_add_song = $('<button class="btn btn-sm btn-dark btn-box animate__animated animate__bounceIn"><i class="fas fa-plus-circle"  title="Add song to playlist"></i></button>');
                    $(btn_add_song).click(function () {
                        cr_player.add_song(s.mp3, s.name, s.artist);
                        return false;
                    });
                    $(item_box).find(".col_1").append(btn_add_song);

                    var btn_info = $('<button class="btn btn-sm btn-dark btn-box animate__animated animate__bounceIn"><i class="fas fa-info-circle"></i></button>');
                    $(btn_info).click(() => {
                        m.song.showInfoByData(s);
                        return false;
                    })
                    $(item_box).find(".col_2").append(btn_info);
                    $("#box_list_song").append(item_box);
                });
            }
        });
    }
}
var song = new Songs();
m.song = song;
