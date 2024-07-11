class Songs {

    list_song = [];
    list_lang = [];
    list_country = null;

    emp_list_song = null;
    lang = "en";
    box_info_menu_cur = "none";

    show() {
        this.lang=m.lang;
        var container = $("#container");
        $(container).html('');
        this.list_country = $('<div class="col-12 text-center mb-2" id="list_country"></div>');
        this.emp_list_song = $('<div class="song-list col-12 pl-3 pr-3" id="song-list"><div><i class="fas fa-spinner fa-spin"></i> Loading...</div></div>');
        $(container).append(this.list_country);
        $(container).append(this.emp_list_song);

        if (this.list_song.length == 0) {
            $.getJSON("https://raw.githubusercontent.com/kurotsmile/Database-Store-Json/main/song.json", function (data) {

                $.each(data.all_item, function (index, song) {

                    var obj_artist = { "name": song.artist, "lang": song.lang };
                    m.addOrUpdateObjectToList(m.list_artist, obj_artist);

                    var obj_year = { "name": song.year, "lang": song.lang };
                    m.addOrUpdateObjectToList(m.list_year, obj_year);

                    var obj_genre = { "name": song.genre, "lang": song.lang };
                    m.addOrUpdateObjectToList(m.list_genre, obj_genre);

                    var obj_lang = { "name": song.lang, "lang": song.lang };
                    m.addOrUpdateObjectToList(m.song.list_lang, obj_lang);
                    m.song.list_song.push(song);
                });

                m.song.showListSong();
            });
        } else {
            this.showListSong();
        }
    }

    showListSong(){
        if(this.lang=="all")
            m.song.showListSongByData(m.song.list_song);
        else{
            var l_new = m.song.getListSongByMeta("lang", this.lang);
            m.song.showListSongByData(l_new);
        }
    }

    showListSongByData(data) {
        m.act_menu("m-music");
        $(m.song.emp_list_song).html('');
        $.each(data, function (index, song) {

            var songItem = $(`<div role="button" class="song-item" data-src="${song.mp3}" data-title="${song.name}" data-artist="${song.artist}">
                                    <img src="images/avatar_music.png" alt="Avatar" class="song-avatar">
                                    <div class="song-title">${song.name}</div>
                                    <div class="song-artist">${song.artist}</div>
                                    <div class="btnplay btn-extension" title="Play Song"><i class="fas fa-play-circle"></i></div>
                                </div>`);
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
                cr.show_pay();
                return false;
            });
            $(songItem).append(btn_download);
            $(m.song.emp_list_song).append(songItem);
        });

        $('.song-item').click(function () {
            var songSrc = $(this).data('src');
            var songTitle = $(this).data('title');
            var songArtist = $(this).data('artist');
            cr_player.play(songSrc, songTitle, songArtist);
        });

        m.song.showListCountry();
        $("[title]").tooltip();
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
        var t_table_info = '<table class="table table-striped table-hover table-responsive fs-9 w-100 text-break" style="text-align:left;width:100%">';
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
        if (data.lyrics != null) {
            var btn_lyrics = $('<button class="btn btn-sm btn-c btn-msg ' + (m.song.box_info_menu_cur === "lyrics" ? "active" : "lyrics") + ' m-1 animate__animated animate__bounceIn"><i class="fas fa-font"></i></button>');
            $(btn_lyrics).click(function () { m.song.showlyrics(data); });
            $("#all_btn_dock").append(btn_lyrics);
        }

        if (data.link_ytb != null) {
            var btn_ytb = $('<button class="btn btn-sm btn-c btn-msg ' + (m.song.box_info_menu_cur === "video" ? "active" : "lyrics") + ' m-1 animate__animated animate__bounceIn"><i class="fab fa-youtube"></i></button>');
            $(btn_ytb).click(function () { m.song.showVideo(data); });
            $("#all_btn_dock").append(btn_ytb);
        }

        var btn_info = $('<button class="btn btn-sm btn-c btn-msg ' + (m.song.box_info_menu_cur === "info" ? "active" : "info") + ' m-1 animate__animated animate__bounceIn"><i class="fas fa-info-circle"></i></button>');
        $(btn_info).click(function () { m.song.showInfoByData(data); });
        $("#all_btn_dock").append(btn_info);

        var btn_download = $('<button class="btn btn-sm btn-c btn-msg m-1 animate__animated animate__bounceIn"><i class="fas fa-arrow-alt-circle-down"></i></button>');
        $(btn_download).click(function () {
            cr.show_pay(data.name);
        });
        $("#all_btn_dock").append(btn_download);
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
                btn_extension = '<a onclick="m.song.showListSongByMeta(\'artist\',\'' + v + '\',\''+m.song.lang+'\')" class="btn btn-sm btn-dark"><i class="fas fa-list"></i></a>';
                val = v;
                break;
            case "genre":
                btn_extension = '<a onclick="m.song.showListSongByMeta(\'genre\',\'' + v + '\',\''+m.song.lang+'\')" class="btn btn-sm btn-dark"><i class="fas fa-list"></i></a>';
                val = v;
                break;
            default:
                val = v;
                break;
        }

        if (val != '') {
            html = '<tr>';
            html += '<td><i class="fas fa-info"></i> ' + k + '</td>';
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
        $(m.song.list_country).html('');

        var btn_all_l = $(`<button class="btn btn-sm ${(m.song.lang === "all" ? "active" : "all")} m-1 btn-c btn_l"><i class="fas fa-globe"></i></button>`);
        $(m.song.list_country).append(btn_all_l);
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
            $(m.song.list_country).append(btn_l);
        });
    }

    getListSongByMeta(filed, val,lang=null) {
        var list_s = [];
        $(m.song.list_song).each(function (index, s) {
            if(lang!=null&&lang!="all"){
                if (s[filed] == val&&lang==s.lang) list_s.push(s);
            }else{
                if (s[filed] == val) list_s.push(s);
            }  
        });
        return list_s;
    }

    showListSongByMeta(filed, val,lang=null) {
        var html = '<div class="container-fluid"><div class="row"><div class="col-12"><table class="table table-striped table-hover table-responsive fs-9 w-100 "><tbody id="box_list_song"></tbody></table></div></div></div>';
        Swal.fire({
            title: val,
            html: html,
            confirmButtonColor: cr.color_btn,
            didOpen: () => {
                var list_song = m.song.getListSongByMeta(filed, val,lang);
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

                    var btn_info=$('<button class="btn btn-sm btn-dark btn-box animate__animated animate__bounceIn"><i class="fas fa-info-circle"></i></button>');
                    $(btn_info).click(()=>{
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
