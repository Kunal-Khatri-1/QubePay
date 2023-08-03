/**
 * @dev This is interface that shows the format in which data will be stored on Firebase.
 * @projectContent : This will store the CID of project-content uploaded to IPFS
 * @files : This will store all the CIDs of the files submited by freelancer.
 * @text : This will store all the CIDs of the text submited by freelancer.
 *      @public : stores all the CIDs which are un-encrypted and can be viewed by anyone. These files/text are displayed on the frontened for all users
 *      @encrypted : stores all the CIDs which are encrypted for private submission by the freelancer to the client. These files/text will only displayed to freelancer and client on frontend
 */

interface FireStoreDataInterface {
  projectContent: string;
  files: {
    public: string[];
    encrypted: string[];
  };
  text: {
    public: string[];
    encrypted: string[];
  };
}

export type { FireStoreDataInterface };
