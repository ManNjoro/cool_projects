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

    protected function setNewProfileInfo($profileAbout, $profileTitle, $profileText, $userId, $filename = null, $tmp = null)
    {
        if ($filename && $tmp) {

            // $destination = __DIR__ . "/images/" . $filename;
            $destination ="../images/";
            $path =  $destination.basename($filename);
            
            $existingFilename = $this->getProfileImage($userId);
            // If there is an existing filename, delete the corresponding image file
            if ($existingFilename && file_exists($destination.basename($existingFilename))) {
                unlink($destination.basename($existingFilename));
            }
            move_uploaded_file($tmp, $path);
            $_SESSION["dp"] = $filename;
        }
        $query = "UPDATE profiles SET profiles_about = :profiles_about, profiles_introtitle=:profiles_introtitle, profiles_introtext=:profiles_introtext, profile_image=:profile_image WHERE users_id=:users_id;";
        $stmt = parent::connect()->prepare($query);
        $stmt->bindParam(":profiles_about", $profileAbout);
        $stmt->bindParam(":profiles_introtitle", $profileTitle);
        $stmt->bindParam(":profiles_introtext", $profileText);
        $stmt->bindParam(":profile_image", $filename);

        $stmt->bindParam(":users_id", $userId);
        if (!$stmt->execute()) {
            $stmt = null;
            header("location: ../profile.php?error=stmtfailed");
            exit();
        }
        $stmt = null;
    }

    protected function setProfileInfo($profileAbout, $profileTitle, $profileText, $userId, $profileImage)
    {
        $query = "INSERT INTO profiles (profiles_about, profiles_introtitle, profiles_introtext, users_id, profile_image) VALUES (:profiles_about, :profiles_introtitle, :profiles_introtext, :users_id, :profile_image);";
        $stmt = parent::connect()->prepare($query);
        $stmt->bindParam(":profiles_about", $profileAbout);
        $stmt->bindParam(":profiles_introtitle", $profileTitle);
        $stmt->bindParam(":profiles_introtext", $profileText);
        $stmt->bindParam(":users_id", $userId);
        $stmt->bindParam(":profile_image", $profileImage);
        session_start();
        $_SESSION["dp"] = $profileImage;
        if (!$stmt->execute()) {
            $stmt = null;
            header("location: ../profile.php?error=stmtfailed");
            exit();
        }
        $stmt = null;
    }


    protected function getProfileImage($userId)
    {
        $query = "SELECT profile_image FROM profiles WHERE users_id=:users_id;";
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

        $existingFilename = $stmt->fetchColumn();
        $stmt = null;
        return $existingFilename;
    }
}
