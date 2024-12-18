import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, UserPlus, MessageSquare, Mail, Loader2, Users, Check } from 'lucide-react';
import { cn } from '../../utils/styles';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '../../types/chat';
import { UserService } from '../../services/userService';


export const UserSearchResults = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingRequests, setPendingRequests] = useState<number[]>([]);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['searchUsers', searchQuery],
    queryFn: () => UserService.searchUsers(searchQuery),
    enabled: searchQuery.length >= 2,
  });

  const handleSendFriendRequest = async (targetUser: UserProfile) => {
    try {
      await UserService.sendFriendRequest(targetUser.id);
      setPendingRequests(prev => [...prev, targetUser.id]);
      toast.success(`Friend request sent to ${targetUser.username}`);
    } catch (error) {
      toast.error('Failed to send friend request');
    }
  };

  const handleStartChat = (targetUser: UserProfile) => {
    navigate(`/messages/${targetUser.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="flex items-center gap-3 mb-8">
        <Users className="w-8 h-8 text-indigo-500" />
        <h1 className="text-3xl font-bold">Find Users</h1>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by username..."
            className="w-full pl-12 pr-4 py-3 bg-stone-800 rounded-xl text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : searchQuery.length < 2 ? (
        <div className="text-center py-12 text-gray-400">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-medium mb-2">Search for Users</h2>
          <p>Enter at least 2 characters to start searching</p>
        </div>
      ) : searchResults?.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-medium mb-2">No Users Found</h2>
          <p>Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults?.map((searchUser: UserProfile, index: number) => (
            <motion.div
              key={searchUser.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "bg-stone-900 rounded-xl p-6 border border-stone-800",
                "hover:border-indigo-500/30 transition-all duration-300",
                "group relative overflow-hidden",
                "before:absolute before:inset-0 before:rounded-xl before:opacity-0",
                "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)]",
                "hover:before:opacity-100"
              )}
            >
              {/* User Card Content */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={searchUser.avatar || '/api/placeholder/64/64'}
                    alt={searchUser.username}
                    className="w-16 h-16 rounded-xl"
                  />
                  <div className={cn(
                    "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-stone-900",
                    searchUser.status === 'online' ? "bg-green-500" : "bg-gray-500"
                  )} />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {searchUser.username}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{searchUser.friendsCount} friends</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchUser.status === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => handleSendFriendRequest(searchUser)}
                  disabled={pendingRequests.includes(searchUser.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg flex-1",
                    pendingRequests.includes(searchUser.id)
                      ? "bg-green-500/20 text-green-400"
                      : "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30",
                    "transition-colors"
                  )}
                >
                  {pendingRequests.includes(searchUser.id) ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Request Sent</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Add Friend</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleStartChat(searchUser)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg flex-1",
                    searchUser.status === 'online'
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      : "bg-stone-800 text-gray-400 hover:bg-stone-700",
                    "transition-colors"
                  )}
                >
                  {searchUser.status === 'online' ? (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Message</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearchResults;