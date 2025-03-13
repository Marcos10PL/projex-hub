import ms from "ms";
import dotenv from "dotenv";
dotenv.config();

const tokenOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: ms(process.env.JWT_EXPIRES_IN),
  sameSite: "Strict",
};

const emailLayout = content => `
  <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              background-color: #040018;
              color: #d1d1d1;
              text-align: center;
            }
  
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              text-align: center;
            }
  
            h1 {
              font-size: 1.5rem;
              margin-bottom: 20px;
              text-align: center;
            }
  
            p {
              line-height: 1.5;
              text-align: center;
              margin-bottom: 20px;
            }
  
            .button {
              display: block;
              max-width: 400px;
              margin: 0 auto;
              text-align: center;
              text-decoration: none;
              background-color: #8500dd;
              color: #d4d4d4;
              border: 2px solid #bf60ff;
              padding: 0.5rem;
              border-radius: 0.5rem;
              cursor: pointer;
              transition: all .15s ease-in-out;
              font-weight: bold;
            }
  
            .button:hover {
              background-color: #bf60ff;
              color: #fff;
            }
  
            .footer {
              text-align: center;
              margin-top: 30px;
              opacity: 0.7;
            }
          </style>
        </head>
  
        <body>
          <div class="container">
            <h1><span style="color: #00d49f;">Projex</span><span style="color: #bf60ff;">HUB</span>!</h1>
            ${content}
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} <span style="color: #00d49f;">Projex</span><span style="color: #bf60ff;">HUB</span></p>
            </div>
          </div>
        </body>
  
        </html>
`;

const confirmEmailOptions = {
  subject: "ProjexHUB - Confirm your email",
  html: token =>
    emailLayout(`            
      <p>Thank you for signing up! To complete your registration and confirm your email address, please click the button below:</p>
      <a href="${process.env.FRONTEND_URL_CONFIRM_EMAIL}/${token}" class="button">Confirm Email</a>
      <p>If you didn't sign up for ProjexHUB, please ignore this email.</p>`),
};

const resetPasswordOptions = {
  subject: "ProjexHUB - Reset your password",
  html: token =>
    emailLayout(`
      <p>We received a request to reset your password. To proceed, please click the button below to reset your password:</p>
      <a href="${process.env.FRONTEND_URL_RESET_PASSWORD}/${token}" class="button">Reset Password</a>
      <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
    `),
};

export {
  tokenOptions,
  confirmEmailOptions,
  resetPasswordOptions,
};
