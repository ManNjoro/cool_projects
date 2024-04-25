/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import User from "./User";

export default function GithubProfileFinder() {
  const [userName, setUserName] = useState("ManNjoro");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit() {}

  async function fetchGithubUserData() {
    setLoading(true);
    const res = await fetch(`https://api.github.com/users/${userName}`);
    const data = await res.json();
    if (data) {
      setUserData(data);
      setLoading(false);
    }
    console.log(data);
  }

  useEffect(() => {
    fetchGithubUserData();
  }, []);


  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="github-profile-container">
      <div className="input-wrapper">
        <input
          type="text"
          name="search-by-username"
          placeholder="Search Github Username..."
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button onClick={handleSubmit}>Search</button>
      </div>
      {
        userData !== null &&  <User user={userData} />
      }
    </div>
  );
}
