// Dependencies
import jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server";

// Utils
import { encrypt, setBase64, getBase64 } from "./security";
import { isPasswordMatch } from "./is";

// Configuration
import { $security } from "../../config";

export const createToken = async user => {
  const {
    id,
    email,
    password,
    privilege,
    active,
    providerId,
    clientId,
    employeeId
  } = user;

  const token = setBase64(`${encrypt($security().secretKey)}${password}`);
  const userData = {
    id,
    email,
    privilege,
    active,
    token,
    providerId,
    clientId,
    employeeId
  };

  const createTk = jwt.sign(
    { data: setBase64(userData) },
    $security().secretKey,
    { expiresIn: $security().expiresIn }
  );

  return Promise.all([createTk]);
};

export const doLogin = async (email, password, models) => {
  const user = await models.User.findOne({
    where: { email },
    raw: true
  });

  if (!user) {
    throw new AuthenticationError("Invalid Login");
  }
  const passwordMatch = isPasswordMatch(encrypt(password), user.password);
  const isActive = user.active;

  if (!passwordMatch) {
    throw new AuthenticationError("Invalid Login");
  }

  if (!isActive) {
    throw new AuthenticationError("Your account is not actived yet");
  }

  const [token] = await createToken(user);

  const data = {
    token: token,
    userId: user.id,
    privilege: user.privilege,
    clientId: user.clientId,
    providerId: user.providerId,
    employeeId: user.employeeId
  };
  return data;
};
