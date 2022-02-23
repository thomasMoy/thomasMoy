<?php
    
    $startDate = $_POST['start_Date'];
    $endDate = $_POST['end_Date'];
    
    $data = file_get_contents("https://covidtrackerapi.bsg.ox.ac.uk/api/v2/stringency/date-range/$startDate/$endDate");


	$decoded = json_decode($data,true);	


	echo json_encode($decoded);

?>