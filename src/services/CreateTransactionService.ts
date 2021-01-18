import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';
import FindCategoryService from './FindCategoryService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    if (!['outcome', 'income'].includes(type)) {
      throw new AppError('Invalid transaction type.', 400);
    }

    if (type === 'outcome') {
      const balance = await transactionRepository.getBalance();

      if (balance.total < value) {
        throw new AppError(
          `Invalid outcome. Seems you don't have enough money`,
          400,
        );
      }
    }

    const findCategoryService = new FindCategoryService();

    let categoryEntity = await findCategoryService.execute({ title: category });

    if (!categoryEntity) {
      const createCategoryService = new CreateCategoryService();
      categoryEntity = await createCategoryService.execute({ title: category });
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category: categoryEntity,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
