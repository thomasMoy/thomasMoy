<?php

    $string = file_get_contents("../json/countryBorders.geo.json");
    $json = json_decode($string);
    $features = $json->features;

    $countries = array();

    for($i=0;$i<sizeof($features);$i++){

    $feature = $features[$i];
    $country_name = $feature->properties->name;
    $country_iso_a3 = $feature->properties->iso_a3;
    $country_iso_2 = $feature->properties->iso_a2;
    $array = [$country_name, $country_iso_a3, $country_iso_2];
    array_push($countries, $array);
    
}
    sort($countries);

print_r(json_encode($countries));
    
?>
