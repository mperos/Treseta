<?php
    require_once 'database/db_class.php';

    function sendJSONandExit($message) {
        header('Content-type:application/json;charset=utf-8');
        echo json_encode($message);
        flush();
        exit(0);
    }

    function get_rooms() {
        $db = DB::getConnection();

        try {
            $st = $db->prepare("SELECT * FROM treseta_rooms");
            $st->execute();
        }
        catch(PDOException $e) { 
            echo "Greška: " . $e->getMessage(); 
            return false; 
        }

        $room_id = [];
        $room_name = [];
        $room_status = [];
        $room_users = [];
        while($row = $st->fetch()) {
            array_push($room_id, $row["room_id"]);
            array_push($room_name, $row["room_name"]);
            array_push($room_status, $row["room_status"]);
            array_push($room_users, $row["users"]);
        }

        $message["room_id"] = $room_id;
        $message["room_name"] = $room_name;
        $message["room_status"] = $room_status;
        $message["room_users"] = $room_users;

        sendJSONandExit($message);
    }

    function create_room($login_id, $room_name) {
        $db = DB::getConnection();

        if($login_id === "") {
            echo "<p> Login ID nije postavljen. </p>";
            return false;
        }

        try {
            $st = $db->prepare("SELECT * FROM treseta_rooms WHERE room_name=:room");
            $st->execute(["room" => $room_name]);
        }
        catch(PDOException $e) {
            echo "<p> Nevaljan upit na bazu. </p>";
            return false; 
        }

        if($st->rowCount() !== 0) {
            echo "<p> Već postoji baza sa ovim imenom. </p>";
            return false;
        }

        try {
            $usersObj->users = [];
            $usersJSON = json_encode($usersObj);
            $st = $db->prepare("INSERT INTO treseta_rooms (room_name, room_status, users) VALUES (:room, :stat, :users)");
            $st->execute(["room" => $room_name, "stat" => 0, "users" => $usersJSON]);    
        }
        catch(PDOException $e) { 
            echo "<p> Nevaljan unos u bazu. </p>";
            return false; 
        }

        if($st->rowCount() !== 1) {
            echo "<p> Došlo je do pogreške. Pokušajte ponovno. </p>";
            return false;
        }
        else {
            echo "<p> Uspješno ste napravili novu sobu! </p>";
        }
    }

    function enter_room($room_id, $login_id) {
        $db = DB::getConnection();

        if($login_id === "" || $room_id === "") {
            echo "<p> Login ID nije postavljen. </p>";
            return false;
        }

        try {
            $st = $db->prepare("SELECT * FROM treseta_rooms WHERE room_id=:room_id");
            $st->execute(["room_id" => $room_id]);
        }
        catch(PDOException $e) {
            echo "<p> Nevaljan upit na bazu. </p>";
            return false; 
        }

        if($st->rowCount() !== 1) {
            echo "<p> Ušli ste u sobu koja ne postoji. </p>";
            return false;
        }

        
        $row = $st->fetch();
        $room_name = $row["room_name"];
        $room_status = $row["room_status"];
        $usersJSON = $row["users"];

        $usersObj = json_decode($usersJSON, true);
        array_push($usersObj["users"], intval($login_id));
        $usersJSON = json_encode($usersObj);
        try {
            $st = $db->prepare("UPDATE treseta_rooms SET room_status = :room_status, users = :users WHERE room_id=:room_id");
            $st->execute(["room_status" => $room_status, "users" => $usersJSON, "room_id" => $room_id]);
        }
        catch(PDOException $e) {
            echo "<p> Nevaljana promjena u bazi. </p>";
            return false; 
        }

        if($st->rowCount() !== 1) {
            echo "<p> Došlo je do pogreške. Pokušajte ponovno. </p>";
            return false;
        }
        else {
            echo "<p> Uspješno ste ušli u sobu! </p>";
        }
    }

    function new_room() {
        echo "<label for='new_room'> Room name: </label>";
        echo "<input type='text' name='new_room' id='nroom'> <br>";
        echo "<button id='btn_create'> Create! </button>";
        return;
    }

    function logout() {
        return;
    }

    if(isset($_GET["action"])) {
        $action = $_GET["action"];

        if($action === "rooms") {
            get_rooms();
        } 
        else if($action === "new_room") {
            new_room();
        }
        else if($action === "create_room") {
            if(isset($_GET["room_name"]) && isset($_GET["login_id"])) {
                $room_name = $_GET["room_name"]; 
                $login_id = $_GET["login_id"];
                create_room($login_id, $room_name);
            }
        }
        else if($action === "enter_room") {
            if(isset($_GET["room_id"]) && isset($_GET["login_id"])) {
                $login_id = $_GET["login_id"];
                $room_id = $_GET["room_id"];
                enter_room($room_id, $login_id);
            }
        }
        else if($action === "logout") {
            logout();
        }
        else {
            echo "Error!";
        }
    }
     
?>