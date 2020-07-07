<?php
    require_once 'database/db_class.php';

    function login_user($user, $pass) {
        $db = DB::getConnection();

        try {
            $st = $db->prepare("SELECT * FROM treseta_users WHERE user_name=:user");
            $st->execute(["user" => $user]);
        }
        catch( PDOException $e ) {  
            return false; 
        }

        if($st->rowCount() !== 1) {
            return false;
        }
        
        $row = $st->fetch();
        $id = $row["user_id"];
        $username = $row["user_name"];
        $password_hash = $row["user_pass"];

        if(password_verify($pass, $password_hash)) {
            return $id;
        }
        else {
            return false;
        }
    }

    
    function register_user($user, $pass) {
        $db = DB::getConnection();

        // Provjera je li username zauzet
        try {
            $st = $db->prepare("SELECT * FROM treseta_users WHERE user_name=:user");
            $st->execute(["user" => $user]);
        }
        catch(PDOException $e) { 
            return false; 
        }

        if($st->rowCount() !== 0) {
            return false;
        }

        // Ubacivanje novog korisnika u tablicu treseta_users
        $password_hash = password_hash($pass, PASSWORD_DEFAULT);
        try {
            $st = $db->prepare("INSERT INTO treseta_users (user_name, user_pass) VALUES (:user, :pass)");
            $st->execute(["user" => $user, "pass" => $password_hash]);    
        }
        catch(PDOException $e) { 
            return false; 
        }

        if($st->rowCount() !== 1) {
            return false;
        }
        else {
            echo "You have registered successfully!";
        }
    }

    function sendJSONandExit($message) {
        header('Content-type:application/json;charset=utf-8');
        echo json_encode($message);
        flush();
        exit(0);
    }

    // action je login ili register
    if(isset($_GET["user"]) && isset($_GET["pass"]) && isset($_GET["action"])) {
        $user = $_GET["user"];
        $pass = $_GET["pass"];
        $action = $_GET["action"];

        if($action === "login") {
            $id = login_user($user, $pass);
            
	        $message = [];
        	$message["id"] = $id;
            sendJSONandExit($message);
        }
        else if($action === "register") {
            register_user($user, $pass);
        }
        else {
            echo "error";
        }
    }

    else {
        echo "Data not sent.";
    }
?>