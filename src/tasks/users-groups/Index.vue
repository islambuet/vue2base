<template>
    <div v-if="$systemFunctions.statusTaskLoaded==1">
        <List v-show="method=='list'"/>
    </div>
</template>

<script>
import List from './List.vue'
// import Pagination from '@/components/Pagination.vue';
// import ValidationError from '@/components/ValidationError.vue';
    export default {
        components: {
            List
            // Pagination,
            // ValidationError,
        },

        data (){
            return {
                base_url:'users-groups',
                method:'list',        
                permissions:{},
                itemDefault: {},
                item: {},
                modules_tasks:{},
                // module_task_max_action:0,

                /*refreshRole:false,
                permissions:{'action_0':0},
                columns:{csv:[]},
                //csv:all-hidden,hidden,control/all,filter/search
                itemDefault: {id: 0,name: '',ordering: '',status: ''},
                items: {data:[]},
                item: {},                
                editing: false,
                searchString: '',
                pagination: {current_page: 1,per_page_options: [2,10,20,500,1000],per_page:20,show_all_items:true},
                modules_tasks:{'max_level':1,'tree':[]}, 
                module_task_max_action:8,*/
            }
        },
        created(){    
            if(!(this.$systemFunctions.user.id>0)){
                return;
            }        
            this.$systemFunctions.loadLanguageFiles([
                {language:this.$systemFunctions.getLanguage(),file:'tasks/'+this.base_url+'/language.js'},
            ]);
            this.init();
        },
        watch: {
            $route(to, from) {
                //this.routing(to);                      
            }
        },
        methods: {
            init(){
                this.$systemFunctions.statusTaskLoaded=0;
                this.$systemFunctions.statusDataLoaded=0;
                this.$axios.get('/users-groups/initialize')
                .then(res=>{                    
                    if(res.data.error==''){
                        // this.setColumnCsv();                        
                        this.permissions=res.data.permissions;
                        this.itemDefault=res.data.itemDefault;
                        this.modules_tasks=res.data.modules_tasks;
                        this.$systemFunctions.statusTaskLoaded=1;
                        // this.getItems(this.pagination);
                    }
                    this.$systemFunctions.statusDataLoaded = 1;
                }).catch(error => {                      
                    this.$systemFunctions.statusDataLoaded = 1;
                    if (error.response && error.response.data && error.response.data.error) {
                        this.$systemFunctions.showResponseError(error.response.data);            
                    } else {            
                        this.$systemFunctions.showResponseFailure();
                    }                              
                });
            },
            // setColumnCsv() {
            //     this.columns.csv=[];                
            //     this.columns.csv.push({
            //         label: this.$systemFunctions.getLabel('label_id'),
            //         key: 'id'
            //     });
            //     this.columns.csv.push({
            //         label: this.$systemFunctions.getLabel('label_name'),
            //         key: 'name'
            //     });
            //     this.columns.csv.push({
            //         label: this.$systemFunctions.getLabel('label_ordering'),
            //         key: 'ordering'
            //     });
            //     this.columns.csv.push({
            //         label: this.$systemFunctions.getLabel('label_status'),
            //         key: 'status'
            //     });
            // },
            // getItems(pagination){
            //     this.$systemFunctions.statusDataLoaded=0;
            //     this.$axios.get('/users-groups/get-items?page='+ pagination.current_page+'&perPage='+ pagination.per_page)
            //     .then(res => {
            //         this.$systemFunctions.statusDataLoaded = 1;
            //         if(res.data.error==''){
            //             this.items=res.data.items;                                                
            //         }
            //     }).catch(error => {                      
            //         this.$systemFunctions.statusDataLoaded = 1;
            //         if (error.response && error.response.data && error.response.data.error) {
            //             this.$systemFunctions.showResponseError(error.response.data);            
            //         } else {            
            //             this.$systemFunctions.showResponseFailure();
            //         }                              
            //     });
            // },            
            // addItem(){
            //     this.$systemFunctions.validationErrors='';
            //     this.item={};
            //     Object.assign(this.item, this.itemDefault);                
            // },
            // editItem(item){
            //     this.$systemFunctions.validationErrors='';
            //     this.item={};
            //     Object.assign(this.item, item);                            
            // },
            // assignTask(item){
            //     this.$systemFunctions.validationErrors='';
            //     this.refreshRole=false;
            //     let $this=this;
            //     //settimeout for rerender the div
            //     setTimeout(() => {
            //         $this.refreshRole=true;
            //         $this.item={};
            //         Object.assign($this.item, item);                
            //      }, 1);
                
            // },            
            // saveItem(){
                
            //     this.$systemFunctions.statusDataLoaded=0;
            //     this.$axios.post('/users-groups/save-item',new FormData(document.getElementById('formSave')))
            //     .then(res => {
            //         this.$systemFunctions.statusDataLoaded = 1;
            //         if(res.data.error==''){
            //             this.$systemFunctions.showSuccessMessage(this.$systemFunctions.getLabel('msg_success_saved'));
            //             $('#modalAddEdit').modal('hide');
            //             this.getItems(this.pagination);
            //         }
            //     }).catch(error => {                      
            //         this.$systemFunctions.statusDataLoaded = 1;
            //         if (error.response && error.response.data && error.response.data.error) {
            //             this.$systemFunctions.showResponseError(error.response.data);            
            //         } else {            
            //             this.$systemFunctions.showResponseFailure();
            //         }                              
            //     });
            // },
            // saveRole(form_id){
            //     this.$systemFunctions.statusDataLoaded=0;
            //     this.$axios.post('/users-groups/save-role/'+this.item.id,new FormData(document.getElementById(form_id)))
            //     .then(res => {
            //         this.$systemFunctions.statusDataLoaded = 1;
            //         if(res.data.error==''){                        
            //             this.$systemFunctions.showSuccessMessage(this.$systemFunctions.getLabel('msg_success_saved'));
            //             $('#modalAssignTask').modal('hide');
            //             this.getItems(this.pagination);
            //         }
            //     }).catch(error => {                      
            //         this.$systemFunctions.statusDataLoaded = 1;
            //         if (error.response && error.response.data && error.response.data.error) {
            //             this.$systemFunctions.showResponseError(error.response.data);            
            //         } else {            
            //             this.$systemFunctions.showResponseFailure();
            //         }                              
            //     });

            // },
            
        }

    }
</script>

<style  scoped>

</style>
