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
                base_url:'system-configurations',
                method:'list',        
                permissions:{},
                itemDefault: {},                
                item: {},           //single item
                items: {data:[]},   //from Laravel server with pagination and info
                itemsFiltered: [],    //for display                              
                columns:{all:{},hidden:[],sort:{key:'',dir:''}},
                hidden_columns:[],
                pagination: {current_page: 1,per_page_options: [10,20,50,100,500,1000],per_page:50,show_all_items:true},                
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
                this.getItems(this.pagination);//Load at least once
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
                this.setColumns();
                this.$systemFunctions.statusTaskLoaded=0;
                this.$systemFunctions.statusDataLoaded=0;                
                this.$axios.get('/'+this.base_url+'/initialize')
                .then(res=>{                    
                    if(res.data.error==''){                                              
                        this.permissions=res.data.permissions;
                        this.itemDefault=res.data.itemDefault;                        
                        this.columns.hidden=res.data.hidden_columns;
                        
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
                    filterable:true,
                    sortable:true,
                    type:'number',
                    filter:{from:'',to:''}
                };
                
                key='purpose';
                this.columns.all[key]={
                    label: this.$systemFunctions.getLabel('label_purpose'),
                    hideable:true,
                    filterable:true,
                    sortable:true,
                    type:'text',
                    filter:{from:'',to:''}
                };
                key='config_value';
                this.columns.all[key]={
                    label: this.$systemFunctions.getLabel('label_config_value'),
                    hideable:true,
                    sortable:true,
                    filterable:false,
                    type:'text',
                    filter:{from:'',to:''}                  
                };                
                key='status';
                this.columns.all[key]={
                    label: this.$systemFunctions.getLabel('label_status'),
                    hideable:true,
                    filterable:true,
                    sortable:true,
                    type:'dropdown',
                    filter:{from:'',to:'',options:[
                        {value:this.$systemFunctions.dbStatus.ACTIVE,label:this.$systemFunctions.dbStatus.ACTIVE},
                        {value:this.$systemFunctions.dbStatus.INACTIVE,label:this.$systemFunctions.dbStatus.INACTIVE},
                    ]}
                };
                key='created_at';
                this.columns.all[key]={
                    label: this.$systemFunctions.getLabel('label_created_time'),
                    hideable:true,
                    filterable:true,
                    sortable:true,
                    type:'date',
                    filter:{from:'',to:''}
                };
            },  
            
            reloadItems(pagination){
                this.$systemFunctions.loadListData=true;
                this.getItems(pagination);
            },       
            getItems(pagination){                
                if(this.$systemFunctions.loadListData)
                {
                    this.$systemFunctions.statusDataLoaded=0;
                    this.$axios.get('/'+this.base_url+'/get-items?page='+ pagination.current_page+'&perPage='+ pagination.per_page)
                    .then(res => {
                        this.$systemFunctions.statusDataLoaded = 1;
                        if(res.data.error==''){
                            this.items=res.data.items;
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
                this.itemsFiltered=this.$systemFunctions.getFilteredItems(this.items.data,this.columns);
                for(let i=0;i<this.itemsFiltered.length;i++){
                    this.itemsFiltered[i]['created_at']=this.$systemFunctions.displayTime(this.itemsFiltered[i]['created_at']);                    
                }               
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
                let items=this.items.data;
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
