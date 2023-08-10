import jwt from "jsonwebtoken";
function authenticateToken(req, res, next) {
    const secret = process.env.SECRET || "";
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null)
        return res.sendStatus(401);
    try {
        const user = jwt.verify(token, secret);
        req.user = user;
        next();
    }
    catch (err) {
        return res.sendStatus(403);
    }
}
export default authenticateToken;
