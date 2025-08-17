import createHttpError from 'http-errors';
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { sendMail } from '../utils/sendMail.js';
import { getEnvVariable } from '../utils/getEnvVar.js';

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (user !== null) {
    throw new createHttpError.Conflict('Email is already in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
};

export async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (user === null) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

export async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findById(sessionId);

  if (session === null) {
    throw new createHttpError.Unauthorized('Session not found');
  }
  if (session.refreshToken !== refreshToken) {
    throw new createHttpError.Unauthorized('Refresh token is invalid');
  }
  if (session.refreshTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized('Refresh token is expired');
  }

  await Session.deleteOne({ _id: session._id });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

export async function requestResetPwd(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new createHttpError.NotFound('User not found!');
  }

  const token = jwt.sign(
    {
      sub: user._id,
      name: user.name,
    },
    getEnvVariable('SECRET_JWT'),
    { expiresIn: '5m' }
  );

  await sendMail({
    to: email,
    subject: 'Reset password',
    html: `<p>To reset password please visit this <a href="${getEnvVariable('APP_DOMAIN')}/auth/reset-pwd/${token}">Link</a></p>`,
  });
}

export async function resetPwd(token, password) {
  try {
    const decoded = jwt.verify(token, getEnvVariable('SECRET_JWT'));

    const user = await User.findById(decoded.sub);

    if (!user) {
      throw new createHttpError.NotFound('User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    console.log('Password reset for user:', decoded);
  } catch (error) {
    throw new createHttpError.Unauthorized('Token is expired or invalid.');
  }
}
