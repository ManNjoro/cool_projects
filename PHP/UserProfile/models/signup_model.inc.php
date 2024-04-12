<?php

declare(strict_types=1);

class ModelSignup extends Dbh
{


    public function get_username(string $username)
    {
        $query = "SELECT username FROM users WHERE username=:username;";
        $stmt = parent::connect()->prepare($query);
        $stmt->bindParam(":username", $username);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    public function get_email(string $email)
    {
        $query = "SELECT email FROM users WHERE email=:email;";
        $stmt = parent::connect()->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    public function set_user(string $pwd, string $username, string $email)
    {
        $query = "INSERT INTO users (username, pwd, email) VALUES (:username, :pwd, :email);";
        $stmt = parent::connect()->prepare($query);
        $options = [
            'cost' => 12
        ];
        $hashedPwd = password_hash($pwd, PASSWORD_BCRYPT, $options);
        $stmt->bindParam(":username", $username);
        $stmt->bindParam(":pwd", $hashedPwd);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
    }
}
