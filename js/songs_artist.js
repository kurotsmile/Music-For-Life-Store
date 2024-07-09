class Songs_Artist{
    emp_list_artist="";

    show(){
        var container=$("#container");
        $(container).html('');
        this.emp_list_artist=$('<div class="song-list col-12 pl-3 pr-3" id="song-list"></div>');
        $(container).append(this.emp_list_artist);

        $.each(m.list_artist,function(index,a){
            var artistItem = $(`<div role="button" class="song-item">
            <img src="images/singer.png" alt="Avatar Artist" class="song-avatar">
            <div class="song-title">${a.name}</div>
            <div class="song-artist">${a.amount} (${a.lang})</div>
            </div>`);
            $(m.song_artist.emp_list_artist).append(artistItem);
        });
    }
}
var song_artist=new Songs_Artist();
m.song_artist=song_artist;