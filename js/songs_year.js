class Songs_year{
    show(){
        $("#song-list").html("");
        var songList = $("#song-list");
        $.each(m.list_year,function(index,y){
            var songItem = `<div role="button" class="song-item">
            <img src="images/timer_music.png" alt="Avatar" class="song-avatar">
            <div class="song-title">${y.name}</div>
            <div class="song-artist">${y.amount} (${y.lang})</div>
            </div>`;
            songList.append(songItem);
        });
    }
}

var song_year=new Songs_year();
m.song_year=song_year;