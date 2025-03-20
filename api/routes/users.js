import express from "express";
import { updateUser, deleteUser, getUser, getUsers} from "../controllers/userController.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// router.get("/checkauthentication", verifyToken, (req,res,next)=> {
//     res.send("Hello user, you are logged in ");
// });

// router.get("/checkuser/:id",verifyUser, (req,res,next)=> {
//     res.send("Hello user, you are logged in  and you can delete your account");
// });

// router.get("/checkadmin/:id",verifyAdmin, (req,res,next)=> {
//     res.send("Hello admin, you are logged in  and you can delete all accounts");
// });

//update
router.put("/:id",verifyAdmin, updateUser);

//delete
router.delete("/:id",verifyAdmin, deleteUser);

//get
router.get("/:id",verifyUser, getUser);

//get all
router.get("/",verifyAdmin, getUsers);



export default router;