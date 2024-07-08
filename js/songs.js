class Songs{
    show(){
        $.getJSON("https://raw.githubusercontent.com/kurotsmile/Database-Store-Json/main/song.json", function(data) {
            var songList = $("#song-list");
            $.each(data.all_item, function(index, song) {
                var obj_artist={"name":song.artist,"lang":song.lang};
                m.addOrUpdateObjectToList(m.list_artist,obj_artist);

                var obj_year={"name":song.year,"lang":song.lang};
                m.addOrUpdateObjectToList(m.list_year,obj_year);
                
                var songItem = `<div role="button" class="song-item" data-src="${song.mp3}" data-title="${song.name}" data-artist="${song.artist}">
                                    <img src="images/avatar_music.png" alt="Avatar" class="song-avatar">
                                    <div class="song-title">${song.name}</div>
                                    <div class="song-artist">${song.artist}</div>
                                </div>`;
                songList.append(songItem);
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

                // Next button functionality
                $('#next-btn').off('click').click(function() {
                    // Implement next song functionality if needed
                });

                // Set initial play/pause button state
                $('#play-btn').html('&#10074;&#10074;'); // Pause icon
            });

            // Add click event for each song item info button
            $('.song-info-btn').click(function() {
                var songTitle = $(this).closest('.song-item').data('title');
                var songArtist = $(this).closest('.song-item').data('artist');
                var songSrc = $(this).closest('.song-item').data('src');

                // Prepare data for SweetAlert2 modal
                var htmlContent = `<table class="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th scope="row">Title</th>
                                                <td>${songTitle}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Artist</th>
                                                <td>${songArtist}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Source</th>
                                                <td>${songSrc}</td>
                                            </tr>
                                            <!-- Add more rows for other song details as needed -->
                                        </tbody>
                                    </table>`;

                // Display SweetAlert2 modal
                Swal.fire({
                    title: 'Song Information',
                    html: htmlContent,
                    icon: 'info',
                    confirmButtonText: 'Close'
                });
            });
        });
    }
}
var song=new Songs();
m.song=song;
