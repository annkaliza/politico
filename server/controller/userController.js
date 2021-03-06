import Helper from '../Helper/Helper';
import UserDB from '../model/user';

import { checkPassword } from '../Helper/password';
import { generateToken } from '../middlewares/auth';

const createUser = async (req, res) => {
  const result = Helper.isValidUser(req.body);
  if (result.error) {
    return Helper.invalidDataMessage(res, result);
  }
  const createUserQuery = new UserDB(req.body);
  if (await createUserQuery.fetchUser() && await createUserQuery.rowCount > 0) {
    return res.status(409).send({ status: 409, error: 'Email Already Exist' });
  }
  if (!await createUserQuery.createNewUser()) {
    return res.status(500).send({ status: 500, error: 'Internal Error' });
  }
  const user = createUserQuery.result;
  const token = generateToken(user.email);
  return res.status(201).send({ status: 201, message: 'User created successfully', data: [{ token, user }] });
};

const logIn = async (req, res) => {
  const result = Helper.isValidlogin(req.body);
  if (result.error) {
    return Helper.invalidDataMessage(res, result);
  }
  const loginUserQuery = new UserDB(req.body);
  if (await loginUserQuery.fetchUser() && await loginUserQuery.rowCount === 0) {
    return res.status(404).send({ status: 404, error: 'User Not found' });
  }
  let user = await loginUserQuery.result[0];
  if (!checkPassword(user.password, req.body.password)) {
    return res.status(401).send({ status: 401, error: 'Incorrect Email or password' });
  }
  const token = generateToken(user.email);
  const userWithoutPassword = Object.assign({}, user);
  delete userWithoutPassword.password;
  user = userWithoutPassword;
  return res.status(200).send({ status: 200, message: 'successfully logged in', data: [{ token, user }] });
};

const passwordReset = async (req, res) => {
  const result = Helper.isValidEmail(req.body);
  if (result.error) {
    return Helper.invalidDataMessage(res, result);
  }
  const resetEmailQuery = new UserDB(req.body);
  if (await resetEmailQuery.fetchUser() && await resetEmailQuery.rowCount === 0) {
    return res.status(404).send({ status: 404, error: 'Email Not found' });
  }
  return res.status(200).send({
    status: 200, data: [{ message: 'Check your email for password reset link', email: req.body.email }],
  });
};
export { createUser, logIn, passwordReset };
