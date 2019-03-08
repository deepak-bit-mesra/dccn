$(document).ready(function(){
    //----------------------------GLOBALS-------------------------------------------------
    var acceptAlert = "<div class='alert text-center alert-success'><strong>ACCEPTED !!!</strong> </div>";
    var rejectAlert = "<div class='alert text-center alert-danger'><strong>REJECTED !!!</strong> </div>";
    var remainder = 0;//Remainder for ODD EVEN Parity Even =0 , Odd = 1;




    /*****************  FUNCTIONS  ************************/
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
});

function count_char(str,char){
    count = 0;
    for(x in str){
        if(str[x] === char){
            count++;
        }
    }
    return count; 
    
}