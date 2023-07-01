export enum MachineTypes{
  VIRTUAL_MACHINE= 'VIRTUAL_MACHINE',
  LOAD_BALANCER = 'LOAD_BALANCER',
  SQL_DATABASE = 'SQL_DATABASE',
  CACHE = 'CACHE',
  FILE_STORAGE = 'FILE_STORAGE',
  MESSAGE_QUEUE = 'MESSAGE_QUEUE',
  CONTENT_DELIVERY_NETWORK = 'CONTENT_DELIVERY_NETWORK'
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