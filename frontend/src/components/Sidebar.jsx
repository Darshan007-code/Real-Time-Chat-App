import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, X, UserPlus, MessageSquare, Compass, Plus, Camera } from "lucide-react";
import { formatLastSeen } from "../lib/utils";
import CreateGroupModal from "./CreateGroupModal";
import StatusCenter from "./StatusCenter";

const Sidebar = () => {
  const { 
    getUsers, 
    users, 
    getGroups, 
    groups, 
    selectedUser, 
    setSelectedUser, 
    selectedGroup, 
    setSelectedGroup, 
    isUsersLoading, 
    isGroupsLoading,
    searchPublicGroups,
    publicGroups,
    isPublicGroupsLoading,
    joinGroup
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats"); // 'chats', 'groups', 'status', or 'discover'
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers, getGroups]);

  useEffect(() => {
    if (activeTab === "discover") {
      searchPublicGroups(searchQuery);
    }
  }, [searchQuery, activeTab, searchPublicGroups]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOnline = showOnlineOnly ? onlineUsers.includes(user._id) : true;
    return matchesSearch && matchesOnline;
  });

  const filteredGroups = groups.filter((group) => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoin = async (groupId) => {
    await joinGroup(groupId);
    setActiveTab("groups");
  };

  if (isUsersLoading || isGroupsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block uppercase tracking-widest text-xs opacity-50">Contacts</span>
          </div>
          {activeTab === "groups" && (
            <button 
              onClick={() => setIsCreateGroupOpen(true)}
              className="btn btn-xs btn-primary hidden lg:flex gap-1 rounded-full px-3"
            >
              <UserPlus size={12} /> New Group
            </button>
          )}
        </div>

        {/* Search Bar - Hidden in Status Tab */}
        {activeTab !== "status" && (
          <div className="relative hidden lg:block mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="size-4 text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder={`Search ${activeTab === 'discover' ? 'public groups' : activeTab}...`}
              className="input input-bordered w-full pl-9 h-9 text-sm rounded-xl focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="size-4 text-zinc-500 hover:text-zinc-300" />
              </button>
            )}
          </div>
        )}

        {/* New 4-Tab Switcher */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-base-200 rounded-2xl mb-4 hidden lg:grid">
          {[
            { id: "chats", icon: MessageSquare, label: "Chats" },
            { id: "groups", icon: Users, label: "Groups" },
            { id: "status", icon: Camera, label: "Status" },
            { id: "discover", icon: Compass, label: "Find" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 py-2 text-[8px] font-black rounded-xl transition-all uppercase tracking-tighter
                ${activeTab === tab.id ? "bg-base-100 text-primary shadow-sm scale-105" : "hover:bg-base-300 opacity-60"}`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Online filter toggle - only for chats */}
        {activeTab === "chats" && (
          <div className="hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-primary checkbox-xs rounded"
              />
              <span className="text-[10px] font-bold uppercase opacity-50">Online Only</span>
            </label>
          </div>
        )}
      </div>

      <div className="overflow-y-auto w-full flex-1">
        {activeTab === "chats" && (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 border-r-4 border-primary" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img src={user.profilePic || "/avatar.png"} alt="" className="size-12 object-cover rounded-2xl" />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0 flex-1">
                <div className="font-bold text-sm truncate">{user.fullName}</div>
                <div className="text-[10px] text-zinc-400">
                  {onlineUsers.includes(user._id) ? (
                    <span className="text-green-500 font-bold uppercase tracking-widest">Active</span>
                  ) : (
                    `Seen: ${formatLastSeen(user.lastSeen)}`
                  )}
                </div>
              </div>
            </button>
          ))
        )}

        {activeTab === "groups" && (
          filteredGroups.map((group) => (
            <button
              key={group._id}
              onClick={() => setSelectedGroup(group)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedGroup?._id === group._id ? "bg-base-300 border-r-4 border-primary" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img src={group.avatar || "/avatar.png"} alt="" className="size-12 object-cover rounded-2xl" />
              </div>
              <div className="hidden lg:block text-left min-w-0 flex-1">
                <div className="font-bold text-sm truncate">{group.name}</div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-widest">
                  {group.members.length} Members
                </div>
              </div>
            </button>
          ))
        )}

        {activeTab === "status" && <StatusCenter />}

        {activeTab === "discover" && (
          <div className="space-y-1 p-2">
            {isPublicGroupsLoading ? (
               <div className="flex justify-center p-4"><span className="loading loading-spinner"></span></div>
            ) : (
              publicGroups.map((group) => {
                const isMember = groups.some(g => g._id === group._id);
                return (
                  <div key={group._id} className="w-full p-3 flex items-center gap-3 bg-base-200/50 rounded-2xl mb-2 group">
                    <img src={group.avatar || "/avatar.png"} className="size-10 object-cover rounded-xl" alt="" />
                    <div className="hidden lg:flex flex-1 items-center justify-between min-w-0">
                      <div className="text-left">
                        <div className="font-bold text-xs truncate">{group.name}</div>
                        <div className="text-[9px] text-zinc-400 line-clamp-1">{group.description}</div>
                      </div>
                      {!isMember && (
                        <button onClick={() => handleJoin(group._id)} className="btn btn-xs btn-primary rounded-lg px-2">Join</button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {(activeTab === "chats" ? filteredUsers : (activeTab === "groups" ? filteredGroups : [])).length === 0 && !["discover", "status"].includes(activeTab) && (
          <div className="text-center text-zinc-500 py-10 px-2 opacity-50">
            No {activeTab} frequency detected
          </div>
        )}
      </div>

      {isCreateGroupOpen && <CreateGroupModal onClose={() => setIsCreateGroupOpen(false)} />}
    </aside>
  );
};
export default Sidebar;
