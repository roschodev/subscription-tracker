import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {getAllUsers, getUser} from "../controllers/user.controller.js";


const userRouter = Router();

userRouter.get("/",authorize, getAllUsers);

userRouter.get("/:id",authorize, getUser);

userRouter.post("/", (req, res) => res.send({title: "CREATE user"}));

userRouter.put("/:id", (req, res) => res.send({title: "UPDATE user by id"}));

userRouter.delete("/:id", (req, res) => res.send({title: "DELETE user"}));

export default userRouter;