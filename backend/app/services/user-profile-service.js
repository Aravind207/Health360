import UserProfile from "../models/user-profile/user-profile-model.js";

// Save a new user profile to the database.
export const save = async (newUserProfile) => {
  try {
    // Calculate maintenance calorie based on weight
    newUserProfile.maintenanceCalorie = newUserProfile.weight * 15;
    newUserProfile.calorieDeficit = newUserProfile.maintenanceCalorie - 500;
    newUserProfile.calorieSurplus = newUserProfile.maintenanceCalorie + 300;
    const userProfile = new UserProfile(newUserProfile)
    const savedUserProfile = await userProfile.save();
    return savedUserProfile;
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error; 
  }
};
// Find a user profile by ID.
export const find = async (id) => {
try {
  const userProfile = await UserProfile.findById(id).exec();
  return userProfile;
} catch (error) {
    console.error("Error finding user profile: ",error)
    throw error;
}
  
};

// Update a user profile by ID
export const update = async (updatedUserProfile, email) => {
    try{
      updatedUserProfile.maintenanceCalorie = updatedUserProfile.weight * 15;
      updatedUserProfile.calorieDeficit = updatedUserProfile.maintenanceCalorie - 500;
      updatedUserProfile.calorieSurplus = updatedUserProfile.maintenanceCalorie + 300;
      const userProfile = await UserProfile.findOneAndUpdate(
        { email },
        updatedUserProfile,
        { new: true, runValidators: true }
    ).exec();
  return userProfile;
    }
    catch(error) {
        console.error("Error updating user profile: ",error)
        throw error;
    }
};

export const getByUserId =  async (userId) => {
  const userProfile = await UserProfile.find({ userId });
  return userProfile;
}
