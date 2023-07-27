// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongo from '@solarirr/lib/db/mongoose';
import Prediction from '@solarirr/lib/models/prediction';
import User from '@solarirr/lib/models/user';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

type Data = {
  data: any;
};

type Error = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  if (req.method !== 'POST')
    return res.status(401).json({ error: 'only POST' });

  await connectMongo();

  const token = await getToken({ req });

  if (!token) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const user = await User.findOne({ _id: token.id });

  const prediction = await Prediction.find({
    model: req.body.model,
    city: req.body.city,
  })
    .sort({ createdAt: -1 })
    .limit(1);

  const predictionsIrr = prediction[0].predections;
  const energy = [];

  for (let i = 0; i < predictionsIrr.length; i++) {
    energy.push(
      Math.abs(
        predictionsIrr[i] *
          user.farm.singlePanelArea *
          user.farm.eff *
          (1 - 0.15)
      )
    );
  }

  res.status(200).json({ data: { irr: prediction[0], energy } });
}
