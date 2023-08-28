import bcryptjs from "bcryptjs";
function passwordIsOk(req, res, next) {
    const user = JSON.parse(req.params.user);
    const db_pass = user.password;
    const form_pass = req.body.password;
    if (bcryptjs.compareSync(form_pass, db_pass)) {
        return next();
    }
    return res.status(400).json({
        succes: false,
        message: "¡Credenciales inválidas!",
    });
}
export default passwordIsOk;
