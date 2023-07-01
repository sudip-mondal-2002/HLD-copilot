// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {System} from "@/types/System";
import {Requirements} from "@/types/Requirements";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<System>
) {
  console.log(req.body as Requirements);
  res.status(200).json(dummyData)
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