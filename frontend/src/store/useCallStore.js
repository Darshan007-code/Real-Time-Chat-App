import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

export const useCallStore = create((set, get) => ({
  localStream: null,
  remoteStream: null,
  call: null, // { from, name, signal, callType }
  callAccepted: false,
  callEnded: false,
  isReceivingCall: false,
  peerConnection: null,

  setLocalStream: (stream) => set({ localStream: stream }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),

  initiateCall: async (userToCall, callType = "video") => {
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === "video",
        audio: true,
      });
      set({ localStream: stream, callAccepted: false, callEnded: false });

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        set({ remoteStream: event.streams[0] });
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", { to: userToCall, candidate: event.candidate });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("callUser", {
        userToCall,
        signalData: offer,
        from: authUser._id,
        name: authUser.fullName,
        callType,
      });

      set({ peerConnection: pc });

      socket.on("callAccepted", async (signal) => {
        set({ callAccepted: true });
        await pc.setRemoteDescription(new RTCSessionDescription(signal));
      });

      socket.on("iceCandidate", async (candidate) => {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      });

      socket.on("callEnded", () => {
        get().endCall();
      });

    } catch (error) {
      console.error("Error initiating call:", error);
      toast.error("Could not access camera/microphone");
    }
  },

  handleIncomingCall: (data) => {
    set({ isReceivingCall: true, call: data });
  },

  answerCall: async () => {
    const socket = useAuthStore.getState().socket;
    const { call } = get();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: call.callType === "video",
        audio: true,
      });
      set({ localStream: stream, callAccepted: true, isReceivingCall: false });

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        set({ remoteStream: event.streams[0] });
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", { to: call.from, candidate: event.candidate });
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(call.signal));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answerCall", { signal: answer, to: call.from });

      set({ peerConnection: pc });

      socket.on("iceCandidate", async (candidate) => {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      });

      socket.on("callEnded", () => {
        get().endCall();
      });

    } catch (error) {
      console.error("Error answering call:", error);
      toast.error("Could not access camera/microphone");
    }
  },

  endCall: () => {
    const { localStream, peerConnection, call } = get();
    const socket = useAuthStore.getState().socket;

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    if (peerConnection) {
      peerConnection.close();
    }

    if (call && socket) {
      socket.emit("endCall", { to: call.from });
    }

    set({
      localStream: null,
      remoteStream: null,
      call: null,
      callAccepted: false,
      callEnded: true,
      isReceivingCall: false,
      peerConnection: null,
    });
  },

  rejectCall: () => {
    const socket = useAuthStore.getState().socket;
    const { call } = get();
    if (call && socket) {
      socket.emit("endCall", { to: call.from });
    }
    set({ isReceivingCall: false, call: null });
  },
}));
