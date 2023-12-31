import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import FormInput from './formItem';
import Select from 'react-select';

type FormProps = {
  onSubmit: (...args: any) => any;
};

export type formDataType = {
  city: string;
  pvPanalArea: number;
  noOfPanels: number;
  pvEff: number;
};

const Form: React.FC<FormProps> = ({ onSubmit }) => {
  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } =
    useFormik<formDataType>({
      initialValues: {
        city: '0',
        pvPanalArea: 1.7,
        noOfPanels: 1,
        pvEff: 0.2,
      },
      onSubmit: onSubmit,
    });

  const cityOptions = [
    { value: '0', label: 'Marseille, France' },
    { value: '1', label: 'Tokyo, Japan' },
    { value: '2', label: 'Singapoure' },
    { value: '3', label: 'Calgary, Canada' },
  ];

  const panelOptions = [
    { value: '0.18', label: 'Mono PERC' },
    { value: '0.17', label: 'Poly PERC' },
    { value: '0.19', label: 'Half-cut mono PERC' },
    { value: '0.205', label: 'Shingled mono cells' },
    { value: '0.21', label: 'Half-cut mono PERC MBB' },
    { value: '0.215', label: 'Half-cut N-Type TOPcon' },
    { value: '0.22', label: 'Half-cut N-Type HJT' },
    { value: '0.22', label: 'N-Type IBC' },
  ];

  useEffect(() => {
    const x = async () => {
      const res = await fetch('/api/getFarm', { method: 'GET' });
      const data = await res.json();

      if (Object.values(data).length === 0) return;

      const city = cityOptions.find((c) => c.value === '' + data.farm.city);
      const eff = panelOptions.find((c) => c.value === '' + data.farm.pvEff);

      setFieldValue('city', city);
      setFieldValue('pvPanalArea', data.farm.pvPanalArea);
      setFieldValue('noOfPanels', data.farm.noOfPanels);
      setFieldValue('pvEff', eff);
    };
    x();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFieldValue]);

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4 px-4">
        <label className="text-sm text-gray-500 bg-white rounded left-2">
          city
        </label>
        <Select
          defaultValue={values.city}
          value={values.city}
          isDisabled={false}
          isLoading={false}
          isClearable={true}
          isSearchable={true}
          name="city"
          onChange={(n) => setFieldValue('city', n)}
          options={cityOptions as any}
        />
        <FormInput
          placeHolder="PV Panal Area (m²)"
          name="pvPanalArea"
          onChange={handleChange}
          value={values.pvPanalArea}
          error={errors.pvPanalArea}
          touched={touched.pvPanalArea}
        />
        <FormInput
          placeHolder="PV Efficiency (%)"
          name="noOfPanels"
          onChange={handleChange}
          value={values.noOfPanels}
          error={errors.noOfPanels}
          touched={touched.noOfPanels}
        />
        <label className="px-1 text-sm text-gray-500 bg-white rounded left-2">
          panel type
        </label>
        <Select
          className="basic-single"
          classNamePrefix="select"
          defaultValue={values.pvEff}
          isDisabled={false}
          isLoading={false}
          isClearable={true}
          isRtl={false}
          isSearchable={true}
          name="pvEff"
          onChange={(n) => {
            setFieldValue('pvEff', n);
          }}
          options={panelOptions as any}
        />
        <button className="bg-[#208977] mx-4 py-2 text-white rounded-md hover:bg-[#43C59E] transition">
          save
        </button>
      </form>
    </div>
  );
};

export default Form;
