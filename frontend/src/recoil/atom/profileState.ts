import { atom } from "recoil";
import { selector } from "recoil";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { Profile } from "../../hooks";

export const profileAtom = atom<Profile | null>({
  key: "profileAtom",
  default: null,
});

export const profileSelector = selector<Profile | null>({
  key: "profileSelector",
  get: async ({ get }) => {
    const cachedProfile = get(profileAtom);

    if (cachedProfile) {
      console.log("Cached Profile:", cachedProfile);
      return cachedProfile;
    }

    try {
      const response = await axios.get<{ profile: Profile }>(
        `${BACKEND_URL}/api/v1/user/profile/view`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      return response.data.profile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },
});
