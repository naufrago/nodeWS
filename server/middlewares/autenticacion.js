const jwt = require('jsonwebtoken');


// verifica token
let verificaToken = (req, res, next) => {
    let token = req.get('token');
    // res.json({
    //     token
    // })
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        // console.log(req.usuario);
        next();
    })
};

// verifica rol de admin
let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.json({
            ok: false,
            err: "El usuario no es Administrador"
        });
    }



};

module.exports = {
    verificaToken,
    verificaAdminRole
}