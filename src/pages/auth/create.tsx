import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Create() {
  const router = useRouter();

  useEffect(() => {
    const x = async () => {
      const res = await fetch('/api/profileComplete', { method: 'GET' });
      const { profileComplete } = await res.json();
      if (profileComplete) router.push('/');
    };
    x();
  }, [router]);

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } =
    useFormik({
      initialValues: {
        city: 0,
        singlePanelArea: 0,
        noOfPanels: 0,
        eff: 0,
      },
      onSubmit: async (values) => {
        const res = await fetch('/api/addFarm', {
          method: 'POST',
          body: JSON.stringify(values),
        });
        if (res.ok) router.push('/');
      },
    });

  return (
    <div>
      <p>add your farm specs</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>Choose a City</label>
        <select name="city" onChange={handleChange('city')} value={values.city}>
          <option value={0}>Marseille, France</option>
          <option value={1}>Tokyo, Japan</option>
          <option value={2}>Singapoure</option>
          <option value={3}>Calgary, Canada</option>
        </select>
        <label>Area of Single Panal</label>
        <input
          name="singlePanelArea"
          type="text"
          onChange={handleChange('singlePanelArea')}
          value={values.singlePanelArea}
        />
        <label>Number of Panels</label>
        <input
          name="noOfPanels"
          type="text"
          onChange={handleChange('noOfPanels')}
          value={values.noOfPanels}
        />
        <label>Choose panel type</label>
        <select name="eff" onChange={handleChange('eff')} value={values.eff}>
          <option value={0.17}>Poly PERC</option>
          <option value={0.18}>Mono PERC</option>
          <option value={0.19}>Half-cut mono PERC</option>
          <option value={0.205}>Shingled mono cells</option>
          <option value={0.21}>Half-cut mono PERC MBB</option>
          <option value={0.215}>Half-cut N-Type TOPcon</option>
          <option value={0.22}>Half-cut N-Type HJT</option>
          <option value={0.22}>N-Type IBC</option>
        </select>
        <button type="submit">save</button>
      </form>
    </div>
  );
}
