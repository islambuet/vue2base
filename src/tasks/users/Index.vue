<template>
    <div v-if="$systemFunctions.statusTaskLoaded==1">
        <List/>
        <Add/>
        <Edit/>
        <Details/>        
    </div>
</template>

<script>
import List from './List.vue'
import Add from './Add.vue'
import Edit from './Edit.vue'
import Details from './Details.vue'
    export default {
        components: {
            List,
            Add,
            Edit,
            Details,            
        },

        data (){
            return {
                base_url:'users',
                method:'list',        
                permissions:{},
                itemDefault: {},                
                item: {},           //single item
                items: {data:[]},   //from Laravel server with pagination and info
                itemsFiltered: [],    //for display                                
                columns:{all:{},hidden:[],sort:{key:'',dir:''}},
                hidden_columns:[],
                pagination: {current_page: 1,per_page_options: [10,20,50,100,500,1000],per_page:100,show_all_items:true},                
                users_groups:[],
                users_types:[],
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
                
                this.$systemFunctions.statusTaskLoaded=0;
                this.$systemFunctions.statusDataLoaded=0;                
                this.$axios.get('/'+this.base_url+'/initialize')
                .then(res=>{                    
                    if(res.data.error==''){                                              
                        this.permissions=res.data.permissions;
                        this.itemDefault=res.data.itemDefault;                        
                        this.users_groups=res.data.users_groups;
                        this.users_types=res.data.users_types;
                        this.columns.hidden=res.data.hidden_columns;
                        this.setColumns();
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
                    label: this.$systemFunctions.getLabel('label_'+key),
                    hideable:false,
                    filterable:true,
                    sortable:true,
                    type:'number',
                    filter:{from:'',to:''}
                };
                for(let index=0;index<this.$systemFunctions.language_available.length;index++)
                {
                    key='name_'+this.$systemFunctions.language_available[index];
                    this.columns.all[key]={
                        label: this.$systemFunctions.getLabel('label_'+key),
                        hideable:true,
                        filterable:true,
                        sortable:true,
                        type:'text',
                        filter:{from:'',to:''}
                    };   
                }
                key='user_group_name';
                this.columns.all[key]={
                    label: this.$systemFunctions.getLabel('label_'+key),
                    hideable:true,
                    sortable:true,
                    filterable:true,
                    type:'dropdown',
                    filter:{from:'',to:'',options:this.users_groups.map(item=>{item.label=item.value=item.name;return item})}                   
                };   
                key='user_type_name';
                this.columns.all[key]={
                    label: this.$systemFunctions.getLabel('label_'+key),
                    hideable:true,
                    sortable:true,
                    filterable:true,
                    type:'dropdown',
                    filter:{from:'',to:'',options:this.users_types.map(item=>{item.label=item.value=item.name;return item})}                     
                };   
                key='email';
                this.columns.all[key]={
                    label: this.$systemFunctions.getLabel('label_'+key),
                    hideable:true,
                    sortable:true,
                    filterable:true,
                    type:'text',
                    filter:{from:'',to:''}                   
                };  
                key='mobile_no';
                this.columns.all[key]={
                    label: this.$systemFunctions.getLabel('label_'+key),
                    hideable:true,
                    sortable:true,
                    filterable:true,
                    type:'text',
                    filter:{from:'',to:''}                   
                };          
                key='status';
                this.columns.all[key]={
                    label: this.$systemFunctions.getLabel('label_'+key),
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
                let items=this.items.data;
                for(let i=0;i<items.length;i++){
                    let name=JSON.parse(items[i]['name']);
                    for(let index=0;index<this.$systemFunctions.language_available.length;index++)
                    {
                        let lang=this.$systemFunctions.language_available[index];
                        items[i]['name_'+lang]=name[lang]?name[lang]:'';
                    }
                }
                this.itemsFiltered=this.$systemFunctions.getFilteredItems(items,this.columns);
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
                    for(let index=0;index<this.$systemFunctions.language_available.length;index++)
                    {
                        let lang=this.$systemFunctions.language_available[index];
                        this.item['name_'+lang]='';;
                    }         
                }
            },
            setItemByItemId(item_id){
                this.item={};
                //local search
                let items=this.items.data;
                for(let i=0;i<items.length;i++){
                    if(items[i].id==item_id){
                        Object.assign(this.item, items[i]);
                        //name according to language already set
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
