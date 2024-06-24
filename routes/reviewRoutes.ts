import express from 'express';
import { addReview, getReviewsByBook, updateReview, deleteReview } from '../controllers/reviewController';
import { validateReview, validate } from '../validations/reviewValidators';
import { checkUser } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', checkUser, validateReview, validate, addReview);
router.get('/:bookId', getReviewsByBook);
router.put('/:reviewId', checkUser, validateReview, validate, updateReview);
router.delete('/:reviewId', checkUser, deleteReview);

export default router;
