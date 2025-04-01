import jwt from 'jsonwebtoken';
import dotenv from "dotenv"; 

dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  
  if (!token) {
    return res.status(401).json({ message: 'Користувач не авторизований' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Невірний токен' });
    }
    req.user = decoded; 
    next(); 
  });
};

export default verifyToken;
