"use strict";

var global={};
$(document).ready(function(){
    //----------------------------GLOBALS-------------------------------------------------
    var acceptAlert = "<div class='alert text-center alert-success'><strong>ACCEPTED !!!</strong> </div>";
    var rejectAlert = "<div class='alert text-center alert-danger'><strong>REJECTED !!!</strong> </div>";
    var remainder = 0;//Remainder for ODD EVEN Parity Even =0 , Odd = 1;
    global.original_data = [];
    global._2dp_original_data = [];
    global.segment_number=1;
    global._2dp_segment_number=1;
    global.checksumArr = ['10011001','11100010','00100100','10000100'];

    /*****************  Events  ************************/
    $("#id_sender-cpb").click(function(){
        var inp = $("#id_even-parity-input");
        inp_str = inp.val();
        count = count_char(inp_str,'1');
        if((count%2 == remainder))
            computed_str= inp_str + '0';
        else
            computed_str= inp_str + '1';
        $("#id_even-parity-output").val(computed_str);

    });
    
    /* --------------------------------------------------- */
    $("#id_add-noise").click(function(){
        $("#id_even-parity-output").prop("disabled",false);

    });
    /* --------------------------------------------------- */
    $("#id_send").click(function(){
        $("#id_receiver-even-parity-input").val($("#id_even-parity-output").val());
    });
    /* --------------------------------------------------- */
    $("#id_receiver-cpb").click(function(){
        var str_received = $("#id_receiver-even-parity-input").val();
        $message = $("#acceptance");
        if(count_char(str_received,'1') %2 === remainder ){
            $message.html(acceptAlert);
        } 
        else{
            $message.html(rejectAlert);
        }
    });
    /* --------------------------------------------------- */
    $("#id_even_parity_tab").click(function(){
        remainder = 0;
    });
    /* --------------------------------------------------- */
    $("#id_odd_parity_tab").click(function(){
        remainder = 1;
    });
    /* --------------------------------------------------- */
    /*
    *
    *       1D PARITY ENDED
    *       CHECKSUM STARTED
    * 
    * 
    * 
    * 
    * */
    $("#continue").click(function(){
        global.num_segment = parseInt($("#id_segment").val());
        global.num_bits = parseInt($("#id_num_bits").val());
        

        for(i=0;i<global.num_segment;i++){
            //nothing
        }
        debugger;

    });
    /* --------------------------------------------------- */
    $("#id_nextbtn").click(function(){
        add_to_original_data_array();
    });

    /* --------------------------------------------------- */
    $("#id_bin_entries").keypress(function (e) { 
        //console.log(e.which);//not using keycode
        //debugger;
        if(e.which !== 49 && e.which!== 48){
            //console.log("nothing");
            e.preventDefault();
        }
        if(e.which === 13){
            //console.log("Enter Pressed");
            add_to_original_data_array();
            

        }
    });

    /* --------------------------------------------------- */

    $("#send_checksum").click(function(e){
        //e.preventDefault();
        $("#text_Area_received_Data").text(global.original_data.toString());
        try{
            $("#received_Checksum").html(global.checksum_SentData.checksum);
            $("#id_verifychecksum").prop("disabled",false);
            $("#id_verifychecksum, #checksum_add_noise").css({
                "cursor":"auto"
            });
            $("#checksum_add_noise").prop("disabled",false);
        }
        catch(err){
            debugger;
            window.alert("No Data Found. Please Try Again");
            console.error("ERROR :- ",err.message);
            debugger;
            
        }
        
        

    });

    /* --------------------------------------------------- */


    $("#id_verifychecksum").click(function (e) { 
        //e.preventDefault();
        var receivedData = $("#text_Area_received_Data").val();
        var receivedChecksum =  $("#received_Checksum").text();

        var receivedDataArray = str_to_array(receivedData);
        var sum = checksum(receivedDataArray)["sum"];
        debugger;

        sum = checksum_Addition(sum,receivedChecksum);//Complement
        console.log("sum + checksum  = " ,sum);
        var message = $("#checksum_acceptance");
        if(sum==='00000000'){
            message.html(acceptAlert);
        }
        else{
            message.html(rejectAlert);
        }



        
    });
    
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /*
    *
    *       CHECKSUM ENDED
    *       2D parity STARTED
    * 
    * 
    * 
    * 
    * */

    $("#_2dp_id_nextbtn").click(function(){
        _2dp_add_to_original_data_array();
    });

    /* --------------------------------------------------- */

    $("#_2dp_id_bin_entries").keypress(function (e) { 
        //console.log(e.which);//not using keycode
        //debugger;
        if(e.which !== 49 && e.which!== 48){
            //console.log("nothing");
            e.preventDefault();
        }
        if(e.which === 13){
            //console.log("Enter Pressed");
            _2dp_add_to_original_data_array();
            

        }
    });

    /* --------------------------------------------------- */

    $("#_2dp_send_checksum").click(function(e){
        $("#_2dp_text_Area_received_Data").val(
            addingRowAndColumnParity(global._2dp_original_data));
        debugger;
        $("#_2dp_id_verifychecksum").prop("disabled",false);
        $("#_2dp_checksum_add_noise").prop("disabled",false);
    });

    /* --------------------------------------------------- */


    $("#_2dp_checksum_add_noise").click(function(e){
        $("#_2dp_text_Area_received_Data").prop("disabled",false);
    });

    /* --------------------------------------------------- */

    $("#_2dp_id_verifychecksum").click(function(e){
        var receivedString = $("#_2dp_text_Area_received_Data").val();
        
        var flag = _2dp_vefify(receivedString);
        if(flag==true){
            showAlert("_2dp_checksum_acceptance",acceptAlert);
        }
        else{
            showAlert("_2dp_checksum_acceptance",rejectAlert);
        }

    });

    

});
























