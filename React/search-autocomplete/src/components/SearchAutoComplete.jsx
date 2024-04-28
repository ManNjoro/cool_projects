import { useEffect } from "react";
import { useState } from "react";
import Suggestions from "./Suggestions";

export default function SearchAutoComplete() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchParam, setSearchParam] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

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

  const handleChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchParam(query);
    if (query.length > 1) {
      const filteredData =
        users && users.length
          ? users.filter((item) => item.toLowerCase().indexOf(query) > -1)
          : [];
      setFilteredUsers(filteredData);
      setShowDropDown(true);
    } else {
      setShowDropDown(false);
    }
  };

  useEffect(() => {
    fetchListOfUsers();
  }, []);

  console.log(`users: ${users}`);
  console.log(`filtered: ${filteredUsers}`);
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
        value={searchParam}
        onChange={handleChange}
      />
      {showDropDown && <Suggestions data={filteredUsers} />}
    </div>
  );
}
