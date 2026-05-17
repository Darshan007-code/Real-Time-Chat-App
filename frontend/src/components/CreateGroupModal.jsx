import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { X, Camera, Users, Loader2, Globe, Lock } from "lucide-react";
import toast from "react-hot-toast";

const CreateGroupModal = ({ onClose }) => {
  const { users, createGroup } = useChatStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAvatar(reader.result);
    };
  };

  const toggleMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Group name is required");
    if (!isPublic && selectedMembers.length === 0) return toast.error("Select at least one member for private groups");

    setIsCreating(true);
    try {
      await createGroup({
        name: name.trim(),
        description: description.trim(),
        members: selectedMembers,
        isPublic,
        avatar,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-base-100 rounded-xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-base-300 flex items-center justify-between bg-base-200">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Users className="size-5" /> Create New Group
          </h2>
          <button onClick={onClose} className="btn btn-sm btn-ghost btn-circle">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative group">
              <div className="size-20 rounded-full border-2 border-base-300 overflow-hidden bg-base-200 flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt="Avatar Preview" className="size-full object-cover" />
                ) : (
                  <Camera className="size-8 text-zinc-500" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="group-avatar"
                onChange={handleAvatarChange}
              />
              <label
                htmlFor="group-avatar"
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full 
                opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
              >
                <Camera className="size-6 text-white" />
              </label>
            </div>
            <p className="text-xs text-zinc-500">Group Icon</p>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Group Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full h-10"
              placeholder="Enter group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description (Optional)</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-20"
              placeholder="What is this group about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Public/Private Toggle */}
          <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
            <div className="flex items-center gap-2">
              {isPublic ? <Globe className="size-4 text-primary" /> : <Lock className="size-4 text-zinc-500" />}
              <div className="flex flex-col">
                <span className="text-sm font-bold">{isPublic ? 'Public Group' : 'Private Group'}</span>
                <span className="text-[10px] text-zinc-500">
                  {isPublic ? 'Anyone can search and join' : 'Only members you add can join'}
                </span>
              </div>
            </div>
            <input 
              type="checkbox" 
              className="toggle toggle-primary toggle-sm" 
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          </div>

          {/* Member Selection - only for private or optional for public */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                {isPublic ? 'Initial Members (Optional)' : 'Select Members (Required)'}
              </span>
            </label>
            <div className="border border-base-300 rounded-lg overflow-y-auto max-h-48 divide-y divide-base-300">
              {users.map((user) => (
                <label
                  key={user._id}
                  className="flex items-center gap-3 p-3 hover:bg-base-200 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={selectedMembers.includes(user._id)}
                    onChange={() => toggleMember(user._id)}
                  />
                  <div className="size-8 rounded-full overflow-hidden">
                    <img src={user.profilePic || "/avatar.png"} alt={user.fullName} className="size-full object-cover" />
                  </div>
                  <span className="text-sm font-medium">{user.fullName}</span>
                </label>
              ))}
            </div>
          </div>
        </form>

        <div className="p-4 border-t border-base-300 bg-base-200">
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary w-full"
            disabled={isCreating || !name.trim() || (!isPublic && selectedMembers.length === 0)}
          >
            {isCreating ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Creating...
              </>
            ) : (
              "Create Group"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
