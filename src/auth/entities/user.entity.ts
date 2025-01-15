import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users') // Nombre que se le pondra en la base de datos
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique: true,
    })
    email: string;

    //Si hago un findOneBy 
    @Column({
        type: 'text',
        select: false
    })
    password: string;

    @Column({
        type: 'text',
    })
    fullName: string;
    
    @Column({
        type: 'bool',
        default: true
    })
    isActive: boolean;

    @Column('text',{
        array: true,
        default: ['user']
    })
    roles: string[];

    @OneToMany(
        () => Product,
        ( product ) => product.user
    )
    product: Product;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }

}
