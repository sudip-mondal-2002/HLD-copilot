import type {NextApiRequest, NextApiResponse} from 'next'
import {MachineID, System} from "@/types/System";
import {Requirements} from "@/types/Requirements";
import * as fs from "fs";
import {openai} from "@/utils/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<System>
) {
  const {requirements, title, description} = req.body as {
    requirements: Requirements,
    title: string,
    description: string
  }
  const systemTypes = fs.readFileSync('src/types/System.ts').toString()
  const prompt = `
${systemTypes}
You can use zero or more machines of each type(don't use any unnecessary server) and give them proper names(up to 3-4 words) and descriptions(up to 2-3 lines)
  
Return a single JSON of the System type for a distributed system that defines high level of ${title} which ${description}.

Functional Requirements:
  ${
    requirements.functional.reduce((acc, arg) => {
      return `${acc}
\t- ${arg}`
    }, "")
  }

Non Functional Requirements:
  ${
    requirements.nonFunctional.reduce((acc, arg) => {
      return `${acc}
\t- ${arg}`
    }, "")
  }

Compute servers should be using appropriate database/cache servers.
API gateway should be using appropriate compute servers.
Users should be able to request to API Gateway/CDN only.


If any machine has a load balancer for it, no other server should use that server directly, they should use the load balancer instead. Respective Load balancer will use that server.

The machine descriptions(2-3 sentences) should be written in a way that a new developer can understand the system by reading them.(Don't copy the machine type descriptions from the enum comments)

  `
  try {
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "user", content: prompt},
        {role: "assistant", content: "content of system.json file is"}
      ],
    });

    const rawReply = chatCompletion.data.choices[0].message

    const system = (rawReply?.content ? JSON.parse(rawReply.content || "") : {machines: [], users: []}) as System

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

    system.users = system.users.filter(user => user.requests.length)

    system.machines = system.machines.map((machine) => {
      // remove the quotes from the name and description and capitalize the first letter and lowercase the rest
      machine.name = machine.name.replace(/"/g, "").toUpperCase()
      machine.description = machine.description.replace(/"/g, "")
      return machine
    })

    res.status(200).json(system)
  } catch (e) {
    console.log(e)
    res.status(429).end()
  }
}

