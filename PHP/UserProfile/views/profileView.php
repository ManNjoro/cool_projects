<?php

class ProfileInfoView extends ProfileInfo {
    public function fetchAbout($userId)
    {
        $profileInfo = $this->getProfileInfo($userId);
        echo $profileInfo[0]["profiles_about"];
    }

    public function fetchTitle($userId)
    {
        $profileInfo = $this->getProfileInfo($userId);
        echo $profileInfo[0]["profiles_introtitle"];
    }

    public function fetchText($userId)
    {
        $profileInfo = $this->getProfileInfo($userId);
        echo $profileInfo[0]["profiles_introtext"];
    }

    public function fetchImage($userId) {
        $profileImage = $this->getProfileImage($userId);
        echo $profileImage;

    }
}