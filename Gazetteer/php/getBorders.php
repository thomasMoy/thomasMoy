<?php

    $string = file_get_contents('../json/countryBorders.geo.json');
    $json = json_decode($string);
    $features = $json->features;
    $country_code = $_GET['country_Code'];

    $output_geo = "";

    for($i=0; $i<sizeof($features); $i++){
        $feature = $features[$i];
        if($feature->properties->iso_a3 == $country_code) {
            $output_geo = $feature->geometry;
        }
    }

    echo json_encode($output_geo);

    /*ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
    
        $data = file_get_contents('../json/countryBorders.geo.json');
        $decode = json_decode($data, true);

        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
        $output['data'] = $decode['features'];

        header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);*/

?>

