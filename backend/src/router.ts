import { Router } from "express";
import { createAccount, getUser, login, updateProfile, uploadImage } from "./handlers";
import { body } from "express-validator"
import { handlerInputErrors } from "./middleware/validation";
import { authenticate } from "./middleware/auth";


const router = Router();

/** Autenticacion y Registro */
router.post("/auth/register", 
    body('handle').notEmpty().withMessage('El Campo handle, es obligatorio'),
    body('name').notEmpty().withMessage('El Campo name, es obligatorio'),
    body('email').notEmpty().isEmail().withMessage('El Campo email, es obligatorio'),
    body('password').isLength({min:8}).notEmpty().withMessage('El Campo password, es obligatorio'),
    handlerInputErrors,
    createAccount)
/** Inicio de sesion */
router.post('/auth/login', 
    body('email').notEmpty().isEmail().withMessage('El Campo email, es obligatorio'),
    body('password').notEmpty().withMessage('El Campo password, es obligatorio'),
    handlerInputErrors,
    login)

router.get('/user', authenticate, getUser)

router.patch('/user', 
    body('handle').notEmpty().withMessage('El Campo handle, es obligatorio'),
    authenticate, 
    updateProfile)

router.post('/user/image', authenticate, uploadImage)

export default router 