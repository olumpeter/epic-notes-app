import { faker } from "@faker-js/faker"
import { UniqueEnforcer } from "enforce-unique"

const uniqueUsernameEnforcer = new UniqueEnforcer()

export function createUser() {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()

    const username = uniqueUsernameEnforcer
        .enforce(() => {
            return (
                faker.string.alphanumeric({ length: 2 }) +
                "_" +
                faker.internet.username({
                    firstName: firstName.toLowerCase(),
                    lastName: lastName.toLowerCase(),
                })
            )
        })
        .slice(0, 20)
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
    return {
        username,
        name: `${firstName} ${lastName}`,
        email: `${username}@example.com`,
    }
}
