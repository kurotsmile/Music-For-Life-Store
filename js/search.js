class Search{
    show(){
        m.act_menu('m-search');
        var container = $("#container");
        $(container).html('');
        var title_search = $('<div class="col-12 text-center mb-2" id="list_country"><div>Search '+m.key_search+'..</div>');
        var emp_list_song = $('<div class="song-list col-12 pl-3 pr-3" id="song-list"></div>');
        $(container).append(title_search);
        $(container).append(emp_list_song);

        $.each(m.song.list_song,function(index,song){
            if(song.name.toLowerCase().indexOf(m.key_search.toLowerCase())!==-1){
                $(emp_list_song).append(m.song.songItemEmp(song));
            }
        });
    }
}
var search=new Search();
m.search=search;