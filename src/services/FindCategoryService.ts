import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface Request {
  title?: string;
  id?: string;
}

class FindCategoryService {
  public async execute(findOptions: Request): Promise<Category | undefined> {
    const categoryRepository = getRepository(Category);
    const categoryEntity = await categoryRepository.findOne(findOptions);

    return categoryEntity;
  }
}

export default FindCategoryService;
