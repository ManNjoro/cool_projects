import { useEffect } from "react";
import { useState } from "react";

export default function SearchAutoComplete() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  async function fetchListOfUsers() {
    try {
      const res = await fetch("https://dummyjson.com/users");
      const data = await res.json();
      console.log(data);
      if (data && data.users && data.users.length) {
        setUsers(data.users.map((user) => user.firstName));
        setError(null);
      }
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchListOfUsers();
  }, []);

  console.log(users);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="search-autocomplete-container">
      <input
        type="text"
        name="search-users"
        placeholder="Search Users here..."
      />
    </div>
  );
}
