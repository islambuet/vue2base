<template>
    <div v-if="$systemFunctions.statusTaskLoaded==1">
        <List/>
        <AddEdit/>
        <Details/>        
    </div>
</template>

<script>
import List from './List.vue'
import AddEdit from './AddEdit.vue'
import Details from './Details.vue'
    export default {
        components: {
            List,
            AddEdit,
            Details,            
        },

        data (){
            return {
                base_url:'modules-tasks',
                method:'list',        
                permissions:{},
                itemDefault: {},                
                item: {},           //single item
                items: {data:[]},   //from Laravel server with pagination and info
                itemsFiltered: [],    //for display  
                columns:{all:{},hidden:[],sort:{key:'',dir:''}},
                hidden_columns:[],              
                modules_tasks:{},
                module_task_types:[],
            }
        },
        created(){    
            if(!(this.$systemFunctions.user.id>0)){
                return;
            }        
            this.$systemFunctions.loadLanguageFiles([
                {language:this.$systemFunctions.getLanguage(),file:'tasks/'+this.base_url+'/language.js'},
            ]);
            this.$systemFunctions.loadListData=true;
            this.init();
        },
        watch: {
            $route(to, from) {
                this.routing(to);                      
            }
        },
        methods: {
            routing:function(route)
            { 
                this.getItems();//Load at least once
                if(route.path=='/'+this.base_url)
                {
                    this.method='list';
                }
                else if(route.path=='/'+this.base_url+'/add')
                {
                    this.method='add';
                    this.addItem();
                }
                else if(route.path.indexOf('/'+this.base_url+'/edit/')!=-1)
                {
                    this.method='edit';        
                    this.editItem(route.params['item_id']);        
                }
                else if(route.path.indexOf('/'+this.base_url+'/details/')!=-1)
                {
                    this.method='details';        
                    this.detailsItem(route.params['item_id']);        
                }                
            },
            init(){
                
                this.$systemFunctions.statusTaskLoaded=0;
                this.$systemFunctions.statusDataLoaded=0;                
                this.$axios.get('/'+this.base_url+'/initialize')
                .then(res=>{                    
                    if(res.data.error==''){
                        this.permissions=res.data.permissions;
                        this.itemDefault=res.data.itemDefault;                        
                        this.columns.hidden=res.data.hidden_columns;                        
                        this.module_task_types=res.data.types;                        
                        this.$systemFunctions.statusTaskLoaded=1;
                        this.routing(this.$route);
                    }
                    this.$systemFunctions.statusDataLoaded = 1;
                }).catch(error => {  
                    console.log(error);                    
                    this.$systemFunctions.statusDataLoaded = 1;
                    if (error.response && error.response.data && error.response.data.error) {
                        this.$systemFunctions.showResponseError(error.response.data);            
                    } else {            
                        this.$systemFunctions.showResponseFailure();
                    }                              
                });
            },
            setColumns(){
                this.columns.all={}; 
                this.columns.sort={key:'',dir:''};              
                let key='id';
                this.columns.all[key]={
                    label: this.$systemFunctions.getLabel('label_id'),
                    hideable:false,
                    filterable:false,
                    sortable:false,
                    type:'number',
                    filter:{from:'',to:''}
                };
                key='type';
                this.columns.all[key]={
                    label: this.$systemFunctions.getLabel('label_module_task_type'),
                    hideable:false,
                    filterable:false,
                    sortable:false,
                    type:'text',
                    filter:{from:'',to:''}
                };
                //names
                if(this.$systemFunctions.language_available.length>1){
                    if(this.$systemFunctions.language!=this.$systemFunctions.language_available[0]){
                        key='name_0';
                        this.columns.all[key]={
                            label: this.$systemFunctions.getLabel('label_name_'+this.$systemFunctions.language_available[0]),
                            hideable:false,
                            filterable:false,
                            sortable:false,
                            type:'text',
                            filter:{from:'',to:''}
                        };
                    }                    
                }
                for(var level=1;level<=this.modules_tasks.max_level;level++)
                {
                    key='name_'+level;
                    this.columns.all[key]={
                        label: this.$systemFunctions.getLabel('label_name_'+this.$systemFunctions.language),
                        hideable:false,
                        filterable:false,
                        sortable:false,
                        type:'text',
                        filter:{from:'',to:''}
                    };   
                }
                key='url';
                this.columns.all[key]={
                    label: this.$systemFunctions.getLabel('label_url'),
                    hideable:false,
                    filterable:false,
                    sortable:false,
                    type:'text',
                    filter:{from:'',to:''}
                };
                key='controller';
                this.columns.all[key]={
                    label: this.$systemFunctions.getLabel('label_controller'),
                    hideable:false,
                    filterable:false,
                    sortable:false,
                    type:'text',
                    filter:{from:'',to:''}
                };
                key='ordering';
                this.columns.all[key]={
                    label: this.$systemFunctions.getLabel('label_ordering'),
                    hideable:false,
                    filterable:false,
                    sortable:false,
                    type:'text',
                    filter:{from:'',to:''}
                };
            },  
            
            reloadItems(){
                this.$systemFunctions.loadListData=true;
                this.getItems();
            },       
            getItems(){                
                if(this.$systemFunctions.loadListData)
                {
                    this.$systemFunctions.statusDataLoaded=0;
                    this.$axios.get('/'+this.base_url+'/get-items')
                    .then(res => {
                        this.$systemFunctions.statusDataLoaded = 1;
                        if(res.data.error==''){
                            this.modules_tasks=res.data.modules_tasks;
                            this.setColumns();
                            this.getFilteredItems();                             
                        }
                        this.$systemFunctions.loadListData=false;
                    }).catch(error => {   
                        console.log(error);                   
                        this.$systemFunctions.statusDataLoaded = 1;
                        if (error.response && error.response.data && error.response.data.error) {
                            this.$systemFunctions.showResponseError(error.response.data);            
                        } else {            
                            this.$systemFunctions.showResponseFailure();
                        }                              
                    });
                }                
            }, 
            getFilteredItems:function(){ 
                var items=[];
                for(var i=0;i<this.modules_tasks.tree.length;i++)
                {                    
                    var item={};
                    Object.assign(item, this.modules_tasks.tree[i].module_task);
                    let name=JSON.parse(item['name']);
                    delete item['name'];
                    for(let index=0;index<this.$systemFunctions.language_available.length;index++)
                    {
                        let lang=this.$systemFunctions.language_available[index];
                        item['name_'+lang]=name[lang]?name[lang]:'';
                    }

                    if(this.$systemFunctions.language!=this.$systemFunctions.language_available[0]){
                        item['name_0']=item['name_'+this.$systemFunctions.language_available[0]];                        
                    }
                    
                    for(var level=1;level<=this.modules_tasks.max_level;level++)
                    {
                        if(level==this.modules_tasks.tree[i].level)
                        {
                            item['name_'+level]=item['name_'+this.$systemFunctions.language];          
                        }
                        else
                        { 
                            item['name_'+level]='';   
                        }
                    }                                
                    items.push(item);                    
                }
                this.itemsFiltered=items;
            },            
            addItem(){
                this.$systemFunctions.validationErrors='';
                if(!(this.permissions.action_1))
                {
                    this.$systemFunctions.statusTaskLoaded=-2;
                }
                else
                { 
                    this.item={};
                    Object.assign(this.item, this.itemDefault);           
                }
            },
            setItemByItemId(item_id){
                this.item={};
                //local search
                let items=this.itemsFiltered;
                for(let i=0;i<items.length;i++){
                    if(items[i].id==item_id){
                        Object.assign(this.item, items[i]);
                    }                        
                }                    
                //Live Search request
                if(!('id' in this.item)){                        
                    this.$systemFunctions.statusDataLoaded=0;
                    this.$axios.get('/'+this.base_url+'/get-item/'+ item_id)
                    .then(res => {
                        this.$systemFunctions.statusDataLoaded = 1;
                        if(res.data.error==''){
                            this.item={};
                            this.item=res.data.item; 
                            let name=JSON.parse(this.item['name']);
                            delete this.item['name']; 
                            
                            for(let index=0;index<this.$systemFunctions.language_available.length;index++)
                            {
                                let lang=this.$systemFunctions.language_available[index];
                                this.item['name_'+lang]=name[lang]?name[lang]:'';
                            }                   
                        }
                    }).catch(error => {                           
                        this.$systemFunctions.statusDataLoaded = 1;
                        if (error.response && error.response.data && error.response.data.error) {
                            this.$systemFunctions.showResponseError(error.response.data);            
                        } else {            
                            this.$systemFunctions.showResponseFailure();
                        }                              
                    });
                }
            },
            editItem(item_id){
                this.$systemFunctions.validationErrors='';
                if(!(this.permissions.action_2))
                {
                    this.$systemFunctions.statusTaskLoaded=-2;
                }
                else
                {
                    this.setItemByItemId(item_id);                      
                }
            },
            detailsItem(item_id){                
                this.setItemByItemId(item_id);
            },
        }

    }
</script>

<style  scoped>

</style>
