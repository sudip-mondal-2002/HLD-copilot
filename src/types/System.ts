export enum MachineTypes{
  COMPUTE= 'COMPUTE',
  LOAD_BALANCER = 'LOAD_BALANCER',
  SQL_DATABASE = 'SQL_DATABASE',
  NOSQL_DATABASE = "NOSQL_DATABASE",
  CACHE = 'CACHE',
  FILE_STORAGE = 'FILE_STORAGE',
  MESSAGE_QUEUE = 'MESSAGE_QUEUE',
  CONTENT_DELIVERY_NETWORK = 'CONTENT_DELIVERY_NETWORK',
  API_GATEWAY = "API_GATEWAY"
}

export type MachineID = number
export type Machine = {
  id: MachineID
  name: string
  machineType: MachineTypes
  connectedTo: MachineID[]
  description: string
}
// machineA.connectedTo.includes(machineB.machineID) means machineA sends requests to machineB


export type System = {
  machines: Machine[]
}