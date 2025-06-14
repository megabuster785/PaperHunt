const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); 
let refreshTokens=[];


exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email: email.toLowerCase(), password });

    
    const verificationToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    const verificationURL = `http://localhost:3000/verify-email/${verificationToken}`;
    const message = `Please verify your email by clicking this link:\n\n${verificationURL}`;

    await sendEmail({
      email: user.email,
      subject: 'Email Verification',
      message,
    });

    res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const token = req.params.token;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now()},
  });

  if (!user) {
    if (!user) {return res.status(400).json({ success: false, message: 'Verification token is invalid or expired' });
}

  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

     
    await sendEmail({
      email: user.email,
      subject: 'Registration Confirmed',
      message: `Hello ${user.username}, your email has been successfully verified. Welcome aboard!`,
    });


  res.status(200).json({ success: true, message: 'Email verified successfully. You can now log in.' });

};



exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.isVerified) {
    return res.status(401).json({ message: 'Please verify your email before logging in.' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
  
    res.status(200).json({ accessToken, refreshToken });
  };
exports.refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ message: 'Refresh token missing' });
  if (!refreshTokens.includes(token)) return res.status(403).json({ message: 'Invalid refresh token' });

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Expired or invalid refresh token' });

    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

    
    const newRefreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  
    refreshTokens = refreshTokens.filter(t => t !== token);
    refreshTokens.push(newRefreshToken);

    res.json({ accessToken, refreshToken: newRefreshToken });
  });
};
  
  exports.logout = (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token required' });
  
    refreshTokens = refreshTokens.filter(t => t !== token);
  
    res.status(200).json({ message: 'Logged out successfully' });
  };
  exports.forgotPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'No user with that email' });
  
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
  
    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;
    const message = `Click the link to reset your password: ${resetURL}`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token',
        message
      });
      res.json({ message: 'Token sent to email!' });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500).json({ message: 'Email failed' });
    }
  };
 

exports.resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Confirmation',
      message: 'Your password has been successfully reset. If you did not perform this action, please contact support immediately.'
    });
  } catch (err) {
    
    console.error('Error sending confirmation email:', err);
  }

  res.json({ message: 'Password has been reset' });
};




exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
  
    try {
      const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      res.status(403).json({ message: 'Invalid or expired token' });
    }
  };
