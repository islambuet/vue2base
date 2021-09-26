<template>
    <div class="btn-group d-print-none position-absolute" :style="position" style="top: calc(50% - 8px)">
        <i type="button" class="feather icon-search" :class="getFilterClass" data-toggle="dropdown"></i>
        <div class="dropdown-menu dropdown-menu-right" onclick="event.stopPropagation()">
            <div class="dropdown-item p-1" v-if="column.type=='number'">
                <small>{{$systemFunctions.getLabel('label_from')}}</small>
                <input type="number" class="form-control form-control-sm float_all" v-model="from" @input="column.filter.from=from;onChangeFilter()"> 
                <small>{{$systemFunctions.getLabel('label_to')}}</small>
                <input type="number" class="form-control form-control-sm float_all" v-model="to" @input="column.filter.to=to;onChangeFilter()">               
            </div>  
            <div class="dropdown-item p-1" v-if="column.type=='text'">
                <small>{{$systemFunctions.getLabel('label_search')}}</small>
                <input type="text" class="form-control form-control-sm" v-model="from" @input="column.filter.from=from;onChangeFilter()"> 
            </div>          
            <div class="dropdown-item p-1" v-if="column.type=='dropdown'">  
                <select class="form-control form-control-sm"  v-model="from" @change="column.filter.from=from;onChangeFilter()">  
                    <option value="">{{$systemFunctions.getLabel('label_select')}}</option>
                    <option v-for="(option, i) in column.filter.options" :key="i" :value="option.value">
                          {{ option.label }}
                      </option>                                  
                  </select>
            </div>      
            <div class="dropdown-item p-1" v-if="column.type=='date'">
                <small>{{$systemFunctions.getLabel('label_from')}}</small>
                <input type="date" class="form-control form-control-sm" v-model="from" @input="column.filter.from=from;onChangeFilter()"> 
                <small>{{$systemFunctions.getLabel('label_to')}}</small>
                <input type="date" class="form-control form-control-sm" v-model="to" @input="column.filter.to=to;onChangeFilter()">               
            </div>     
            <div class="dropdown-divider"></div>
            <div class="dropdown-item p-1 text-center">
                <button type="button" class="btn btn-sm bg-gradient-primary" @click="resetFilter()"><i class="feather icon-rotate-cw"></i> {{$systemFunctions.getLabel('button_reset')}}</button>
            </div>
        </div>
    </div>
</template>

<script>
export default { 
    name: "ColumnFilter",    
    props: {
        column: {
            type: Object,
            required: true
        },
        position: {
            type: String,
            default:'right:5px'
            
        },
        onChangeFilter: {
            type: Function,
            default: ()=> (console.log('default on change Filter called'))            
        },
    }, 
    data:function(){
        return{      
            from:'',
            to:'',
        }
    },
    created(){
        this.from=this.column.filter.from;
        this.to=this.column.filter.to;
    },
    computed: {
        getFilterClass(){
            if((this.from.length>0)||(this.to.length>0)){
                    return 'text-danger';
            }
            return 'text-primary';
        }
    },    
    methods:{
        resetFilter(){            
            this.column.filter.from="";
            this.column.filter.to="";
            this.from='';
            this.to='';
            this.onChangeFilter();
        }
    }
};
</script>
<style scoped>
    .dropdown-item:active {
        background-color: transparent;
    }
</style>