class Songs_Artist{

    show(){
        var container=$("#container");
        $(container).html('Tran Thien Thanh');

        $.each(m.list_year,function(index,y){
            var songItem = `<div role="button" class="song-item">
            <img src="images/year_music.png" alt="Avatar" class="song-avatar">
            <div class="song-title">${y.name}</div>
            <div class="song-artist">${y.amount} (${y.lang})</div>
            </div>`;
            songList.append(songItem);
        });
    }
}
var song_artist=new Songs_Artist();
m.song_artist=song_artist;