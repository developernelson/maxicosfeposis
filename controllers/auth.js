import { response } from "express";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

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

export const authLoginStart = (req, res = response) => {

    const { correo, contraseña } = req.body;
    const errors = [];

    const auth = getAuth();
    signInWithEmailAndPassword(auth, correo, contraseña)
        .then(({ user }) => { // user esta dentro de userCredential
            return res.redirect('/');
        })
        .catch((error) => {
            console.log(error);
            errors.push({
                msg: 'El usuario o contraseña no es valido!'
            })
            return res.render('login', { errors, correo, contraseña });
        })

}