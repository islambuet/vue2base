<template>
  <div id="system_main_container"> 
    <Loading v-show="$systemFunctions.statusDataLoaded == 0" />
    <Loading v-if="statusSiteLoaded == 0" />
    <LoadingFailed v-else-if="statusSiteLoaded == -1" />
    <ThemeDefault v-else-if="statusSiteLoaded == 1 && $systemFunctions.user.id > 0" />
    <ThemeSingle v-else-if="statusSiteLoaded == 1 && !($systemFunctions.user.id > 0)" />
  </div>
</template>
<script>
import ThemeDefault from "@/components/themes/ThemeDefault/Index.vue";
import ThemeSingle from "@/components/themes/ThemeSingle.vue";
import Loading from "@/components/busy-states/Loading.vue";
import LoadingFailed from "@/components/busy-states/LoadingFailed.vue";

export default {
  components: {
    Loading,
    LoadingFailed,
    ThemeDefault,
    ThemeSingle,
  },
  data() {
    return {
      statusSiteLoaded: 0, //Loading=0,success=0,failed=-1  only this page
    };
  },
  created() {
    //this.$axios.defaults.baseURL = 'http://127.0.0.1:8085/api';    
    //this.$axios.defaults.baseURL = this.$systemFunctions.baseUrl+'../apivue2base/public/api/';//enable for final build
    this.$axios.defaults.baseURL = 'http://127.0.0.1/base/apivue2base/public/api/';
    this.$axios.defaults.headers.common['language'] = this.$systemFunctions.language;
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$systemFunctions.user.authToken;
    //before axios call
    let $this=this;
    this.$axios.interceptors.request.use(function (config) {  
        $this.$toast.clear();
        $this.$systemFunctions.validationErrors='';
        return config;
      }, function (error) {              
        return Promise.reject(error);
      });
    this.$systemFunctions.setPageTitle(this.$systemFunctions.getLabel("label_site_title"));
    this.init();
  },
  methods: {
    init()
    {
      this.$axios.all([      
          this.$axios.get('/user/initialize'),  
                 
        ]).then(this.$axios.spread((resUser) => 
        { 
          if(resUser.data.user){               
              this.$systemFunctions.setUser(resUser.data.user); 
            }else{
              if(this.$router.history.current.path!='/login'){
                this.$router.push("/login");
              }
            }   
            this.statusSiteLoaded=1;                  
        })).catch(error => {                  
          this.statusSiteLoaded=-1;
      });
    }
  }
}
</script>
