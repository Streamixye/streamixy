
import { useEffect, useState } from "react";

export interface LiveStream {
  streamId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  title: string;
  thumbnailUrl: string;
  viewers: number;
  invitedUsers: string[];
  tokens?: number; // Track tokens earned during stream
  likes?: number; // Track likes received during stream
  requests?: Array<{id: number, username: string, message: string}>; // Track join requests
}

// Store active live streams in localStorage to persist between page refreshes
const STORAGE_KEY = "activeStreams";

// Get active streams from localStorage
const getStoredStreams = (): LiveStream[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading stored streams:", error);
    return [];
  }
};

// Save active streams to localStorage
const saveStreams = (streams: LiveStream[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(streams));
  } catch (error) {
    console.error("Error saving streams:", error);
  }
};

// Hook for accessing and updating live streams
export const useLiveStreams = () => {
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>(getStoredStreams);

  // Listen for custom events for stream changes
  useEffect(() => {
    const handleStreamStart = (event: CustomEvent) => {
      const newStream = event.detail;
      setLiveStreams(prev => {
        const updated = [...prev.filter(s => s.streamId !== newStream.streamId), newStream];
        saveStreams(updated);
        return updated;
      });
    };

    const handleStreamEnd = (event: CustomEvent) => {
      const streamId = event.detail.streamId;
      setLiveStreams(prev => {
        const updated = prev.filter(s => s.streamId !== streamId);
        saveStreams(updated);
        return updated;
      });
    };

    const handleInviteUser = (event: CustomEvent) => {
      const { streamId, username } = event.detail;
      setLiveStreams(prev => {
        const updated = prev.map(stream => {
          if (stream.streamId === streamId) {
            if (!stream.invitedUsers.includes(username)) {
              return {
                ...stream,
                invitedUsers: [...stream.invitedUsers, username]
              };
            }
          }
          return stream;
        });
        saveStreams(updated);
        return updated;
      });
    };

    const handleTokenTransaction = (event: CustomEvent) => {
      const { creatorName, amount, type } = event.detail;
      setLiveStreams(prev => {
        const updated = prev.map(stream => {
          if (stream.creatorName === creatorName) {
            return {
              ...stream,
              tokens: (stream.tokens || 0) + amount
            };
          }
          return stream;
        });
        saveStreams(updated);
        return updated;
      });
    };

    const handleLike = (event: CustomEvent) => {
      const { creatorName } = event.detail;
      setLiveStreams(prev => {
        const updated = prev.map(stream => {
          if (stream.creatorName === creatorName) {
            return {
              ...stream,
              likes: (stream.likes || 0) + 1
            };
          }
          return stream;
        });
        saveStreams(updated);
        return updated;
      });
    };

    const handleJoinRequest = (event: CustomEvent) => {
      const { creatorName, requestId, username, message } = event.detail;
      setLiveStreams(prev => {
        const updated = prev.map(stream => {
          if (stream.creatorName === creatorName) {
            const currentRequests = stream.requests || [];
            return {
              ...stream,
              requests: [...currentRequests, { id: requestId, username, message }]
            };
          }
          return stream;
        });
        saveStreams(updated);
        return updated;
      });
    };

    document.addEventListener('streamStart', handleStreamStart as EventListener);
    document.addEventListener('streamEnd', handleStreamEnd as EventListener);
    document.addEventListener('inviteUser', handleInviteUser as EventListener);
    document.addEventListener('tokenTransaction', handleTokenTransaction as EventListener);
    document.addEventListener('streamLike', handleLike as EventListener);
    document.addEventListener('joinRequest', handleJoinRequest as EventListener);

    return () => {
      document.removeEventListener('streamStart', handleStreamStart as EventListener);
      document.removeEventListener('streamEnd', handleStreamEnd as EventListener);
      document.removeEventListener('inviteUser', handleInviteUser as EventListener);
      document.removeEventListener('tokenTransaction', handleTokenTransaction as EventListener);
      document.removeEventListener('streamLike', handleLike as EventListener);
      document.removeEventListener('joinRequest', handleJoinRequest as EventListener);
    };
  }, []);

  // Function to start a live stream
  const startStream = (stream: Omit<LiveStream, "invitedUsers">) => {
    const newStream = { 
      ...stream, 
      invitedUsers: [],
      tokens: 0,
      likes: 0,
      requests: []
    };
    
    // Dispatch custom event for the new stream
    const event = new CustomEvent('streamStart', { detail: newStream });
    document.dispatchEvent(event);
    
    return newStream.streamId;
  };

  // Function to end a live stream
  const endStream = (streamId: string) => {
    const event = new CustomEvent('streamEnd', { detail: { streamId } });
    document.dispatchEvent(event);
  };

  // Function to invite a user to the stream
  const inviteUser = (streamId: string, username: string) => {
    const event = new CustomEvent('inviteUser', { detail: { streamId, username } });
    document.dispatchEvent(event);
  };

  return {
    liveStreams,
    startStream,
    endStream,
    inviteUser,
    getLiveStream: (id: string) => liveStreams.find(stream => stream.streamId === id),
    getStreamsByInvitedUser: (username: string) => 
      liveStreams.filter(stream => stream.invitedUsers.includes(username)),
  };
};
