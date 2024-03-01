const data = require("./data.json")
const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        events: [Event!]
    }

    type Event {
        id: ID!
        title: String!
        desc: String!
        date: String!
        from: String!
        to: String!
        location_id: ID!
        user_id: ID!
        user: User!
        location: Location!
        participants: [Participant!]
    }

    type Location {
        id: ID!
        name: String!
        desc: String!
        lat: Int!
        lng: Int!
    }
    type Participant {
        id: ID!
        user_id: ID!
        event_id: ID!
        user: User!
        event: Event!
        }
    type Query {
        # User
        users: [User!]!
        user(id: ID!): User!
        # Event
        events: [Event!]!
        event(id: ID!): Event!
        # Location
        locations: [Location!]!
        location(id: ID!): Location!
        # Participant
        participants: [Participant!]!
        participant(id: ID!): Participant!
    }
`;

const resolvers = {
    Query: {
        users: () => data.users,
        user: (parent, args) => {
            return data.users.find((user) => user.id === parseInt(args.id))
        },
        events: () => data.events,
        event: (parent, args) => {
            return data.events.find((event) => event.id === parseInt(args.id))
        },
        locations: () => data.locations,
        location: (parent,args) => {
            return data.locations.find((location) => parseInt(args.id) === parseInt(location.id))
        },
        participants: () => data.participants,
        participant: (parent, args) => {
            return data.participants.find((participant) => parseInt(args.id) === parseInt(participant.id))
        }
    },
    User: {
        events: (parent) => {
            return data.events.filter((event) => parseInt(parent.id) === parseInt(event.user_id))
        }
    },
    Event: {
        user: (parent) => {
            return data.users.find((user) => parseInt(parent.user_id) === parseInt(user.id))
        },
        location: (parent) => {
            return data.locations.find((location) => parseInt(location.id) === parseInt(parent.location_id))
        },
        participants: (parent) => {
            return data.participants.filter((participant) => parseInt(participant.event_id) === parseInt(parent.id))
        }
    },
    Participant: {
        user: (parent) => {
            return data.users.find((user) => parseInt(user.id) === parseInt(parent.user_id))
        },
        event: (parent) => {
            return data.events.find((event) => parseInt(event.id) === parseInt(parent.event_id))
        }
    }
};
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
server.listen().then(({url}) => {
    console.log(`server is ready at ${url}`);
});