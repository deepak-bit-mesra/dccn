


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

/* --------------------------------------------------- */

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

/* --------------------------------------------------- */

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

/* --------------------------------------------------- */

function showAlert(id,msg){
    $(("#"+id)).html(msg);
}
/* --------------------------------------------------- */
/*

/*

/*

/*              CRC

/*

/*

/*
/* ---------------------------------------------------*/


function crc_Division_Remainder(div,key){//div for dividend
    var n = div.length;//div = 100100
    var m = key.length;//key = 1101

    
    //var div = (parseInt(div,2) << (m-1)).toString(2);//Adding m-1 Zeroes. say 288
    //say str_augDiv = 100100000

    var pick = m;//4-1 = 3 
    var rem = div.substr(0,pick);//Starting first Time Rem for Remainder
    

    for(var i=0;i<n-m+1;i++){//Ignoring the Last BIT in Dividend
        
        if(rem[0]=='0'){
            rem = XOR(rem,'0000');
        }
        else{
            rem = XOR(rem,key);
        }
        if(rem.length<m-1){//Means The First Bits are zero and ThereFore Not Appearing
            var difference = (m-1)-rem.length;
            rem = AddPrefix('0',difference,rem);
            console.log("After Prefixing . Rem = ",rem);
            
        }


        if(div[pick]==undefined)break;//Checking For Last Bit

        rem = rem + div[pick];
        console.log("Remainder After Bring Down = ",rem);
        console.log("Pick  = ",pick);
        pick = pick + 1;
        
    }
    



    return rem;//Replaced The Added Zeroes With the Remainder.
    
    
}

/* ---------------------------------------------------*/

function XOR(str_a,str_b){
    var str_c = (parseInt(str_a,2) ^ parseInt(str_b,2)).toString(2);
    console.log(str_a,"^",str_b,"=",str_c);
    return str_c;
}

/* ---------------------------------------------------*/

function AddPrefix(char,len,targetString){
    var str = char.repeat(len);
    return (str + targetString);
}

/* ---------------------------------------------------*/

function crc_Send_Data(div,key){
    var m = key.length;
    var ori_div = div;
    var div = (parseInt(div,2) << (m-1)).toString(2);//Adding m-1 Zeroes. say 288
    var send_data = ori_div + crc_Division_Remainder(div,key);
    return send_data;
}

/* ---------------------------------------------------*/
function crc_Receive_Data(div,key){
    if(parseInt(crc_Division_Remainder(div,key))==0){
        console.log("Accepted");
        return true;
    }
    console.log("Rejected");
    return false;
}