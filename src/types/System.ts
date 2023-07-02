export enum MachineTypes {
  COMPUTE = 'COMPUTE', // Can be used as servers where the original REST/GraphQL API is hosted
  LOAD_BALANCER = 'LOAD_BALANCER', // Reverse proxy that distributes requests to other machines
  SQL_DATABASE = 'SQL_DATABASE', // USed to store data in SQL tables
  NOSQL_DATABASE = "NOSQL_DATABASE", // Used to store data in NoSQL documents
  CACHE = 'CACHE', // Used to store data in key-value pairs
  FILE_STORAGE = 'FILE_STORAGE', // Used to store files
  MESSAGE_QUEUE = 'MESSAGE_QUEUE', // Used as message brokers for asynchronous communication
  CONTENT_DELIVERY_NETWORK = 'CONTENT_DELIVERY_NETWORK', // Used to cache static assets
  API_GATEWAY = "API_GATEWAY" // Used to aggregate multiple APIs into one
}

export type MachineID = number
export type Machine = {
  id: MachineID
  name: string // Name should be short but telling what is the machine used for
  machineType: MachineTypes
  uses: MachineID[] // this final system should be a connected network
  description: string // this should be different from the description of the machine type. This should be more specific to the system and how the machine works
}
// machineA.uses.includes(machineB.machineID) means machineA sends requests to machineB

export type User = {
  name: string // customer/admin/vendor/...(stakeholder)
  description: string
  requests: MachineID[] // id of API_GATEWAY/CDN(when needed) that the user can request to
}

export type System = {
  machines: Machine[] // list of machines to be used in the system
  users: User[] // list of stakeholders that use the system, all the users.name should be unique
}