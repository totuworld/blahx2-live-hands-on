// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import MessageCtrl from '@/controllers/message/message.controller';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  console.info(method);
  if (method !== 'POST') {
    return res.status(400).end('지원하지 않는 http method입니다');
  }
  try {
    await MessageCtrl.postReplay(req, res);
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
}
