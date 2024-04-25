/* eslint-disable react/prop-types */


export default function User({ user }) {
  const { avatar_url, followers, following, public_repos, name, login } = user;
  return (
    <div className="user">
      <div>
        <img src={avatar_url} alt="User" className="avatar" />
      </div>
      <div>
        <a href={`https://github.com/${login}`}>{name || login}</a>
      </div>
    </div>
  );
}
