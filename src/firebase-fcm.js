import admin from "firebase-admin";

const serviceAccount =
  "/socket_sever_data/busition-firebase-adminsdk-p6mxk-de15bc77f9.json";

await admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

function sendNotification(token) {
  const registrationToken = msg;

  const message = {
    notification: {
      title: "Sample test Title",
      body: "Sample test body",
    },
    // data:{
    // }

    token: token,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
}

export { sendNotification };
