import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const sumIncome = await this.query(
      `select SUM(T.value) from "TRANSACTION" T where T.type = 'income'`,
    );

    const sumOutcome = await this.query(
      `select SUM(T.value) from "TRANSACTION" T where T.type = 'outcome'`,
    );

    const income = parseFloat(sumIncome[0].sum || 0);
    const outcome = parseFloat(sumOutcome[0].sum || 0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
