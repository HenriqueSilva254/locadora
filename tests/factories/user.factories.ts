import {faker} from '@faker-js/faker'
import prisma from 'database'

export const createUser = async () => {
 const user = {
    id: 1,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: "fake@email.com",
    cpf: '12332112344',
    birthDate: "2010-04-04T13:15:03-08:00",
 }

 const result = await prisma.user.create({
    data: user
 })
 return result
}   
