import {faker} from '@faker-js/faker'
import prisma from 'database'

export const createMovie = async () => {
 const movie = {
  name: faker.lorem.text(),
  adultsOnly: false,
  }

 const result = await prisma.movie.create({
    data: movie
 })
 return result
}

export const createMovieAdult = async () => {
   const movie = {
    name: faker.lorem.text(),
    adultsOnly: true,
    }
  
   const result = await prisma.movie.create({
      data: movie
   })
   return result
  }