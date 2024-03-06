const User = require("../routes/user.route");
const axios = require("axios");

//Function to add mutual firends in the friends array
const saveMutualFriends = async (user) => {
  try {
    const followersResponse = await axios.get(
      `https://api.github.com/users/${user.login}/followers`
    );
    const followers = followersResponse.data.map((follower) => follower.login);
    const followingResponse = await axios.get(
      `https://api.github.com/users/${user.login}/following`
    );
    const following = followingResponse.data.map((followed) => followed.login);

    // Find mutual friends
    const mutualFriends = followers.filter((follower) =>
      following.includes(follower)
    );

    // Save mutual friends to the user's friend list
    user.friends = mutualFriends;

    await user.save();
  } catch (error) {
    console.error("Error finding and saving mutual friends:", error);
  }
};

//Function to getUser from the username given in params
exports.getUser = async (req, res) => {
  try {
    //Check if the user is present in the database
    const { username } = req.params;
    const user = await User.findOne({ login: username });

    //if user dont exist add it from the github api
    if (!user) {
      const response = await axios.get(
        `https://api.github.com/users/${username}`
      );
      const data = response.data;
      const newUser = await User.create({ ...data });

      //Saving the mutual friends data
      await saveMutualFriends(newUser);

      return res.status(200).send({ newUser });
    }
    return res.status(200).send({ user });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

//Function to filter data according to the query
exports.searchUsers = async (req, res) => {
  try {
    const { username, location, company, hireable, public_repos } = req.query;
    const query = {
      deleted: { $ne: true },
    };
    if (username) {
      query.login = username;
    }
    if (location) {
      query.location = location;
    }
    if (company) {
      query.company = company;
    }
    if (public_repos) {
      query.public_repos = { $gte: parseInt(public_repos) };
    }

    const searchResults = await User.find(query);

    return res.status(200).send({ searchResults });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

//Function to hide the data
exports.softDeleteUser = async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user by username
    const user = await User.findOne({ login: username });

    // If user not found, return not found response
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Soft delete the user by updating the 'deleted' field
    user.deleted = true;
    await user.save();

    return res.status(200).send({ message: "User soft deleted successfully" });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.updateUserFields = async (req, res) => {
  try {
    const { username } = req.params;
    const { location, blog, bio } = req.body;

    // Find the user by username
    const user = await User.findOne({ login: username });

    // If user not found, return not found response
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Update specified fields
    if (location) {
      user.location = location;
    }
    if (blog) {
      user.blog = blog;
    }
    if (bio) {
      user.bio = bio;
    }

    // Save the updated user
    await user.save();

    return res
      .status(200)
      .send({ message: "User fields updated successfully", user });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

// Function to get all users sorted by given field
exports.getAllUsersSorted = async (req, res) => {
  try {
    const { sortBy } = req.query;

    // Define valid sort fields
    const validSortFields = [
      "public_repos",
      "public_gists",
      "followers",
      "following",
      "created_at",
    ];

    if (!validSortFields.includes(sortBy)) {
      return res.status(400).send({ error: "Invalid sort field" });
    }

    // Query the database to get all users and sort by the specified field
    const users = await User.find().sort({ [sortBy]: -1 });

    return res.status(200).send({ users });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
