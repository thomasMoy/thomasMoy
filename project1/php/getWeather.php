<?php
    $capitalCity = $_POST['capital_City'];
    
    $data = file_get_contents("https://api.openweathermap.org/data/2.5/weather?q=$capitalCity&units=metric&appid=b5da222a4ee7262743232406f592da30");


	$decoded = json_decode($data,true);	


	echo json_encode($decoded);
?>