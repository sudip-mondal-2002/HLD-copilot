import type {NextApiRequest, NextApiResponse} from 'next'
import {System} from "@/types/System";
import {Requirements} from "@/types/Requirements";
import * as fs from "fs";
import {openai} from "@/utils/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  return res.status(200).json(dummyData)
  const {requirements, title, description} = req.body as {
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

    const system = rawReply?.content ? JSON.parse(rawReply?.content || "") : {machines: []}

    res.status(200).json(system)
  } catch (e) {
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
"machineType": "COMPUTE",
"connectedTo": [2],
"description": "Handles user authentication and authorization."
},
{
"id": 2,
"name": "DatabaseServer",
"machineType": "SQL_DATABASE",
"connectedTo": [3, 4, 5],
"description": "Stores user and blog data."
},
{
"id": 3,
"name": "ImageServer",
"machineType": "FILE_STORAGE",
"connectedTo": [],
"description": "Stores blog images."
},
{
"id": 4,
"name": "CommentServer",
"machineType": "NOSQL_DATABASE",
"connectedTo": [2],
"description": "Stores user comments."
},
{
"id": 5,
"name": "ReviewServer",
"machineType": "COMPUTE",
"connectedTo": [2],
"description": "Handles review of posts and comments."
}
]
}`) as System;