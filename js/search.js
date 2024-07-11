class Search{
    show(){
        alert(m.url_data);
        alert(m.key_search);
        var html='';
        $.each(m.song.list_song,function(index,s){
            if(m.key_search==s.name){
                html+=s.name;
            }
        });
        $("#container").html(html);
    }
}
var search=new Search();
m.search=search;