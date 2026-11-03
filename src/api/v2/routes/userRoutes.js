// ADICIONADO: rotas relativas V2 com schemas próprios e middleware compartilhado.
import express from "express";
import uploadPhoto from "../../../config/multer.js";
import { ValidationError } from "../../../errors/AppError.js";
import * as userController from "../controllers/userController.js";
import validate from "../../../middlewares/validate.js";
import {
  createUserV2Schema,
  idParamSchema,
  updateUserV2Schema,
} from "../schemas/userSchema.js";

const router = express.Router();

function requireUpdateData(req, _res, next) {
  if (Object.keys(req.body).length === 0 && !req.file) {
    return next(
      new ValidationError("Dados de entrada inválidos", [
        {
          field: "body",
          message: "Envie pelo menos um campo para atualização",
        },
      ]),
    );
  }
  return next();
}

router.post(
  "/",
  uploadPhoto,
  validate(createUserV2Schema),
  userController.create,
);
router.get("/", userController.getAll);
router.get("/:id", validate(idParamSchema, "params"), userController.getById);
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  uploadPhoto,
  validate(updateUserV2Schema),
  requireUpdateData,
  userController.update,
);
router.delete("/:id", validate(idParamSchema, "params"), userController.remove);

export default router;
