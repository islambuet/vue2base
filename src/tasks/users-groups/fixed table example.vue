<template>
        <div class="outer card mb-2">
            <div class="inner card-body">
                <table>
                    <tr>
                    <td>Header A</td>
                    <td>col 1 - A</td>
                    <td>col 2 - A (WITH LONGER CONTENT)</td>
                    <td>col 3 - A</td>
                    <td>col 4 - A</td>
                    <td>col 5 - A</td>
                    </tr>
                    <tr>
                    <td>Header B</td>
                    <td>col 1 - B</td>
                    <td>col 2 - B</td>
                    <td>col 3 - B</td>
                    <td>col 4 - B</td>
                    <td>col 5 - B</td>
                    </tr>
                    <tr>
                    <td>Header C</td>
                    <td>col 1 - C</td>
                    <td>col 2 - C</td>
                    <td>col 3 - C</td>
                    <td>col 4 - C</td>
                    <td>col 5 - C</td>
                    </tr>
                </table>
            </div>
        </div>  
    
</template>

<style scoped>
table{
    table-layout:fixed;
}

table th:first-child,table td:first-child
{
  position:absolute; 
  width:500px;
  left:0; 
}
table th:nth-child(2), table td:nth-child(2)
{
  position:absolute;
  width:500px;
  left:500px;  
}
.outer {position:relative}
.inner {
  overflow-x:scroll;  
  margin-left:1000px;
  
}
/* table {
  table-layout: fixed; 
  
  
}
td, th {
  vertical-align: top;
  border-top: 1px solid #ccc;
  padding:10px;
  width:400px;
}
th {
  position:absolute;  
  left:0; 
  
}
.outer {position:relative}
.inner {
  overflow-x:scroll;
  overflow-y:visible;
  margin-left:400px;
  
} */
/* table{
    table-layout:fixed;
}
td,th{
   vertical-align: top;
    border-top: 1px solid #ccc;
    padding:10px;
    width:500px;
}

th:first-child, td:first-child
{
  position:absolute;
  width:500px;
  left:0px;
  background-color:grey;
  border: 5px solid blue;  
} */
/* th:nth-child(2), td:nth-child(2)
{
  position:sticky;
  left:500px;
  background-color:lightgray;
} */
/* 
table.has-sticky-column td:first-child,table.has-sticky-column th:first-child{
    position: sticky;
    left: 0;    
    width: 300px!important;
    background-color: blue;
}
table.has-sticky-column td:nth-child(2),table.has-sticky-column th:nth-child(2){
    position: sticky;
    left: 300px;       
    width: 300px!important; 
    background-attachment: fixed;
    background-color: red;
} */
</style>