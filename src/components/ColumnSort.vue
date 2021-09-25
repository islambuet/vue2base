<template>
    <div class="d-print-none position-absolute" :style="position" style="top: calc(50% - 24px );">                                            
        <div @click="onChangeSort()"><i type="button" class="bi bi-sort-up-alt text-primary mr-2"></i></div>
        <div @click="onChangeSort()"><i type="button" class="bi bi-sort-down text-primary mr-2"></i></div>                                            
    </div>
</template>

<script>
export default { 
    name: "ColumnSort",    
    props: {
        column: {
            type: Object,
            required: true
        },
        position: {
            type: String,
            default:'left:5px'
            
        },
        onChangeSort: {
            type: Function,
            default: ()=> (console.log('default on sort Filter called'))            
        },
    }, 
    data:function(){
        return{      
        
        }
    },
    created(){
        
    },
    computed: {
        getFilterClass(){
            // if((this.from.length>0)||(this.to.length>0)){
            //         return 'text-danger';
            // }
            // return 'text-primary';
        }
    },    
    methods:{
        resetFilter(){            
            // this.column.filter.from="";
            // this.column.filter.to="";
            // this.from='';
            // this.to='';
            // this.onChangeFilter();
        }
    }
};
</script>