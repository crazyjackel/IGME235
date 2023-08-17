<?php

/*
header('content-type:application/json');      // tell the requestor that this is JSON
header("Access-Control-Allow-Origin: *");     // turn on CORS
header("X-this-330-service-is-kinda-lame: true");   // a custom header - by convention they begin with 'X'
*/


if($_FILES['image']['tmp_name']){
    move_uploaded_file($_FILES['image']['tmp_name'], '..data/'.rand(1, 1000).'.jpg');
}
?>