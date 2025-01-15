import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProductImage } from "./";
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: "19056500-8dcb-444f-98d0-89d23f2e204c",
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: "T-Shit Teslo",
        description: 'Product title',
        uniqueItems: true
    })
    @Column('text',{
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product price'
    })
    @Column('float',{
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'Desciption for the product',
        description: 'Product description',
        uniqueItems: null,
    })
    @Column({
        type: 'text',
        nullable:true
    })
    description: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true
    })
    @Column('text',{
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
    })
    @Column('int',{
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M','XL','XXL'],
        description: 'Product sizes',
    })
    @Column('text',{
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product gender',
        default: 0
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['shirt'],
        description: 'Product tags',
    })
    @Column({
        type: 'text',
        array: true,
        default: []
    })
    tags: string[];
    
    
    //iamages
    //Aqui se hace la relacion
    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        productImage => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }
    )
    user: User;

    //Cada vez que vaya a insertar, pasara por estas validaciones
    @BeforeInsert()
    checkSlugInsert(){
        if( !this.slug ){
            this.slug = this.title;
        }
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
}
