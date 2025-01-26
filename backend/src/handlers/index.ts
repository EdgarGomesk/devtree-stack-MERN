import { Request, Response } from 'express'
import User from "../models/User";
import slugify from "slugify";
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid'
import formidable from 'formidable';
import { checkPassword, hashPassword } from '../utils/auth';
import { generateJWT } from '../utils/jwt';
import cloudinary from '../config/cloudinary';



export const createAccount = async (req: Request, res: Response) => {
    // Manejar errorres


    const { email, password } = req.body
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(409).json({
            "message": "El email ya esta registrado"
        })
        return
    }

    const handle = slugify(req.body.handle, '')
    const handleExists = await User.findOne({ handle })

    if (handleExists) {
        res.status(409).json({
            "message": "El nombre de usuario ya esta registrado"
        })
        return
    }

    const user = new User(req.body)
    user.password = await hashPassword(password)
    user.handle = handle
    await user.save()


    res.status(201).json({
        "message": "Registro creado correctamente"
    })

}

export const login = async (req: Request, res: Response) => {


    // revisar si el usuario existe
    const { email, password } = req.body
    const user = await User.findOne({ email })

    // comprobar la contraseña
    if (!user) {
        res.status(409).json({
            "message": "El email no existe"
        })
        return
    }

    const okPassword = await checkPassword(password, user.password);

    if (!okPassword) {
        res.status(401).json({
            "message": "La contraseña no es correcta, intente de nuevo"
        })
        return
    }

    const token = generateJWT({ id: user._id })

    res.send(token)

}

export const getUser = async (req: Request, res: Response) => {
    res.json(req.user);
}

export const updateProfile = async (req: Request, res: Response) => {
    try {

        const { description, links } = req.body
        const handle = slugify(req.body.handle, '')
        const handleExists = await User.findOne({ handle })

        if (handleExists && handleExists.email !== req.user.email) {
            res.status(409).json({
                "message": "El nombre de usuario ya esta registrado"
            })
            return
        }

        req.user.description = description
        req.user.handle = handle
        req.user.links = links
        await req.user.save()
        res.send('perfil Actualizado Correcamente')

    } catch (e) {
        const error = new Error('hubo un error')
        res.status(500).json({ error: error.message })
        return
    }
}


export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({ multiples: false });

    try {
        form.parse(req, (error, fields, files) => {
            console.log(files.file[0].filepath);

            cloudinary.uploader.upload(files.file[0].filepath, { public_id: uuid() }, async function (error, result) {
                if (error) {
                    const error = new Error('Hubo un error al subir la imagen')
                    res.status(500).json({ error: error.message });
                    return;
                }

                if (result) {
                    req.user.image = result.secure_url
                    await req.user.save();
                    res.json({image: result.secure_url});
                }
            })
        })

    } catch (e) {
        const error = new Error('Hubo Error')
        res.status(500).json({ error: error.message });
        return;
    }
}


