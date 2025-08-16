import {
  loginUser,
  registerUser,
  logoutUser,
  refreshSession,
  requestResetPwd,
  resetPwd,
} from '../service/auth.js';

export const registerUserController = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    console.log(user);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'Registration failed', error: error.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const session = await loginUser(req.body.email, req.body.password);

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ status: 401, message: 'Login failed', error: error.message });
  }
};

export async function logoutController(req, res) {
  try {
    const { sessionId } = req.cookies;
    if (sessionId) {
      await logoutUser(sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'Logout failed', error: error.message });
  }
}

export async function refreshController(req, res) {
  try {
    const { sessionId, refreshToken } = req.cookies;
    const session = await refreshSession(sessionId, refreshToken);

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ status: 401, message: 'Refresh failed', error: error.message });
  }
}

export async function requestResetPwdController(req, res) {
  try {
    await requestResetPwd(req.body.email);
    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Failed to send reset password email.',
      error: error.message,
    });
  }
}

export async function resetPwdController(req, res) {
  try {
    const { token, password } = req.body;
    await resetPwd(token, password);

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Password reset failed',
      error: error.message,
    });
  }
}
