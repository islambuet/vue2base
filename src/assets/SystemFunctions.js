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
        language_available:['en','bn','in'],
        labels: labels,
        user: {
            authToken: localStorage.getItem(localStorageAuthTokenStr) ? localStorage.getItem(localStorageAuthTokenStr) : '',
            id: 0,
            name: language == 'en' ? 'Guest' : 'অতিথি',
            info:{},
            profile_picture_url: '',
            tasks: []
        },    
        baseUrl: process.env.BASE_URL,
        statusTaskLoaded: 0,    //Loading=0,success=1,failed=-1,acceesdenied=-2, site_off_line = -3  for all page
        statusDataLoaded: 1,    //Loading=0,loaed=1    
        validationErrors:'',
        showJumpActions:true, //for displaying direct edit or details
        loadListData:true,//For Reloading List view data
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
            else if (data.error == 'DATA_ALREADY_SAVED') {
                this.$toast.error(this.getLabel('DATA_ALREADY_SAVED'));
                this.loadListData=true;
            }
            else {
                this.$toast.error(this.getLabel(data.errorMessage));
            }
            //           
        },
        setUser: function (data) {
            // data == object {token_auth: 'value'}, ...
            for (var item_key in data) {
                if(item_key=='name'){
                    let name=JSON.parse(data[item_key]);
                    let lang=this.getLanguage();
                    this.user[item_key] = name[lang]?name[lang]:'';;
                }
                else{
                    this.user[item_key] = data[item_key];
                }
                
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

        },
        getFilteredItems(datas,columns){
            let filterItems= datas.filter((item)=>{
                for(let  key in columns.all)
                {
                    let column = columns.all[key];
                    if(column.filterable){
                        if(column.type=='number'){
                            if(column.filter.from.length>0){
                                if(parseFloat(item[key])<parseFloat(column.filter.from))
                                {                        
                                    return false;
                                }
                            }
                            if(column.filter.to.length>0){
                                if(parseFloat(item[key])>parseFloat(column.filter.to))
                                {                        
                                    return false;
                                }
                            }
                        }
                        else if(column.type=='text'){
                            if(column.filter.from.length>0){
                                if(item[key].toLowerCase().indexOf(column.filter.from.toLowerCase())==-1)
                                {
                                    return false;
                                }
                            }
                        }
                        else if(column.type=='dropdown'){
                            if(column.filter.from.length>0){
                                if(item[key]!=column.filter.from)
                                {                         
                                    return false;
                                } 
                            }
                        }
                        else if(column.type=='date'){
                            if(column.filter.from.length>0){                               
                                if(new Date(item[key])<new Date(column.filter.from+" 00:00:00"))
                                {                        
                                    return false;
                                }
                            }
                            if(column.filter.to.length>0){
                                if(new Date(item[key])>new Date(column.filter.to+" 00:00:00"))
                                {                        
                                    return false;
                                }
                            }
                        }
                    }
                }
                return true;
            });
            let key=columns.sort.key;
            let dir=columns.sort.dir;
            if(key!='' ){
                if((key in columns.all) &&((dir=='asc')||(dir=='desc')))
                {
                    if(columns.all[key].type=='number')
                    {
                        filterItems.sort((a,b)=> (a[key] > b[key] ? 1: -1 ));
                    }
                    else if(columns.all[key].type=='date')
                    {
                        filterItems.sort((a,b)=> (new Date(a[key]) > new Date(b[key]) ? 1 : -1));
                    }
                    else{
                        filterItems.sort((a,b)=> (a[key].localeCompare(b[key])));                                           
                    }
                    if(dir=='desc'){
                        filterItems.reverse();
                    }
                }
            }
            return filterItems;
        },
        exportCsv(columns,datas,filename="output.csv")
        {
            var csvStr="";           
            for(let  key in columns.all){
                let column=columns.all[key];
                if((columns.hidden.indexOf(key))==-1){
                    csvStr=csvStr+'"'+column.label+'",';
                }               
            }            
            csvStr+="\n";
            for (var j=0;j<datas.length;j++)
            {
                for(let  key in columns.all){                    
                    if((columns.hidden.indexOf(key))==-1){                        
                        csvStr=csvStr+'"'+datas[j][key]+'",'; 
                    }               
                }  
                csvStr+="\n";
            }            
            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvStr);
            hiddenElement.target = '_blank';
            hiddenElement.download = filename;
            hiddenElement.click();  
        },
    }
});
export default systemFunctions
//Vue.prototype.$systemFunctions = systemFunctions