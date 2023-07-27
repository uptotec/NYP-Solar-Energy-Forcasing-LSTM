// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongo from '@solarirr/lib/db/mongoose';
import User from '@solarirr/lib/models/user';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

type Data = {
  profileComplete: boolean;
};

type Error = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  if (req.method !== 'GET') return res.status(401).json({ error: 'only GET' });

  await connectMongo();

  const token = await getToken({ req });

  if (!token) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const user = await User.findOne({ _id: token.id });

  res.status(200).json({ profileComplete: user.profileComplete });
}
