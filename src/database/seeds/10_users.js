import faker from '@faker-js/faker'
import bcrypt from 'bcrypt';

export const seed = async function(knex) {
    await knex('users').del()

    const userRoles = ['client', 'freelancer']

    const users = []
    for(let i = 0; i < 10; i++) {
      users.push({
        id: faker.datatype.uuid(),
        email: faker.internet.email(),
        password:  bcrypt.hashSync(faker.animal.dog(), 10),
        first_name: faker.name.firstName(1),
        last_name: faker.name.lastName(1),
        description: faker.word.noun(5),
        role: userRoles[Math.floor(Math.random() * userRoles.length)]
      })
    }
    console.log(users);
    return await knex('users').insert(users)
}
