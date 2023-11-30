import { firebaseApp } from "../../../utils";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// Next-Auth Options Imports
import { getNextAuthOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

const db = getFirestore(firebaseApp);

export default async (req: any, res: any) => {
  const nextAuthOptions = getNextAuthOptions(req);
  const session = await getServerSession(req, res, nextAuthOptions);

  if (session) {
    const projectsCollection = collection(db, "projects");

    try {
      if (req.method === "GET") {
        const { walletAddress } = req.query;
        const projectsQuery = query(
          projectsCollection,
          where("Client's Wallet Address", "==", walletAddress)
        );
        const projectsSnapshot = await getDocs(projectsQuery);
        const projects = projectsSnapshot.docs.map((project) => ({
          id: project.id,
          ...project.data(),
        }));
        res.status(200).json(projects);
      }
    } catch (e) {
      res.status(400).end();
    }
  } else {
    res.status(401);
    res.end();
  }
};
