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
    global._crc_Data ={dividend:"100100",key:"1101"};


    $("#myModal").on('show.bs.modal',function(){
        console.log("On show");
        var ack_div_modal = $("#Acknowledgement");
        ack_div_modal.load("pages/Acknowledgement.htm");
    });
    //var ack_div_modal = $("#Acknowledgement");
    //ack_div_modal.load("pages/Acknowledgement.htm");


    /*****************  Events  ************************/
    $("#id_sender-cpb").click(function(){
        var inp = $("#id_even-parity-input");
        var inp_str = inp.val();
        var computed_str;
        var count = count_char(inp_str,'1');
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
        var message = $("#acceptance");
        if(count_char(str_received,'1') %2 === remainder ){
            message.html(acceptAlert);
        } 
        else{
            message.html(rejectAlert);
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


    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /*
    *
    *       
    *       2D parity ENDED
    *       CRC STARTED
    * 
    * 
    * 
    * 
    * */

    $("#_crc_id_Dividend,#_crc_id_key").keypress(function(e){
        if(e.which !== 49 && e.which!== 48){
            //console.log("nothing");
            e.preventDefault();
        }
        if(e.which === 13){
            console.log("Enter Pressed");
            //_2dp_add_to_original_data_array();
            

        }
    });

    $("#_crc_continue").click(function(e){
        var dividend = $("#_crc_id_Dividend").val();
        var key = $("#_crc_id_key").val();
        var sent_data = crc_Send_Data(dividend,key);
        $("#_crc_card-body-para").text(sent_data);

    });

    $("#_crc_send_Data").click(function (e) {
        var temp = $("#_crc_card-body-para").text();
        $("#_crc_text_Area_received_Data").val(temp);
        $("#_crc_received_Key").text($("#_crc_id_key").val());
        $("#_crc_id_verifychecksum,#_crc_checksum_add_noise").prop("disabled",false);

    });

    $("#_crc_id_verifychecksum").click(function(e){
        var dividend = $("#_crc_text_Area_received_Data").val();
        var key = $("#_crc_received_Key").text();
        if(crc_Receive_Data(dividend,key)){
            showAlert("_crc_checksum_acceptance",acceptAlert);
        }
        else{
            showAlert("_crc_checksum_acceptance",rejectAlert);
        }
    });


    $("#_crc_checksum_add_noise").click(function(e){
        $("#_crc_text_Area_received_Data").prop("disabled",false);
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
