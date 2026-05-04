import { checkUserProfileData } from "./checkUserData";

export const getProfileRedirectPath = (userData) => {
    return checkUserProfileData(userData) ? "/dashboard" : "/profile";
} 