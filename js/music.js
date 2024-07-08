var list_artist=[];
var list_year=[];

$(document).ready(function() {

    function addOrUpdateObjectToList(list_obj, data_obj_add) {
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

    $.getJSON("https://raw.githubusercontent.com/kurotsmile/Database-Store-Json/main/song.json", function(data) {
        var songList = $("#song-list");
        $.each(data.all_item, function(index, song) {
            var obj_artist={"name":song.artist,"lang":song.lang};
            addOrUpdateObjectToList(list_artist,obj_artist);

            var obj_year={"name":song.year,"lang":song.lang};
            addOrUpdateObjectToList(list_year,obj_year);
            
            var songItem = `<div class="song-item" data-src="${song.mp3}" data-title="${song.name}" data-artist="${song.artist}">
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

    // Scroll to top button functionality
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

        var scrollRight = ($(window).width() - $('.container').offset().left - $('.container').width()) / 2 - 50; // 50px offset từ lề phải
        scrollTopBtn.css('right', scrollRight);
    });

    scrollTopBtn.click(function() {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });
});


function donwload_artist(){
    download_json(list_artist,"song_artist.json");
}

function donwload_year(){
    download_json(list_year,"song_year.json");
}

function download_json(data,file_name){
    var jsonString = JSON.stringify(data);
    var blob = new Blob([jsonString], { type: "application/json" });

    var url = URL.createObjectURL(blob);
    
    var a = document.createElement('a');
    a.href = url;
    a.download = file_name;
    a.click();
    URL.revokeObjectURL(url);
}