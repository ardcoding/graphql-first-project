const {ApolloServer, gql} = require('apollo-server');
const {events, users, locations, participants} = require('./data.json')
const {ApolloServerPluginLandingPageGraphQLPlayground} = require('apollo-server-core');

const typeDefs = gql `

    type Event{
        id : ID!
        title : String!
        desc : String
        date : String
        from : String
        to : String
        location_id : Int
        user_id : Int
        user : User
        participants : [Participant]
        location : Location
    }

    type Location{
        id : ID!
        name : String!
        desc : String
        lat : Int
        lng : Int
    }

    type User{
        id : ID!
        username : String
        email : String
        event : [Event]
    }

    type Participant{
        id : ID!
        username : User
        user_id : ID!
        event_id : ID!
    }

    type Query{
        events: [Event]
        event(id: ID): Event

        locations : [Location]
        location(id: ID!): Location

        users : [User]
        user(id: ID): User

        participants : [Participant]
        participant(id: ID): Participant
    }
`;

const resolvers = {
    Query: {
      events: () => events,
      event:(parent,args) => events.find(event => (event.id).toString() === args.id),

      locations: () => locations,
      location: (parent, args) => locations.find(location => (location.id).toString() === args.id),


      users: () => users,
      user:(parent,args) => users.find(user => (user.id).toString() === args.id),

      participants: () => participants,
      participant:(parent,args) => participants.find(participant => (participant.id).toString() === args.id),

    },
    Event: {
        user: (parent) =>  users.find(user => user.id === parent.user_id),
        participants: (parent) =>  participants.filter(participant => participant.event_id === parent.id),
        location: (parent) =>  locations.find(location => location.id === parent.location_id)   
      },

    Participant:{
        username: (parent)=>  users.find(user => user.id === parent.user_id)
    },
    User:{
        event: (parent) => events.filter(event => event.user_id === parent.id)
    }
    
  };

  const server = new ApolloServer ({ 
    typeDefs, 
    resolvers, 
    plugins:[
        ApolloServerPluginLandingPageGraphQLPlayground({

        }),
    ]})

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
  