/* ********************* Functions **********************  */
/*

*
*
*

*
*
*

*
*
*

*
*
*

*/



function count_char(str,char){
    var count = 0;
    var x;
    for(x in str){
        if(str[x] === char){
            count++;
        }
    }
    return count; 
    
}
/* --------------------------------------------------- */
function add_to_original_data_array(){
    var temp = $("#id_bin_entries").val();
    //debugger;
    temp = get_8_bit_binary_from_str(temp);
    global.original_data.push(temp);

    //Just TExt Changes
    $("#id_bin_entries").val("");
    $("#card-body-para").text(global.original_data.toString());
    var sg_num_span = $("#seg_num");
    sg_num_span.text("(k=" + (++global.segment_number) +")");
    var m = "<BR>m = 8";
    $("#k_and_m").html("k = " + (global.segment_number - 1) + m);
    global.checksum_SentData = checksum(global.original_data);
    $("#sender_sum").html("Sum = "+global.checksum_SentData.sum+"<BR>CheckSum = "+global.checksum_SentData.checksum);
}
/* --------------------------------------------------- */
function parse_binaryInt(str){
    return parseInt(str,2);
}
/* --------------------------------------------------- */

/* --------------------------------------------------- */
function get_8_bit_binary(num){
    var concatinated_str = '00000000' + num.toString(2);
    var last8bits = concatinated_str.substr(-8);//last 8 characters of string
    return last8bits;
}
/* --------------------------------------------------- */
function get_8_bit_binary_from_str(str){
    var concatinated_str = '00000000' + str;
    var last8bits = concatinated_str.substr(-8);//last 8 characters of string
    return last8bits;
}
/* --------------------------------------------------- */
function checksum_Addition(a,b){
    //This Function will take 2 numbers of 8 bits
    // Add them . If there is 1 extra bit,It means that
    // we have to subtract the value of 9th bit from left i.e. 256
    // then Add 1 to the sum and return that.
    x = parse_binaryInt(a);
    y = parse_binaryInt(b);
    var ans = (x+y)%255;
    //If there is 9th bit 
    // removed 9th bit and then added it.
    // % operator is used because it will remove the 9th bit
    // As well as add it to the sum
    console.log("In checksum_Addition");
    console.log("a = ",a);
    console.log("b = ",b);
    console.log("ans = ",get_8_bit_binary(ans));
    return get_8_bit_binary(ans);
}
/* --------------------------------------------------- */
function checksum(bin_data_arr){
    
    var len = bin_data_arr.length;
    var i=0;
    var sum = get_8_bit_binary(0);
    $.each(bin_data_arr,function(index,value){
        sum = checksum_Addition(sum,value);
    });
    var checksum = bitwise_NOT(sum);
    return {"sum":sum,"checksum":checksum};
}
/* --------------------------------------------------- */

