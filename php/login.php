<?php

    function is_logingIn() {
        if(isset($_POST["login_button"])) 
            return true;
        else
            return false;
    }

    function login_user() {
        $username = $_POST["username"];
        $password = $_POST["password"];

        $db = DB::getConnection();

        try {
            $st = $db->prepare("SELECT * FROM dz2_users WHERE username=:user");
            $st->execute(["user" => $username]);
        }
        catch( PDOException $e ) { 
            echo "Greška:" . $e->getMessage(); 
            return false; 
        }

        if($st->rowCount() !== 1) {
            echo "User with that name doesn't exist!";
            return false;
        }
        
        $row = $st->fetch();
        $id = $row["id"];
        $username = $row["username"];
        $password_hash = $row["password_hash"];
        $email = $row["email"];
        $complete_registration = $row["has_registered"];

        if(password_verify($password, $password_hash)) {
            return array($id,$username,$password_hash,$email,$complete_registration);
        }
        else {
            echo "Wrong password!";
            return false;
        }
    }

    function is_registering() {
        if (isset($_POST["register_button"]))
            return true;
        else
            return false;
    }

    function register_user() {
        $username = $_POST["username"];
        $password = $_POST["password"];
        
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        
        $db = DB::getConnection();

        // Tribat će prilagodit imenima stupcima u našoj databazi
        $st = $db->prepare("INSERT INTO Users (username, password_hash) VALUES (:user, :pass)");
        $st->execute(["user" => $username, "pass" => $password_hash]);

        if($st->rowCount() !== 1) {
            echo "Registering failed!";
        }
        else {
            echo "You have registered successfully!";
        }

        // Di da nas odvede kad završimo funkciju, opet na istu stranicu?
        // echo "<br><a href="index.php">Return to login page.</a>;
    }
?>