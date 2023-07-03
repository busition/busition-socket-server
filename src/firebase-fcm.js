import admin from "firebase-admin";

const serviceAccount = "/env/busition-firebase-adminsdk-p6mxk-de15bc77f9.json";

await admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

function sendNotification(socket, token) {
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
      logger.info("Successfully sent message:", socket.id, response);
    })
    .catch((error) => {
      logger.error("Error sending message:", socket.id, error);
    });
}

export { sendNotification };
