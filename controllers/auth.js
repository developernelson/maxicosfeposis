import { response } from "express";
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { intialState } from "../helpers/initialState";

export const authLogin = (req, res = response) => {

    const auth = getAuth();
    if (auth.currentUser) {
        return res.redirect('/');
    }

    res.render('login');
}

export const authLogout = (req, res = response) => {

    const auth = getAuth();
    if (auth.currentUser) {
        signOut(auth)
    }
    res.redirect('/auth/login');

}

export const authLoginStart = async (req, res = response) => {

    const { correo, contraseña } = req.body;
    const errors = [];

    const auth = getAuth();
    signInWithEmailAndPassword(auth, correo, contraseña)
        .then(({ user }) => { // user esta dentro de userCredential
            intialState()
                .then(() => res.redirect('/'))
        })
        .catch((error) => {
            console.log(error);
            errors.push({
                msg: 'El usuario o contraseña no es valido!'
            })
            return res.render('login', { errors, correo, contraseña });
        })

}


export const authRegister = (req, res = response) => {

    const auth = getAuth();
    if (auth.currentUser) {
        return res.redirect('/');
    }
    res.render('register');
}

export const authRegisterStart = (req, res = response) => {

    const { nombre, correo, contraseña1, contraseña2 } = req.body;

    const auth = getAuth();

    createUserWithEmailAndPassword(auth, correo, contraseña1)
        .then((userCredential) => {
            updateProfile(auth.currentUser, { displayName: nombre })
                .then(() => {
                    console.log('Nombre: ', userCredential.user.displayName);
                })
            return res.redirect(`/?register=true&name=${nombre}`);
        })
        .catch((error) => {
            // const errorMessage = error.message;
            // console.log(error);
            const errorCode = error.code;
            console.log(errorCode);
            if(errorCode === 'auth/email-already-in-use'){
                return res.render('register', {nombre, correo, contraseña1, contraseña2, alert : true});    
            }
            return res.redirect('/auth/register');
        });
}