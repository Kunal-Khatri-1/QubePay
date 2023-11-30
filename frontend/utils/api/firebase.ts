/**
 * @note anything that is only imported server side is NOT included in the client bundle by NEXT
 * @dev AVOID IMPORTING anything from this file in CLIENT side. This file is only for SERVER side.
 */

import * as admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIRESTORE_SERVICE_ACCOUNT);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

let firebaseAdminApp: admin.app.App;
if (
  admin.apps.length === 0 ||
  !admin.apps.some((app) => app.name === "next-firebase-admin")
) {
  firebaseAdminApp = admin.initializeApp(
    {
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    },
    "next-firebase-admin"
  );
} else {
  firebaseAdminApp = admin.app("next-firebase-admin");
}
const db = admin.firestore(firebaseAdminApp);

export { db };
