<?php

class ProfileInfo extends Dbh
{
    protected function getProfileInfo($userId)
    {
        $query = "SELECT * FROM profiles WHERE users_id=:users_id;";
        $stmt = parent::connect()->prepare($query);
        $stmt->bindParam(":users_id", $userId);
        if (!$stmt->execute()) {
            $stmt = null;
            header("location: ../profile.php?error=stmtfailed");
            exit();
        }

        if ($stmt->rowCount() == 0) {
            $stmt = null;
            header("Location: ../profile.php?error=profilenotfound");
            exit();
        }

        $profileData = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt = null;
        return $profileData;
    }

    protected function setNewProfileInfo($profileAbout, $profileTitle, $profileText, $userId)
    {
        $query = "UPDATE profiles SET profiles_about = :profiles_about, profiles_introtitle=:profiles_introtitle, profiles_introtext=:profiles_introtext WHERE users_id=:users_id;";
        $stmt = parent::connect()->prepare($query);
        $stmt->bindParam(":profiles_about", $profileAbout);
        $stmt->bindParam(":profiles_introtitle", $profileTitle);
        $stmt->bindParam(":profiles_introtext", $profileText);
        $stmt->bindParam(":users_id", $userId);
        if (!$stmt->execute()) {
            $stmt = null;
            header("location: ../profile.php?error=stmtfailed");
            exit();
        }
        $stmt = null;
    }

    protected function setProfileInfo($profileAbout, $profileTitle, $profileText, $userId)
    {
        $query = "INSERT INTO profiles (profiles_about, profiles_introtitle, profiles_introtext, users_id) VALUES (:profiles_about, :profiles_introtitle, :profiles_introtext, :users_id);";
        $stmt = parent::connect()->prepare($query);
        $stmt->bindParam(":profiles_about", $profileAbout);
        $stmt->bindParam(":profiles_introtitle", $profileTitle);
        $stmt->bindParam(":profiles_introtext", $profileText);
        $stmt->bindParam(":users_id", $userId);
        if (!$stmt->execute()) {
            $stmt = null;
            header("location: ../profile.php?error=stmtfailed");
            exit();
        }
        $stmt = null;
    }
}
