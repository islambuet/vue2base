<template>
    <div v-if="$systemFunctions.statusTaskLoaded==1">
        {{$systemFunctions.getLabel('label_task')}}
    </div>
</template>

<script>
//import Pagination from '@/components/Pagination.vue';
///import ValidationError from '@/components/ValidationError.vue';
    export default {
        // components: {
        //     Pagination,
        //     ValidationError,
        // },

        data (){
            return {                
                permissions:{'action_0':0},
                columns:{csv:[]},
                //csv:all-hidden,hidden,control/all,filter/search                
                itemDefault: {id:0,name_en:'',name_bn:'',type:'',parent:0,url:'',controller:'',ordering:'',status:''},
                items: {data:[]},
                item: {},     
                types:[],                                           
                modules_tasks:{'max_level':1,'tree':[]}, 
            }
        },
        created(){
            this.$systemFunctions.loadLanguageFiles([
                {language:this.$systemFunctions.language,file:'tasks/modules-tasks/language.js'},
            ]); 
        },
        mounted (){
            if(!(this.$systemFunctions.user.id>0)){
                return;
            }
                       
            this.init();            
        },
        computed:{   
            getFilteredItems:function(){  
                var items=[];
                for(var i=0;i<this.modules_tasks.tree.length;i++)
                {                    
                    var item={};
                    Object.assign(item, this.modules_tasks.tree[i].module_task);
                    item['name_0']=this.modules_tasks.tree[i].module_task['name_'+((this.$systemFunctions.language=='en')?'bn':'en')]; 
                    for(var level=1;level<=this.modules_tasks.max_level;level++)
                    {
                        if(level==this.modules_tasks.tree[i].level)
                        {
                            item['name_'+level]=this.modules_tasks.tree[i].module_task['name_'+this.$systemFunctions.language];          
                        }
                        else
                        { 
                            item['name_'+level]='';   
                        }
                    }                                
                    items.push(item);                    
                }
                
                return items;  
            },  
            getParents:function(){ 
                var temp_items=[];  
                for(var i=0;i<this.modules_tasks.tree.length;i++)
                {
                    if(this.modules_tasks.tree[i].module_task.type!='TASK')
                    {
                        temp_items.push({value:this.modules_tasks.tree[i].module_task.id,text:this.modules_tasks.tree[i].prefix+''+this.modules_tasks.tree[i].module_task['name_en']});
                    }
                } 
                return temp_items;
            }    
        }, 
        methods: {
            init(){
                this.$systemFunctions.statusTaskLoaded=1;
                this.$systemFunctions.statusDataLoaded=1;                
                return;
                this.$axios.get('/modules-tasks/initialize')
                .then(res=>{
                    this.$systemFunctions.statusDataLoaded = 1;
                    if(res.data.error==''){
                                                
                        this.permissions=res.data.permissions;
                        this.itemDefault=res.data.itemDefault;
                        this.types=res.data.types;
                        this.$systemFunctions.statusTaskLoaded=1;
                        this.getItems();
                    }
                }).catch(error => {                      
                    this.$systemFunctions.statusDataLoaded = 1;
                    if (error.response && error.response.data && error.response.data.error) {
                        this.$systemFunctions.showResponseError(error.response.data);            
                    } else {            
                        this.$systemFunctions.showResponseFailure();
                    }                              
                });

            },
            setColumnCsv() {
                this.columns.csv=[];                
                this.columns.csv.push({
                    label: this.$systemFunctions.getLabel('label_id'),
                    key: 'id'
                });
                this.columns.csv.push({
                    label: this.$systemFunctions.getLabelTask('label_module_task_type'),
                    key: 'type'
                });
                this.columns.csv.push({
                        label: this.$systemFunctions.getLabel('label_name_'+((this.$systemFunctions.language=='en')?'bn':'en')),
                        key: 'name_0'
                    });
                for(var level=1;level<=this.modules_tasks.max_level;level++)
                {
                    this.columns.csv.push({
                        label: this.$systemFunctions.getLabel('label_name_'+this.$systemFunctions.language),
                        key: 'name_'+level
                    });         
                }
                this.columns.csv.push({
                    label: this.$systemFunctions.getLabelTask('label_url'),
                    key: 'url'
                });
                this.columns.csv.push({
                    label: this.$systemFunctions.getLabelTask('label_controller'),
                    key: 'controller'
                });                
                this.columns.csv.push({
                    label: this.$systemFunctions.getLabel('label_ordering'),
                    key: 'ordering'
                });
                
            },
            getItems(){
                this.$systemFunctions.statusDataLoaded=0;
                this.$axios.get('/modules-tasks/get-items')
                .then(res => {
                    this.$systemFunctions.statusDataLoaded = 1;
                    if(res.data.error==''){
                        this.modules_tasks=res.data.modules_tasks;  
                        this.setColumnCsv();                                                                      
                    }
                }).catch(error => {                      
                    this.$systemFunctions.statusDataLoaded = 1;
                    if (error.response && error.response.data && error.response.data.error) {
                        this.$systemFunctions.showResponseError(error.response.data);            
                    } else {            
                        this.$systemFunctions.showResponseFailure();
                    }                              
                });
            },            
            addItem(){
                this.$systemFunctions.validationErrors='';
                this.item={};
                Object.assign(this.item, this.itemDefault);                
            },
            editItem(item){                
                this.$systemFunctions.validationErrors='';
                this.item={};
                Object.assign(this.item, item);                            
            },                     
            saveItem(){
                
                this.$systemFunctions.statusDataLoaded=0;
                this.$axios.post('/modules-tasks/save-item',new FormData(document.getElementById('formSave')))
                .then(res => {
                    this.$systemFunctions.statusDataLoaded = 1;
                    if(res.data.error==''){
                        this.$systemFunctions.showSuccessMessage(this.$systemFunctions.getLabel('msg_success_saved'));
                        $('#modalAddEdit').modal('hide');
                        this.getItems(this.pagination);
                    }
                }).catch(error => {                      
                    this.$systemFunctions.statusDataLoaded = 1;
                    if (error.response && error.response.data && error.response.data.error) {
                        this.$systemFunctions.showResponseError(error.response.data);            
                    } else {            
                        this.$systemFunctions.showResponseFailure();
                    }                              
                });
            },
            
            
        }

    }
</script>

<style  scoped>

</style>
