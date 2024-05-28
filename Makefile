run-prisma: 
	npx prisma migrate dev
	npx prisma generate

generate: 
	npx prisma generate

migrate:
	npx prisma migrate dev
