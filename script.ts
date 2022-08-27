import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
  const pokemon= await prisma.pokemon.upsert({
    where: {
      id: 1,
    },
    update: {
      win: 1,
      total:1
    },
    create: {
      id: 1,
      win: 1,
      total:1
    },
  })
  console.log(pokemon)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })