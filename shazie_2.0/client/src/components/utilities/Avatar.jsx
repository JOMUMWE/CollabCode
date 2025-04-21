import { useState, useEffect } from "react";
import axios from "axios";

export default function Avatar({ members, length }) {
  const [profilePics, setProfilePics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfilePictures = async () => {
      if (!members || members.length === 0) return;

      setLoading(true);
      const pics = {};

      // Only fetch for the first 3 members that would be displayed
      const membersToFetch = members.slice(0, 3);

      for (const member of membersToFetch) {
        if (member._id) {
          try {
            const response = await axios.get(`/getProfilePic/${member._id}`);
            if (response.data && response.data.profilePic) {
              pics[member._id] = response.data.profilePic;
            }
          } catch (error) {
            console.error(
              `Error fetching profile picture for ${member.name}:`,
              error
            );
          }
        }
      }

      setProfilePics(pics);
      setLoading(false);
    };

    fetchProfilePictures();
  }, [members]);

  // Helper function to get profile pic or generate placeholder
  const getAvatarContent = (member, index) => {
    if (loading) {
      return (
        <div className="w-10 h-10 flex items-center justify-center bg-gray-300 animate-pulse">
          <span className="text-gray-500">...</span>
        </div>
      );
    }

    if (member && member._id && profilePics[member._id]) {
      return (
        <img
          src={profilePics[member._id]}
          alt={member.name}
          className="w-10 h-10 object-cover rounded-full"
        />
      );
    }

    // Fallback to initials if no profile pic
    return (
      <div className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full">
        <span>
          {member && member.name
            ? member.name.slice(0, 2).toUpperCase()
            : `U${index}`}
        </span>
      </div>
    );
  };

  return (
    <div className="avatar-group -space-x-6">
      {members && members.length > 0 ? (
        <>
          {members
            .slice(0, Math.min(3, members.length))
            .map((member, index) => (
              <div key={member._id || index} className="avatar">
                <div className="w-10">{getAvatarContent(member, index)}</div>
              </div>
            ))}

          {length > 3 && (
            <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content w-10 rounded-full">
                <span>+{length - 3}</span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="avatar">
          <div className="w-10">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>
      )}
    </div>
  );
}
