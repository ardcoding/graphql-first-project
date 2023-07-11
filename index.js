const {ApolloServer, gql} = require('apollo-server');
const {events, users, locations, participants} = require('./data.json')
const {ApolloServerPluginLandingPageGraphQLPlayground} = require('apollo-server-core');
const {nanoid} = require("nanoid");

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
    

    input createEventInput{
        title : String!
        desc : String
        date : String
        from : String
        to : String
        location_id : Int
        user_id : Int
    }
    input updateEventInput{
        title : String
        desc : String
        date : String
        from : String
        to : String
        location_id : Int
        user_id : Int
    }

    input createLocationInput{
        name : String!
        desc : String
        lat : Int
        lng : Int
    }
    input updateLocationInput{
        name : String
        desc : String
        lat : Int
        lng : Int
    }

    input createUserInput{
        username: String!
        email: String
    }
    input updateUserInput{
        username: String
        email: String
    }

    input createParticipantInput{
        user_id : ID!
        event_id : ID!
    }
    input updateParticipantInput{
        user_id : ID
        event_id : ID
    }

    type deleteAllOutput{
        count: Int
    }

    type Mutation{
        createUser(data: createUserInput!): User!
        updateUser(id:ID!, data: updateUserInput!): User!
        deleteUser(id:ID!): User!
        deleteAllUsers: deleteAllOutput!

        createEvent(data: createEventInput!): Event!
        updateEvent(id:ID!, data: updateEventInput!): Event!
        deleteEvent(id:ID!): Event!
        deleteAllEvents: deleteAllOutput!
        
        createLocation(data: createLocationInput!): Location!
        updateLocation(id:ID!, data: updateLocationInput!): Location!
        deleteLocation(id:ID!): Location!
        deleteAllLocations: deleteAllOutput!

        createParticipant(data: createParticipantInput!): Participant!
        updateParticipant(id:ID!, data: updateParticipantInput!): Participant!
        deleteParticipant(id:ID!): Participant!
        deleteAllParticipants: deleteAllOutput!
    }

`;

const resolvers = {
    Mutation:{
        createUser:(parent, {data}) => { 
            const newUser = {
                id: nanoid(), 
                ...data,
            }
            users.push(newUser)
            return newUser
        },
        updateUser:(parent, {id, data})=>{
            const user = users.findIndex(user=> user.id == id)
            if(user==-1){
               throw new Error("Kullanıcı Bulunamadı")
            }
            const updatedUser  = users[user] = {
                ...users[user],
                ...data
            }
            return updatedUser
        },
        deleteUser:(parent, {id})=>{
            const user = users.findIndex(user=> user.id == id)

            if(user==-1){
               throw new Error( "Kullanıcı Bulunamadı")
            }

            const deletedUser = users[user]
            users.splice(user,1)
            return deletedUser
        },
        deleteAllUsers: () => {
            const length = users.length
            users.splice(0,length)
            return{
                count: length,
            }
        },


        createEvent:(parent, {data}) => { 
            const newEvent = {
                id: nanoid(), 
                ...data,
            }
            events.push(newEvent)
            return newEvent
        },
        updateEvent:(parent, {id, data})=>{
            const event = events.findIndex(event=> event.id == id)
            if(event==-1){
               throw new Error( "Etkinlik Bulunamadı")
            }
            const updatedEvent  = events[event] = {
                ...events[event],
                ...data
            }
            return updatedEvent
        },
        deleteEvent:(parent, {id})=>{
            const event = events.findIndex(event=> event.id == id)

            if(event==-1){
               throw new Error( "Etkinlik Bulunamadı")
            }

            const deletedEvent = events[event]
            events.splice(event,1)
            return deletedEvent
        },
        deleteAllEvents: () => {
            const length = events.length
            events.splice(0,length)
            return{
                count: length,
            }
        },


        createLocation:(parent, {data}) => { 
            const newLocation = {
                id: nanoid(), 
                ...data,
            }
            users.push(newLocation)
            return newLocation
        },
        updateLocation:(parent, {id, data})=>{
            const location = locations.findIndex(location=> location.id == id)
            if(location==-1){
               throw new Error("Etkinlik Yeri Bulunamadı")
            }
            const updatedLocation  = locations[location] = {
                ...locations[location],
                ...data
            }
            return updatedLocation
        },
        deleteLocation:(parent, {id})=>{
            const location = locations.findIndex(location=> location.id == id)

            if(location==-1){
               throw new Error( "Etkinlik Yeri Bulunamadı")
            }

            const deletedLocation = locations[location]
            locations.splice(location,1)
            return deletedLocation
        },
        deleteAllLocations: () => {
            const length = locations.length
            locations.splice(0,length)
            return{
                count: length,
            }
        },


        createParticipant:(parent, {data}) => { 
            const newParticipant = {
                id: nanoid(), 
                ...data,
            }
            participants.push(newParticipant)
            return newParticipant
        },
        updateParticipant:(parent, {id, data})=>{
            const participant = participants.findIndex(participant=> participant.id == id)
            if(participant==-1){
               throw new Error( "Katılımcı Bulunamadı")
            }
            const updatedParticipant  = participants[participant] = {
                ...participants[participant],
                ...data
            }
            return updatedParticipant
        },
        deleteParticipant:(parent, {id})=>{
            const participant = participants.findIndex(participant=> participant.id == id)

            if(participant==-1){
               throw new Error( "Katılımcı Bulunamadı")
            }

            const deletedParticipant = participants[participant]
            participants.splice(participant,1)
            return deletedParticipant
        },
        deleteAllParticipants: () => {
            const length = participants.length
            participants.splice(0,length)
            return{
                count: length,
            }
        },
    },
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
  