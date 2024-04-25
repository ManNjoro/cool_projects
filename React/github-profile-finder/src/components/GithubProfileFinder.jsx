import { useEffect, useState } from "react";

export default function GithubProfileFinder() {
  const [userName, setUserName] = useState();

  function handleSubmit() {}

  async function fetchGithubUserData() {
    const res = await fetch(`https://api.github.com/users/${userName}`);
    const data = await res.json();
    console.log(data);
  }

  useEffect(() => {
    fetchGithubUserData();
  }, [userName]);

  console.log(userName);

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
    </div>
  );
}
