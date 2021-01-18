import { DeleteResult, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<DeleteResult> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionRepository.findOne({ id });
    if (!transaction) {
      throw new AppError(`There's no transaction with id: ${id}`, 400);
    }

    return transactionRepository.delete({ id });
  }
}

export default DeleteTransactionService;
