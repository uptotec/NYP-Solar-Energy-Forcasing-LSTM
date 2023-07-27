import Form, { formDataType } from '@solarirr/components/form';
import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MdMail, MdCall } from 'react-icons/md';
import { BsLinkedin } from 'react-icons/bs';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

type API_DATA = {
  gridPercent: number;
  pvPercent: number;
  gridCost: number;
  pvCost: number;
  totalCost: number;
  LCOE: number;
  totalPvArea: number;
  pvPanelCount: number;
};

export default function Home() {
  const { data: session } = useSession();
  const [data, setData] = React.useState<API_DATA[]>([]);

  const getData = async (values: formDataType) => {
    console.log(values);
    const res = await fetch('/api/addFarm', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    const resData = (await res.json()) as API_DATA[];

    setData(resData);
  };

  return (
    <div className="flex flex-col w-full desktop:flex-row desktop:h-full">
      <div className="p-2 desktop:h-screen desktop:sticky desktop:top-0 desktop:w-1/4 desktop:border-r-2 desktop:overflow-y-auto">
        <div className="flex items-center gap-2 pb-4">
          <Image
            src={session?.user.image!}
            width={50}
            height={50}
            alt="bue logo"
            className="rounded-full"
          />
          <p className="text-2xl font-bold">hello, {session?.user.name}</p>
        </div>
        <div className="border" />
        <p className="py-4 text-justify text-m">here is your farm data</p>
        <Form onSubmit={getData} />
      </div>
      <main className="p-4 desktop:w-3/4">
        <div className="mb-4">
          <ResponsiveContainer width="100%" height={500}>
            <ComposedChart data={data} margin={{ top: 20, left: 20 }}>
              <Line
                type="monotone"
                dataKey="totalCost"
                stroke="#48BEFF"
                strokeWidth={2}
              />
              <Bar dataKey="pvCost" barSize={30} fill="#43C59E" />
              <Bar dataKey="gridCost" barSize={30} fill="#208977" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="pvPercent" xAxisId="0" unit=" PV" fontSize={16} />
              <XAxis
                dataKey="gridPercent"
                xAxisId="1"
                unit=" Grid"
                axisLine={false}
                fontSize={16}
              />
              <YAxis unit=" EGP" fontSize={14} />
              <Tooltip />
              <Legend verticalAlign="top" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full overflow-x-auto text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-100 uppercase bg-[#208977]">
              <tr>
                <th scope="col" className="px-6 py-3">
                  PV %
                </th>
                <th scope="col" className="px-6 py-3">
                  Grid %
                </th>
                <th scope="col" className="px-6 py-3">
                  Total PV Area (m²)
                </th>
                <th scope="col" className="px-6 py-3">
                  NO. PV Panels
                </th>
                <th scope="col" className="px-6 py-3">
                  LCOE (EGP/kWh)
                </th>
                <th scope="col" className="px-6 py-3">
                  PV Cost (EGP)
                </th>
                <th scope="col" className="px-6 py-3">
                  Grid Cost (EGP)
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Cost (EGP)
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map(
                ({
                  pvPercent,
                  gridPercent,
                  totalPvArea,
                  pvPanelCount,
                  LCOE,
                  pvCost,
                  gridCost,
                  totalCost,
                }) => (
                  <tr className="bg-white border-b " key={pvPercent}>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                    >
                      {gridPercent}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                    >
                      {pvPercent}
                    </td>
                    <td scope="row" className="px-6 py-4">
                      {totalPvArea.toFixed(2)}
                    </td>
                    <td scope="row" className="px-6 py-4">
                      {pvPanelCount}
                    </td>
                    <td scope="row" className="px-6 py-4">
                      {LCOE.toFixed(2)}
                    </td>
                    <td scope="row" className="px-6 py-4">
                      {pvCost.toFixed(2)}
                    </td>
                    <td scope="row" className="px-6 py-4">
                      {gridCost.toFixed(2)}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {totalCost.toFixed(2)}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
