<?php

require_once __DIR__ . '/db_class.php';

create_table_users();
create_table_rooms();
create_table_games();
create_table_actions();

exit( 0 );

// -------------------------------
function has_table($tblname) {
	$db = DB::getConnection();
	
	try {
		$st = $db->prepare("SHOW TABLES LIKE :tblname");

		$st->execute(array("tblname" => $tblname));
		if($st->rowCount() > 0)
			return true;
	}
	catch(PDOException $e) { 
        exit("PDO error [show room_player_turn]: " . $e->getMessage()); 
    }

	return false;
}

function create_table_users() {
	$db = DB::getConnection();

	if(has_table("treseta_users"))
		exit("Tablica treseta_users vec postoji. Obrisite ju pa probajte ponovno.");

	try {
        // user pass je zapravo password_hash
        // ako stignemo ja bi jos doda email, ver_code i has_registered
        // da neko ne moze nastackat 10000 usera
		$st = $db->prepare( 
			"CREATE TABLE IF NOT EXISTS treseta_users (" .
			"user_id int NOT NULL PRIMARY KEY AUTO_INCREMENT," .
			"user_name varchar(20) NOT NULL," .
            "user_pass varchar(255) NOT NULL)"
        );

		$st->execute();
	}
	catch(PDOException $e) { 
        exit("PDO error [create treseta_users]: " . $e->getMessage()); 
    }

	echo "Napravio tablicu treseta_users.<br/>";
}

function create_table_rooms() {
	$db = DB::getConnection();

	if(has_table("treseta_rooms"))
		exit("Tablica treseta_rooms vec postoji. Obrisite ju pa probajte ponovno.");

	try {
		$st = $db->prepare(
            // user_turn drži koji je igrač na potezu, inače bi trebalo deducirat
            // iz treseta_actions ko je idući na redu, a to nije bas najlakše
			"CREATE TABLE IF NOT EXISTS treseta_rooms (" .
			"room_id int NOT NULL PRIMARY KEY AUTO_INCREMENT," .
			"room_name varchar(20) NOT NULL," .
            "room_status varchar(50) NOT NULL)" . 
            "user_turn int NOT NULL)"
	    );

		$st->execute();
	}
	catch(PDOException $e) { 
        exit("PDO error [create treseta_rooms]: " . $e->getMessage()); 
    }

	echo "Napravio tablicu treseta_rooms.<br/>";
}

function create_table_games() {
	$db = DB::getConnection();

	if(has_table('treseta_games'))
		exit( 'Tablica treseta_games vec postoji. Obrisite ju pa probajte ponovno.' );

	try {
		$st = $db->prepare( 
            // treba razmislit kako spremat karte, 
            // mozda array ili samo string
			'CREATE TABLE IF NOT EXISTS treseta_games (' .
			'game_id int NOT NULL PRIMARY KEY AUTO_INCREMENT,' .
			'room_id INT NOT NULL,' .
			'user_id INT NOT NULL,' .
			'user_cards varchar(1000) NOT NULL)'
		);

		$st->execute();
	}
	catch( PDOException $e ) { 
        exit("PDO error [create treseta_games]: " . $e->getMessage()); 
    }

	echo "Napravio tablicu treseta_games.<br/>";
}

function create_table_actions() {
    $db = DB::getConnection();

	if(has_table('treseta_actions'))
		exit( 'Tablica treseta_actions vec postoji. Obrisite ju pa probajte ponovno.' );

	try {
		$st = $db->prepare(
			'CREATE TABLE IF NOT EXISTS treseta_actions (' .
			'game_id int NOT NULL PRIMARY KEY AUTO_INCREMENT,' .
			'action_date DATETIME NOT NULL,' .
			'action_card varchar(10) NOT NULL)'
		);

		$st->execute();
	}
	catch( PDOException $e ) { 
        exit("PDO error [create treseta_game]: " . $e->getMessage()); 
    }

	echo "Napravio tablicu treseta_game.<br/>";    
}

?>