class Music{
    list_artist=[];
    list_year=[];

    onLoad(){
        m.loadJs("js/songs.js","song");
    }

    loadJs(path_js, obj_call, func_call = "show") {
        if(window[obj_call]!=null){
            window[obj_call][func_call]();
        }else{
            $.getScript(path_js).done(function(script, textStatus) {
                if(obj_call!=null) window[obj_call][func_call]();
            })
            .fail(function(jqxhr, settings, exception) {
                console.log("Script loading failed: " + exception);
            });
        }
    }
    
    addOrUpdateObjectToList(list_obj, data_obj_add) {
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

    donwload_artist(){
        var data_download={};
        data_download["all_item"]=m.list_artist;
        data_download["collection"]='song_artist';
        m.download_json(data_download,"song_artist.json");
    }
    
    donwload_year(){
        var data_download={};
        data_download["all_item"]=m.list_year;
        data_download["collection"]='song_year';
        m.download_json(data_download,"song_year.json");
    }
    
    download_json(data,file_name){
        var jsonString = JSON.stringify(data);
        var blob = new Blob([jsonString], { type: "application/json" });
    
        var url = URL.createObjectURL(blob);
        
        var a = document.createElement('a');
        a.href = url;
        a.download = file_name;
        a.click();
        URL.revokeObjectURL(url);
    }

    async pay(){
        if (!window.PaymentRequest) {
            alert('Web Payments API is not supported in this browser.');
            return;
        }

        const paymentMethods = [{
            supportedMethods: 'basic-card',
            data: {
                supportedNetworks: ['visa', 'mastercard', 'amex']
            }
        }];

        const paymentDetails = {
            displayItems: [
                {
                    label: 'Music For Life Subscription',
                    amount: { currency: 'USD', value: '9.99' }
                }
            ],
            total: {
                label: 'Total',
                amount: { currency: 'USD', value: '9.99' }
            }
        };

        try {
            const request = new PaymentRequest(paymentMethods, paymentDetails);

            const paymentResponse = await request.show();
            await paymentResponse.complete('success');
            alert('Payment successful!');
        } catch (err) {
            console.error(err);
            alert('Payment failed or was cancelled.');
        }
    }

    show_list_year(){
        m.loadJs("js/songs_year.js","song_year","show");
    }
}

var m;
$(document).ready(function() {
    m=new Music();
    m.onLoad();

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