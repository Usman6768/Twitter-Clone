import jwt from 'jsonwebtoken';


export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d'
    })

    res.cookie("jwt", token , {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        httpOnly: true, // The cookie is accessible only through the HTTP protocol,
        sameSite: "strict", // The cookie is only sent with requests from the same site.
        secure: process.env.NODE_ENV !== "development", // The cookie is only sent over a secure protocol (HTTPS).
    })

}