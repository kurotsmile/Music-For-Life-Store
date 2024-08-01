class Search{
    show(){
        m.act_menu('m-search');
        m.sub_title(cr.l('search_result',"Search Results")+" "+m.key_search+"...");
        m.clear();
        $.each(m.song.list_song,function(index,song){
            if(song.name.toLowerCase().indexOf(m.key_search.toLowerCase())!==-1){
                var empSong=m.song.songItemEmp(song);
                $(empSong).click(()=>{
                    cr_player.play(song.mp3,song.name,song.artist);
                });
                m.add_item(empSong);
            }
        });
    }
}
var search=new Search();
m.search=search;