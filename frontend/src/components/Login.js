import React, { useState } from 'react'
const Login = () => {
  const [username, setUsername] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [followers, setFollowers] = useState([]);

  const fetchUserInfoAndRepositories = async () => {
    try {
      const userResponse = await fetch(`http://localhost:3001/users/${username}`);
      const userData = await userResponse.json();
      setUserInfo(userData);
      console.log(setUserInfo);

      const reposResponse = await fetch(userData.repos_url);
      const reposData = await reposResponse.json();
      setRepositories(reposData);

      const followersResponse = await fetch(userData.followers_url);
      const followersData = await followersResponse.json();
      setFollowers(followersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRepositoryClick = (repoName) => {
    // Redirect to repository description page
    console.log(`Clicked on repository: ${repoName}`);
  };

  const handleFollowerClick = (followerUsername) => {
    // Redirect to repository list page of the follower
    console.log(`Clicked on follower: ${followerUsername}`);
  };

  return (
    <div className=''>
      <h1 className='text-center py-7 bg-black text-white'>GitHub Repository Viewer</h1>
      <input className='p-4 m-4 col-span-9 rounded-lg items-center'
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter GitHub Username"
      />
      <button className='col-span-3 py-2  px-4 bg-red-700 text-white rounded-lg hover:bg-opacity-10' 
        onClick={fetchUserInfoAndRepositories}>Search</button>

      <div className='text-center text-lg my-1'>
        <h2 className='bg-black text-white'>User Info</h2>
        <p >Username: {userInfo.login}</p>
        <p>Name: {userInfo.name}</p>
        <p>Public Repos: {userInfo.public_repos}</p>
      </div>

      <div className=' my-5 text-center text-xl text-red-950'>
        <h2 className='bg-black text-white'>Repositories</h2>
        <ul>
          {repositories.map(repo => (
            <li key={repo.id} onClick={() => handleRepositoryClick(repo.name)}>
              {repo.name}
            </li>
          ))}
        </ul>
      </div>

      <div className='my-5 text-center text-xl'>
        <h2 className='bg-black text-white'>Followers</h2>
        <ul>
          {followers.map(follower => (
            <li key={follower.id} onClick={() => handleFollowerClick(follower.login)}>
              {follower.login}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Login;