import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';

interface Request {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const categoryRepository = getRepository(Category);
    let categoryEntity = await categoryRepository.findOne({ title });

    if (!categoryEntity) {
      categoryEntity = categoryRepository.create();
      categoryEntity.title = title;
      categoryEntity = await categoryRepository.save(categoryEntity);
      return categoryEntity;
    }

    throw new AppError('Category already exists', 400);
  }
}

export default CreateCategoryService;
