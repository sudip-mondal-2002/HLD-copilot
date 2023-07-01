import type { NextApiRequest, NextApiResponse } from 'next'
import {System} from "@/types/System";
import {Requirements} from "@/types/Requirements";
import * as fs from "fs";
import {openai} from "@/utils/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {requirements, title, description} = req.body as{
    requirements: Requirements,
    title: string,
    description: string
  }
  const systemTypes = fs.readFileSync('src/types/System.ts').toString()
  const prompt = `
${systemTypes}
You can use zero or more machines of each type(don't use any unnecessary server) and give them proper names(up to 3-4 words) and descriptions(up to 2-3 lines)
  
Return a single JSON of the System type for a distributed system that defines high level of ${title} which is ${description}.

Functional Requirements:
  ${
    requirements.functional.reduce((acc, arg)=>{
      return `${acc}
\t- ${arg}`
    }, "")
  }

Non Functional Requirements:
  ${
    requirements.nonFunctional.reduce((acc, arg)=>{
      return `${acc}
\t- ${arg}`
    }, "")
  }
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

    const system = rawReply?.content? JSON.parse(rawReply.content) : {machines: []}

    res.status(200).json(system)
  } catch (e){
    console.log(e)
    res.status(429).json({
      message: "Too many requests ..."
    })
  }
}


const dummyData: System = JSON.parse(`{
  "machines": [
    {
      "id": 1,
      "name": "AuthServer",
      "machineType": "VIRTUAL_MACHINE",
      "connectedTo": [],
      "description": "Handles user authentication"
    },
    {
      "id": 2,
      "name": "DBServer",
      "machineType": "SQL_DATABASE",
      "connectedTo": [],
      "description": "Stores blog data"
    },
    {
      "id": 3,
      "name": "ImageServer",
      "machineType": "FILE_STORAGE",
      "connectedTo": [],
      "description": "Stores and serves blog images"
    },
    {
      "id": 4,
      "name": "CommentServer",
      "machineType": "VIRTUAL_MACHINE",
      "connectedTo": [2],
      "description": "Handles user comments and stores them in the database"
    },
    {
      "id": 5,
      "name": "ReviewServer",
      "machineType": "VIRTUAL_MACHINE",
      "connectedTo": [2],
      "description": "Reviews and moderates posts/comments for inappropriate content"
    },
    {
      "id": 6,
      "name": "LoadBalancer",
      "machineType": "LOAD_BALANCER",
      "connectedTo": [1, 2, 3, 4, 5],
      "description": "Distributes incoming traffic across the servers for scalability and load balancing"
    },
    {
      "id": 7,
      "name": "CacheServer",
      "machineType": "CACHE",
      "connectedTo": [2],
      "description": "Caches frequently accessed blog data for improved performance"
    },
    {
      "id": 8,
      "name": "CDNServer",
      "machineType": "CONTENT_DELIVERY_NETWORK",
      "connectedTo": [3],
      "description": "Delivers static content (images) to users efficiently"
    },
    {
      "id": 9,
      "name": "MessageQueueServer",
      "machineType": "MESSAGE_QUEUE",
      "connectedTo": [],
      "description": "Handles asynchronous processing of tasks like blog updates, notifications, etc."
    }
  ]
}`) as System;