function bitwise_NOT(str_8_bit){
    var ans = ['0','0','0','0','0','0','0','0'];
    var len = str_8_bit.length;
    
    for(var i=0;i<len;i++){
        if(str_8_bit[i]=='1')
            ans[i]='0';
        else
            ans[i] = '1';
    }
    return ans.join('');
}
/* --------------------------------------------------- */
function str_to_array(str){
    var arr = str.split(',');
    function trimComma(value){
        return value!='';
    }
    arr= arr.filter(trimComma);
    return arr;
}
/* --------------------------------------------------- */
function _2dp_add_to_original_data_array(){
    var temp = $("#_2dp_id_bin_entries").val();
    //debugger;
    temp = get_8_bit_binary_from_str(temp);
    global._2dp_original_data.push(temp);
    
    //Just TExt Changes
    $("#_2dp_id_bin_entries").val("");
    $("#_2dp_card-body-para").text(global._2dp_original_data.toString());
    var sg_num_span = $("#_2dp_seg_num");
    sg_num_span.text("(k=" + (++global._2dp_segment_number) +")");
    var m = "<BR>m = 8";
    $("#_2dp_k_and_m").html("k = " + (global._2dp_segment_number - 1) + m);
    //global._2dp_checksum_SentData = checksum(global._2dp_original_data);
    //$("#_2dp_sender_sum").html("Sum = "+global._2dp_checksum_SentData.sum+"<BR>CheckSum = "+global._2dp_checksum_SentData.checksum);
}

function addingRowAndColumnParity(arrofStr){
    debugger;
    var len = arrofStr.length;
    var augumented_Arr = new Array(len);
    //Adding Row Parity
    
    for (var i in arrofStr) {
        console.log(arrofStr[i]);
        if (count_char(arrofStr[i], '1') % 2 == 0) {
            augumented_Arr[i] = arrofStr[i] + '0';
        }
        else {
            augumented_Arr[i] = arrofStr[i] + '1';
        }

    }
    //Adding Column Parity (The Last Row)
    //debugger;
    var tempColumnArr = [];
    for(var col=0;col<9;col++){//string length becomes 9
        var tempstr = '';
        for(i in augumented_Arr){
            tempstr = tempstr + augumented_Arr[i][col];
        }
        
        tempColumnArr[col] = ''+count_char(tempstr,'1')%2;
        //debugger;
        //console.log("tempcolArr ",tempColumnArr);
        
        
 
    }
    augumented_Arr[augumented_Arr.length] = tempColumnArr.join('');
    //console.log(augumented_Arr);
    return global.augumented_Arr = augumented_Arr;
    
}

function _2dp_vefify(receivedString){
    var flag = true;
    //For Row Parity Check
    var arr = receivedString.split(',');
    for(var i in arr){//Including the Last row i.e. row of column parities
        //console.log(global.augumented_Arr[i].substring(0,8));
        //console.log(global.augumented_Arr[i][8]);
        if(count_char(arr[i].substring(0,8),'1')%2 != parseInt(arr[i][8])){
            flag = false;
            return flag;
        }
    }
    //For Column parity Check
    for(var col=0;col<9;col++){//string length becomes 9
        var tempstr = '';
        for(var i =0;i<arr.length-1;i++){//leaving the last row
            tempstr = tempstr + arr[i][col];

        }
        if(count_char(tempstr,'1')%2 != parseInt(arr[arr.length -1][col])){
            flag = false;
            return flag;
        }

    }
    return flag;

}

function showAlert(id,msg){
    $(("#"+id)).html(msg);
}
