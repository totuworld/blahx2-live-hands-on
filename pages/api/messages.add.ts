// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import FirebaseAdmin from '@/models/firebase_admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  console.info(method);
  console.info(req.body);
  const { uid, message, author } = req.body;
  if (uid === undefined) {
    return res.status(400).send('uid가 없어요.');
  }
  if (message === undefined) {
    return res.status(400).send('message가 없어요.');
  }
  console.info(author);
  // 저장할 데이터
  const addData: {
    message: string;
    author?: {
      displayName: string;
      photoURL?: string;
    };
  } = {
    message,
  };
  if (author !== undefined) {
    addData.author = author;
  }
  try {
    // 콜렉션을 특정합니다.
    const colRef = FirebaseAdmin.getInstance().Firestore.collection('members').doc(uid).collection('messages');
    // 데이터를 저장해요.
    await colRef.add(addData);
    // 생성 결과를 응답해요.
    res.status(201).end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}
