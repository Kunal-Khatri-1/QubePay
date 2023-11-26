/**
 * @note anything that is only imported server side is NOT included in the client bundle by NEXT
 * @dev AVOID IMPORTING anything from this file in CLIENT side. This file is only for SERVER side.
 */

import * as admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIRESTORE_SERVICE_ACCOUNT);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

const firebaseAdminApp = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  },
  "next-firebase-admin"
);
const db = admin.firestore(firebaseAdminApp);

export { db };
