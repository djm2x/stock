import { Article, Vente } from './entity';
import { VenteArticle } from './entity';

const typeorm = (window as any).require('typeorm');

const path = './src/app/backend/data';

export const dbConnection: Promise<any> = typeorm.createConnection({
  type: 'sqlite',
  database: `./mydb.sqlite`,
  entities: [
    Article,
    Vente,
    VenteArticle,
  ],
  synchronize: true,
  logging: false,
  // autoSchemaSync: true
});
