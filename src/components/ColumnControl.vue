<template>
    <div class="card d-print-none mb-2">
        <div class="card-body">            
            <div class="row">
                <template v-for="(column, key) in columns.all">
                    <div class="col-sm-6 col-md-3" :key="'cc_'+key" v-if="column.hideable">                                                
                        <label><input type="checkbox" :value="key" :checked="columns.hidden.indexOf(key)>=0?false:true" @change="toggleControlColumns($event)" > {{column.label}}</label>
                    </div>
                </template>
            </div>
            <div class="text-center" v-if="allow_save">
                <button type="button" class="btn btn-sm bg-gradient-primary" @click="saveHiddenColumns"><i class="feather icon-save"></i> {{$systemFunctions.getLabel('button_save_column_controls')}}</button>
            </div>
        </div>
    </div>
</template>

<script>
export default { 
    name: "ColumnControl",    
    props: {
        columns: {
            type: Object,
            required: true
        },        
        allow_save:{
            type: Boolean,
            default:true
        },
        url: {
            type: String,
            required: true
        },
        method: {
            type: String,
            default: 'list'
            
        },
    }, 
    methods:{
        toggleControlColumns:function (event)
        {
            let key=event.srcElement.value;            
            if(event.srcElement.checked)
            { 
                //this.columns.hidden.splice(this.columns.hidden.indexOf(key), 1);                                  
                this.columns.hidden=this.columns.hidden.filter(function(value) {return value !== key});
            }else
            {
                this.columns.hidden.push(key);
            }    
        },        
        saveHiddenColumns:function()
        {
            //this.$systemFunctions.statusDataLoaded=0;
            var form_data=new FormData();            
            form_data.append ('url', this.url);
            form_data.append ('method', this.method);
            for(let i=0;i<this.columns.hidden.length;i++){
                form_data.append ('hidden_columns[]', this.columns.hidden[i]);
            }
            this.$axios.post('/columns-control/save-item',form_data)
            .then(res => {
                this.$systemFunctions.statusDataLoaded = 1;
                if(res.data.error==''){
                    this.$systemFunctions.showSuccessMessage(this.$systemFunctions.getLabel('msg_success_saved'));
                    
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
    }

};
</script>
