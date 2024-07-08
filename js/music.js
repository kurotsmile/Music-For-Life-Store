$(document).ready(function() {
    // Load song data from URL
    $.getJSON("https://raw.githubusercontent.com/kurotsmile/Database-Store-Json/main/song.json", function(data) {
        var songList = $("#song-list");
        $.each(data.all_item, function(index, song) {
            var songItem = `<div class="song-item" data-src="${song.mp3}" data-title="${song.name}" data-artist="${song.artist}">
                                <img src="images/avatar_music.png" alt="Avatar" class="song-avatar">
                                <div class="song-title">${song.name}</div>
                                <div class="song-artist">${song.artist}</div>
                                <button class="btn btn-sm btn-info song-info-btn"><i class="fas fa-info-circle"></i> Info</button>
                            </div>`;
            songList.append(songItem);
        });

        // Add click event for each song item
        $('.song-item').click(function() {
            var songSrc = $(this).data('src');
            var songTitle = $(this).data('title');
            var songArtist = $(this).data('artist');

            // Update player information
            $('#player-song-title').text(songTitle);
            $('#player-song-artist').text(songArtist);
            $('#mp3-player').find('audio').remove();
            $('#mp3-player').append(`<audio src="${songSrc}" id="audio-player" controls autoplay></audio>`);

            var audioPlayer = $('#audio-player')[0];

            // Show the player
            $('#mp3-player').addClass('active');
            
            // Play button functionality
            $('#play-btn').off('click').click(function() {
                if (audioPlayer.paused) {
                    audioPlayer.play();
                    $(this).html('&#10074;&#10074;'); // Pause icon
                } else {
                    audioPlayer.pause();
                    $(this).html('&#9654;'); // Play icon
                }
            });

            // Prev button functionality
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

        // Nếu cuộn đến một mức nào đó, hiển thị nút scrollTop
        if (scrollTop > windowHeight / 2) {
            scrollTopBtn.fadeIn();
        } else {
            scrollTopBtn.fadeOut();
        }

        // Canh chỉnh nút scrollTop để nó nằm ở giữa theo chiều cao của trang
        var scrollRight = ($(window).width() - $('.container').offset().left - $('.container').width()) / 2 - 50; // 50px offset từ lề phải
        scrollTopBtn.css('right', scrollRight);
    });

    scrollTopBtn.click(function() {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });
});
