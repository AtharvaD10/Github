import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        try {
          const userResponse = await axios.get(`https://api.github.com/users/${username}`);
          setUserInfo(userResponse.data);

          const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos`);
          setRepositories(reposResponse.data);

          const followersResponse = await axios.get(`https://api.github.com/users/${username}/followers`);
          setFollowers(followersResponse.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [username]);

  const handleRepoClick = (repo) => {
    setSelectedRepo(repo);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="flex items-center justify-center">
        <input
          type="text"
          className="border border-gray-300 rounded px-4 py-2 mr-2 w-64"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setUsername(username)}
        >
          Search
        </button>
      </div>

      {userInfo && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">{userInfo.login}</h2>
          <p>Followers: {userInfo.followers}</p>
          <p>Following: {userInfo.following}</p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4">
        {repositories.map(repo => (
          <div key={repo.id} className="border border-gray-300 p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleRepoClick(repo)}>
            <h3 className="font-bold">{repo.name}</h3>
            <p>{repo.description}</p>
          </div>
        ))}
      </div>

      {followers.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold">Followers</h3>
          <ul>
            {followers.map(follower => (
              <li key={follower.id} className="cursor-pointer hover:text-blue-500">
                {follower.login}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedRepo && (
        <div className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ${modalVisible ? '' : 'hidden'}`}>
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-bold">{selectedRepo.name}</h2>
            <p>{selectedRepo.description}</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
