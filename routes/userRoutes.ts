import express from 'express';
import { checkUser } from '../middlewares/authMiddleware';
import { deleteUser, getUser, updatePassword, updateUser } from '../controllers/UserController';
import {changePasswordValidationRules, updateProfileValidationRules, validate} from '../validations/userValidation'

const router = express.Router();

router.get('/', checkUser, getUser);
router.put('/', checkUser,updateProfileValidationRules, validate, updateUser );
router.delete('/', checkUser, deleteUser);
router.put('/change-password', checkUser, changePasswordValidationRules, validate, updatePassword)


export default router;
