/* eslint-disable react/react-in-jsx-scope */
// import { ZIMKitManager, Common } from "@zegocloud/zimkit-react";
// import { useEffect, useState } from "react";
// import "@zegocloud/zimkit-react/index.css";

// const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// function Chat() {
//   const id = Math.floor(Math.random() * 1000);

//   const [state, setState] = useState({
//     appConfig: {
//       appID: 234626847,
//       serverSecret: "b6c97135d351a543b9ab5c294bf86b24",
//     },
//     userInfo: {
//       userID: `skillify${id}`,
//       userName: `skillify${id}`,
//       userAvatarUrl: "",
//     },
//   });

//   useEffect(() => {
//     const initZimKit = async () => {
//       const zimKit = new ZIMKitManager();
//       const token = zimKit.generateKitTokenForTest(
//         state.appConfig.appID,
//         state.appConfig.serverSecret,
//         state.userInfo.userID
//       );
//       await zimKit.init(state.appConfig.appID);
//       await zimKit.connectUser(state.userInfo, token);
//     };

//     initZimKit();
//   }, []);

//   return (
//     <div>
//       Welcome {state.userInfo.userID}
//       <Common />
//     </div>
//   );
// }

// export default Chat;


import { ChatEngine } from 'react-chat-engine';

function ChatEngineConfig() {
  return (
    <ChatEngine
      projectID="e9c6deac-8967-4533-89b6-5c3fe4679e89"
      userName="YOUR_USERNAME"
      userSecret="YOUR_USER_SECRET"
      // Add other configuration options as needed
    />
  );
}

export default ChatEngineConfig;
