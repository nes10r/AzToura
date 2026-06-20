const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.destination.update({
    where: { slug: 'baku' },
    data: { coverImage: '/images/baku-night.jpg' },
  });
  console.log('Baku image updated in DB');
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
