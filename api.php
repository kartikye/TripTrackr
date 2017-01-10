<?php
    cors();
    $username = "travellogger";
    $password = "Myturtle1!";
    $host = "182.50.133.171";
    $dbname = "travellogger";

    mysql_connect($host, $username, $password);
    mysql_select_db($dbname) or die(mysql_error());

    if(mysql_real_escape_string($_POST['action']) != null){
        $action = mysql_real_escape_string($_POST['action']);
    
        switch($action){
            case "delete":
                deleteTrip();
                break;
            case "read":
                read();
                break;
            case "update":
                break;
            case "new":
                newTrip();
                break;
            case "distance":
                distance();
                break;
            default:
                echo "hello";
                break;
        }
    }
    
    function distance(){
        $start = $_POST['startID'];
        $end = $_POST['endID'];
        $response = file_get_contents("https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=place_id:".$start."&destinations=place_id:".$end."&key=AIzaSyC_G4Kiyr-mBiXXUaX4b_48z3oInEQBX3g");
        echo($response);
    }
    
    function deleteTrip(){
        $query = "DELETE FROM trips WHERE trips.tripID = '".$_POST['tripID']."'";
        $qry_result = mysql_query($query) or die(mysql_error());
        $query = "DELETE FROM legs WHERE legs.tripID = '".$_POST['tripID']."'";
        $qry_result = mysql_query($query) or die(mysql_error());
        echo "hello ".$qry_result." ".$_POST['tripID'] ;
    }
    
    function read(){
        $query = "SELECT * FROM trips INNER JOIN legs ON trips.tripID=legs.tripID";
        $qry_result = mysql_query($query) or die(mysql_error());
        
        $row = array();
        while($r = mysql_fetch_assoc($qry_result)) {
            $row[] = $r;
        }
        
        $trips = array();
        
        for($i = 0; $i < count($row); $i++){
            $j = tripExists($row[$i]['tripID'], $trips);
            if($j != -1){
                $leg = array(
                            'legID' => $row[$i]['legID'],
                            'date' => $row[$i]['date'],
                            'startName' => $row[$i]['startName'],
                            'startID' => $row[$i]['startID'],
                            'endName' => $row[$i]['endName'],
                            'endID' => $row[$i]['endID'],
                            'distance' => $row[$i]['distance']
                        );
                array_push($trips[$j]['legs'], $leg);
            }else{
                $trip = array(
                    'tripID' => $row[$i]['tripID'],
                    'tripName' => $row[$i]['tripName'],
                    'legs' => array(
                        array(
                            'legID' => $row[$i]['legID'],
                            'date' => $row[$i]['date'],
                            'startName' => $row[$i]['startName'],
                            'startID' => $row[$i]['startID'],
                            'endName' => $row[$i]['endName'],
                            'endID' => $row[$i]['endID'],
                            'distance' => $row[$i]['distance']
                        )    
                    )
                );
                array_push($trips, $trip);
            }
        }
        
        
        
       print json_encode($trips);
    }
   
    function newTrip(){
        
        
        $data = $_POST['data'];
        
        $tripName = $data['tripName'];
        echo $tripName;
        $legs = $data['legs'];
        
        $tripQuery = "INSERT INTO trips (tripName) VALUES ('".$tripName."')";
        mysql_query($tripQuery) or die('error'.mysql_error());
        $tripID = mysql_insert_id(); 
        
        for($i = 0; $i < count($legs); $i++){
            $legQuery = "INSERT INTO legs (tripID, date,startName,startID,endName,endID, distance) VALUES('".$tripID."','".$legs[$i]['date']."','".$legs[$i]['startName']."','".$legs[$i]['startID']."','".$legs[$i]['endName']."','".$legs[$i]['endID']."','".$legs[$i]['distance']."')";
            mysql_query($legQuery); 
        }
        
        print_r($tripID);
    }
   
    function tripExists($id, $trips){
        if(count($trips) > 0){
            for($i = 0; $i < count($trips); $i++){
                if($trips[$i]["tripID"] == $id){
                    return $i;
                }
            }
        }
        return -1;
    }
        
    function cors() {

        // Allow from any origin
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
            // you want to allow, and if so:
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');    // cache for 1 day
        }
    
        // Access-Control headers are received during OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
                header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
    
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
                header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        }
    }
?>