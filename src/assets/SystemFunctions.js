import Vue from 'vue'

function initialData() {
    var localStorageAuthTokenStr='authToken';
    var localStorageLanguageStr='language';
    var language = localStorage.getItem(localStorageLanguageStr) ? localStorage.getItem(localStorageLanguageStr) : 'bn'; 
    var labels= {};
    var language_files = [
        { language: language, file: 'languages/action.js' },
        { language: language, file: 'languages/button.js' },
        { language: language, file: 'languages/label.js' },
        { language: language, file: 'languages/message.js' },
        { language: language, file: 'languages/response.js' },
    ];
    try {
        for (var i = 0; i < language_files.length; i++) {
            var language = language_files[i].language;
            var filedata = require(`@/${language_files[i].file}`);
            for (var item in filedata.labels) {
                labels[item] = filedata.labels[item][language] ? filedata.labels[item][language] : item;
            }
        }
    }
    catch (error) {
        console.log(error);
    }

    return {
        localStorageAuthTokenStr:localStorageAuthTokenStr,
        localStorageLanguageStr:localStorageLanguageStr,
        language: language,
        language_available:['en','bn'],
        labels: labels,
        user: {
            authToken: localStorage.getItem(localStorageAuthTokenStr) ? localStorage.getItem(localStorageAuthTokenStr) : '',
            id: 0,
            name: language == 'en' ? 'Guest' : 'অতিথি',
            info:{},
            tasks: []
        },    
        baseUrl: process.env.BASE_URL,
        statusTaskLoaded: 0,    //Loading=0,success=1,failed=-1,acceesdenied=-2, site_off_line = -3  for all page
        statusDataLoaded: 1,    //Loading=0,loaed=1    
        validationErrors:'',
        showJumpActions:true, 
        dbStatus:{'YES':'Yes','NO':'No','ACTIVE':'Active','INACTIVE':'In-Active','DELETE':'Deleted'}
    }
}


var systemFunctions = new Vue({
    data: function () {
        var tempdata = initialData();
        return tempdata;
      },
    methods: {
        getLanguage(){
            return this.language;
        },
        changeLanguage(language)
        {
            localStorage.setItem(this.localStorageLanguageStr,language);  
            window.location.reload(); 
        },
        loadLanguageFiles: function (language_files) { 
            
            try {
                for (var i = 0; i < language_files.length; i++) {
                    var language = language_files[i].language;
                    var filedata = require(`@/${language_files[i].file}`);                    
                    for (var item in filedata.labels) {
                        this.labels[item] = filedata.labels[item][language] ? filedata.labels[item][language] : item;
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        getLabel(key) {        
            return this.labels[key] ? this.labels[key] : key;
        },
        setPageTitle(title) {
            document.title = title;
        },  
        showSuccessMessage(msg) {
            this.$toast.success(msg, {timeout: 2000 });
        },
        showResponseFailure() {
            this.$toast.error(this.$systemFunctions.getLabel('msg_loading_failed_message'));
        },
        showResponseError(data) {
            //console.log(error);
            if (data.error == 'ACCESS_DENIED') {                
                this.statusTaskLoaded = -2;
            }
            else if (data.error == 'API_OFFLINE') {                
                this.statusTaskLoaded = -3;
            }
            else if (data.error == 'USER_SESSION_EXPIRED') {                
                localStorage.setItem(this.localStorageAuthTokenStr, '');
                this.$axios.defaults.headers.common['Authorization'] = '';
                this.user = initialData().user;                
                this.$routes.push("/login");
                this.$toast.error(this.$systemFunctions.getLabel(data.errorMessage));
            }
            else if (data.error == 'VALIDATION_FAILED') {
                if(typeof data.errorMessage=='string'){
                    this.validationErrors = data.errorMessage;
                }else if(typeof data.errorMessage=='object'){
                    let messages='';
                    for (let message in data.errorMessage) {
                        messages+=data.errorMessage[message]+'<br>';                        
                      }
                    this.validationErrors = messages;                    
                } else{
                    console.log(data.errorMessage);
                }
            }
            else {
                this.$toast.error(this.getLabel(data.errorMessage));
            }
            //           
        },
        setUser: function (data) {
            // data == object {token_auth: 'value'}, ...
            for (var item_key in data) {
                this.user[item_key] = data[item_key];
            }
        },
        logout() {
            this.$axios.get('/user/logout')
            .then(response => {                    
            })
            .catch(error => {
            });
            localStorage.setItem(this.localStorageAuthTokenStr, '');
            this.$axios.defaults.headers.common['Authorization'] = '';
            //var tempdata = initialData();
            this.user = initialData().user;            
            this.$routes.push("/login");
            
        },
        displayDate(timestamp){
            var date = new Date(timestamp);
            return  ('0' + date.getDate()).slice(-2)
            +' '+date.toLocaleString('default', { month: 'short' })
            +' '+date.getFullYear();

        },
        displayTime(timestamp){
            
            var date = new Date(timestamp);
            return  ('0' + date.getDate()).slice(-2)
            +' '+date.toLocaleString('default', { month: 'short' })
            +' '+date.getFullYear()
            +' ' + ('0' + date.getHours()).slice(-2) 
            +':' + ('0' + date.getMinutes()).slice(-2)
            +':' + ('0' + date.getSeconds()).slice(-2);

        }
    }
});
export default systemFunctions
//Vue.prototype.$systemFunctions = systemFunctions