<?php

    $countryCode = $_POST['country_Code'];
    
    $data = file_get_contents("https://restcountries.com/v3.1/alpha/$countryCode");


	$decoded = json_decode($data,true);	


	echo json_encode($decoded);
    
?>
    