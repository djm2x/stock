// import { VenteArticle2 } from './vente.article';
// import { PrimaryColumn, RelationId, ManyToOne, Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable } from 'typeorm';
const typeorm = (window as any).require('typeorm');
const Entity = typeorm.Entity;
const Column = typeorm.Column;
const PrimaryGeneratedColumn = typeorm.PrimaryGeneratedColumn;
const OneToMany = typeorm.OneToMany;
const PrimaryColumn = typeorm.PrimaryColumn;
const ManyToOne = typeorm.ManyToOne;
const JoinTable = typeorm.ManyToOne;

@Entity('Article')
export class Article {

  @PrimaryGeneratedColumn()
  id = null;

  @Column('text')
  reference = '';

  @Column('text')
  designation = '';

  @Column('integer')
  qteE = 1;

  @Column('real')
  prixA = 1;

  @Column('real')
  prixV = 1;

  @Column('integer')
  stockIntial = 1;

  @Column('integer')
  stockFinal = 1;

  @OneToMany(type => VenteArticle, va => va.article)
  venteArticles: VenteArticle[];
}

@Entity('Vente')
export class Vente {
  @PrimaryGeneratedColumn()
  id = null;

  @Column('text')
  numero = '';

  @Column('date')
  date = new Date();

  @Column('integer')
  tva = 20;

  @OneToMany(type => VenteArticle, va => va.vente)
  venteArticles: VenteArticle[];
}


@Entity('vente_article')
export class VenteArticle {

  @PrimaryColumn('integer')
  articleId = null;

  @PrimaryColumn('integer')
  venteId = null;

  @Column('integer')
  qte = 0;

  @Column('real')
  montant = 0;

  @ManyToOne(type => Article, a => a.venteArticles, { onDelete: 'CASCADE' })
  article: Article;

  @ManyToOne(type => Vente, a => a.venteArticles, { onDelete: 'CASCADE' })
  vente: Vente;
}
