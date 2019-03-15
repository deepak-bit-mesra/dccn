var data = [
    {value:0.4,code:""},
    {value:0.18,code:""},
    {value:0.17,code:""},
    {value:0.15,code:""},
    {value:0.1,code:""}
];

var desc = function(a,b){//use this as arr.sort(desc) for descending order
    return b-a;
}
$(document).ready(function(){

    
    
});

var suminrange = function(arr,start,end){
    var sum=0;
    var i;
    for(i=start;i<=end;i++){
        sum = sum + arr[i].value;
    }
    return sum;
}
var pIndex = function(arr,start,end){
    var i;
    for(i=0;i<data.length-1;i++){
        //console.log(i);
        if(suminrange(data,0,i) > suminrange(data,i+1,data.length-1)){
            console.log("TRUE for ",i);
            break;
        }
    }
    return i;
}
function zero_and_one(arr){

}