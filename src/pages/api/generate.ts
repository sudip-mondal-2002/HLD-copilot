import type { NextApiRequest, NextApiResponse } from 'next';
import { Connection, Machine, MachineID, MachineTypes, System } from '@/types/System';
import { Requirements } from '@/types/Requirements';
import * as fs from 'fs';
import { openai } from '@/utils/openai';
import { CreateChatCompletionRequest } from 'openai';

export default async function POST(req: NextApiRequest, res: NextApiResponse<System>) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { requirements, title, description, incomingChat } = req.body as {
    requirements: Requirements;
    title: string;
    description: string;
    incomingChat?: {
      currentSystem: System;
      message: string;
    };
  };
  const systemTypes = fs.readFileSync('src/types/System.ts').toString();
  try {
    const chat: CreateChatCompletionRequest = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You need to build a microservice system as per the requirements and return a JSON object ob type System with the following structure
          ${systemTypes}
  There should not be any single point of failure.
  The compute servers should be distributed such that they follow single responsibility principle.
  Compute servers should be connected To appropriate database/cache servers.
  API gateway should be connectedTo appropriate compute servers.
  Users should be able to request to API Gateway/CDN only.
  If any machine has a load balancer for it, no other server should use that server directly, they should use the load balancer instead. Respective Load balancer will use that server.  

  The machine names should be self-explanatory. (Eg. Product-service, Profile-pic-cache, etc.)

  The machine descriptions should be in the following format:
  This <machinetype> is used for <purpose>. The machine does so by <how it does it>.

  In case of multiple Users, all user names should be unique.
  The whole system should be a connected graph.
`
        }, {
          role: 'user',
          content: `
  Design a microservice system that defines high level of ${title} which ${description}.
        
  Functional Requirements:
  ${requirements.functional.reduce((acc, arg) => {
            return `${acc}
\t- ${arg}`;
          }, '')}
  
  Non Functional Requirements:
  ${requirements.nonFunctional.reduce((acc, arg) => {
            return `${acc}
\t- ${arg}`;
          }, '')}
`,
        }
      ],
    };
    if (incomingChat) {
      chat.messages.push({
        role: 'assistant',
        content: `content of server.json is 
        ${JSON.stringify(incomingChat.currentSystem)}
        `,
      });
      chat.messages.push({
        role: 'user',
        content: incomingChat.message,
      });
      chat.messages.push({
        role: 'system',
        content:
          'Keep in mind users can only request to API Gateway/CDN and the resultant system should be a connected network',
      });
      chat.messages.push({
        role: 'assistant',
        content: 'Here is the revised complete content of server.json',
      });
    } else {
      chat.messages.push({
        role: 'assistant',
        content: 'complete content of server.json is',
      });
    }

    const chatCompletion = await openai.createChatCompletion(chat);

    const rawReply = chatCompletion.data.choices[0].message;

    // the first { and last } are needed

    const starting = rawReply?.content?.indexOf('{') || 0;
    const ending = rawReply?.content?.lastIndexOf('}') || 0;
    const extractedJSON = rawReply?.content?.substring(starting, ending + 1);
    if (!extractedJSON) {
      res.status(500).end();
    }
    if (rawReply?.content) {
      rawReply.content = extractedJSON;
    }

    const system = (rawReply?.content ? JSON.parse(rawReply.content || '') : { machines: [], users: [] }) as System;



    system.machines = system.machines.map(machine => {
      // remove the quotes from the name and description and capitalize the first letter and lowercase the rest
      machine.name = machine.name.replace(/"/g, '').toUpperCase();
      machine.description = machine.description.replace(/"/g, '');
      return machine;
    });

    const currentMachines = system.machines.map(machine => machine.id);
    system.connections = system.connections.filter(
      connection =>
        currentMachines.includes(connection.requestOrigin) && currentMachines.includes(connection.requestDestination)
    );



    res.status(200).json(system);
  } catch (e) {
    console.log(e);
    res.status(429).end();
  }
}
