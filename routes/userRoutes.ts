import express from 'express';
import { checkUser } from '../middlewares/authMiddleware';
import { deleteUser, getUser, updatePassword, updateUser } from '../controllers/UserController';
import {changePasswordValidationRules, updateProfileValidationRules, validate} from '../validations/userValidation'

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get current user's profile
 *     description: Retrieves the profile data of the authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
router.get('/', checkUser, getUser);

/**
 * @swagger
 * /api/users:
 *   put:
 *     summary: Update user profile
 *     description: Updates the profile data of the authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                   street:
 *                     type: string
 *                   houseNumber:
 *                     type: string
 *                   apartmentNumber:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       '200':
 *         description: User profile successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid request body
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
router.put('/', checkUser, updateProfileValidationRules, validate, updateUser);

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Delete user account
 *     description: Deletes the account of the authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User account successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
router.delete('/', checkUser, deleteUser);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Change user password
 *     description: Changes the password of the authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       '200':
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Invalid request body
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
router.put('/change-password', checkUser, changePasswordValidationRules, validate, updatePassword);

export default router;
