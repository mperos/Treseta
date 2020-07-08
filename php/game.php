<?php
session_start();



require_once __DIR__ . '/database/db_class.php';



if(isset($_GET) && isset($_GET['function']))
{
    if($_GET['function'] == 'exit')
    {
        $room = $_SESSION['room_id'];
        $db = DB::getConnection();
        $st = $db->prepare("DELETE FROM treseta_rooms WHERE room_id=:room");
        $st->execute();

        $st = $db->prepare("DELETE FROM treseta_games WHERE room_id=:room");
        $st->execute();
    }
    if($_GET['function'] == 'wait')
    {
        $room = $_SESSION['room_id'];
        $db = DB::getConnection();
        $st = $db->prepare("SELECT * FROM treseta_rooms WHERE room_id=:room");
        $st->execute(["room" => $room]);
        $row = $st->fetch();
        echo $row['users'];
    }
    if($_GET['function'] == 'set_session')
    {
        $_SESSION['user_id'] = $_GET['user'];
        $_SESSION['room_id'] = $_GET['room'];
    }
    if($_GET['function'] == 'user_id')
    {
        echo $_SESSION['user_id'];
    }
    if($_GET['function'] == 'users')
    {
        $room = $_SESSION['room_id'];
        $db = DB::getConnection();
        $st = $db->prepare("SELECT * FROM treseta_rooms WHERE room_id=:room");
        $st->execute(["room" => $room]);
        while($row = $st->fetch())
        {
            echo $row['users'];
           // $users = json_decode($row['users'])->users;
            //for($i = 0; $i<sizeof($users);$i++)
              //  if($users[$i] == $_SESSION['user_id'])
               // {
                 //   echo $i;
                //}
        }
    }
    if($_GET['function'] == 'myturn')
    {
        $room = $_SESSION['room_id'];
        $db = DB::getConnection();
        $st = $db->prepare("SELECT * FROM treseta_games WHERE room_id=:room");
        $st->execute(["room" => $room]);
        while($row = $st->fetch())
        {
            $users = json_decode($row['user_cards'])->users;
            for($i = 0; $i<sizeof($users);$i++)
                if($users[$i] == $_SESSION['user_id'])
                {
                    echo $i;
                    exit(0);
                }
        }
    }
    if($_GET['function'] == 'setcards')
    {
        $room = $_SESSION['room_id'];
        $db = DB::getConnection();

        $st = $db->prepare("SELECT * FROM treseta_games WHERE room_id=:room");
        $st->execute(["room" => $room]);
        if($st->rowCount() !== 1)
        {
            $st = $db->prepare("INSERT INTO treseta_games (room_id, user_cards) VALUES (:room, :cards)");
            $st->execute(["room" => $room, "cards" => $_GET["cards"]]);
        }
        else
        {
            $st = $db->prepare("UPDATE treseta_games SET user_cards=:cards WHERE room_id=:room");
            $st->execute(["room" => $room, "cards" => $_GET["cards"]]);
        }
    }
    if($_GET['function'] == 'loadturn')
    {
        $room = $_SESSION['room_id'];
        $db = DB::getConnection();

        $st = $db->prepare("SELECT * FROM treseta_games WHERE room_id=:room");
        $st->execute(["room" => $room]);

        if($st->rowCount() < 1)
            echo 'no';
        else
        {
            $row = $st->fetch();
            echo $row["user_cards"];
        }
    }
    if($_GET['function'] == 'setturn')
    {
        $room = $_SESSION['room_id'];
        $db = DB::getConnection();

        $st = $db->prepare("UPDATE treseta_games SET user_cards=:cards WHERE room_id=:room");
        $st->execute(["room" => $room, "cards" => $_GET["cards"]]);
        
    }
}




exit(0);


function add_row($cards)
{
	$room = 124;
	$db = DB::getConnection();
	$st = $db->prepare("INSERT INTO treseta_games (room_id, user_cards) VALUES (:room, :cards)");
    $st->execute(["room" => $room, "cards" => $_GET["cards"]]);
}




?>