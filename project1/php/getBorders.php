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

?>

