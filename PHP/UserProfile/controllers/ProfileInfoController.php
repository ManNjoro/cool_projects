<?php

class ProfileInfoController extends ProfileInfo
{
    private $userId;
    private $username;

    public function __construct($userId, $username)
    {
        $this->userId = $userId;
        $this->username = $username;
    }

    public function defaultProfileInfo()
    {
        $profileAbout = "Tell people about yourself! Your interests, hobbies, or favorite TV show!";
        $profileTitle = "Hi! I am " . $this->username;
        $profileText = "Welcome to my profile page! Soon I'll be able to tell you more about myself, and what you can find on my profile page.";
        $profileImage = "dp.jpg";
        $this->setProfileInfo($profileAbout, $profileTitle, $profileText, $this->userId, $profileImage);
    }

    public function updateProfileInfo($about, $introTitle, $introText, $filename=null, $tmp=null)
    {
        if($this->emptyInputCheck($about, $introTitle, $introText)) {
            header("Location: ../profilesettings.php?error=emptyinput");
            exit();
        }
        
        // update profile info
        $this->setNewProfileInfo($about, $introTitle, $introText, $this->userId, $filename, $tmp);
    }

    private function emptyInputCheck($about, $introTitle, $introText)
    {
        $isEmpty = true;
        if (empty($about) || empty($introTitle) || empty($introText)) {
            $isEmpty = true;
        }
        $isEmpty = false;

        return $isEmpty;
    }


}
