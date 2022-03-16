// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import FirebaseAdmin from '@/models/firebase_admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  console.info(method);
  const { uid } = req.query;
  if (uid === undefined) {
    return res.status(400).send('uid가 없어요.');
  }
  const useUid = (() => {
    if (Array.isArray(uid)) {
      return uid[0];
    }
    return uid;
  })();
  const colRef = FirebaseAdmin.getInstance().Firestore.collection('members').doc(useUid).collection('messages');
  try {
    // 컬렉션 내 모든 문서 데이터를 읽음
    const colSnap = await colRef.get();
    // 각 문서를 순회해서 데이터를 반환
    const data = colSnap.docs.map((mv) => {
      const docData = mv.data() as {
        id: string;
        message: string;
        author?: {
          displayName: string;
          photoURL?: string;
        };
      };
      docData.id = mv.id;
      return docData;
    });
    // 결과 반환
    // 여기서 결과는 페이징 처리를 위해 아래와 같은 형식을 가지는 것.
    return res.status(200).json({
      totalElements: data.length,
      totalPages: 1,
      page: 1,
      size: 10,
      content: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}
