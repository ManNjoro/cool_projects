<?php

declare(strict_types=1);
require_once "../includes/dbh.inc.php";

class ModelLogin extends Dbh
{

    public function get_user(string $username)
    {
        $query = "SELECT * FROM users WHERE username=:username;";
        $stmt = parent::connect()->prepare($query);
        $stmt->bindParam(":username", $username);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result;
    }
}
