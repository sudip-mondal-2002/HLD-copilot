import type {NextApiRequest, NextApiResponse} from 'next'
import {MachineID, MachineTypes, System} from "@/types/System";
import {Requirements} from "@/types/Requirements";
import * as fs from "fs";
import {openai} from "@/utils/openai";
import {CreateChatCompletionRequest} from "openai";

export default async function POST(
  req: NextApiRequest,
  res: NextApiResponse<System>
) {
  if (req.method !== "POST") {
    return res.status(405).end()
  }
  const {requirements, title, description, incomingChat} = req.body as {
    requirements: Requirements,
    title: string,
    description: string,
    incomingChat?: {
      currentSystem: System,
      message: string
    }
  }
  const systemTypes = fs.readFileSync('src/types/System.ts').toString()
  try {
    const chat:CreateChatCompletionRequest = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user", content: `
  Design a microservice system that defines high level of ${title} which ${description}.
  There should not be any single point of failure.
  The compute servers should be distributed such that they follow single responsibility principle.
        `
        },
        {
          role: "assistant", content: `
What are the machines available to use in the system?
`
        },
        {role: "user", content: `${systemTypes}`},
        {role: "assistant", content: `What are the functional requirements of the system?`},
        {
          role: "user", content: `Functional Requirements:
  ${
            requirements.functional.reduce((acc, arg) => {
              return `${acc}
\t- ${arg}`
            }, "")
          }`
        },
        {role: "assistant", content: `What are the non functional requirements of the system?`},

        {
          role: "user", content: `Non Functional Requirements:
  ${
            requirements.nonFunctional.reduce((acc, arg) => {
              return `${acc}
\t- ${arg}`
            }, "")
          }
`
        },
        {role: "assistant", content: "Any specifications about the connections"},
        {
          role: "user", content: `
Compute servers should be using appropriate database/cache servers.
API gateway should be using appropriate compute servers.
Users should be able to request to API Gateway/CDN only.
If any machine has a load balancer for it, no other server should use that server directly, they should use the load balancer instead. Respective Load balancer will use that server.
`
        },
        {role: "assistant", content: "How should the machine naming and description should look like?"},
        {
          role: "user", content: `
The machine names should be self-explanatory. (Eg. Product-service, Profile-pic-cache, etc.)

The machine descriptions should be in the following format:
This <machinetype> is used for <purpose>. The machine does so by <how it does it>.
`
        },
      ],
    }
    if(incomingChat){
      chat.messages.push({
        role: "assistant",
        content: `content of server.json is 
        ${JSON.stringify(incomingChat.currentSystem)}
        `
      })
      chat.messages.push({
        role: "user",
        content: incomingChat.message
      })
      chat.messages.push({
        role: "system",
        content: "Keep in mind users can only request to API Gateway/CDN"
      })
      chat.messages.push({
        role: "assistant",
        content: "Here is the revised content of server.json"
      })
    } else {
      chat.messages.push({
        role: "assistant",
        content: 'content of server.json is'
      })
    }

    const chatCompletion = await openai.createChatCompletion(chat);

    const rawReply = chatCompletion.data.choices[0].message

    // the first { and last } are needed

    const starting = rawReply?.content?.indexOf("{") || 0
    const ending = rawReply?.content?.lastIndexOf("}") || 0
    const extractedJSON = rawReply?.content?.substring(starting, ending + 1)
    if (!extractedJSON) {
      res.status(500).end()
    }
    if(rawReply?.content){
      rawReply.content = extractedJSON
    }


    const system = (rawReply?.content ? JSON.parse(rawReply.content || "") : {machines: [], users: []}) as System

    system.users = system.users.filter(user => user.requests.length > 0)
    system.users.map((user) => {
      // remove numeric characters from the name
      user.name = user.name.replace(/[0-9]/g, "").trim()
      // if some machine is not An API Gateway or CDN, then remove the requests to it
      user.requests = user.requests.filter((machineID) => {
        const machine = system.machines.find(machine => machine.id === machineID)
        return machine?.machineType === MachineTypes.API_GATEWAY || machine?.machineType === MachineTypes.CONTENT_DELIVERY_NETWORK || machine?.machineType === MachineTypes.LOAD_BALANCER
      })
    })

    // Run a BFS to find which machines are being used directly or indirectly by users
    const queue = system.users.reduce((acc, user) => [...acc, ...user.requests], [] as MachineID[])
    const usedMachines = new Set<MachineID>()
    while (queue.length > 0) {
      const machineID = queue.pop()
      if (machineID && !usedMachines.has(machineID)) {
        usedMachines.add(machineID)
        const machine = system.machines.find(machine => machine.id === machineID)
        if (machine) {
          queue.push(...machine.uses)
        }
      }
    }

    // remove the machines that are not being used by users
    system.machines = system.machines.filter(machine => usedMachines.has(machine.id))

    system.machines = system.machines.map((machine) => {
      // remove the quotes from the name and description and capitalize the first letter and lowercase the rest
      machine.name = machine.name.replace(/"/g, "").toUpperCase()
      machine.description = machine.description.replace(/"/g, "")
      return machine
    })

    res.status(200).json(system)
  } catch
    (e) {
    console.log(e)
    res.status(429).end()
  }
}

