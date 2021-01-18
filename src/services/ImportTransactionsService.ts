import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';

import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  importFileName: string;
}

interface TransactionCSVData {
  title: string;
  category: string;
  value: number;
  type: 'income' | 'outcome';
}

class ImportTransactionsService {
  async execute({ importFileName }: Request): Promise<Transaction[]> {
    const transactionsCSV: TransactionCSVData[] = [];

    const currentPathImportFile = path.join(
      uploadConfig.tmpDir,
      importFileName,
    );

    const parsingTransactions = async (data: any): Promise<void> => {
      if (['income', 'outcome'].includes(data.type)) {
        transactionsCSV.push(data);
      }
      return Promise.resolve();
    };

    // Data Management
    const processFile = async (): Promise<TransactionCSVData[]> => {
      const parser = fs.createReadStream(currentPathImportFile).pipe(csv());

      return new Promise((resolve, reject) => {
        const promises: Promise<void>[] = [];
        parser
          .on('data', (data: any) => {
            promises.push(parsingTransactions(data));
          })
          .on('error', err => {
            console.log(err);
            reject(new AppError('Erro while parse CSV file!', 500));
          })
          .on('finish', async () => {
            await Promise.all(promises);
            resolve(transactionsCSV);
          });
      });
    };

    const responseTransactions = await processFile();
    const transactionsResult: Transaction[] = [];
    const createTransactionService = new CreateTransactionService();

    await responseTransactions.reduce(async (promise, trans) => {
      await promise;
      const transaction = await createTransactionService.execute({
        title: trans.title,
        category: trans.category,
        type: trans.type,
        value: trans.value,
      });

      transactionsResult.push(transaction);
    }, Promise.resolve());

    fs.promises.unlink(currentPathImportFile);

    return transactionsResult;
  }
}

export default ImportTransactionsService;
